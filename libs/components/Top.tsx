// apps/vira-frontend/src/components/Top.tsx

import React, { useCallback, useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import {
	Stack,
	Box,
	IconButton,
	Popover,
	Badge,
	List,
	ListItem,
	ListItemText,
	Typography,
	CircularProgress,
	Divider,
	Button,
	MenuItem,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar, useQuery, useMutation, gql } from '@apollo/client';
import { socketVar, unreadNotificationCountVar, userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import {
	GET_MY_NOTIFICATIONS,
	GET_MY_UNREAD_NOTIFICATIONS_COUNT,
	MARK_NOTIFICATION_READ,
	MARK_ALL_NOTIFICATIONS_READ,
} from '../../apollo/user/query';

/* ============================
   Types
============================ */

type NotificationItem = {
	_id: string;
	notificationType: string;
	notificationStatus: string;
	notificationGroup: string;
	notificationTitle: string;
	notificationDesc?: string | null;
	authorId: string;
	receiverId: string;
	productId?: string | null;
	articleId?: string | null;
	createdAt: string;
	updatedAt: string;
};

/* ============================
   Styled Menu
============================ */

const StyledMenu = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
		transformOrigin={{ vertical: 'top', horizontal: 'right' }}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		top: '109px',
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 160,
		color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, ' +
			'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, ' +
			'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, ' +
			'rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		'& .MuiMenu-list': {
			padding: '4px 0',
		},
		'& .MuiMenuItem-root': {
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			'&:active': {
				backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
			},
		},
	},
}));



const Top: React.FC = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const unread = useReactiveVar(unreadNotificationCountVar);
	const socket = useReactiveVar(socketVar);

	const { t } = useTranslation('common');
	const router = useRouter();

	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);

	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);

	/* ========== Notifications Queries & Mutations ========== */

	const {
		data: notificationsData,
		loading: notificationsLoading,
		error: notificationsError,
		refetch: refetchNotifications,
	} = useQuery(GET_MY_NOTIFICATIONS, {
		variables: { input: { page: 1, limit: 10 } },
		skip: !user?._id,
		fetchPolicy: 'cache-and-network',
	});

	const { data: unreadData, refetch: refetchUnreadCount } = useQuery(GET_MY_UNREAD_NOTIFICATIONS_COUNT, {
		skip: !user?._id,
		pollInterval: 30000, // 30s da bir marta backend bilan sync
	});

	const [markNotificationRead] = useMutation(MARK_NOTIFICATION_READ);
	const [markAllNotificationsRead, { loading: markAllLoading }] = useMutation(MARK_ALL_NOTIFICATIONS_READ);

	const notifications: NotificationItem[] = notificationsData?.getMyNotifications?.list ?? [];

	// backenddan kelgan unread count ni global reactiveVar ga yozamiz
	useEffect(() => {
		if (typeof unreadData?.getMyUnreadNotificationsCount === 'number') {
			unreadNotificationCountVar(unreadData.getMyUnreadNotificationsCount);
		}
	}, [unreadData]);

	/* ========== WebSocket orqali real-time notification ========== */

	useEffect(() => {
		if (!socket) return;

		const handler = (msg: MessageEvent) => {
			try {
				const data = JSON.parse(msg.data as any);
				if (data?.event === 'NEW_NOTIFICATION') {
					unreadNotificationCountVar(unreadNotificationCountVar() + 1);
				}
			} catch (e) {
				console.error('WS parse error:', e);
			}
		};

		socket.addEventListener('message', handler);
		return () => {
			socket.removeEventListener('message', handler);
		};
	}, [socket]);

	/* ========== Language & Layout effects ========== */

	useEffect(() => {
		const stored = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
		if (!stored) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(stored);
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/product/detail':
				setBgColor(true);
				break;
			default:
				setBgColor(false);
				break;
		}
	}, [router.pathname]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	// scroll bo'yicha navbar rangini o'zgartirish
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const handler = () => {
			setColorChange(window.scrollY >= 50);
		};
		window.addEventListener('scroll', handler);
		return () => window.removeEventListener('scroll', handler);
	}, []);

	/* ========== Handlers ========== */

	const langClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl2(e.currentTarget);
	const langClose = () => setAnchorEl2(null);

	const handleOpen = async (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		if (user?._id) {
			await Promise.all([refetchNotifications(), refetchUnreadCount()]);
		}
	};

	const handleClose = () => setAnchorEl(null);

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const id = open ? 'notification-popover' : undefined;

	const handleClickNotification = async (item: NotificationItem) => {
		try {
			if (item.notificationStatus === 'WAIT') {
				await markNotificationRead({
					variables: { notificationId: item._id },
				});
				await Promise.all([refetchNotifications(), refetchUnreadCount()]);
			}
			// Agar keyinchalik mahsulot / article linkka o'tkazmoqchi bo'lsangiz,
			// bu yerga router.push qo'yasiz:
			// example: if (item.productId) router.push(`/product/detail?productId=${item.productId}`);
		} catch (err) {
			console.error(err);
		}
	};

	const handleMarkAllRead = async () => {
		try {
			await markAllNotificationsRead();
			unreadNotificationCountVar(0); // badge-ni zudlik bilan tozalaymiz
			await Promise.all([refetchNotifications(), refetchUnreadCount()]);
		} catch (err) {
			console.error(err);
		}
	};

	/* ========== Mobile simple top ========== */

	if (device === 'mobile') {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'}>

						{/* Router links */}
						<Box className={'router-box'}>
							<Link href={'/'}>
								<div>{t('Home')}</div>
							</Link>
							<Link href={'/product'}>
								<div>{t('Products')}</div>
							</Link>
							<Link href={'/seller'}>
								<div>{t('Sellers')}</div>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<div>{t('Community')}</div>
							</Link>
							{user?._id && (
								<Link href={'/mypage'}>
									<div>{t('My Page')}</div>
								</Link>
							)}
							<Link href={'/cs'}>
								<div>{t('CS')}</div>
							</Link>
						</Box>

						{/* User box */}
						<Box className={'user-box'}>
							{user?._id ? (
								<>
									<div className={'login-user'} onClick={(e) => setLogoutAnchor(e.currentTarget)}>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.png'
											}
											alt=""
										/>
									</div>
									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => setLogoutAnchor(null)}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<div className={'join-box'}>
										<AccountCircleOutlinedIcon />
										<span>
											{t('Login')} / {t('Register')}
										</span>
									</div>
								</Link>
							)}

							{/* Notifications + Lang */}
							<div className={'lan-box'}>
								{user?._id && (
									<>
										<IconButton onClick={handleOpen}>
											<Badge color="primary" badgeContent={unread > 99 ? '99+' : unread} invisible={unread === 0}>
												<NotificationsOutlinedIcon className="notification-icon" />
											</Badge>
										</IconButton>

										<Popover
											id={id}
											open={open}
											anchorEl={anchorEl}
											onClose={handleClose}
											anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
											transformOrigin={{ vertical: 'top', horizontal: 'left' }}
										>
											<Box sx={{ width: 360, maxHeight: 400, display: 'flex', flexDirection: 'column' }}>
												{/* Header */}
												<Box
													sx={{
														px: 2,
														py: 1.5,
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'space-between',
														borderBottom: '1px solid rgba(0,0,0,0.06)',
													}}
												>
													<Typography variant="subtitle1" fontWeight={600}>
														{t('Notifications')}
													</Typography>

													<Button
														size="small"
														variant="text"
														onClick={handleMarkAllRead}
														disabled={markAllLoading || notifications.length === 0}
													>
														{t('Mark all as read')}
													</Button>
												</Box>

												{/* Content */}
												<Box sx={{ flex: 1, overflowY: 'auto' }}>
													{notificationsLoading && !notificationsData ? (
														<Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
															<CircularProgress size={22} />
														</Box>
													) : notificationsError ? (
														<Box sx={{ p: 2 }}>
															<Typography color="error" variant="body2">
																{t('An error occurred. Please try again.')}
															</Typography>
														</Box>
													) : notifications.length === 0 ? (
														<Box sx={{ p: 2 }}>
															<Typography variant="body2" color="text.secondary">
																{t('You have no new notifications.')}
															</Typography>
														</Box>
													) : (
														<List disablePadding>
															{notifications.map((item) => {
																const isUnread = item.notificationStatus === 'WAIT';

																return (
																	<React.Fragment key={item._id}>
																		<ListItem
																			button
																			onClick={() => handleClickNotification(item)}
																			sx={{
																				alignItems: 'flex-start',
																				bgcolor: isUnread ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
																			}}
																		>
																			<ListItemText
																				primary={
																					<Typography
																						variant="body2"
																						fontWeight={isUnread ? 600 : 400}
																						sx={{ mb: 0.5 }}
																					>
																						{item.notificationTitle}
																					</Typography>
																				}
																				secondary={
																					item.notificationDesc && (
																						<Typography variant="caption" color="text.secondary">
																							{item.notificationDesc}
																						</Typography>
																					)
																				}
																			/>
																		</ListItem>
																		<Divider component="li" />
																	</React.Fragment>
																);
															})}
														</List>
													)}
												</Box>
											</Box>
										</Popover>
									</>
								)}

								{/* Language selector */}
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
								>
									<Box className={'flag'}>
										<img src={`/img/flag/lang${lang || 'en'}.png`} alt={'language-flag'} />
									</Box>
								</Button>

								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img className="img-flag" src={'/img/flag/langen.png'} alt={'usaFlag'} />
										{t('English')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img className="img-flag" src={'/img/flag/langkr.png'} alt={'koreanFlag'} />
										{t('Korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										<img className="img-flag" src={'/img/flag/langru.png'} alt={'russiaFlag'} />
										{t('Russian')}
									</MenuItem>
								</StyledMenu>
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}

	/* ========== Desktop navbar ========== */

	return (
		<Stack className={'navbar'}>
			<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
				<Stack className={'container'}>
					{/* Logo */}
					<Box className={'logo-box'}>
						<Link href={'/'}>
							<h1 className="logo-text">VIRA</h1>
						</Link>
					</Box>

					{/* Router links */}
					<Box className={'router-box'}>
						<Link href={'/'}>
							<div>{t('Home')}</div>
						</Link>
						<Link href={'/product'}>
							<div>{t('Products')}</div>
						</Link>
						<Link href={'/seller'}>
							<div>{t('Sellers')}</div>
						</Link>
						<Link href={'/community?articleCategory=FREE'}>
							<div>{t('Community')}</div>
						</Link>
						{user?._id && (
							<Link href={'/mypage'}>
								<div>{t('My Page')}</div>
							</Link>
						)}
						<Link href={'/cs'}>
							<div>{t('CS')}</div>
						</Link>
					</Box>

					{/* User box */}
					<Box className={'user-box'}>
						{user?._id ? (
							<>
								<div className={'login-user'} onClick={(e) => setLogoutAnchor(e.currentTarget)}>
									<img
										src={
											user?.memberImage
												? user.memberImage.startsWith('http')
													? user.memberImage
													: `${REACT_APP_API_URL}/${user.memberImage}`
												: '/img/profile/defaultUser.svg'
										}
										alt=""
									/>
								</div>
								<Menu
									id="basic-menu"
									anchorEl={logoutAnchor}
									open={logoutOpen}
									onClose={() => setLogoutAnchor(null)}
									sx={{ mt: '5px' }}
								>
									<MenuItem onClick={() => logOut()}>
										<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
										Logout
									</MenuItem>
								</Menu>
							</>
						) : (
							<Link href={'/account/join'}>
								<div className={'join-box'}>
									<AccountCircleOutlinedIcon />
									<span>
										{t('Login')} / {t('Register')}
									</span>
								</div>
							</Link>
						)}

						{/* Notifications + Lang */}
						<div className={'lan-box'}>
							{user?._id && (
								<>
									<IconButton onClick={handleOpen}>
										<Badge color="primary" badgeContent={unread > 99 ? '99+' : unread} invisible={unread === 0}>
											<NotificationsOutlinedIcon className="notification-icon" />
										</Badge>
									</IconButton>

									<Popover
										id={id}
										open={open}
										anchorEl={anchorEl}
										onClose={handleClose}
										anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
										transformOrigin={{ vertical: 'top', horizontal: 'left' }}
									>
										<Box sx={{ width: 360, maxHeight: 400, display: 'flex', flexDirection: 'column' }}>
											{/* Header */}
											<Box
												sx={{
													px: 2,
													py: 1.5,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
													borderBottom: '1px solid rgba(0,0,0,0.06)',
												}}
											>
												<Typography variant="subtitle1" fontWeight={600}>
													{t('Notifications')}
												</Typography>

												<Button
													size="small"
													variant="text"
													onClick={handleMarkAllRead}
													disabled={markAllLoading || notifications.length === 0}
												>
													{t('Mark all as read')}
												</Button>
											</Box>

											{/* Content */}
											<Box sx={{ flex: 1, overflowY: 'auto' }}>
												{notificationsLoading && !notificationsData ? (
													<Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
														<CircularProgress size={22} />
													</Box>
												) : notificationsError ? (
													<Box sx={{ p: 2 }}>
														<Typography color="error" variant="body2">
															{t('An error occurred. Please try again.')}
														</Typography>
													</Box>
												) : notifications.length === 0 ? (
													<Box sx={{ p: 2 }}>
														<Typography variant="body2" color="text.secondary">
															{t('You have no new notifications.')}
														</Typography>
													</Box>
												) : (
													<List disablePadding>
														{notifications.map((item) => {
															const isUnread = item.notificationStatus === 'WAIT';

															return (
																<React.Fragment key={item._id}>
																	<ListItem
																		button
																		onClick={() => handleClickNotification(item)}
																		sx={{
																			alignItems: 'flex-start',
																			bgcolor: isUnread ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
																		}}
																	>
																		<ListItemText
																			primary={
																				<Typography variant="body2" fontWeight={isUnread ? 600 : 400} sx={{ mb: 0.5 }}>
																					{item.notificationTitle}
																				</Typography>
																			}
																			secondary={
																				item.notificationDesc && (
																					<Typography variant="caption" color="text.secondary">
																						{item.notificationDesc}
																					</Typography>
																				)
																			}
																		/>
																	</ListItem>
																	<Divider component="li" />
																</React.Fragment>
															);
														})}
													</List>
												)}
											</Box>
										</Box>
									</Popover>
								</>
							)}

							{/* Language selector */}
							<Button
								disableRipple
								className="btn-lang"
								onClick={langClick}
								endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
							>
								<Box className={'flag'}>
									<img src={`/img/flag/lang${lang || 'en'}.png`} alt={'language-flag'} />
								</Box>
							</Button>

							<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose}>
								<MenuItem disableRipple onClick={langChoice} id="en">
									<img className="img-flag" src={'/img/flag/langen.png'} alt={'usaFlag'} />
									{t('English')}
								</MenuItem>
								<MenuItem disableRipple onClick={langChoice} id="kr">
									<img className="img-flag" src={'/img/flag/langkr.png'} alt={'koreanFlag'} />
									{t('Korean')}
								</MenuItem>
								<MenuItem disableRipple onClick={langChoice} id="ru">
									<img className="img-flag" src={'/img/flag/langru.png'} alt={'russiaFlag'} />
									{t('Russian')}
								</MenuItem>
							</StyledMenu>
						</div>
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withRouter(Top);
