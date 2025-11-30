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

	if (device === 'mobile') {
		return (
			<Stack className="join-page-mo">
				<Stack className="main">
					<Box className="hero-block" />

					<Box className="info">
						<span>{loginView ? 'LOGIN' : 'CREATE YOUR ACCOUNT'}</span>
						<p>{loginView ? 'Login to continue' : 'Start your free trial'}</p>
					</Box>

					<Box className="social-btn google">
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
			<Stack className="container">
				<Stack className="main">
					<Stack className="left">
						<Box className="hero-block" />

						<Box className="info">
							<span>{loginView ? 'LOGIN' : 'CREATE YOUR ACCOUNT'}</span>
							<p>{loginView ? 'Login with your account to continue.' : "LET'S GET STARTED"}</p>
						</Box>

						<Box className="social-btn google">
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

							<Button
								variant="contained"
								className="primary-btn"
								disabled={!input.nick || !input.password}
								onClick={loginView ? doLogin : doSignUp}
							>
								{loginView ? 'LOGIN' : 'SIGNUP'}
							</Button>
						</Box>
						<Box className="ask-info">
							{loginView ? (
								<p>
									Don&apos;t Have An Account?
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
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(Join);
