import React, { useState } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';
import { BoardArticle } from '../../types/board-article/board-article';
import CommunityCard from '../common/CommunityCard';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { Messages } from '../../config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

const MyArticles: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const { t } = useTranslation('mypage');
	const user = useReactiveVar(userVar);
	const [searchCommunity, setSearchCommunity] = useState({
		...initialInput,
		search: { memberId: user._id },
	});
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: boardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeBoArticleHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user?._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});

			await boardArticlesRefetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert(t('articles.likeSuccess'), 750);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const renderSkeletonCards = () => (
		<>
			{Array.from({ length: 3 }).map((_, index) => (
				<Stack key={`article-skeleton-${index}`} className="community-general-card-config" sx={{ width: '285px' }}>
					<Skeleton variant="rectangular" className="card-img" width="100%" height={170} />
					<Stack className="desc-box" sx={{ marginTop: '-20px' }}>
						<Stack>
							<Skeleton variant="text" width="50%" height={20} />
							<Skeleton variant="text" width="80%" height={24} />
						</Stack>
						<Stack className={'buttons'}>
							<Skeleton variant="text" width="30%" height={24} />
						</Stack>
					</Stack>
				</Stack>
			))}
		</>
	);

	if (device === 'mobile') {
		return <>ARTICLE PAGE MOBILE</>;
	} else
		return (
			<div id="my-articles-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">{t('articles.title')}</Typography>
						<Typography className="sub-title">{t('subtitle')}</Typography>
					</Stack>
				</Stack>
				<Stack className="article-list-box">
					{boardArticlesLoading ? (
						renderSkeletonCards()
					) : boardArticles?.length > 0 ? (
						boardArticles?.map((boardArticle: BoardArticle) => {
							return (
								<CommunityCard
									boardArticle={boardArticle}
									key={boardArticle?._id}
									size={'small'}
									likeArticleHandler={likeBoArticleHandler}
								/>
							);
						})
					) : (
						<Stack className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<Typography>{t('articles.empty')}</Typography>
						</Stack>
					)}
				</Stack>

				{boardArticles?.length > 0 && (
					<Stack className="pagination-conf">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(totalCount / searchCommunity.limit)}
								page={searchCommunity.page}
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
						<Stack className="total">
							<Typography>{t('articles.totalCount', { count: totalCount ?? 0 })}</Typography>
						</Stack>
					</Stack>
				)}
			</div>
		);
};

MyArticles.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default MyArticles;
