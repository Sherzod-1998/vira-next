import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination } from '@mui/material';
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

	// URL da category bo‘lsa, initialInput ichiga yozib qo‘yamiz (FREE / RECOMMEND / NEWS / HUMOR)
	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
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
		if (!query?.articleCategory)
			router.push(
				{
					pathname: router.pathname,
					query: { articleCategory: 'FREE' },
				},
				router.pathname,
					{ shallow: true },
				);
	}, [query?.articleCategory, router]);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		setSearchCommunity({
			...searchCommunity,
			page: 1,
			search: { articleCategory: value as BoardArticleCategory },
		});

		await router.push(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			router.pathname,
			{ shallow: true },
		);
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
			console.log('ERROR, likeArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	/** ===========================
	 *  🔹 MOBILE LAYOUT
	 *  =========================== */
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
								<Stack className="m-list-box">
									{totalCount ? (
										boardArticles?.map((boardArticle: BoardArticle) => (
											<CommunityCard
												boardArticle={boardArticle}
												key={boardArticle?._id}
												likeArticleHandler={likeArticleHandler}
											/>
										))
									) : (
										<Stack className="no-data">
											<img src="/img/icons/icoAlert.svg" alt="" />
											<p>No Article found!</p>
										</Stack>
									)}
								</Stack>
							</TabPanel>

							<TabPanel value="RECOMMEND" className="m-tab-panel">
								<Stack className="m-list-box">
									{totalCount ? (
										boardArticles?.map((boardArticle: BoardArticle) => (
											<CommunityCard
												boardArticle={boardArticle}
												key={boardArticle?._id}
												likeArticleHandler={likeArticleHandler}
											/>
										))
									) : (
										<Stack className="no-data">
											<img src="/img/icons/icoAlert.svg" alt="" />
											<p>No Article found!</p>
										</Stack>
									)}
								</Stack>
							</TabPanel>

							<TabPanel value="NEWS" className="m-tab-panel">
								<Stack className="m-list-box">
									{totalCount ? (
										boardArticles?.map((boardArticle: BoardArticle) => (
											<CommunityCard
												boardArticle={boardArticle}
												key={boardArticle?._id}
												likeArticleHandler={likeArticleHandler}
											/>
										))
									) : (
										<Stack className="no-data">
											<img src="/img/icons/icoAlert.svg" alt="" />
											<p>No Article found!</p>
										</Stack>
									)}
								</Stack>
							</TabPanel>

							<TabPanel value="HUMOR" className="m-tab-panel">
								<Stack className="m-list-box">
									{totalCount ? (
										boardArticles?.map((boardArticle: BoardArticle) => (
											<CommunityCard
												boardArticle={boardArticle}
												key={boardArticle?._id}
												likeArticleHandler={likeArticleHandler}
											/>
										))
									) : (
										<Stack className="no-data">
											<img src="/img/icons/icoAlert.svg" alt="" />
											<p>No Article found!</p>
										</Stack>
									)}
								</Stack>
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

								<TabPanel value="FREE">
									<Stack className="list-box">
										{totalCount ? (
											boardArticles?.map((boardArticle: BoardArticle) => {
												return (
													<CommunityCard
														boardArticle={boardArticle}
														key={boardArticle?._id}
														likeArticleHandler={likeArticleHandler}
													/>
												);
											})
										) : (
											<Stack className={'no-data'}>
												<img src="/img/icons/icoAlert.svg" alt="" />
												<p>No Article found!</p>
											</Stack>
										)}
									</Stack>
								</TabPanel>

								<TabPanel value="RECOMMEND">
									<Stack className="list-box">
										{totalCount ? (
											boardArticles?.map((boardArticle: BoardArticle) => {
												return (
													<CommunityCard
														boardArticle={boardArticle}
														key={boardArticle?._id}
														likeArticleHandler={likeArticleHandler}
													/>
												);
											})
										) : (
											<Stack className={'no-data'}>
												<img src="/img/icons/icoAlert.svg" alt="" />
												<p>No Article found!</p>
											</Stack>
										)}
									</Stack>
								</TabPanel>

								<TabPanel value="NEWS">
									<Stack className="list-box">
										{totalCount ? (
											boardArticles?.map((boardArticle: BoardArticle) => {
												return (
													<CommunityCard
														boardArticle={boardArticle}
														key={boardArticle?._id}
														likeArticleHandler={likeArticleHandler}
													/>
												);
											})
										) : (
											<Stack className={'no-data'}>
												<img src="/img/icons/icoAlert.svg" alt="" />
												<p>No Article found!</p>
											</Stack>
										)}
									</Stack>
								</TabPanel>

								<TabPanel value="HUMOR">
									<Stack className="list-box">
										{totalCount ? (
											boardArticles?.map((boardArticle: BoardArticle) => {
												return (
													<CommunityCard
														boardArticle={boardArticle}
														key={boardArticle?._id}
														likeArticleHandler={likeArticleHandler}
													/>
												);
											})
										) : (
											<Stack className={'no-data'}>
												<img src="/img/icons/icoAlert.svg" alt="" />
												<p>No Article found!</p>
											</Stack>
										)}
									</Stack>
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
		direction: 'ASC',
		search: {
			articleCategory: 'FREE',
		},
	},
};

export default withLayoutBasic(Community);
