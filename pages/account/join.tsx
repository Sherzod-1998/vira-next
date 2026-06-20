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

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();

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
						<span>{loginView ? 'LOGIN' : 'CREATE YOUR ACCOUNT'}</span>
						<p>{loginView ? 'Login to continue' : 'Start your free trial'}</p>
					</Box>

					<Box className="social-btn google" onClick={() => handleGoogleLogin()} style={{ cursor: 'pointer' }}>
						<div className="icon">
							<GoogleIcon />
						</div>
						<span>Login With Google</span>
					</Box>

					<Box className="divider-or">
						<span>Or</span>
					</Box>

					<Box className="input-wrap">
						<div className="input-box">
							<span>Email / Nickname</span>
							<input onChange={(e) => handleInput('nick', e.target.value)} />
						</div>

						<div className="input-box">
							<span>Password</span>
							<input type="password" onChange={(e) => handleInput('password', e.target.value)} />
						</div>

						{!loginView && (
							<div className="input-box">
								<span>Phone</span>
								<input onChange={(e) => handleInput('phone', e.target.value)} />
							</div>
						)}
					</Box>

					<Box className="register">
						{!loginView && (
							<div className="type-option">
								<span className="text">Register as:</span>
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
										label="User"
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
										label="Seller"
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
								LOGIN
							</Button>
						) : (
							<Button
								variant="contained"
								className="primary-btn"
								disabled={!input.nick || !input.password || !input.phone}
								onClick={doSignUp}
							>
								SIGNUP
							</Button>
						)}
					</Box>

					<Box className="divider-or second">
						<span>Or</span>
					</Box>

					<Box className="social-btn facebook">
						<div className="icon">
							<FacebookIcon />
						</div>
						<span>Login With Facebook</span>
					</Box>

					<Box className="ask-info">
						{loginView ? (
							<p>
								Don’t Have An Account?
								<b onClick={() => viewChangeHandler(false)}> Create Account</b>
							</p>
						) : (
							<p>
								Already have account?
								<b onClick={() => viewChangeHandler(true)}> LOGIN</b>
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
						<span className="tagline">Luxury Jewelry Marketplace</span>
					</Box>
					<Box className="quote">
						<p>“Where timeless elegance meets the people who cherish it.”</p>
					</Box>
				</Stack>

				{/* RIGHT — form panel */}
				<Stack className="form-side">
					<Box className="form-inner">
						<Box className="heading">
							<span className="title">{loginView ? 'Welcome back' : 'Create your account'}</span>
							<p className="subtitle">
								{loginView ? 'Sign in to continue to Vira' : 'Join Vira and start exploring'}
							</p>
						</Box>

						<Box className="social-btn google" onClick={() => handleGoogleLogin()}>
							<div className="icon">
								<GoogleIcon />
							</div>
							<span>Continue with Google</span>
						</Box>

						<Box className="divider-or">
							<span>or</span>
						</Box>

						<Box className="input-wrap">
							<div className="input-box">
								<span>Email / Nickname</span>
								<input
									placeholder="Enter your nickname"
									value={input.nick}
									onChange={(e) => handleInput('nick', e.target.value)}
								/>
							</div>

							<div className="input-box">
								<span>Password</span>
								<input
									type="password"
									placeholder="Enter your password"
									value={input.password}
									onChange={(e) => handleInput('password', e.target.value)}
								/>
							</div>

							{!loginView && (
								<div className="input-box">
									<span>Phone</span>
									<input
										placeholder="Enter your phone number"
										value={input.phone}
										onChange={(e) => handleInput('phone', e.target.value)}
									/>
								</div>
							)}
						</Box>

						<Box className="register">
							{!loginView && (
								<div className="type-option">
									<span className="text">Register as:</span>
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
											label="User"
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
											label="Seller"
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
								{loginView ? 'Sign In' : 'Sign Up'}
							</Button>
						</Box>

						<Box className="ask-info">
							{loginView ? (
								<p>
									Don&apos;t have an account?
									<b onClick={() => viewChangeHandler(false)}> Create account</b>
								</p>
							) : (
								<p>
									Already have an account?
									<b onClick={() => viewChangeHandler(true)}> Sign in</b>
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
