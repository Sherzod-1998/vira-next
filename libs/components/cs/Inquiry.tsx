import React, { useState } from 'react';
import { Box, Stack, TextField, Button, Pagination } from '@mui/material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_MY_CS_INQUIRIES } from '../../../apollo/user/query';
import { CREATE_CS_INQUIRY } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';

const Inquiry = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('cs');

	if (!user?._id) {
		return (
			<Box sx={{ padding: 5, textAlign: 'center', fontSize: 18 }}>
				{t('inquiry.loginRequired')}
			</Box>
		);
	}

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [page, setPage] = useState(1);
	const limit = 10;

	const { data, loading, error, refetch } = useQuery(GET_MY_CS_INQUIRIES, {
		variables: { input: { page, limit } },
		fetchPolicy: 'network-only',
	});

	const [createCsInquiry, { loading: createLoading }] = useMutation(CREATE_CS_INQUIRY);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title || !content) return;

		await createCsInquiry({
			variables: {
				input: {
					title,
					content,
				},
			},
		});

		setTitle('');
		setContent('');
		setPage(1);
		refetch({ input: { page: 1, limit } });
	};

	const list = data?.getMyCsInquiries?.list ?? [];
	const total = data?.getMyCsInquiries?.total ?? 0;
	const totalPages = Math.ceil(total / limit) || 1;
	const paginationChangeHandler = (event: React.ChangeEvent<unknown>, value: number) => setPage(value);

	const getStatusClass = (status: string) => `status-badge ${status === 'ANSWERED' ? 'answered' : 'pending'}`;
	const getStatusLabel = (status: string) => (status === 'ANSWERED' ? t('inquiry.status.answered') : t('inquiry.status.pending'));

	/* MOBILE LAYOUT */
	if (device === 'mobile') {
		return (
			<Stack className="m-inquiry-content">
				<span className="m-title">{t('inquiry.title')}</span>

				<form className="m-inquiry-form" onSubmit={handleSubmit}>
					<TextField
						label={t('inquiry.form.titleLabel')}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						fullWidth
						size="small"
					/>
					<TextField
						label={t('inquiry.form.contentLabel')}
						value={content}
						onChange={(e) => setContent(e.target.value)}
						fullWidth
						size="small"
						multiline
						rows={5}
					/>

					<Button
						type="submit"
						variant="contained"
						disabled={createLoading}
						className="m-submit-btn"
					>
						{createLoading ? t('inquiry.form.sending') : t('inquiry.form.send')}
					</Button>
				</form>

				<Box className="m-inquiry-list">
					{loading && <p>{t('inquiry.list.loading')}</p>}
					{error && <p className="m-error-text">{t('inquiry.list.error')}</p>}
					{!loading && list.length === 0 && <p>{t('inquiry.list.empty')}</p>}

					{list.map((item: any) => (
						<Box key={item._id} className="m-inquiry-card">
							<div className="m-inquiry-header">
								<span className="m-inquiry-title">{item.title}</span>
								<span className={getStatusClass(item.status)}>{getStatusLabel(item.status)}</span>
							</div>
							<p className="m-inquiry-content-text">{item.content}</p>
							<div className="m-inquiry-answer">
								<span className="answer-label">{t('inquiry.list.answerLabel')}&nbsp;</span>
								<span className="answer-text">
									{item.answer ? item.answer : t('inquiry.list.noAnswer')}
								</span>
							</div>
						</Box>
					))}
					{!loading && !error && totalPages > 1 && (
						<Stack className="m-pagination">
							<Pagination size="small" page={page} count={totalPages} onChange={paginationChangeHandler} />
						</Stack>
					)}
				</Box>
			</Stack>
		);
	}

	/* PC LAYOUT */
	return (
		<Stack className="inquiry-content">
			<span className="title">{t('inquiry.title')}</span>

			<form className="inquiry-form" onSubmit={handleSubmit}>
				<TextField
					label={t('inquiry.form.titleLabel')}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					fullWidth
					size="small"
				/>
				<TextField
					label={t('inquiry.form.contentLabel')}
					value={content}
					onChange={(e) => setContent(e.target.value)}
					fullWidth
					size="small"
					multiline
					rows={3}
				/>

				<Button
					type="submit"
					variant="contained"
					disabled={createLoading}
					sx={{ color: '#fff', background: 'rgba(146, 106, 84, 1)' }}
				>
					{createLoading ? t('inquiry.form.sending') : t('inquiry.form.send')}
				</Button>
			</form>

			<Box className="inquiry-list">
				{loading && <p>{t('inquiry.list.loading')}</p>}
				{error && <p className="error-text">{t('inquiry.list.error')}</p>}
				{!loading && list.length === 0 && <p>{t('inquiry.list.empty')}</p>}

				{list.map((item: any) => (
					<Box key={item._id} className="inquiry-card">
						<div className="inquiry-header">
							<span className="inquiry-title">{item.title}</span>
							<span className={getStatusClass(item.status)}>{getStatusLabel(item.status)}</span>
						</div>
						<p className="inquiry-content-text">{item.content}</p>
						<div className="inquiry-answer">
							<span className="answer-label">{t('inquiry.list.answerLabel')}&nbsp;</span>
							<span className="answer-text">
								{item.answer ? item.answer : t('inquiry.list.noAnswer')}
							</span>
						</div>
					</Box>
				))}
				{!loading && !error && totalPages > 1 && (
					<Stack className="pagination">
						<Pagination page={page} count={totalPages} onChange={paginationChangeHandler} shape="circular" color="primary" />
					</Stack>
				)}
			</Box>
		</Stack>
	);
};

export default Inquiry;
