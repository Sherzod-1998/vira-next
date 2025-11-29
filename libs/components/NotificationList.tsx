// components/notification/NotificationList.tsx
import React, { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
	Box,
	Button,
	CircularProgress,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
	Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import { getNotificationLink } from '../helpers/getNotificationLink';
import {
	GET_MY_NOTIFICATIONS,
	MARK_ALL_NOTIFICATIONS_READ,
	MARK_NOTIFICATION_READ,
} from '../../apollo/user/query';

interface Props {
	onClose: () => void;
}

const PAGE_SIZE = 10;

type Notification = {
	_id: string;
	notificationType: string;
	notificationStatus: string;
	notificationGroup: string;
	notificationTitle: string;
	notificationDesc?: string | null;
	authorId: string;
	receiverId: string;
	productId?: string | null;
	articleId?: string | null;
	createdAt: string;
	updatedAt: string;
};

export const NotificationList: React.FC<Props> = ({ onClose }) => {
	const [page, setPage] = useState(1);
	const router = useRouter();

	const { data, loading, error, refetch } = useQuery(GET_MY_NOTIFICATIONS, {
		variables: { input: { page, limit: PAGE_SIZE } },
		fetchPolicy: 'cache-and-network',
	});

	const [markNotificationRead] = useMutation(MARK_NOTIFICATION_READ);
	const [markAllNotificationsRead, { loading: markAllLoading }] = useMutation(MARK_ALL_NOTIFICATIONS_READ);

	const notifications: Notification[] = useMemo(
		() => data?.getMyNotifications?.list ?? [],
		[data],
	);

	const total: number = data?.getMyNotifications?.total ?? 0;
	const limit: number = data?.getMyNotifications?.limit ?? PAGE_SIZE;
	const hasMore = page * limit < total;

	const handleClickItem = async (item: Notification) => {
		try {
			// agar unread bo'lsa → read qilib qo'yamiz
			if (item.notificationStatus === 'WAIT') {
				await markNotificationRead({
					variables: { notificationId: item._id },
				});
				await refetch();
			}

			const link = getNotificationLink(item);
			if (link) {
				router.push(link);
			}

			onClose();
		} catch (e) {
			console.error(e);
		}
	};

	const handleMarkAll = async () => {
		try {
			await markAllNotificationsRead();
			await refetch();
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<Box
			sx={{
				width: 400,
				maxHeight: 500,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{/* Header */}
			<Box
				sx={{
					p: 2,
					borderBottom: '1px solid rgba(255,255,255,0.1)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Typography variant="h6" fontWeight={600}>
					Notifications
				</Typography>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Button
						size="small"
						variant="text"
						onClick={handleMarkAll}
						disabled={markAllLoading || notifications.length === 0}
					>
						Mark all as read
					</Button>
					<IconButton size="small" onClick={onClose}>
						<CloseIcon fontSize="small" />
					</IconButton>
				</Box>
			</Box>

			{/* Content */}
			<Box sx={{ flex: 1, overflowY: 'auto' }}>
				{loading && !data ? (
					<Box
						sx={{
							py: 4,
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<CircularProgress size={24} />
					</Box>
				) : error ? (
					<Box sx={{ p: 2 }}>
						<Typography color="error" variant="body2">
							Xatolik yuz berdi, iltimos qayta urinib ko‘ring.
						</Typography>
					</Box>
				) : notifications.length === 0 ? (
					<Box sx={{ p: 2 }}>
						<Typography variant="body2" color="text.secondary">
							Hozircha notification yo‘q.
						</Typography>
					</Box>
				) : (
					<List disablePadding>
						{notifications.map((item) => {
							const isUnread = item.notificationStatus === 'WAIT';

							return (
								<ListItem
									key={item._id}
									disablePadding
									sx={{
										'&:not(:last-of-type)': {
											borderBottom: '1px solid rgba(255,255,255,0.06)',
										},
									}}
								>
									<ListItemButton
										onClick={() => handleClickItem(item)}
										sx={{
											alignItems: 'flex-start',
											bgcolor: isUnread ? 'rgba(255,255,255,0.04)' : 'transparent',
										}}
									>
										{/* Chapdagi ko‘k nuqta (unread) */}
										<Box sx={{ pt: 1, pr: 1 }}>
											{isUnread && (
												<Box
													sx={{
														width: 8,
														height: 8,
														borderRadius: '50%',
														bgcolor: 'primary.main',
														mt: 0.5,
													}}
												/>
											)}
										</Box>

										<ListItemText
											primary={
												<Typography variant="body2" fontWeight={isUnread ? 600 : 400}>
													{item.notificationTitle}
												</Typography>
											}
											secondary={
												<Typography
													variant="caption"
													color="text.secondary"
													sx={{ whiteSpace: 'pre-line' }}
												>
													{item.notificationDesc ?? ''}
												</Typography>
											}
										/>
									</ListItemButton>
								</ListItem>
							);
						})}
					</List>
				)}
			</Box>

			{/* Pastki qism – Load more */}
			{hasMore && (
				<Box
					sx={{
						borderTop: '1px solid rgba(255,255,255,0.1)',
						p: 1.5,
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					<Button
						size="small"
						onClick={() => setPage((prev) => prev + 1)}
						disabled={loading}
					>
						Load more
					</Button>
				</Box>
			)}
		</Box>
	);
};

export default NotificationList;
