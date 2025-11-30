import React from 'react';
import { Stack, Box } from '@mui/material';
import { useQuery } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_NOTICES } from '../../../apollo/user/query';

const formatDate = (dateStr: string) => {
	const d = new Date(dateStr);
	const yy = d.getFullYear().toString().slice(-2);
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	// 01.03.2024 formatiga yaqinlashamiz: dd.mm.yyyy
	return `${dd}.${mm}.20${yy}`;
};

const Notice = () => {
	const device = useDeviceDetect();

	// 1-bet, 20 ta notice
	const { data, loading, error } = useQuery(GET_NOTICES, {
		variables: {
			input: {
				page: 1,
				limit: 20,
			},
		},
		fetchPolicy: 'network-only',
	});

	const list = data?.getNotices?.list ?? [];

	if (device === 'mobile') {
		if (loading) return <div>Loading...</div>;
		if (error) return <div>Error...</div>;

		return (
			<Stack className="m-notice-content">
				<span className="m-title">Notice</span>
				<Stack className="m-list">
					{list.map((notice: any, idx: number) => {
						const isEvent = notice.noticeCategory === 'EVENT';
						return (
							<Stack
								key={notice._id}
								className={`m-notice-card ${isEvent ? 'event' : ''}`}
							>
								<Stack className="m-row-top">
									{isEvent && <span className="m-badge">Event</span>}
									<span className="m-date">{formatDate(notice.createdAt)}</span>
								</Stack>
								<span className="m-text">{notice.noticeContent}</span>
							</Stack>
						);
					})}
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'notice-content'}>
				<Stack className={'main'}>
					<Box component={'div'} className={'top'}>
						<span>number</span>
						<span>Title</span>
						<span>date</span>
					</Box>
					<Stack className={'bottom'}>
						{loading && (
							<div className="notice-card">
								<span>Loading...</span>
							</div>
						)}

						{!loading && list.length === 0 && (
							<div className="notice-card">
								<span>No notices.</span>
							</div>
						)}

						{!loading &&
							list.map((notice: any, idx: number) => {
								const isEvent = notice.noticeCategory === 'EVENT';
								return (
									<Stack
										flexDirection="row"
										alignItems="center"
										className={`notice-card ${isEvent ? 'event' : ''}`}
										key={notice._id}
										sx={{ width: '100%' }}
									>
										{/* Chap tomon: raqam yoki "event" pill */}
										{isEvent ? <div>event</div> : <span className={'notice-number'}>{idx + 1}</span>}

										{/* O‘rta: title + content markazda */}
										<Box className="notice-middle">
											<span className={'notice-content-text'}>{notice.noticeContent}</span>
										</Box>

										{/* O‘ng: sana */}
										<span className={'notice-date'}>{formatDate(notice.createdAt)}</span>
									</Stack>
								);
							})}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Notice;
