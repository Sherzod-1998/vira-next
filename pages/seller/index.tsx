import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination, Skeleton, Typography } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Member } from '../../libs/types/member/member';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { GET_SELLERS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import SellerCard from '../../libs/components/common/SellerCard';
import { SellersInquiry } from '../../libs/types/member/member.input';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale as string, ['common', 'seller'])),
	},
});

const SellerList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation('seller');
	const [filterSortName, setFilterSortName] = useState<string>(t('list.sort.recent'));
	const [sortingOpen, setSortingOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [searchFilter, setSearchFilter] = useState<SellersInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [sellers, setSellers] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const {
		loading: getSellersLoading,
		data: getSellersData,
		error: getSellersError,
		refetch: getSellersRefetch,
	} = useQuery(GET_SELLERS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setSellers(data?.getSellers?.list);
			setTotal(data?.getSellers?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
			setCurrentPage(inputObj.page === undefined ? 1 : inputObj.page);
			setSearchText(inputObj.search?.text || '');
			setFilterSortName(getSortLabel(inputObj.sort, inputObj.direction));
		} else {
			const input = JSON.stringify(initialInput);
			router.replace(`/seller?input=${input}`, `/seller?input=${input}`);
		}
	}, [initialInput, router, router.query.input]);

	/** HANDLERS **/
	const getSortLabel = (sort?: string, direction?: string) => {
		if (sort === 'createdAt' && direction === 'ASC') return t('list.sort.oldest');
		if (sort === 'memberLikes') return t('list.sort.likes');
		if (sort === 'memberViews') return t('list.sort.views');
		return t('list.sort.recent');
	};

	const pushSearchFilter = async (input: SellersInquiry) => {
		await router.push({ pathname: '/seller', query: { input: JSON.stringify(input) } }, undefined, { scroll: false });
		setSearchFilter(input);
		setCurrentPage(input.page === undefined ? 1 : input.page);
		setSearchText(input.search?.text || '');
	};

	const submitSearchHandler = async () => {
		await pushSearchFilter({
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, text: searchText },
		});
	};

	const resetSearchHandler = async () => {
		setSearchText('');
		await pushSearchFilter(initialInput);
	};

	const renderSellerSkeletons = (mobile = false) => (
		<Stack className={mobile ? 'm-card-wrap' : 'card-wrap'}>
			{Array.from({ length: 6 }).map((_, index) => (
				<Stack
					className={mobile ? 'm-seller-card seller-card-skeleton' : 'seller-general-card seller-card-skeleton'}
					key={`seller-skeleton-${index}`}
				>
					<Skeleton variant="rounded" className={mobile ? 'm-skeleton-avatar' : 'seller-img'} />
					<Stack className={mobile ? 'm-right' : 'seller-desc'}>
						<Stack className={mobile ? 'm-info' : 'seller-info'}>
							<Skeleton variant="text" width={mobile ? 130 : 120} height={24} />
							<Skeleton variant="text" width={mobile ? 70 : 58} height={20} />
						</Stack>
						<Skeleton variant="rounded" width={mobile ? 120 : 92} height={28} />
					</Stack>
				</Stack>
			))}
		</Stack>
	);

	const renderEmptyState = (mobile = false) => (
		<div className={mobile ? 'm-empty-state' : 'seller-empty-state'}>
			<Typography className="empty-title">{t('list.emptyTitle')}</Typography>
			<Typography className="empty-subtitle">{t('list.emptySubtitle')}</Typography>
			<Button className="empty-reset-btn" onClick={resetSearchHandler}>
				{t('list.reset')}
			</Button>
		</div>
	);

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		let nextInput = { ...searchFilter };

		switch (e.currentTarget.id) {
			case 'recent':
				nextInput = { ...searchFilter, sort: 'createdAt', direction: 'DESC' as any };
				setFilterSortName(t('list.sort.recent'));
				break;
			case 'old':
				nextInput = { ...searchFilter, sort: 'createdAt', direction: 'ASC' as any };
				setFilterSortName(t('list.sort.oldest'));
				break;
			case 'likes':
				nextInput = { ...searchFilter, sort: 'memberLikes', direction: 'DESC' as any };
				setFilterSortName(t('list.sort.likes'));
				break;
			case 'views':
				nextInput = { ...searchFilter, sort: 'memberViews', direction: 'DESC' as any };
				setFilterSortName(t('list.sort.views'));
				break;
		}
		pushSearchFilter(nextInput).then();
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		await pushSearchFilter({ ...searchFilter, page: value });
	};

	const likeMemberHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			await likeTargetMember({
				variables: {
					input: id,
				},
			});

			await getSellersRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
			throw err;
		}
	};

	/* MOBILE LAYOUT */
	if (device === 'mobile') {
		return (
			<div id="m-seller-list-page">
				<Head>
					<title>{t('list.title')}</title>
				</Head>
				<div className="m-container">
					{/* SEARCH + SORT */}
					<Stack className="m-filter" spacing={2}>
						<div className="m-search">
							<input
								type="text"
								placeholder={t('list.searchPlaceholder')}
								value={searchText}
								onChange={(e: any) => setSearchText(e.target.value)}
								onKeyDown={(event: any) => {
									if (event.key === 'Enter') {
										submitSearchHandler().then();
									}
								}}
							/>
						</div>

						<div className="m-sort">
							<span className="m-sort-label">{t('list.sortBy')}</span>
							<button type="button" className="m-sort-button" onClick={sortingClickHandler}>
								<span>{filterSortName}</span>
								<KeyboardArrowDownRoundedIcon className="m-sort-icon" />
							</button>

							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem onClick={sortingHandler} id="recent" disableRipple>
									{t('list.sort.recent')}
								</MenuItem>
								<MenuItem onClick={sortingHandler} id="old" disableRipple>
									{t('list.sort.oldest')}
								</MenuItem>
								<MenuItem onClick={sortingHandler} id="likes" disableRipple>
									{t('list.sort.likes')}
								</MenuItem>
								<MenuItem onClick={sortingHandler} id="views" disableRipple>
									{t('list.sort.views')}
								</MenuItem>
							</Menu>
						</div>
					</Stack>

					{/* SELLERS LIST */}
					{getSellersLoading && renderSellerSkeletons(true)}
					{!getSellersLoading && sellers?.length === 0 && renderEmptyState(true)}
					{!getSellersLoading && sellers?.length > 0 && (
						<Stack className="m-card-wrap">
							{sellers.map((seller: Member) => (
								<SellerCard seller={seller} key={seller._id} likeMemberHandler={likeMemberHandler} />
							))}
						</Stack>
					)}

					{/* PAGINATION */}
					{sellers.length !== 0 && (
						<Stack className="m-pagination" spacing={1.5}>
							{Math.ceil(total / searchFilter.limit) > 1 && (
								<Pagination
									page={currentPage}
									count={Math.ceil(total / searchFilter.limit)}
									onChange={paginationChangeHandler}
									shape="circular"
									color="primary"
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
							)}

							<span className="m-total">{t('list.totalAvailable', { count: total })}</span>
						</Stack>
					)}
				</div>
			</div>
		);
	}

	/* DESKTOP LAYOUT */
	return (
		<Stack className={'seller-list-page'}>
			<Head>
				<title>{t('list.title')}</title>
			</Head>
			<Stack className={'container'}>
				<Stack className={'filter'}>
					<Box component={'div'} className={'left'}>
						<input
							type="text"
							placeholder={t('list.searchPlaceholder')}
							value={searchText}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									submitSearchHandler().then();
								}
							}}
						/>
					</Box>
					<Box component={'div'} className={'right'}>
						<span>{t('list.sortBy')}</span>
						<div>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{filterSortName}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem onClick={sortingHandler} id={'recent'} disableRipple>
									{t('list.sort.recent')}
								</MenuItem>
								<MenuItem onClick={sortingHandler} id={'old'} disableRipple>
									{t('list.sort.oldest')}
								</MenuItem>
								<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>
									{t('list.sort.likes')}
								</MenuItem>
								<MenuItem onClick={sortingHandler} id={'views'} disableRipple>
									{t('list.sort.views')}
								</MenuItem>
							</Menu>
						</div>
					</Box>
				</Stack>
				{getSellersLoading && renderSellerSkeletons()}
				{!getSellersLoading && sellers?.length === 0 && renderEmptyState()}
				{!getSellersLoading && sellers?.length > 0 && (
					<Stack className={'card-wrap'}>
						{sellers.map((seller: Member) => {
							return <SellerCard seller={seller} key={seller._id} likeMemberHandler={likeMemberHandler} />;
						})}
					</Stack>
				)}
				<Stack className={'pagination'}>
					<Stack className="pagination-box">
						{sellers.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
							<Stack className="pagination-box">
								<Pagination
									page={currentPage}
									count={Math.ceil(total / searchFilter.limit)}
									onChange={paginationChangeHandler}
									shape="circular"
									color="primary"
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
						)}
					</Stack>

					{sellers.length !== 0 && <span>{t('list.totalAvailable', { count: total })}</span>}
				</Stack>
			</Stack>
		</Stack>
	);
};

SellerList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(SellerList);
