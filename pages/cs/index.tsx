import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack } from '@mui/material';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/cs/Notice';
import Faq from '../../libs/components/cs/Faq';
import Inquiry from '../../libs/components/cs/Inquiry';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale as string, ['common', 'cs'])),
	},
});

const CS: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation('cs');

	const changeTabHandler = (tab: string) => {
		router.push(
			{
				pathname: '/cs',
				query: { tab: tab },
			},
			undefined,
			{ scroll: false },
		);
	};

	const tab = (router.query.tab as string) ?? 'notice';
	const contactItems = [
		{ icon: <EmailOutlinedIcon />, label: t('contact.email'), value: 'support@vira.com' },
		{ icon: <PhoneInTalkOutlinedIcon />, label: t('contact.phone'), value: '+82 10 9910 5777' },
		{ icon: <AccessTimeOutlinedIcon />, label: t('contact.hours'), value: 'Mon-Fri, 9:00-18:00 KST' },
	];

	const renderHero = (mobile = false) => (
		<Box component="div" className={mobile ? 'm-cs-hero' : 'cs-hero'}>
			<Box component="div" className={mobile ? 'm-hero-copy' : 'hero-copy'}>
				<span>{t('hero.title')}</span>
				<p>{t('hero.subtitle')}</p>
			</Box>
			<Box component="div" className={mobile ? 'm-contact-strip' : 'contact-strip'}>
				{contactItems.map((item) => (
					<div className={mobile ? 'm-contact-item' : 'contact-item'} key={item.label}>
						{item.icon}
						<div>
							<strong>{item.label}</strong>
							<span>{item.value}</span>
						</div>
					</div>
				))}
			</Box>
		</Box>
	);

	if (device === 'mobile') {
		return (
			<Stack className="m-cs-page">
				<Head>
					<title>{t('pageTitle')}</title>
				</Head>
				<Stack className="m-container">
					{renderHero(true)}
					{/* HEADER */}
					<Box component="div" className="m-cs-main-info">
						<Box component="div" className="m-info">
							<span>{t('info.title')}</span>
							<p>{t('info.subtitle')}</p>
						</Box>

						<Box component="div" className="m-btns">
							<div
								className={tab === 'notice' ? 'active' : ''}
								onClick={() => changeTabHandler('notice')}
							>
								{t('tabs.notice')}
							</div>
							<div
								className={tab === 'faq' ? 'active' : ''}
								onClick={() => changeTabHandler('faq')}
							>
								{t('tabs.faq')}
							</div>
							<div
								className={tab === 'inquiry' ? 'active' : ''}
								onClick={() => changeTabHandler('inquiry')}
							>
								{t('tabs.inquiry')}
							</div>
						</Box>
					</Box>

					{/* CONTENT */}
					<Box component="div" className="m-cs-content">
						{tab === 'notice' && <Notice />}
						{tab === 'faq' && <Faq />}
						{tab === 'inquiry' && <Inquiry />}
					</Box>
				</Stack>
			</Stack>
		);
	}
	else {
		return (
			<Stack className={'cs-page'}>
				<Head>
					<title>{t('pageTitle')}</title>
				</Head>
				<Stack className={'container'}>
					{renderHero()}
					<Box component={'div'} className={'cs-main-info'}>
						<Box component={'div'} className={'info'}>
							<span>{t('info.title')}</span>
							<p>{t('info.subtitle')}</p>
						</Box>
						<Box component={'div'} className={'btns'}>
							<div
								className={tab === 'notice' ? 'active' : ''}
								onClick={() => changeTabHandler('notice')}
							>
								{t('tabs.notice')}
							</div>
							<div
								className={tab === 'faq' ? 'active' : ''}
								onClick={() => changeTabHandler('faq')}
							>
								{t('tabs.faq')}
							</div>
							<div
								className={tab === 'inquiry' ? 'active' : ''}
								onClick={() => changeTabHandler('inquiry')}
							>
								{t('tabs.inquiry')}
							</div>
						</Box>
					</Box>

					<Box component={'div'} className={'cs-content'}>
						{tab === 'notice' && <Notice />}
						{tab === 'faq' && <Faq />}
						{tab === 'inquiry' && <Inquiry />}
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(CS);
