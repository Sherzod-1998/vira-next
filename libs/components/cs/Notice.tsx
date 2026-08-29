import React, { useState } from 'react';
import Image from 'next/image';
import { Stack, Box, Pagination, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_NOTICES } from '../../../apollo/user/query';

const formatDate = (dateStr: string) => {
	const d = new Date(dateStr);
	const yy = d.getFullYear().toString().slice(-2);
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${dd}.${mm}.20${yy}`;
};

const Notice = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('cs');
	const [page, setPage] = useState<number>(1);
	const limit = 10;
	const { data, loading, error } = useQuery(GET_NOTICES, {
		variables: {
			input: {
				page,
				limit,
			},
		},
		fetchPolicy: 'network-only',
	});

	const list = data?.getNotices?.list ?? [];
	const total = data?.getNotices?.total ?? 0;
	const totalPages = Math.ceil(total / limit) || 1;
	const paginationChangeHandler = (event: React.ChangeEvent<unknown>, value: number) => setPage(value);

	const renderMobileSkeletons = () => (
		<Stack className="m-list">
			{Array.from({ length: 4 }).map((_, index) => (
				<Stack className="m-notice-card notice-skeleton" key={`m-notice-skeleton-${index}`}>
					<Skeleton variant="text" width="45%" height={22} />
					<Skeleton variant="text" width="82%" height={24} />
				</Stack>
			))}
		</Stack>
	);

	const renderDesktopSkeletons = () => (
		<Stack className="bottom">
			{Array.from({ length: 6 }).map((_, index) => (
				<Stack className="notice-card notice-skeleton" key={`notice-skeleton-${index}`}>
					<Skeleton variant="text" width="8%" height={24} />
					<Skeleton variant="text" width="28%" height={24} />
					<Skeleton variant="text" width="42%" height={24} />
					<Skeleton variant="text" width="14%" height={24} />
				</Stack>
			))}
		</Stack>
	);

	const renderState = (type: 'empty' | 'error', mobile = false) => (
		<Stack className={mobile ? 'm-notice-state' : 'notice-state'}>
			<Image src="/img/icons/icoAlert.svg" alt="" width={40} height={40} />
			<Typography className="state-title">
				{type === 'empty' ? t('notice.empty.title') : t('notice.error.title')}
			</Typography>
			<Typography className="state-subtitle">
				{type === 'empty' ? t('notice.empty.subtitle') : t('notice.error.subtitle')}
			</Typography>
		</Stack>
	);

	if (device === 'mobile') {
		return (
			<Stack className="m-notice-content">
				<span className="m-title">{t('notice.title')}</span>
				{loading && renderMobileSkeletons()}
				{!loading && error && renderState('error', true)}
				{!loading && !error && list.length === 0 && renderState('empty', true)}
				{!loading && !error && list.length > 0 && (
					<Stack className="m-list">
						{list.map((notice: any) => {
							const isEvent = notice.noticeCategory === 'EVENT';
							return (
								<Stack key={notice._id} className={`m-notice-card ${isEvent ? 'event' : ''}`}>
									<Stack className="m-row-top">
										<span className="m-badge">{notice.noticeCategory}</span>
										<span className="m-date">{formatDate(notice.createdAt)}</span>
									</Stack>
									<span className="m-notice-title">{notice.noticeTitle}</span>
									<span className="m-text">{notice.noticeContent}</span>
								</Stack>
							);
						})}
					</Stack>
				)}
				{!loading && !error && totalPages > 1 && (
					<Stack className="m-pagination">
						<Pagination size="small" page={page} count={totalPages} onChange={paginationChangeHandler} />
					</Stack>
				)}
			</Stack>
		);
	} else {
		return (
			<Stack className={'notice-content'}>
				<Stack className={'main'}>
					<Box component={'div'} className={'top'}>
						<span>{t('notice.columns.number')}</span>
						<span>{t('notice.columns.title')}</span>
						<span>{t('notice.columns.content')}</span>
						<span>{t('notice.columns.date')}</span>
					</Box>
					{loading && renderDesktopSkeletons()}
					{!loading && error && renderState('error')}
					{!loading && !error && list.length === 0 && renderState('empty')}
					{!loading && !error && list.length > 0 && (
						<Stack className={'bottom'}>
							{list.map((notice: any, idx: number) => {
								const isEvent = notice.noticeCategory === 'EVENT';
								return (
									<Stack
										flexDirection="row"
										alignItems="center"
										className={`notice-card ${isEvent ? 'event' : ''}`}
										key={notice._id}
										sx={{ width: '100%' }}
									>
										{isEvent ? <div>{notice.noticeCategory}</div> : <span className={'notice-number'}>{(page - 1) * limit + idx + 1}</span>}

										<Box className="notice-middle">
											<span className={'notice-title'}>{notice.noticeTitle}</span>
											<span className={'notice-content-text'}>{notice.noticeContent}</span>
										</Box>

										<span className={'notice-date'}>{formatDate(notice.createdAt)}</span>
									</Stack>
								);
							})}
						</Stack>
					)}
				</Stack>
				{!loading && !error && totalPages > 1 && (
					<Stack className="pagination">
						<Pagination page={page} count={totalPages} onChange={paginationChangeHandler} shape="circular" color="primary" />
					</Stack>
				)}
			</Stack>
		);
	}
};

export default Notice;
