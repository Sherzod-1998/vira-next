import React, { ChangeEvent, useEffect, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ReviewCard from '../../libs/components/seller/ReviewCard';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Product } from '../../libs/types/product/product';
import { Member } from '../../libs/types/member/member';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { getMemberImage, Messages, REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { CREATE_COMMENT, LIKE_TARGET_PRODUCT, SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { GET_COMMENTS, GET_MEMBER, GET_PRODUCTS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import MainProductCard from '../../libs/components/homepage/MainProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination as SwiperPagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import dayjs from 'dayjs';

SwiperCore.use([SwiperPagination]);

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale as string, ['common', 'seller'])),
	},
});

const SellerDetail: NextPage = ({ initialInput, initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation('seller');
	const user = useReactiveVar(userVar);
	const [sellerId, setsellerId] = useState<string | null>(null);
	const [seller, setseller] = useState<Member | null>(null);
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(initialInput);
	const [sellerProducts, setsellerProducts] = useState<Product[]>([]);
	const [productTotal, setProductTotal] = useState<number>(0);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [sellerComments, setsellerComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [isFollowing, setIsFollowing] = useState<boolean>(false);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/
	const [createComment] = useMutation(CREATE_COMMENT);
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { memberId: sellerId },
		skip: !sellerId,
		onCompleted: (data: T) => {
			setseller(data?.getMember);
			setIsFollowing(!!data?.getMember?.meFollowed?.[0]?.myFollowing);
			setSearchFilter({
				...searchFilter,
				search: {
					memberId: data?.getMember?._id,
					materialList: undefined,
				},
			});
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: data?.getMember?._id,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: data?.getMember?._id,
			});
		},
	});

	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setsellerProducts(data?.getProducts?.list);
			setProductTotal(data?.getProducts?.metaCounter[0]?.total ?? 0);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: {
			input: commentInquiry,
		},
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setsellerComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.sellerId) setsellerId(router.query.sellerId as string);
	}, [router]);

	/** HANDLERS **/
	const isOwnProfile = !!seller?._id && seller?._id === user?._id;
	const isVerifiedSeller = (seller?.memberRank || 0) > 0;

	const sellerStats = [
		{ label: t('detail.stats.followers'), value: seller?.memberFollowers ?? 0 },
		{ label: t('detail.stats.following'), value: seller?.memberFollowings ?? 0 },
		{ label: t('detail.stats.products'), value: seller?.memberProducts ?? 0 },
		{ label: t('detail.stats.likes'), value: seller?.memberLikes ?? 0 },
		{ label: t('detail.stats.memberSince'), value: seller?.createdAt ? dayjs(seller.createdAt).format('YYYY') : '-' },
	];

	const followSellerHandler = async () => {
		if (!sellerId) return;
		if (!user?._id) {
			sweetMixinErrorAlert(t('detail.pleaseLogInFirst')).then();
			return;
		}
		if (isOwnProfile) return;

		const previousFollowing = isFollowing;
		const previousFollowers = seller?.memberFollowers ?? 0;
		const nextFollowing = !previousFollowing;

		setIsFollowing(nextFollowing);
		setseller((prev) =>
			prev
				? {
						...prev,
						memberFollowers: nextFollowing ? previousFollowers + 1 : Math.max(previousFollowers - 1, 0),
				  }
				: prev,
		);

		try {
			if (nextFollowing) {
				await subscribe({ variables: { input: sellerId } });
			} else {
				await unsubscribe({ variables: { input: sellerId } });
			}
			await getMemberRefetch({ memberId: sellerId });
		} catch (err: any) {
			setIsFollowing(previousFollowing);
			setseller((prev) => (prev ? { ...prev, memberFollowers: previousFollowers } : prev));
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const onLike = async (id: string) => {
		try {
			await likeTargetProduct({ variables: { input: id } });
			await getProductsRefetch({ input: searchFilter });
		} catch (e: any) {
			sweetMixinErrorAlert(e.message).then();
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	const productPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		setSearchFilter({ ...searchFilter });
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			if (user._id === sellerId) throw Error(t('detail.cannotReviewYourself'));
			await createComment({
				variables: {
					input: insertCommentData,
				},
			});

			setInsertCommentData({ ...insertCommentData, commentContent: '' });

			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const likeProductHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetProduct({
				variables: {
					input: id,
				},
			});
			await getProductsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className="m-seller-detail-page">
				<Head>
					<title>{seller?.memberFullName ?? seller?.memberNick ?? t('list.title')}</title>
					<meta name="description" content={seller?.memberDesc || t('detail.seo.descriptionFallback')} />
				</Head>
				<Stack className="m-container">
					{/* SELLER HEADER */}
					<Stack className="m-seller-header">
						<div className="m-avatar" onClick={() => redirectToMemberPageHandler(seller?._id as string)}>
							<Image src={getMemberImage(seller?.memberImage)} alt={seller?.memberFullName ?? seller?.memberNick ?? ''} fill style={{ objectFit: 'cover' }} />
						</div>
						<Box component="div" className="m-info">
							<div className="m-name-row" onClick={() => redirectToMemberPageHandler(seller?._id as string)}>
								<strong>{seller?.memberFullName ?? seller?.memberNick}</strong>
								{isVerifiedSeller && (
									<span className="m-verified-badge">
										<VerifiedOutlinedIcon />
										{t('detail.verifiedSeller')}
									</span>
								)}
							</div>
							<span className="m-phone">{seller?.memberPhone}</span>
							<span className="m-meta">
								{t('detail.productsMetaAndReviews', { products: seller?.memberProducts ?? 0, count: commentTotal })}
							</span>
							<div className="m-seller-stats">
								{sellerStats.map((stat) => (
									<span className="m-stat-item" key={stat.label}>
										<b>{stat.value}</b>
										<small>{stat.label}</small>
									</span>
								))}
							</div>
							{seller && !isOwnProfile && (
								<Button className={`m-follow-btn ${isFollowing ? 'is-following' : ''}`} onClick={followSellerHandler}>
									{isFollowing ? t('detail.following') : t('detail.follow')}
								</Button>
							)}
						</Box>
					</Stack>

					{/* PRODUCTS SECTION */}
					<Stack className="m-section m-products-section">
						<Typography className="m-section-title">{t('detail.productsSection')}</Typography>

						{productTotal ? (
							<>
								<Swiper
									className="m-products-swiper"
									slidesPerView={'auto'}
									spaceBetween={16}
									pagination={{ clickable: true, el: '.m-products-swiper-pagination' }}
								>
									{sellerProducts.map((product: Product) => (
										<SwiperSlide className="m-product-slide" key={product?._id}>
											<MainProductCard product={product} onLike={onLike} />
										</SwiperSlide>
									))}
								</Swiper>

								<div className="m-products-swiper-pagination" />

								<Stack className="m-pagination">
									<span className="m-pagination-text">
										{t('detail.totalProductsAvailable', { count: productTotal })}
									</span>
								</Stack>
							</>
						) : (
							<div className="m-no-data">
								<Image src="/img/icons/icoAlert.svg" alt="" width={40} height={40} />
								<p>{t('detail.noProductsFound')}</p>
							</div>
						)}
					</Stack>

					{/* REVIEWS SECTION */}
					<Stack className="m-section m-review-section">
						<Typography className="m-section-title">{t('detail.reviewsSection')}</Typography>
						<Typography className="m-section-subtitle">{t('detail.reviewsSubtitle')}</Typography>

						{commentTotal !== 0 && (
							<Stack className="m-review-list">
								<Box component="div" className="m-review-title-box">
									<StarIcon className="m-star" />
									<span>{t('detail.reviewsCount', { count: commentTotal })}</span>
								</Box>

								{sellerComments?.map((comment: Comment) => (
									<ReviewCard comment={comment} key={comment?._id} />
								))}

								<Box component="div" className="m-pagination">
									<Pagination
										page={commentInquiry.page}
										count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
										onChange={commentPaginationChangeHandler}
										size="small"
										shape="circular"
										color="primary"
									/>
								</Box>
							</Stack>
						)}

						{/* LEAVE REVIEW */}
						<Stack className="m-leave-review">
							<Typography className="m-leave-title">{t('detail.leaveAReview')}</Typography>
							<Typography className="m-leave-label">{t('detail.review')}</Typography>
							<textarea
								onChange={({ target: { value } }: any) => {
									setInsertCommentData({ ...insertCommentData, commentContent: value });
								}}
								value={insertCommentData.commentContent}
								placeholder={t('detail.writeReviewPlaceholder')}
							></textarea>
							<Box className="m-submit-wrap" component="div">
								<Button
									className="m-submit-btn"
									disabled={insertCommentData.commentContent === '' || user?._id === ''}
									onClick={createCommentHandler}
								>
									<Typography className="title">{t('detail.submitReview')}</Typography>
									<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
										<g clipPath="url(#clip0_6975_3642)">
											<path
												d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
												fill="#181A20"
											/>
										</g>
										<defs>
											<clipPath id="clip0_6975_3642">
												<rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)" />
											</clipPath>
										</defs>
									</svg>
								</Button>
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'seller-detail-page'}>
				<Head>
					<title>{seller?.memberFullName ?? seller?.memberNick ?? t('list.title')}</title>
					<meta name="description" content={seller?.memberDesc || t('detail.seo.descriptionFallback')} />
				</Head>
				<Stack className={'container'}>
					<Stack className={'seller-info'}>
						<div className="avatar-img">
							<Image
								src={getMemberImage(seller?.memberImage)}
								alt={seller?.memberFullName ?? seller?.memberNick ?? ''}
								fill
								style={{ objectFit: 'cover' }}
							/>
						</div>
						<Box component={'div'} className={'info'}>
							<div className="seller-name-row" onClick={() => redirectToMemberPageHandler(seller?._id as string)}>
								<strong>{seller?.memberFullName ?? seller?.memberNick}</strong>
								{isVerifiedSeller && (
									<span className="verified-badge">
										<VerifiedOutlinedIcon />
										{t('detail.verifiedSeller')}
									</span>
								)}
							</div>
							<div>
								<Image src="/img/icons/call.svg" alt="" width={16} height={16} />
								<span>{seller?.memberPhone}</span>
							</div>
							<div className="seller-stats">
								{sellerStats.map((stat) => (
									<span className="stat-item" key={stat.label}>
										<b>{stat.value}</b>
										<small>{stat.label}</small>
									</span>
								))}
							</div>
							{seller && !isOwnProfile && (
								<Button className={`follow-btn ${isFollowing ? 'is-following' : ''}`} onClick={followSellerHandler}>
									{isFollowing ? t('detail.following') : t('detail.follow')}
								</Button>
							)}
						</Box>
					</Stack>
					<Stack className={'seller-home-list'}>
						<Stack className={'card-wrap'}>
							{sellerProducts.map((product: Product) => {
								return (
									<div className={'wrap-main'} key={product?._id}>
										<MainProductCard product={product} onLike={onLike} />
									</div>
								);
							})}
						</Stack>
						<Stack className={'pagination'}>
							{productTotal ? (
								<>
									<Stack className="pagination-box">
										<Pagination
											page={searchFilter.page}
											count={Math.ceil(productTotal / searchFilter.limit) || 1}
											onChange={productPaginationChangeHandler}
											shape="circular"
											color="primary"
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
									<span>{t('detail.totalProductsAvailable', { count: productTotal })}</span>
								</>
							) : (
								<div className={'no-data'}>
									<Image src="/img/icons/icoAlert.svg" alt="" width={40} height={40} />
									<p>{t('detail.noProductsFound')}</p>
								</div>
							)}
						</Stack>
					</Stack>
					<Stack className={'review-box'}>
						<Stack className={'main-intro'}>
							<span>{t('detail.reviewsSection')}</span>
							<p>{t('detail.reviewsSubtitle')}</p>
						</Stack>
						{commentTotal !== 0 && (
							<Stack className={'review-wrap'}>
								<Box component={'div'} className={'title-box'}>
									<StarIcon />
									<span>{t('detail.reviewsCount', { count: commentTotal })}</span>
								</Box>
								{sellerComments?.map((comment: Comment) => {
									return <ReviewCard comment={comment} key={comment?._id} />;
								})}
								<Box component={'div'} className={'pagination-box'}>
									<Pagination
										page={commentInquiry.page}
										count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
										onChange={commentPaginationChangeHandler}
										shape="circular"
										color="primary"
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
								</Box>
							</Stack>
						)}

						<Stack className={'leave-review-config'}>
							<Typography className={'main-title'}>{t('detail.leaveAReview')}</Typography>
							<Typography className={'review-title'}>{t('detail.review')}</Typography>
							<textarea
								onChange={({ target: { value } }: any) => {
									setInsertCommentData({ ...insertCommentData, commentContent: value });
								}}
								value={insertCommentData.commentContent}
							></textarea>
							<Box className={'submit-btn'} component={'div'}>
								<Button
									className={'submit-review'}
									disabled={insertCommentData.commentContent === '' || user?._id === ''}
									onClick={createCommentHandler}
								>
									<Typography className={'title'}>{t('detail.submitReview')}</Typography>
									<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
										<g clipPath="url(#clip0_6975_3642)">
											<path
												d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
												fill="#181A20"
											/>
										</g>
										<defs>
											<clipPath id="clip0_6975_3642">
												<rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)" />
											</clipPath>
										</defs>
									</svg>
								</Button>
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

SellerDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			memberId: '',
		},
	},
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(SellerDetail);
