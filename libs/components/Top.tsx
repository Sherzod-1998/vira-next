import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box, IconButton, Tooltip, Popover } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';

const Top = () => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const { t, i18n } = useTranslation('common');
  const router = useRouter();

  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [lang, setLang] = useState<string | null>('en');
  const drop = Boolean(anchorEl2);
  const [colorChange, setColorChange] = useState(false);
  const [anchorEl, setAnchorEl] = useState<any | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [bgColor, setBgColor] = useState<boolean>(false);
  const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);
  const logoutOpen = Boolean(logoutAnchor);

  useEffect(() => {
    if (localStorage.getItem('locale') === null) {
      localStorage.setItem('locale', 'en');
      setLang('en');
    } else {
      setLang(localStorage.getItem('locale'));
    }
  }, [router]);

  useEffect(() => {
    switch (router.pathname) {
      case '/product/detail':
        setBgColor(true);
        break;
      default:
        break;
    }
  }, [router]);

  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

  const langClick = (e: any) => setAnchorEl2(e.currentTarget);
  const langClose = () => setAnchorEl2(null);

  const handleOpen = (event: { currentTarget: any }) => {
    setAnchorEl(event.currentTarget);
  };

  const langChoice = useCallback(
    async (e: any) => {
      setLang(e.target.id);
      localStorage.setItem('locale', e.target.id);
      setAnchorEl2(null);
      await router.push(router.asPath, router.asPath, { locale: e.target.id });
    },
    [router]
  );

  const changeNavbarColor = () => {
    setColorChange(window.scrollY >= 50);
  };

  const handleClose = () => setAnchorEl(null);
  const handleHover = (event: any) => {
    setAnchorEl(anchorEl !== event.currentTarget ? event.currentTarget : null);
  };

  const handleOpenNotifications = () => {
    console.log("Bildirishnomalar ochildi");
  };

  const id = open ? 'notification-popover' : undefined;

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

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', changeNavbarColor);
  }

  if (device === 'mobile') {
    return (
      <Stack className={'top'}>
        <Link href={'/'}><div>{t('Home')}</div></Link>
        <Link href={'/product'}><div>{t('Products')}</div></Link>
        <Link href={'/seller'}><div>{t('Sellers')}</div></Link>
        <Link href={'/community?articleCategory=FREE'}><div>{t('Community')}</div></Link>
        <Link href={'/cs'}><div>{t('CS')}</div></Link>
      </Stack>
    );
  }

  return (
    <Stack className={'navbar'}>
      <Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
        <Stack className={'container'}>
          <Box className={'logo-box'}>
            <Link href={'/'}><h1 className="logo-text">VIRA</h1></Link>
          </Box>
          <Box className={'router-box'}>
            <Link href={'/'}><div>{t('Home')}</div></Link>
            <Link href={'/product'}><div>{t('Products')}</div></Link>
            <Link href={'/seller'}><div>{t('Sellers')}</div></Link>
            <Link href={'/community?articleCategory=FREE'}><div>{t('Community')}</div></Link>
            {user?._id && <Link href={'/mypage'}><div>{t('My Page')}</div></Link>}
            <Link href={'/cs'}><div>{t('CS')}</div></Link>
          </Box>
          <Box className={'user-box'}>
            {user?._id ? (
              <>
                <div className={'login-user'} onClick={(e) => setLogoutAnchor(e.currentTarget)}>
                  <img
                    src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.png'}
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
                  <span>{t('Login')} / {t('Register')}</span>
                </div>
              </Link>
            )}

            <div className={'lan-box'}>
              {user?._id && (
                <>
                  <IconButton onClick={handleOpen}>
                    <NotificationsOutlinedIcon className="notification-icon" />
                  </IconButton>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    <div className='notification-box'>Notifications
						<div className='notification-content'>
						<p>{t('You have no new notifications.')}</p>
					  </div>						
					</div>
                  </Popover>
                </>
              )}
              <Button
                disableRipple
                className="btn-lang"
                onClick={langClick}
                endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
              >
                <Box className={'flag'}>
                  <img
                    src={`/img/flag/lang${lang || 'en'}.png`}
                    alt={'language-flag'}
                  />
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
