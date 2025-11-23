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
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	MenuItem,
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_NOTICE, DELETE_NOTICE, UPDATE_NOTICE } from '../../../../apollo/admin/mutation';
import { GET_ADMIN_NOTICES } from '../../../../apollo/admin/query';

interface Notice {
	_id: string;
	noticeCategory: string;
	noticeStatus: string;
	noticeTitle: string;
	noticeContent: string;
	memberId: string;
	createdAt: string;
}

interface NoticeListProps {
	status?: string;
}

export const NoticeList: React.FC<NoticeListProps> = ({ status }) => {
	const [page, setPage] = useState(1);
	const limit = 10;

	/** CREATE STATE **/
	const [createOpen, setCreateOpen] = useState(false);
	const [newCategory, setNewCategory] = useState('GENERAL');
	const [newTitle, setNewTitle] = useState('');
	const [newContent, setNewContent] = useState('');

	/** EDIT STATE **/
	const [editOpen, setEditOpen] = useState(false);
	const [editTarget, setEditTarget] = useState<Notice | null>(null);
	const [editTitle, setEditTitle] = useState('');
	const [editContent, setEditContent] = useState('');

	const variables: any = {
		input: {
			page,
			limit,
		},
	};

	if (status) {
		variables.input.noticeStatus = status;
	}

	const { data, loading, error, refetch } = useQuery(GET_ADMIN_NOTICES, {
		variables,
		fetchPolicy: 'network-only',
	});

	const [createNoticeMutation, { loading: createLoading }] = useMutation(CREATE_NOTICE);
	const [deleteNoticeMutation, { loading: deleteLoading }] = useMutation(DELETE_NOTICE);
	const [updateNoticeMutation, { loading: updateLoading }] = useMutation(UPDATE_NOTICE);

	const list: Notice[] = data?.getAdminNotices?.list ?? [];
	const total: number = data?.getAdminNotices?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / limit));

	useEffect(() => {
		setPage(1);
		refetch({
			input: {
				page: 1,
				limit,
				noticeStatus: status,
			},
		});
	}, [status]);

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
					noticeStatus: status,
				},
			});
		}
	};

	/** CREATE HANDLERS **/
	const openCreateDialog = () => {
		setCreateOpen(true);
	};

	const closeCreateDialog = () => {
		setCreateOpen(false);
		setNewCategory('GENERAL');
		setNewTitle('');
		setNewContent('');
	};

	const handleCreate = async () => {
		if (!newTitle || !newContent) {
			alert('Please fill title and content');
			return;
		}

		try {
			await createNoticeMutation({
				variables: {
					input: {
						noticeCategory: newCategory,
						noticeTitle: newTitle,
						noticeContent: newContent,
					},
				},
			});

			closeCreateDialog();

			await refetch({
				input: {
					page,
					limit,
					noticeStatus: status,
				},
			});
		} catch (e) {
			console.error(e);
			alert('Notice yaratishda xatolik yuz berdi');
		}
	};

	/** DELETE HANDLER **/
	const handleDelete = async (id: string) => {
		const ok = window.confirm('Ushbu notice-ni o‘chirmoqchimisiz?');
		if (!ok) return;

		try {
			await deleteNoticeMutation({
				variables: { noticeId: id },
			});
			await refetch({
				input: {
					page,
					limit,
					noticeStatus: status,
				},
			});
		} catch (e) {
			console.error(e);
			alert('Notice o‘chirishda xatolik yuz berdi');
		}
	};

	/** EDIT HANDLERS **/
	const openEditDialog = (notice: Notice) => {
		setEditTarget(notice);
		setEditTitle(notice.noticeTitle);
		setEditContent(notice.noticeContent);
		setEditOpen(true);
	};

	const closeEditDialog = () => {
		setEditOpen(false);
		setEditTarget(null);
		setEditTitle('');
		setEditContent('');
	};

	const handleUpdate = async () => {
		if (!editTarget) return;

		try {
			await updateNoticeMutation({
				variables: {
					input: {
						noticeId: editTarget._id,
						noticeTitle: editTitle,
						noticeContent: editContent,
					},
				},
			});

			closeEditDialog();

			await refetch({
				input: {
					page,
					limit,
					noticeStatus: status,
				},
			});
		} catch (e) {
			console.error(e);
			alert('Notice yangilashda xatolik yuz berdi');
		}
	};

	return (
		<>
			<Stack>
				{/* CREATE BUTTON */}
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
					<Button
						variant="contained"
						onClick={openCreateDialog}
						sx={{ width: 160, color: 'white' }}
					>
						Add Notice
					</Button>
				</Box>

				<TableContainer>
					<Table sx={{ minWidth: 750 }} size="medium">
						<TableHead>
							<TableRow>
								<TableCell align="left">CATEGORY</TableCell>
								<TableCell align="left">TITLE</TableCell>
								<TableCell align="left">CONTENT</TableCell>
								<TableCell align="left">WRITER</TableCell>
								<TableCell align="left">DATE</TableCell>
								<TableCell align="center">STATUS</TableCell>
								<TableCell align="center">ACTIONS</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{loading && (
								<TableRow>
									<TableCell colSpan={7}>Loading...</TableCell>
								</TableRow>
							)}

							{!loading && list.length === 0 && (
								<TableRow>
									<TableCell colSpan={7}>No notices.</TableCell>
								</TableRow>
							)}

							{list.map((item) => (
								<TableRow hover key={item._id}>
									<TableCell align="left">{item.noticeCategory}</TableCell>

									<TableCell align="left">
										<Typography
											sx={{
												fontWeight: 600,
												maxWidth: 260,
												whiteSpace: 'nowrap',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
											}}
										>
											{item.noticeTitle}
										</Typography>
									</TableCell>

									<TableCell align="left">
										<div
											style={{
												maxWidth: 260,
												whiteSpace: 'nowrap',
												textOverflow: 'ellipsis',
												overflow: 'hidden',
											}}
										>
											{item.noticeContent}
										</div>
									</TableCell>

									<TableCell align="left">{item.memberId}</TableCell>

									<TableCell align="left">
										{new Date(item.createdAt).toLocaleDateString()}
									</TableCell>

									<TableCell align="center">
										<span
											style={{
												padding: '4px 10px',
												borderRadius: 6,
												background:
													item.noticeStatus === 'ACTIVE'
														? '#E8F5E9'
														: item.noticeStatus === 'HIDDEN'
														? '#FFF3E0'
														: '#FFEBEE',
												color:
													item.noticeStatus === 'ACTIVE'
														? '#2E7D32'
														: item.noticeStatus === 'HIDDEN'
														? '#EF6C00'
														: '#C62828',
												fontSize: 12,
											}}
										>
											{item.noticeStatus}
										</span>
									</TableCell>

									<TableCell align="center">
										<Stack direction="row" spacing={1} justifyContent="center">
											<Button
												variant="outlined"
												size="small"
												onClick={() => openEditDialog(item)}
											>
												Edit
											</Button>
											<Button
												variant="outlined"
												color="error"
												size="small"
												onClick={() => handleDelete(item._id)}
												disabled={deleteLoading}
											>
												Delete
											</Button>
										</Stack>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

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
			</Stack>

			{/* CREATE DIALOG */}
			<Dialog open={createOpen} onClose={closeCreateDialog} fullWidth maxWidth="sm">
				<DialogTitle>Create Notice</DialogTitle>
				<DialogContent sx={{ mt: 1 }}>
					<TextField
						select
						fullWidth
						label="Category"
						margin="dense"
						value={newCategory}
						onChange={(e) => setNewCategory(e.target.value)}
					>
						<MenuItem value="GENERAL">GENERAL</MenuItem>
						<MenuItem value="EVENT">EVENT</MenuItem>
						<MenuItem value="SYSTEM">SYSTEM</MenuItem>
					</TextField>

					<TextField
						label="Title"
						fullWidth
						margin="dense"
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
					/>

					<TextField
						label="Content"
						fullWidth
						multiline
						minRows={4}
						margin="dense"
						value={newContent}
						onChange={(e) => setNewContent(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeCreateDialog}>Cancel</Button>
					<Button
						variant="contained"
						onClick={handleCreate}
						disabled={createLoading}
						style={{ color: 'white' }}
					>
						{createLoading ? 'Saving...' : 'Create'}
					</Button>
				</DialogActions>
			</Dialog>

			{/* EDIT DIALOG */}
			<Dialog open={editOpen} onClose={closeEditDialog} fullWidth maxWidth="sm">
				<DialogTitle>Edit Notice</DialogTitle>
				<DialogContent sx={{ mt: 1 }}>
					<TextField
						label="Title"
						fullWidth
						margin="dense"
						value={editTitle}
						onChange={(e) => setEditTitle(e.target.value)}
					/>
					<TextField
						label="Content"
						fullWidth
						margin="dense"
						multiline
						minRows={4}
						value={editContent}
						onChange={(e) => setEditContent(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeEditDialog}>Cancel</Button>
					<Button
						onClick={handleUpdate}
						variant="contained"
						disabled={updateLoading}
						style={{ color: 'white' }}
					>
						{updateLoading ? 'Saving...' : 'Save'}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
