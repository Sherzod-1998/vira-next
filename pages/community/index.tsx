import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination, Menu, MenuItem, Skeleton } from '@mui/material';
import CommunityCard from '../../libs/components/common/CommunityCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Direction } from '../../libs/enums/common.enum';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;

	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [searchText, setSearchText] = useState<string>('');
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState<boolean>(false);
	const [filterSortName, setFilterSortName] = useState<string>('Newest');

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: boardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory) {
			router.push(
				{
					pathname: router.pathname,
					query: { articleCategory: 'FREE' },
				},
				router.pathname,
					{ shallow: true },
				);
			return;
		}

		const nextInput: BoardArticlesInquiry = {
			...initialInput,
			sort: (query.sort as string) || initialInput.sort,
			direction: ((query.direction as Direction) || initialInput.direction) as Direction,
			search: {
				articleCategory: query.articleCategory as BoardArticleCategory,
				...(query.text ? { text: query.text as string } : {}),
			},
		};

		setSearchCommunity(nextInput);
		setSearchText((query.text as string) || '');
		setFilterSortName(getSortLabel(nextInput.sort, nextInput.direction));
	}, [initialInput, query?.articleCategory, query?.text, query?.sort, query?.direction, router]);

	/** HANDLERS **/
	const getSortLabel = (sort?: string, direction?: Direction) => {
		if (sort === 'articleLikes') return 'Most Liked';
		if (sort === 'articleViews') return 'Most Viewed';
		if (sort === 'articleComments') return 'Most Commented';
		return 'Newest';
	};

	const pushCommunityQuery = async (input: BoardArticlesInquiry) => {
		await router.push(
			{
				pathname: '/community',
				query: {
					articleCategory: input.search.articleCategory,
					...(input.search.text ? { text: input.search.text } : {}),
					...(input.sort ? { sort: input.sort } : {}),
					...(input.direction ? { direction: input.direction } : {}),
				},
			},
			undefined,
			{ shallow: true },
		);
		setSearchCommunity(input);
		setSearchText(input.search.text || '');
		setFilterSortName(getSortLabel(input.sort, input.direction));
	};

	const submitSearchHandler = async () => {
		const nextSearch = { ...searchCommunity.search };
		if (searchText) nextSearch.text = searchText;
		else delete nextSearch.text;

		await pushCommunityQuery({ ...searchCommunity, page: 1, search: nextSearch });
	};

	const clearSearchHandler = async () => {
		const nextSearch = { ...searchCommunity.search };
		delete nextSearch.text;
		await pushCommunityQuery({ ...searchCommunity, page: 1, search: nextSearch });
	};

	const sortingClickHandler = (e: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		let nextInput = { ...searchCommunity, page: 1 };

		switch (e.currentTarget.id) {
			case 'newest':
				nextInput = { ...nextInput, sort: 'createdAt', direction: Direction.DESC };
				break;
			case 'liked':
				nextInput = { ...nextInput, sort: 'articleLikes', direction: Direction.DESC };
				break;
			case 'viewed':
				nextInput = { ...nextInput, sort: 'articleViews', direction: Direction.DESC };
				break;
			case 'commented':
				nextInput = { ...nextInput, sort: 'articleComments', direction: Direction.DESC };
				break;
		}

		pushCommunityQuery(nextInput).then();
		sortingCloseHandler();
	};

	const tabChangeHandler = async (e: T, value: string) => {
		await pushCommunityQuery({
			...searchCommunity,
			page: 1,
			search: { ...searchCommunity.search, articleCategory: value as BoardArticleCategory },
		});
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeArticleHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});

			await boardArticlesRefetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const renderSkeletonCards = (mobile = false) => (
		<Stack className={mobile ? 'm-list-box' : 'list-box'}>
			{Array.from({ length: 6 }).map((_, index) => (
				<Stack
					className={mobile ? 'm-community-card community-card-skeleton' : 'community-general-card-config community-card-skeleton'}
					key={`community-skeleton-${index}`}
				>
					<Skeleton variant="rounded" className={mobile ? 'm-skeleton-image' : 'image-box'} />
					<Stack className={mobile ? 'm-content' : 'desc-box'}>
						<Skeleton variant="text" width="45%" height={22} />
						<Skeleton variant="text" width="82%" height={24} />
						<Skeleton variant="rounded" width="60%" height={28} />
					</Stack>
				</Stack>
			))}
		</Stack>
	);

	const renderEmptyState = (mobile = false) => (
		<Stack className={mobile ? 'no-data m-empty-state' : 'no-data empty-state'}>
			<img src="/img/icons/icoAlert.svg" alt="" />
			<Typography className="empty-title">No Article found!</Typography>
			<Typography className="empty-subtitle">Try another category or search phrase.</Typography>
			{searchCommunity.search.text && (
				<Button className="clear-search-btn" onClick={clearSearchHandler}>
					Clear search
				</Button>
			)}
		</Stack>
	);

	const renderArticleList = (mobile = false) => {
		if (boardArticlesLoading) return renderSkeletonCards(mobile);
		if (!totalCount) return renderEmptyState(mobile);

		return (
			<Stack className={mobile ? 'm-list-box' : 'list-box'}>
				{boardArticles?.map((boardArticle: BoardArticle) => (
					<CommunityCard boardArticle={boardArticle} key={boardArticle?._id} likeArticleHandler={likeArticleHandler} />
				))}
			</Stack>
		);
	};

	const renderSearchSortControls = (mobile = false) => (
		<Stack className={mobile ? 'm-community-controls' : 'community-controls'}>
			<div className={mobile ? 'm-search-box' : 'search-box'}>
				<input
					type="text"
					placeholder="Search articles"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					onKeyDown={(event) => {
						if (event.key === 'Enter') submitSearchHandler().then();
					}}
				/>
				{searchText && (
					<button type="button" onClick={clearSearchHandler} aria-label="Clear search">
						✕
					</button>
				)}
			</div>
			<div className={mobile ? 'm-sort-box' : 'sort-box'}>
				<span>Sort by</span>
				<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
					{filterSortName}
				</Button>
				<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
					<MenuItem onClick={sortingHandler} id="newest" disableRipple>
						Newest
					</MenuItem>
					<MenuItem onClick={sortingHandler} id="liked" disableRipple>
						Most Liked
					</MenuItem>
					<MenuItem onClick={sortingHandler} id="viewed" disableRipple>
						Most Viewed
					</MenuItem>
					<MenuItem onClick={sortingHandler} id="commented" disableRipple>
						Most Commented
					</MenuItem>
				</Menu>
			</div>
		</Stack>
	);

	/** MOBILE LAYOUT */
	if (device === 'mobile') {
		return (
			<div id="m-community-list-page">
				<div className="m-container">
					<TabContext value={searchCommunity.search.articleCategory}>
						<Stack className="m-header">
							<Typography className="m-title">Vira Community</Typography>
							<Typography className="m-sub">
								Share your thoughts, recommendations, news and humor with the Vira family.
							</Typography>
						</Stack>

						<Stack className="m-tabs-wrap">
							<TabList
								aria-label="community tabs"
								onChange={tabChangeHandler}
								variant="scrollable"
								scrollButtons="auto"
								TabIndicatorProps={{
									style: { display: 'none' },
								}}
							>
								<Tab
									value="FREE"
									label="Free"
									className={`m-tab-button ${searchCommunity.search.articleCategory === 'FREE' ? 'active' : ''}`}
								/>
								<Tab
									value="RECOMMEND"
									label="Recommend"
									className={`m-tab-button ${searchCommunity.search.articleCategory === 'RECOMMEND' ? 'active' : ''}`}
								/>
								<Tab
									value="NEWS"
									label="News"
									className={`m-tab-button ${searchCommunity.search.articleCategory === 'NEWS' ? 'active' : ''}`}
								/>
								<Tab
									value="HUMOR"
									label="Humor"
									className={`m-tab-button ${searchCommunity.search.articleCategory === 'HUMOR' ? 'active' : ''}`}
								/>
							</TabList>
						</Stack>

						{renderSearchSortControls(true)}

						<Stack className="m-write-btn-wrap">
							<Button
								className="m-write-btn"
								onClick={() =>
									router.push({
										pathname: '/mypage',
										query: {
											category: 'writeArticle',
										},
									})
								}
							>
								Write
							</Button>
						</Stack>

						<Stack className="m-panel-wrap">
							<TabPanel value="FREE" className="m-tab-panel">
								{renderArticleList(true)}
							</TabPanel>

							<TabPanel value="RECOMMEND" className="m-tab-panel">
								{renderArticleList(true)}
							</TabPanel>

							<TabPanel value="NEWS" className="m-tab-panel">
								{renderArticleList(true)}
							</TabPanel>

							<TabPanel value="HUMOR" className="m-tab-panel">
								{renderArticleList(true)}
							</TabPanel>
						</Stack>

						{totalCount > 0 && (
							<Stack className="m-pagination-config">
								<Stack className="m-pagination-box">
									<Pagination
										count={Math.ceil(totalCount / searchCommunity.limit)}
										page={searchCommunity.page}
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
								<Stack className="m-total-result">
									<Typography>
										Total {totalCount} article{totalCount > 1 ? 's' : ''} available
									</Typography>
								</Stack>
							</Stack>
						)}
					</TabContext>
				</div>
			</div>
		);
	}

	return (
		<div id="community-list-page">
			<div className="container">
				<TabContext value={searchCommunity.search.articleCategory}>
					<Stack className="main-box">
						<Stack className="left-config">
							<Stack className={'image-info'}>
								<Stack className={'community-name'} justifyContent={'center'} alignItems={'center'}>
									<Typography className={'name'}>Vira Community</Typography>
								</Stack>
							</Stack>

							<TabList
								orientation="vertical"
								aria-label="lab API tabs example"
								TabIndicatorProps={{
									style: { display: 'none' },
								}}
								onChange={tabChangeHandler}
							>
								<Tab
									value={'FREE'}
									label={'Free Board'}
									className={`tab-button ${searchCommunity.search.articleCategory == 'FREE' ? 'active' : ''}`}
								/>
								<Tab
									value={'RECOMMEND'}
									label={'Recommendation'}
									className={`tab-button ${searchCommunity.search.articleCategory == 'RECOMMEND' ? 'active' : ''}`}
								/>
								<Tab
									value={'NEWS'}
									label={'News'}
									className={`tab-button ${searchCommunity.search.articleCategory == 'NEWS' ? 'active' : ''}`}
								/>
								<Tab
									value={'HUMOR'}
									label={'Humor'}
									className={`tab-button ${searchCommunity.search.articleCategory == 'HUMOR' ? 'active' : ''}`}
								/>
							</TabList>
						</Stack>

						<Stack className="right-config">
							<Stack className="panel-config">
								<Stack className="title-box">
									<Stack className="left">
										<Typography className="title">{searchCommunity.search.articleCategory} BOARD</Typography>
										<Typography className="sub-title">
											Express your opinions freely here without content restrictions
										</Typography>
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
										Write
									</Button>
								</Stack>

								{renderSearchSortControls()}

								<TabPanel value="FREE">
									{renderArticleList()}
								</TabPanel>

								<TabPanel value="RECOMMEND">
									{renderArticleList()}
								</TabPanel>

								<TabPanel value="NEWS">
									{renderArticleList()}
								</TabPanel>

								<TabPanel value="HUMOR">
									{renderArticleList()}
								</TabPanel>
							</Stack>
						</Stack>
					</Stack>
				</TabContext>

				{totalCount > 0 && (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(totalCount / searchCommunity.limit)}
								page={searchCommunity.page}
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
						<Stack className="total-result">
							<Typography>
								Total {totalCount} article{totalCount > 1 ? 's' : ''} available
							</Typography>
						</Stack>
					</Stack>
				)}
			</div>
		</div>
	);
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			articleCategory: 'FREE',
		},
	},
};

export default withLayoutBasic(Community);
