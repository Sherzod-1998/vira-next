import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { useGoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../../libs/auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
	const [loginView, setLoginView] = useState<boolean>(true);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => setLoginView(state);

	const checkUserTypeHandler = (e: any) => {
		const checked = e.target.checked;
		if (checked) handleInput('type', e.target.name);
		else handleInput('type', 'USER');
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => ({ ...prev, [name]: value }));
	}, []);

	const doLogin = useCallback(async () => {
		try {
			await logIn(input.nick, input.password);
			router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message);
		}
	}, [input, router]);

	const doSignUp = useCallback(async () => {
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message);
		}
	}, [input, router]);

	const handleGoogleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			try {
				await googleLogin(tokenResponse.access_token);
				router.push(`${router.query.referrer ?? '/'}`);
			} catch (err: any) {
				sweetMixinErrorAlert(err.message);
			}
		},
		onError: () => sweetMixinErrorAlert('Google login failed'),
	});

	if (device === 'mobile') {
		return (
			<Stack className="join-page-mo">
				<Stack className="main">
					<Box className="hero-block" />

					<Box className="info">
						<span>{loginView ? t('join.login') : t('join.mobileTitleSignup')}</span>
						<p>{loginView ? t('join.mobileSubtitleLogin') : t('join.mobileSubtitleSignup')}</p>
					</Box>

					<Box className="social-btn google" onClick={() => handleGoogleLogin()} style={{ cursor: 'pointer' }}>
						<div className="icon">
							<GoogleIcon />
						</div>
						<span>{t('join.loginWithGoogle')}</span>
					</Box>

					<Box className="divider-or">
						<span>{t('join.or')}</span>
					</Box>

					<Box className="input-wrap">
						<div className="input-box">
							<span>{t('join.emailNickname')}</span>
							<input onChange={(e) => handleInput('nick', e.target.value)} />
						</div>

						<div className="input-box">
							<span>{t('join.password')}</span>
							<input type="password" onChange={(e) => handleInput('password', e.target.value)} />
						</div>

						{!loginView && (
							<div className="input-box">
								<span>{t('join.phone')}</span>
								<input onChange={(e) => handleInput('phone', e.target.value)} />
							</div>
						)}
					</Box>

					<Box className="register">
						{!loginView && (
							<div className="type-option">
								<span className="text">{t('join.registerAs')}</span>
								<div>
									<FormControlLabel
										control={
											<Checkbox
												size="small"
												name="USER"
												checked={input.type === 'USER'}
												onChange={checkUserTypeHandler}
											/>
										}
										label={t('join.user')}
									/>

									<FormControlLabel
										control={
											<Checkbox
												size="small"
												name="SELLER"
												checked={input.type === 'SELLER'}
												onChange={checkUserTypeHandler}
											/>
										}
										label={t('join.seller')}
									/>
								</div>
							</div>
						)}

						{loginView ? (
							<Button
								variant="contained"
								className="primary-btn"
								disabled={!input.nick || !input.password}
								onClick={doLogin}
							>
								{t('join.login')}
							</Button>
						) : (
							<Button
								variant="contained"
								className="primary-btn"
								disabled={!input.nick || !input.password || !input.phone}
								onClick={doSignUp}
							>
								{t('join.signupButton')}
							</Button>
						)}
					</Box>

					<Box className="divider-or second">
						<span>{t('join.or')}</span>
					</Box>

					<Box className="social-btn facebook">
						<div className="icon">
							<FacebookIcon />
						</div>
						<span>{t('join.loginWithFacebook')}</span>
					</Box>

					<Box className="ask-info">
						{loginView ? (
							<p>
								{t('join.noAccountMobile')}
								<b onClick={() => viewChangeHandler(false)}> {t('join.createAccountMobile')}</b>
							</p>
						) : (
							<p>
								{t('join.haveAccountMobile')}
								<b onClick={() => viewChangeHandler(true)}> {t('join.login')}</b>
							</p>
						)}
					</Box>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className="join-page">
			<Stack className="main">
				{/* LEFT — luxury visual panel */}
				<Stack className="visual">
					<Box className="overlay" />
					<Box className="brand">
						<h1 className="logo">VIRA</h1>
						<span className="tagline">{t('join.tagline')}</span>
					</Box>
					<Box className="quote">
						<p>“{t('join.quote')}”</p>
					</Box>
				</Stack>

				{/* RIGHT — form panel */}
				<Stack className="form-side">
					<Box className="form-inner">
						<Box className="heading">
							<span className="title">{loginView ? t('join.welcomeBack') : t('join.createYourAccount')}</span>
							<p className="subtitle">
								{loginView ? t('join.signInSubtitle') : t('join.joinSubtitle')}
							</p>
						</Box>

						<Box className="social-btn google" onClick={() => handleGoogleLogin()}>
							<div className="icon">
								<GoogleIcon />
							</div>
							<span>{t('join.continueWithGoogle')}</span>
						</Box>

						<Box className="divider-or">
							<span>{t('join.orLower')}</span>
						</Box>

						<Box className="input-wrap">
							<div className="input-box">
								<span>{t('join.emailNickname')}</span>
								<input
									placeholder={t('join.nicknamePlaceholder')}
									value={input.nick}
									onChange={(e) => handleInput('nick', e.target.value)}
								/>
							</div>

							<div className="input-box">
								<span>{t('join.password')}</span>
								<input
									type="password"
									placeholder={t('join.passwordPlaceholder')}
									value={input.password}
									onChange={(e) => handleInput('password', e.target.value)}
								/>
							</div>

							{!loginView && (
								<div className="input-box">
									<span>{t('join.phone')}</span>
									<input
										placeholder={t('join.phonePlaceholder')}
										value={input.phone}
										onChange={(e) => handleInput('phone', e.target.value)}
									/>
								</div>
							)}
						</Box>

						<Box className="register">
							{!loginView && (
								<div className="type-option">
									<span className="text">{t('join.registerAs')}</span>
									<div>
										<FormControlLabel
											control={
												<Checkbox
													size="small"
													name="USER"
													checked={input.type === 'USER'}
													onChange={checkUserTypeHandler}
												/>
											}
											label={t('join.user')}
										/>
										<FormControlLabel
											control={
												<Checkbox
													size="small"
													name="SELLER"
													checked={input.type === 'SELLER'}
													onChange={checkUserTypeHandler}
												/>
											}
											label={t('join.seller')}
										/>
									</div>
								</div>
							)}

							<Button
								variant="contained"
								className="primary-btn"
								disabled={loginView ? !input.nick || !input.password : !input.nick || !input.password || !input.phone}
								onClick={loginView ? doLogin : doSignUp}
							>
								{loginView ? t('join.signIn') : t('join.signUp')}
							</Button>
						</Box>

						<Box className="ask-info">
							{loginView ? (
								<p>
									{t('join.noAccount')}
									<b onClick={() => viewChangeHandler(false)}> {t('join.createAccount')}</b>
								</p>
							) : (
								<p>
									{t('join.haveAccount')}
									<b onClick={() => viewChangeHandler(true)}> {t('join.signInLink')}</b>
								</p>
							)}
						</Box>
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(Join);
