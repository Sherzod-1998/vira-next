import React, { useEffect, useState } from 'react';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Stack, Typography, Tab, Tabs, IconButton, Backdrop, Pagination } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import dayjs from 'dayjs';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import dynamic from 'next/dynamic';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import EditIcon from '@mui/icons-material/Edit';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { CREATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE, UPDATE_COMMENT } from '../../apollo/user/mutation';
import { GET_BOARD_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import { getMemberImage, Messages } from '../../libs/config';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetMixinSuccessAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';

const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale as string, ['common', 'community'])),
	},
});

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const { t } = useTranslation('community');
	const router = useRouter();
	const { query } = router;

	const articleId = query?.id as string;
	const articleCategory = query?.articleCategory as string;

	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
		...initialInput,
	});
	const [memberImage, setMemberImage] = useState<string>('/img/community/articleImg.png');
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const [boardArticle, setBoardArticle] = useState<BoardArticle>();

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	const {
		loading: boardArticleLoading,
		data: boardArticleData,
		error: boardArticleError,
		refetch: boardArticleRefetch,
	} = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: { input: articleId },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			setBoardArticle(data?.getBoardArticle);
			if (data?.getBoardArticle?.memberData?.memberImage) {
				setMemberImage(getMemberImage(data?.getBoardArticle?.memberData?.memberImage));
			}
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: searchFilter,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			setComments(data.getComments.list);
			setTotal(data.getComments?.metaCounter?.[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!articleId) return;
		setSearchFilter((prev) => ({
			...prev,
			search: { ...prev.search, commentRefId: articleId },
		}));
	}, [articleId]);

	/** HANDLERS **/
	const tabChangeHandler = (event: React.SyntheticEvent, value: string) => {
		router.replace(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			'/community',
			{ shallow: true },
		);
	};

	const likeBoArticleHandler = async (user: any, id: any) => {
		try {
			if (likeLoading) return;
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			setLikeLoading(true);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});
			await boardArticleRefetch({ input: articleId });
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLikeLoading(false);
		}
	};

	const createCommentHandler = async () => {
		if (!comment) return;
		try {
			if (!user?._id) throw new Error(Messages.error2);
			const commentInput: CommentInput = {
				commentGroup: CommentGroup.ARTICLE,
				commentRefId: articleId,
				commentContent: comment,
			};
			await createComment({
				variables: {
					input: commentInput,
				},
			});
			await getCommentsRefetch({ input: searchFilter });
			await boardArticleRefetch({ input: articleId });
			setComment('');
			await sweetMixinSuccessAlert('Successfully commented!');
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		}
	};

	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			if (!commentId) throw new Error('Select a comment to update');
			if (updatedComment === comments?.find((comment) => comment?._id === commentId)?.commentContent) return;
			const updateData: CommentUpdate = {
				_id: commentId,
				...(commentStatus && { commentStatus: commentStatus }),
				...(updatedComment && { commentContent: updatedComment }),
			};

			if (!updateData?.commentContent && !updateData?.commentStatus)
				throw new Error('Provide data to update your comment!');
			if (commentStatus) {
				if (await sweetConfirmAlert('Do you want to delete the comment?')) {
					await updateComment({
						variables: {
							input: updateData,
						},
					});
					await sweetMixinSuccessAlert('Successtully deleted!');
				} else return;
			} else {
				await updateComment({
					variables: {
						input: updateData,
					},
				});
				await sweetMixinSuccessAlert('Successfully updated!');
			}
			await getCommentsRefetch({ input: searchFilter });
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		} finally {
			setOpenBackdrop(false);
			setUpdatedComment('');
			setUpdatedCommentWordsCnt(0);
			setUpdatedCommentId('');
		}
	};

	const getCommentMemberImage = (imageUrl: string | undefined) => {
		if (!imageUrl) return '/img/community/articleImg.png';
		return getMemberImage(imageUrl);
	};

	const goMemberPage = (id: any) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const cancelButtonHandler = () => {
		setOpenBackdrop(false);
		setUpdatedComment('');
		setUpdatedCommentWordsCnt(0);
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const renderEditCommentBackdrop = () => (
		<Backdrop
			sx={{
				top: device === 'mobile' ? '25%' : '40%',
				right: device === 'mobile' ? '5%' : '25%',
				left: device === 'mobile' ? '5%' : '25%',
				width: device === 'mobile' ? '90%' : '1000px',
				height: 'fit-content',
				borderRadius: '10px',
				color: '#ffffff',
				zIndex: 999,
			}}
			open={openBackdrop}
		>
			<Stack
				sx={{
					width: '100%',
					height: '100%',
					background: 'white',
					border: '1px solid #b9b9b9',
					padding: '15px',
					gap: '10px',
					borderRadius: '10px',
					boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
				}}
			>
				<Typography variant="h4" color={'#b9b9b9'}>
					{t('detail.updateComment')}
				</Typography>
				<Stack gap={'20px'}>
					<input
						autoFocus
						value={updatedComment}
						onChange={(e) => updateCommentInputHandler(e.target.value)}
						type="text"
						style={{
							border: '1px solid #b9b9b9',
							outline: 'none',
							height: '40px',
							padding: '0px 10px',
							borderRadius: '5px',
						}}
					/>
					<Stack width={'100%'} flexDirection={'row'} justifyContent={'space-between'}>
						<Typography variant="subtitle1" color={'#b9b9b9'}>
							{updatedCommentWordsCnt}/100
						</Typography>
						<Stack sx={{ flexDirection: 'row', alignSelf: 'flex-end', gap: '10px' }}>
							<Button variant="outlined" color="inherit" onClick={() => cancelButtonHandler()}>
								{t('detail.cancel')}
							</Button>
							<Button variant="contained" color="inherit" onClick={() => updateButtonHandler(updatedCommentId, undefined)}>
								{t('detail.update')}
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</Backdrop>
	);

	if (device === 'mobile') {
		return (
			<div id="m-community-detail-page">
				<Head>
					<title>{boardArticle?.articleTitle || t('detail.boardArticleTitle')}</title>
					<meta
						name="description"
						content={boardArticle?.articleContent?.slice(0, 150) || t('detail.boardSubtitle')}
					/>
				</Head>
				<div className="m-container">
					{/* HEADER: CATEGORY + WRITE BUTTON */}
					<Stack className="m-header">
						<Typography className="m-section-title">
							{articleCategory} {t('detail.board')}
						</Typography>
						<Button
							className="m-write-btn"
							onClick={() =>
								router.push({
									pathname: '/mypage',
									query: { category: 'writeArticle' },
								})
							}
						>
							{t('detail.write')}
						</Button>
					</Stack>

					{/* ARTICLE CARD */}
					<Stack className="m-article-card">
						{/* Author row */}
						<Stack className="m-author-row">
							<Stack className="m-author-left" onClick={() => goMemberPage(boardArticle?.memberData?._id as string)}>
								<Image src={memberImage} alt="" width={40} height={40} className="m-author-img" />
								<Stack className="m-author-info">
									<Typography className="m-author-name">{boardArticle?.memberData?.memberNick}</Typography>
									<Typography className="m-created-at">
										{dayjs(boardArticle?.createdAt).format('DD.MM.YY HH:mm')}
									</Typography>
								</Stack>
							</Stack>

							{/* Stats (views / comments / likes) */}
							<Stack className="m-author-right">
								<Stack className="m-icon-info">
									<VisibilityIcon className="m-icon" />
									<Typography className="m-icon-text">{boardArticle?.articleViews}</Typography>
								</Stack>
								<Stack className="m-icon-info">
									{total > 0 ? <ChatIcon className="m-icon" /> : <ChatBubbleOutlineRoundedIcon className="m-icon" />}
									<Typography className="m-icon-text">{total}</Typography>
								</Stack>
								<Stack className="m-icon-info">
									{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
										<ThumbUpAltIcon
											className="m-icon like"
											onClick={() => likeBoArticleHandler(user, boardArticle?._id)}
										/>
									) : (
										<ThumbUpOffAltIcon
											className="m-icon"
											onClick={() => likeBoArticleHandler(user, boardArticle?._id)}
										/>
									)}
									<Typography className="m-icon-text">{boardArticle?.articleLikes}</Typography>
								</Stack>
							</Stack>
						</Stack>

						{/* Title */}
						<Typography className="m-article-title">{boardArticle?.articleTitle}</Typography>

						{/* Content */}
						<Stack className="m-content-box">
							<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
						</Stack>

						{/* Like button (big) */}
						<Stack className="m-like-row">
							<Button
								className="m-like-btn"
								onClick={() => likeBoArticleHandler(user, boardArticle?._id)}
								disabled={likeLoading}
							>
								{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
									<ThumbUpAltIcon className="m-like-icon" />
								) : (
									<ThumbUpOffAltIcon className="m-like-icon" />
								)}
								<Typography className="m-like-text">
									{t('detail.likeCount', { count: boardArticle?.articleLikes || 0 })}
								</Typography>
							</Button>
						</Stack>
					</Stack>

					{/* COMMENTS INPUT */}
					<Stack className="m-comments-card">
						<Typography className="m-comments-title">{t('detail.commentsTitle', { count: total })}</Typography>
						<Stack className="m-comment-input-box">
							<input
								type="text"
								placeholder={t('detail.leaveComment')}
								value={comment}
								onChange={(e) => {
									if (e.target.value.length > 100) return;
									setWordsCnt(e.target.value.length);
									setComment(e.target.value);
								}}
							/>
							<Stack className="m-comment-bottom-row">
								<Typography className="m-counter">{wordsCnt}/100</Typography>
								<Button className="m-comment-btn" onClick={createCommentHandler}>
									{t('detail.comment')}
								</Button>
							</Stack>
						</Stack>
					</Stack>

					{/* COMMENTS LIST */}
					{total > 0 && (
						<>
							<Typography className="m-comments-list-title">{t('detail.comments')}</Typography>

							<Stack className="m-comments-list">
								{comments?.map((commentData) => (
									<Stack className="m-comment-item" key={commentData?._id}>
										<Stack className="m-comment-header">
											<Stack
												className="m-comment-user"
												onClick={() => goMemberPage(commentData?.memberData?._id as string)}
											>
												<Image
													src={getCommentMemberImage(commentData?.memberData?.memberImage)}
													alt=""
													width={36}
													height={36}
													className="m-comment-img"
												/>
												<Stack className="m-comment-user-info">
													<Typography className="m-comment-name">{commentData?.memberData?.memberNick}</Typography>
													<Typography className="m-comment-date">
														{dayjs(commentData?.createdAt).format('DD.MM.YY HH:mm')}
													</Typography>
												</Stack>
											</Stack>

											{commentData?.memberId === user?._id && (
												<Stack className="m-comment-actions">
													<IconButton
														aria-label={t('detail.deleteCommentAria')}
														onClick={() => {
															setUpdatedCommentId(commentData?._id);
															updateButtonHandler(commentData?._id, CommentStatus.DELETE);
														}}
													>
														<DeleteForeverIcon sx={{ color: '#757575', cursor: 'pointer' }} />
													</IconButton>
													<IconButton
														aria-label={t('detail.editCommentAria')}
														onClick={() => {
															setUpdatedComment(commentData?.commentContent);
															setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
															setUpdatedCommentId(commentData?._id);
															setOpenBackdrop(true);
														}}
													>
														<EditIcon sx={{ color: '#757575' }} />
													</IconButton>
												</Stack>
											)}
										</Stack>

										<Stack className="m-comment-body">
											<Typography className="m-comment-text">{commentData?.commentContent}</Typography>
										</Stack>
									</Stack>
								))}
							</Stack>

							{/* PAGINATION */}
							<Stack className="m-pagination-box">
								<Pagination
									count={Math.ceil(total / searchFilter.limit) || 1}
									page={searchFilter.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
									sx={{
										'& .MuiPaginationItem-root': {
											color: 'rgba(0, 0, 0, 1)',
											borderColor: 'rgba(0, 0, 0, 1)',
										},
										'& .Mui-selected': {
											backgroundColor: 'rgba(146, 106, 84, 1) !important',
											color: '#000000ff !important',
										},
									}}
								/>
							</Stack>
						</>
					)}

					{renderEditCommentBackdrop()}
				</div>
			</div>
		);
	} else {
		return (
			<div id="community-detail-page">
				<Head>
					<title>{boardArticle?.articleTitle || t('detail.boardArticleTitle')}</title>
					<meta
						name="description"
						content={boardArticle?.articleContent?.slice(0, 150) || t('detail.boardSubtitle')}
					/>
				</Head>
				<div className="container">
					<Stack className="main-box">
						<Stack className="left-config">
							<Stack className={'image-info'}>
								<Stack className={'community-name'}>
									<Typography className={'name'}>{t('detail.boardArticleTitle')}</Typography>
								</Stack>
							</Stack>
							<Tabs
								orientation="vertical"
								aria-label="lab API tabs example"
								TabIndicatorProps={{
									style: { display: 'none' },
								}}
								onChange={tabChangeHandler}
								value={articleCategory}
							>
								<Tab
									value={'FREE'}
									label={t('list.tabsDesktop.free')}
									className={`tab-button ${articleCategory === 'FREE' ? 'active' : ''}`}
								/>
								<Tab
									value={'RECOMMEND'}
									label={t('list.tabsDesktop.recommend')}
									className={`tab-button ${articleCategory === 'RECOMMEND' ? 'active' : ''}`}
								/>
								<Tab
									value={'NEWS'}
									label={t('list.tabsDesktop.news')}
									className={`tab-button ${articleCategory === 'NEWS' ? 'active' : ''}`}
								/>
								<Tab
									value={'HUMOR'}
									label={t('list.tabsDesktop.humor')}
									className={`tab-button ${articleCategory === 'HUMOR' ? 'active' : ''}`}
								/>
							</Tabs>
						</Stack>
						<div className="community-detail-config">
							<Stack className="title-box">
								<Stack className="left">
									<Typography className="title">
										{articleCategory} {t('detail.board')}
									</Typography>
									<Typography className="sub-title">{t('detail.boardSubtitle')}</Typography>
								</Stack>
								<Button
									onClick={() =>
										router.push({
											pathname: '/mypage',
											query: {
												category: 'writeArticle',
											},
										})
									}
									className="right"
								>
									{t('detail.write')}
								</Button>
							</Stack>
							<div className="config">
								<Stack className="first-box-config">
									<Stack className="content-and-info">
										<Stack className="content">
											<Typography className="content-data">{boardArticle?.articleTitle}</Typography>
											<Stack className="member-info">
												<Image
													src={memberImage}
													alt=""
													width={30}
													height={30}
													className="member-img"
													onClick={() => goMemberPage(boardArticle?.memberData?._id)}
												/>
												<Typography className="member-nick" onClick={() => goMemberPage(boardArticle?.memberData?._id)}>
													{boardArticle?.memberData?.memberNick}
												</Typography>
												<Stack className="divider"></Stack>
												<Typography className={'time-added'}>
													{dayjs(boardArticle?.createdAt).format('DD.MM.YY HH:mm')}
												</Typography>
											</Stack>
										</Stack>
										<Stack className="info">
											<Stack className="icon-info">
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<ThumbUpAltIcon onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												) : (
													<ThumbUpOffAltIcon onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												)}

												<Typography className="text">{boardArticle?.articleLikes}</Typography>
											</Stack>
											<Stack className="divider"></Stack>
											<Stack className="icon-info">
												<VisibilityIcon />
												<Typography className="text">{boardArticle?.articleViews}</Typography>
											</Stack>
											<Stack className="divider"></Stack>
											<Stack className="icon-info">
												{total > 0 ? <ChatIcon /> : <ChatBubbleOutlineRoundedIcon />}

												<Typography className="text">{total}</Typography>
											</Stack>
										</Stack>
									</Stack>
									<Stack>
										<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
									</Stack>
									<Stack className="like-and-dislike">
										<Stack className="top">
											<Button>
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<ThumbUpAltIcon onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												) : (
													<ThumbUpOffAltIcon onClick={() => likeBoArticleHandler(user, boardArticle?._id)} />
												)}
												<Typography className="text">{boardArticle?.articleLikes}</Typography>
											</Button>
										</Stack>
									</Stack>
								</Stack>
								<Stack
									className="second-box-config"
									sx={{ borderBottom: total > 0 ? 'none' : '1px solid #eee', border: '1px solid #eee' }}
								>
									<Typography className="title-text">{t('detail.commentsTitle', { count: total })}</Typography>
									<Stack className="leave-comment">
										<input
											type="text"
											placeholder={t('detail.leaveComment')}
											value={comment}
											onChange={(e) => {
												if (e.target.value.length > 100) return;
												setWordsCnt(e.target.value.length);
												setComment(e.target.value);
											}}
										/>
										<Stack className="button-box">
											<Typography>{wordsCnt}/100</Typography>
											<Button onClick={createCommentHandler}>{t('detail.comment')}</Button>
										</Stack>
									</Stack>
								</Stack>
								{total > 0 && (
									<Stack className="comments">
										<Typography className="comments-title">{t('detail.comments')}</Typography>
									</Stack>
								)}
								{comments?.map((commentData, index) => {
									return (
										<Stack className="comments-box" key={commentData?._id}>
											<Stack className="main-comment">
												<Stack className="member-info">
													<Stack
														className="name-date"
														onClick={() => goMemberPage(commentData?.memberData?._id as string)}
													>
														<Image
															src={getCommentMemberImage(commentData?.memberData?.memberImage)}
															alt=""
															width={45}
															height={45}
														/>
														<Stack className="name-date-column">
															<Typography className="name">{commentData?.memberData?.memberNick}</Typography>
															<Typography className="date time-added">
																{dayjs(commentData?.createdAt).format('DD.MM.YY HH:mm')}
															</Typography>
														</Stack>
													</Stack>
													{commentData?.memberId === user?._id && (
														<Stack className="buttons">
															<IconButton
																aria-label={t('detail.deleteCommentAria')}
																onClick={() => {
																	setUpdatedCommentId(commentData?._id);
																	updateButtonHandler(commentData?._id, CommentStatus.DELETE);
																}}
															>
																<DeleteForeverIcon sx={{ color: '#757575', cursor: 'pointer' }} />
															</IconButton>
															<IconButton
																aria-label={t('detail.editCommentAria')}
																onClick={() => {
																	setUpdatedComment(commentData?.commentContent);
																	setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
																	setUpdatedCommentId(commentData?._id);
																	setOpenBackdrop(true);
																}}
															>
																<EditIcon sx={{ color: '#757575' }} />
															</IconButton>
														</Stack>
													)}
												</Stack>
												<Stack className="content">
													<Typography>{commentData?.commentContent}</Typography>
												</Stack>
											</Stack>
										</Stack>
									);
								})}
								{total > 0 && (
									<Stack className="pagination-box">
										<Pagination
											count={Math.ceil(total / searchFilter.limit) || 1}
											page={searchFilter.page}
											shape="circular"
											color="primary"
											onChange={paginationHandler}
											sx={{
												'& .MuiPaginationItem-root': {
													color: 'rgba(0, 0, 0, 1)', // normal color
													borderColor: 'rgba(0, 0, 0, 1)',
												},
												'& .Mui-selected': {
													backgroundColor: 'rgba(146, 106, 84, 1) !important',
													color: '#000000ff !important',
												},
											}}
										/>
									</Stack>
								)}
								{renderEditCommentBackdrop()}
							</div>
						</div>
					</Stack>
				</div>
			</div>
		);
	}
};
CommunityDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(CommunityDetail);
