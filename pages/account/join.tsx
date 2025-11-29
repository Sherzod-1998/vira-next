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
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const checkUserTypeHandler = (e: any) => {
		const checked = e.target.checked;
		if (checked) {
			const value = e.target.name;
			handleInput('type', value);
		} else {
			handleInput('type', 'USER');
		}
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doLogin = useCallback(async () => {
		console.warn(input);
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input, router]);

	const doSignUp = useCallback(async () => {
		console.warn(input);
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input, router]);

	if (device === 'mobile') {
		return <div> LOGIN MOBILE</div>;
	} else {
		return (
			<Stack className={'join-page'}>
				<Stack className={'container'}>
					<Stack className={'main'}>
						<Stack className={'left'}>
							{/* TOP COLORED RECTANGLE */}
							<Box className={'hero-block'} />

							{/* TITLE */}
							<Box className={'info'}>
								<span>{loginView ? 'LOGIN' : 'CREATE YOUR ACCOUNT'}</span>
								<p>
									{loginView ? 'Login with your account to continue.' : "LET'S GET STARTED WITH YOUR 30DAYS FREE TRIAL"}
								</p>
							</Box>

							{/* SOCIAL GOOGLE */}
							<Box className={'social-btn google'}>
								<div className="icon">
									<GoogleIcon />
								</div>
								<span>Login With Google</span>
							</Box>

							{/* OR DIVIDER */}
							<Box className={'divider-or'}>
								<span>Or</span>
							</Box>

							{/* INPUTS */}
							<Box className={'input-wrap'}>
								<div className={'input-box'}>
									<span>{loginView ? 'Email / Nickname' : 'Email'}</span>
									<input
										type="text"
										placeholder={loginView ? 'Enter your email' : 'Enter email / nickname'}
										onChange={(e) => handleInput('nick', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key === 'Enter' && loginView) doLogin();
											if (event.key === 'Enter' && !loginView) doSignUp();
										}}
									/>
								</div>

								<div className={'input-box'}>
									<span>Password</span>
									<input
										type="password"
										placeholder={'Password'}
										onChange={(e) => handleInput('password', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key === 'Enter' && loginView) doLogin();
											if (event.key === 'Enter' && !loginView) doSignUp();
										}}
									/>
								</div>

								{!loginView && (
									<div className={'input-box'}>
										<span>Phone</span>
										<input
											type="text"
											placeholder={'Enter Phone'}
											onChange={(e) => handleInput('phone', e.target.value)}
											required={true}
											onKeyDown={(event) => {
												if (event.key === 'Enter') doSignUp();
											}}
										/>
									</div>
								)}
							</Box>

							{/* REGISTER / REMEMBER ROW */}
							<Box className={'register'}>
								{!loginView && (
									<div className={'type-option'}>
										<span className={'text'}>I want to be registered as:</span>
										<div>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															size="small"
															name={'USER'}
															onChange={checkUserTypeHandler}
															checked={input?.type === 'USER'}
														/>
													}
													label="User"
												/>
											</FormGroup>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															size="small"
															name={'SELLER'}
															onChange={checkUserTypeHandler}
															checked={input?.type === 'SELLER'}
														/>
													}
													label="Seller"
												/>
											</FormGroup>
										</div>
									</div>
								)}

								{loginView && (
									<div className={'remember-info'}>
										<FormGroup>
											<FormControlLabel control={<Checkbox size="small" />} label="Remember Me" />
										</FormGroup>
										<a>Forgot Password?</a>
									</div>
								)}

								{loginView ? (
									<Button
										variant="contained"
										className="primary-btn"
										disabled={input.nick === '' || input.password === ''}
										onClick={doLogin}
									>
										LOGIN
									</Button>
								) : (
									<Button
										variant="contained"
										className="primary-btn"
										disabled={input.nick === '' || input.password === '' || input.phone === '' || input.type === ''}
										onClick={doSignUp}
									>
										SIGNUP
									</Button>
								)}
							</Box>

							{/* OR + FACEBOOK BUTTON */}
							<Box className="divider-or second">
								<span>Or</span>
							</Box>
							<Box className={'social-btn facebook'}>
								<div className="icon">
									<FacebookIcon />
								</div>
								<span>Login With Facebook</span>
							</Box>

							{/* BOTTOM TEXT */}
							<Box className={'ask-info'}>
								{loginView ? (
									<p>
										Don&apos;t Have An Account?
										<b onClick={() => viewChangeHandler(false)}> Create An Account</b>
									</p>
								) : (
									<p>
										Have account?
										<b onClick={() => viewChangeHandler(true)}> LOGIN</b>
									</p>
								)}
							</Box>
						</Stack>

						{/* RIGHT SIDE END – dizaynda yo‘q, shuning uchun yashirdik */}
						<Stack className={'right'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(Join);
