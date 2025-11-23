import React, { useEffect, useState } from 'react';
import {
	Box,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Typography,
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ADMIN_CS_INQUIRIES } from '../../../../apollo/admin/query';
import { ANSWER_CS_INQUIRY } from '../../../../apollo/admin/mutation';


interface CsInquiry {
	_id: string;
	title: string;
	content: string;
	answer: string | null;
	status: string;
	userId: string;
	createdAt: string;
}

interface InquiryListProps {
	status?: 'PENDING' | 'ANSWERED'; // parentdan keladigan filter
}

export const InquiryList: React.FC<InquiryListProps> = ({ status }) => {
	const [page, setPage] = useState(1);
	const limit = 10;

	const [selected, setSelected] = useState<CsInquiry | null>(null);
	const [answerText, setAnswerText] = useState('');

	// QUERY VARIABLES
	const variables: any = {
		input: {
			page,
			limit,
		},
	};

	if (status) {
		variables.input.status = status; // 🔥 filter qo'shildi
	}

	const { data, loading, error, refetch } = useQuery(GET_ADMIN_CS_INQUIRIES, {
		variables,
		fetchPolicy: 'network-only',
	});

	const [answerCsInquiry, { loading: answerLoading }] = useMutation(ANSWER_CS_INQUIRY);

	const list: CsInquiry[] = data?.getAdminCsInquiries?.list ?? [];
	const total: number = data?.getAdminCsInquiries?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / limit));

	// status tab o'zgarganda 1-betagacha reset + refetch
	useEffect(() => {
		setPage(1);
		refetch({
			input: {
				page: 1,
				limit,
				status,
			},
		});
	}, [status]);

	const handleOpenDialog = (item: CsInquiry) => {
		setSelected(item);
		setAnswerText(item.answer || '');
	};

	const handleCloseDialog = () => {
		setSelected(null);
		setAnswerText('');
	};

	const handleSubmitAnswer = async () => {
		if (!selected) return;

		await answerCsInquiry({
			variables: {
				input: {
					inquiryId: selected._id,
					answer: answerText,
				},
			},
		});

		handleCloseDialog();
		refetch({
			input: {
				page,
				limit,
				status,
			},
		});
	};

	const changePage = (dir: 'prev' | 'next') => {
		let newPage = page;
		if (dir === 'prev' && page > 1) newPage = page - 1;
		if (dir === 'next' && page < totalPages) newPage = page + 1;

		if (newPage !== page) {
			setPage(newPage);
			refetch({
				input: {
					page: newPage,
					limit,
					status,
				},
			});
		}
	};

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} size="medium">
					<TableHead>
						<TableRow>
							<TableCell align="left">TITLE</TableCell>
							<TableCell align="left">CONTENT</TableCell>
							<TableCell align="left">USER</TableCell>
							<TableCell align="left">DATE</TableCell>
							<TableCell align="center">STATUS</TableCell>
							<TableCell align="center">ACTION</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{loading && (
							<TableRow>
								<TableCell colSpan={6}>Loading...</TableCell>
							</TableRow>
						)}

						{!loading && list.length === 0 && (
							<TableRow>
								<TableCell colSpan={6}>No inquiries.</TableCell>
							</TableRow>
						)}

						{list.map((item) => (
							<TableRow hover key={item._id}>
								<TableCell align="left">{item.title}</TableCell>

								<TableCell align="left">
									<div
										style={{
											maxWidth: 260,
											whiteSpace: 'nowrap',
											textOverflow: 'ellipsis',
											overflow: 'hidden',
										}}
									>
										{item.content}
									</div>
								</TableCell>

								<TableCell align="left">{item.userId}</TableCell>

								<TableCell align="left">
									{new Date(item.createdAt).toLocaleDateString()}
								</TableCell>

								<TableCell align="center">
									<span
										style={{
											padding: '4px 10px',
											borderRadius: 6,
											background:
												item.status === 'PENDING'
													? '#FFEBEE'
													: '#E8F5E9',
											color:
												item.status === 'PENDING'
													? '#C62828'
													: '#2E7D32',
											fontSize: 12,
										}}
									>
										{item.status}
									</span>
								</TableCell>

								<TableCell align="center">
									<Button
										variant="outlined"
										size="small"
										onClick={() => handleOpenDialog(item)}
									>
										{item.answer ? 'Edit Answer' : 'Answer'}
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Simple pagination */}
			<Box
				sx={{
					mt: 2,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 2,
				}}
			>
				<Button
					variant="outlined"
					size="small"
					onClick={() => changePage('prev')}
					disabled={page === 1}
				>
					Prev
				</Button>
				<span>
					{page} / {totalPages}
				</span>
				<Button
					variant="outlined"
					size="small"
					onClick={() => changePage('next')}
					disabled={page === totalPages}
				>
					Next
				</Button>
			</Box>

			{/* ANSWER DIALOG */}
			<Dialog open={!!selected} onClose={handleCloseDialog} fullWidth maxWidth="sm">
				<DialogTitle>Answer Inquiry</DialogTitle>
				{selected && (
					<>
						<DialogContent dividers>
							<Typography variant="subtitle2" sx={{ mb: 1 }}>
								Title
							</Typography>
							<Typography sx={{ mb: 2 }}>{selected.title}</Typography>

							<Typography variant="subtitle2" sx={{ mb: 1 }}>
								Content
							</Typography>
							<Typography sx={{ mb: 2, whiteSpace: 'pre-line' }}>
								{selected.content}
							</Typography>

							<TextField
								label="Answer"
								fullWidth
								value={answerText}
								onChange={(e) => setAnswerText(e.target.value)}
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleCloseDialog}>Cancel</Button>
							<Button
								variant="contained"
								onClick={handleSubmitAnswer}
								disabled={answerLoading || !answerText.trim()}
							>
								{answerLoading ? 'Saving...' : 'Save'}
							</Button>
						</DialogActions>
					</>
				)}
			</Dialog>
		</Stack>
	);
};
