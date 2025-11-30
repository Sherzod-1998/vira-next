import React, { useState } from 'react';
import { Box, Stack, TextField, Button } from '@mui/material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_MY_CS_INQUIRIES } from '../../../apollo/user/query';
import { CREATE_CS_INQUIRY } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';

const Inquiry = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

	if (!user?._id) {
		return (
			<Box sx={{ padding: 5, textAlign: 'center', fontSize: 18 }}>
				You must be logged in to use Inquiry service.
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

	/* 🔹 MOBILE LAYOUT */
	if (device === 'mobile') {
		return (
			<Stack className="m-inquiry-content">
				<span className="m-title">1:1 Inquiry</span>

				<form className="m-inquiry-form" onSubmit={handleSubmit}>
					<TextField
						label="Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						fullWidth
						size="small"
					/>
					<TextField
						label="Content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						fullWidth
						size="small"
					
					/>

					<Button
						type="submit"
						variant="contained"
						disabled={createLoading}
						className="m-submit-btn"
					>
						{createLoading ? 'Sending...' : 'Send'}
					</Button>
				</form>

				<Box className="m-inquiry-list">
					{loading && <p>Loading...</p>}
					{!loading && list.length === 0 && <p>No inquiries yet.</p>}

					{list.map((item: any) => (
						<Box key={item._id} className="m-inquiry-card">
							<div className="m-inquiry-header">
								<span className="m-inquiry-title">{item.title}</span>
								<span className="m-inquiry-status">{item.status}</span>
							</div>
							<p className="m-inquiry-content-text">{item.content}</p>
							<div className="m-inquiry-answer">
								<span className="answer-label">Answer:&nbsp;</span>
								<span className="answer-text">
									{item.answer ? item.answer : 'No answer yet'}
								</span>
							</div>
						</Box>
					))}
				</Box>
			</Stack>
		);
	}

	/* 🔹 PC LAYOUT */
	return (
		<Stack className="inquiry-content">
			<span className="title">1:1 Inquiry</span>

			<form className="inquiry-form" onSubmit={handleSubmit}>
				<TextField
					label="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					fullWidth
					size="small"
				/>
				<TextField
					label="Content"
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
					{createLoading ? 'Sending...' : 'Send'}
				</Button>
			</form>

			<Box className="inquiry-list">
				{loading && <p>Loading...</p>}
				{!loading && list.length === 0 && <p>No inquiries yet.</p>}

				{list.map((item: any) => (
					<Box key={item._id} className="inquiry-card">
						<div className="inquiry-header">
							<span className="inquiry-title">{item.title}</span>
							<span className="inquiry-status">{item.status}</span>
						</div>
						<p className="inquiry-content-text">{item.content}</p>
						<div className="inquiry-answer">
							<span className="answer-label">Answer:&nbsp;</span>
							<span className="answer-text">
								{item.answer ? item.answer : 'No answer yet'}
							</span>
						</div>
					</Box>
				))}
			</Box>
		</Stack>
	);
};

export default Inquiry;