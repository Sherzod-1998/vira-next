import React, { useState } from 'react';
import { Box, Stack, TextField, Button } from '@mui/material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_MY_CS_INQUIRIES } from '../../../apollo/user/query';
import { CREATE_CS_INQUIRY } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';
import { ReactI18NextChild } from 'react-i18next';

const Inquiry = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

	if (!user?._id) {
		return (
			<Box sx={{ padding: 5, textAlign: 'center', fontSize: 18 }}>You must be logged in to use Inquiry service.</Box>
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

	const list = data?.getMyCsInquiries.list ?? [];

	if (device === 'mobile') return <div>Inquiry MOBILE</div>;

	return (
		<Stack className="inquiry-content">
			<span className="title">1:1 Inquiry</span>

			<form className="inquiry-form" onSubmit={handleSubmit}>
				<TextField label="Title" 
				value={title} 
				onChange={(e) => setTitle(e.target.value)} 
				fullWidth size="small" />
				<TextField
					label="Content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					fullWidth size='small'
					
					
				/>

				<Button type="submit" variant="contained" disabled={createLoading}>
					{createLoading ? 'Sending...' : 'Send'}
				</Button>
			</form>

			<Box className="inquiry-list">
				{loading && <p>Loading...</p>}
				{list.length === 0 && !loading && <p>No inquiries yet.</p>}

				{list.map(
					(item: {
						_id: any;
						title:
							| string
							| number
							| boolean
							| React.ReactElement<any, string | React.JSXElementConstructor<any>>
							| React.ReactFragment
							| React.ReactPortal
							| Iterable<ReactI18NextChild>
							| null
							| undefined;
						status:
							| string
							| number
							| boolean
							| React.ReactElement<any, string | React.JSXElementConstructor<any>>
							| React.ReactFragment
							| React.ReactPortal
							| Iterable<ReactI18NextChild>
							| null
							| undefined;
						content:
							| string
							| number
							| boolean
							| React.ReactElement<any, string | React.JSXElementConstructor<any>>
							| React.ReactFragment
							| React.ReactPortal
							| Iterable<ReactI18NextChild>
							| null
							| undefined;
						answer:
							| string
							| number
							| boolean
							| React.ReactElement<any, string | React.JSXElementConstructor<any>>
							| React.ReactFragment
							| React.ReactPortal
							| Iterable<ReactI18NextChild>
							| null
							| undefined;
					}) => (
						<Box key={item._id} className="inquiry-card">
							<div className="inquiry-header">
								<span className="inquiry-title">{item.title}</span>
								<span className="inquiry-status">{item.status}</span>
							</div>
							<p className="inquiry-content-text">{item.content}</p>
							<div className="inquiry-answer">
								<strong>Answer: </strong>
								{item.answer ? item.answer : 'No answer yet'}
							</div>
						</Box>
					),
				)}
			</Box>
		</Stack>
	);
};

export default Inquiry;
