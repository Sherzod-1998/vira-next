import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const HeaderContent = () => {
	const { t, i18n } = useTranslation('common');
	const [lang, setLang] = useState<string | null>('en');
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<div className="header-content">
				<Stack direction="row" className="header-content__inner">
					<div
						className="header-content__text"
						style={{
							width: 150,
							height: 150,
							borderRadius: '50%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: 'none',
							position: 'relative',
							overflow: 'hidden',
						}}
					>
						<svg width={150} height={150} viewBox="0 0 360 360" style={{ position: 'absolute', top: 0, left: 0 }}>
							<defs>
								<path
									id="circlePath"
									d="M 180, 180
                                   m -150, 0
                                   a 150,150 0 1,1 300,0
                                   a 150,150 0 1,1 -300,0"
								/>
							</defs>
							<text fill="#fff" fontSize="24" fontWeight="bold" letterSpacing="2">
								<textPath href="#circlePath" startOffset="0" textLength="942">
									JEWELRY ART – A SYMBOL OF BEAUTY AND ELEGANCE
								</textPath>
							</text>
							<polygon points="240,180 120,120 120,240" fill="#fff" />
						</svg>
					</div>
					<div
						className="circle-image"
						style={{
							width: 150,
							height: 150,
							borderRadius: '50%',
							overflow: 'hidden',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							position: 'relative',
							background: '#000', // optional, for contrast
							left: -28, // moved further to the left
						}}
					>
						<img
							src="/img/banner/circle.jpg"
							alt="Header Banner"
							style={{
								width: '100%',
								height: '100%',
								borderRadius: '50%',
								objectFit: 'cover',
							}}
						/>
					</div>
				</Stack>
				<Stack className="header-content__title" direction="column" spacing={2}>
					<h1 className="header-content__title-text">{t('Where Elegance Finds Extraordinary Artistry')}</h1>
					<h1 className="header-content__title-text_2">
						{t(
							'jewelry has been primarily used as an artistic and fashionable item. In almost all the cultures, jewelry is used as an ornament to enhance and exhibit beauty of human body.',
						)}
					</h1>
				</Stack>
				<Stack className="buttons" direction="row" spacing={2}>
					<button className="more-detail" onClick={() => (window.location.href = '/about-us')}>
						{t('MORE DETAILS')}
					</button>
					<button className="shop_now" onClick={() => (window.location.href = '/product')}>
						{t('SHOP NOW')}
					</button>
				</Stack>
			</div>
		);
	} else {
		return (
			<div className="header-content">
				<Stack direction="row" className="header-content__inner">
					<div
						className="header-content__text"
						style={{
							width: 150,
							height: 150,
							borderRadius: '50%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: 'none',
							position: 'relative',
							overflow: 'hidden',
						}}
					>
						<svg width={150} height={150} viewBox="0 0 360 360" style={{ position: 'absolute', top: 0, left: 0 }}>
							<defs>
								<path
									id="circlePath"
									d="M 180, 180
                                   m -150, 0
                                   a 150,150 0 1,1 300,0
                                   a 150,150 0 1,1 -300,0"
								/>
							</defs>
							<text fill="#fff" fontSize="24" fontWeight="bold" letterSpacing="2">
								<textPath href="#circlePath" startOffset="0" textLength="942">
									JEWELRY ART – A SYMBOL OF BEAUTY AND ELEGANCE
								</textPath>
							</text>
							<polygon points="240,180 120,120 120,240" fill="#fff" />
						</svg>
					</div>
					<div
						className="circle-image"
						style={{
							width: 150,
							height: 150,
							borderRadius: '50%',
							overflow: 'hidden',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							position: 'relative',
							background: '#000', // optional, for contrast
							left: -28, // moved further to the left
						}}
					>
						<img
							src="/img/banner/circle.jpg"
							alt="Header Banner"
							style={{
								width: '100%',
								height: '100%',
								borderRadius: '50%',
								objectFit: 'cover',
							}}
						/>
					</div>
				</Stack>
				<Stack className="header-content__title" direction="column" spacing={2}>
					<h1 className="header-content__title-text">{t('Where Elegance Finds Extraordinary Artistry')}</h1>
					<h1 className="header-content__title-text_2">
						{t(
							'jewelry has been primarily used as an artistic and fashionable item. In almost all the cultures, jewelry is used as an ornament to enhance and exhibit beauty of human body.',
						)}
					</h1>
				</Stack>
				<Stack className="buttons" direction="row" spacing={2}>
					<button className="more-detail" onClick={() => (window.location.href = '/about-us')}>
						{t('MORE DETAILS')}
					</button>
					<button className="shop_now" onClick={() => (window.location.href = '/product')}>
						{t('SHOP NOW')}
					</button>
				</Stack>
			</div>
		);
	}
};

export default HeaderContent;
