import React from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
const TuiEditor = dynamic(() => import('../community/Teditor'), { ssr: false });

const WriteArticle: NextPage = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('mypage');

	if (device === 'mobile') {
		return <>ARTICLE PAGE MOBILE</>;
	} else
		return (
			<div id="write-article-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">{t('writeArticle.title')}</Typography>
						<Typography className="sub-title">{t('writeArticle.subtitle')}</Typography>
					</Stack>
				</Stack>
				<TuiEditor />
			</div>
		);
};

export default WriteArticle;
