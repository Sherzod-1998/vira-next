import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Skeleton, Stack, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/product/Filter';
import { useRouter } from 'next/router';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { Product } from '../../libs/types/product/product';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Direction, Message } from '../../libs/enums/common.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_PRODUCT } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import MainProductCard from '../../libs/components/homepage/MainProductCard';

const DEFAULT_PRICE_START = 0;
const DEFAULT_PRICE_END = 2000000;

const formatFilterLabel = (value: string) =>
	value
		.toLowerCase()
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

const formatPrice = (value: number) => `$${value.toLocaleString()}`;

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProductList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();

	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');

	// Mobile filter drawer state
	const [filterOpen, setFilterOpen] = useState(false);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProducts(data?.getProducts?.list);
			setTotal(data?.getProducts?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
			setCurrentPage(inputObj.page === undefined ? 1 : inputObj.page);
			setFilterSortName(getSortLabel(inputObj.sort, inputObj.direction));
		}
	}, [router.query.input]);

	/** HANDLERS **/
	const getSortLabel = (sort?: string, direction?: Direction) => {
		if (sort === 'productPrice' && direction === Direction.ASC) return 'Lowest Price';
		if (sort === 'productPrice' && direction === Direction.DESC) return 'Highest Price';
		if (sort === 'productViews' && direction === Direction.DESC) return 'Most Popular';
		if (sort === 'productLikes' && direction === Direction.DESC) return 'Most Liked';
		return 'New';
	};

	const pushSearchFilter = async (input: ProductsInquiry) => {
		await router.push(`/product?input=${JSON.stringify(input)}`, `/product?input=${JSON.stringify(input)}`, {
			scroll: false,
		});
		setSearchFilter(input);
		setCurrentPage(input.page === undefined ? 1 : input.page);
	};

	const resetFilters = async () => {
		await pushSearchFilter(initialInput);
	};

	const removeFilterValue = async (field: 'locationList' | 'typeList' | 'materialList', value: string) => {
		const nextValues = ((searchFilter.search as any)?.[field] || []).filter((item: string) => item !== value);
		const nextSearch = { ...searchFilter.search, [field]: nextValues };

		if (nextValues.length === 0) delete (nextSearch as any)[field];

		await pushSearchFilter({ ...searchFilter, page: 1, search: nextSearch });
	};

	const removeTextFilter = async () => {
		const nextSearch = { ...searchFilter.search };
		delete nextSearch.text;
		await pushSearchFilter({ ...searchFilter, page: 1, search: nextSearch });
	};

	const resetPriceFilter = async () => {
		await pushSearchFilter({
			...searchFilter,
			page: 1,
			search: {
				...searchFilter.search,
				pricesRange: { start: DEFAULT_PRICE_START, end: DEFAULT_PRICE_END },
			},
		});
	};

	const activeFilterChips = [
		...((searchFilter.search?.typeList || []).map((value: string) => ({
			key: `type-${value}`,
			label: `Type: ${formatFilterLabel(value)}`,
			onRemove: () => removeFilterValue('typeList', value),
		})) || []),
		...((searchFilter.search?.materialList || []).map((value: string) => ({
			key: `material-${value}`,
			label: `Material: ${formatFilterLabel(value)}`,
			onRemove: () => removeFilterValue('materialList', value),
		})) || []),
		...((searchFilter.search?.locationList || []).map((value: string) => ({
			key: `location-${value}`,
			label: `Location: ${formatFilterLabel(value)}`,
			onRemove: () => removeFilterValue('locationList', value),
		})) || []),
		...(searchFilter.search?.text
			? [
					{
						key: 'text',
						label: `Search: ${searchFilter.search.text}`,
						onRemove: removeTextFilter,
					},
			  ]
			: []),
		...(searchFilter.search?.pricesRange &&
		(searchFilter.search.pricesRange.start !== DEFAULT_PRICE_START ||
			searchFilter.search.pricesRange.end !== DEFAULT_PRICE_END)
			? [
					{
						key: 'price',
						label: `${formatPrice(searchFilter.search.pricesRange.start)} - ${formatPrice(
							searchFilter.search.pricesRange.end,
						)}`,
						onRemove: resetPriceFilter,
					},
			  ]
			: []),
	];

	const renderActiveFilters = (mobile = false) =>
		activeFilterChips.length > 0 && (
			<Stack className={mobile ? 'm-active-filters' : 'active-filters'} direction="row">
				{activeFilterChips.map((chip) => (
					<button className="filter-chip" key={chip.key} type="button" onClick={chip.onRemove}>
						<span>{chip.label}</span>
						<b>✕</b>
					</button>
				))}
				<button className="filter-chip clear-chip" type="button" onClick={resetFilters}>
					Clear all
				</button>
			</Stack>
		);

	const renderSkeletonCards = (mobile = false) => (
		<div className={mobile ? 'm-product-grid' : 'list-config'}>
			{Array.from({ length: 9 }).map((_, index) => (
				<Stack
					className={`product-card product-card-skeleton ${mobile ? 'mobile' : ''}`}
					key={`product-skeleton-${index}`}
				>
					<Skeleton variant="rectangular" className="skeleton-image" />
					<Stack className="product-info">
						<Skeleton variant="text" width="38%" height={22} />
						<Skeleton variant="text" width="80%" height={28} />
						<Skeleton variant="text" width="64%" height={24} />
						<Skeleton variant="text" width="44%" height={28} />
						<Skeleton variant="rounded" width="100%" height={44} />
					</Stack>
				</Stack>
			))}
		</div>
	);

	const renderEmptyState = (mobile = false) => (
		<div className={mobile ? 'm-empty-state' : 'empty-state'}>
			<Typography className="empty-title">No pieces found</Typography>
			<Typography className="empty-subtitle">Try adjusting your filters</Typography>
			<Button className="empty-clear-btn" onClick={resetFilters}>
				Clear filters
			</Button>
		</div>
	);

	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/product?input=${JSON.stringify(searchFilter)}`,
			`/product?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const onLike = async (id: string) => {
		try {
			if (!id) return;
			await likeTargetProduct({
				variables: { input: id },
			});

			await getProductsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, onLike:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProduct({
				variables: { input: id },
			});
			await getProductsRefetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

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
			case 'new':
				nextInput = { ...searchFilter, sort: 'createdAt', direction: Direction.DESC };
				setFilterSortName('New');
				break;
			case 'lowest':
				nextInput = { ...searchFilter, sort: 'productPrice', direction: Direction.ASC };
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				nextInput = { ...searchFilter, sort: 'productPrice', direction: Direction.DESC };
				setFilterSortName('Highest Price');
				break;
			case 'popular':
				nextInput = { ...searchFilter, sort: 'productViews', direction: Direction.DESC };
				setFilterSortName('Most Popular');
				break;
			case 'liked':
				nextInput = { ...searchFilter, sort: 'productLikes', direction: Direction.DESC };
				setFilterSortName('Most Liked');
				break;
		}
		pushSearchFilter(nextInput).then();
		setSortingOpen(false);
		setAnchorEl(null);
	};

	/* MOBILE LAYOUT */
	if (device === 'mobile') {
		return (
			<div id="product-list-page-mobile">
				<div className="container">
					{/* TOP BAR: Title + Sort */}
					<Stack className="m-top-bar" direction="row" alignItems="center" justifyContent="space-between">
						<Typography className="m-title">Products</Typography>

						<div className="m-sort">
							<span className="m-sort-label">Sort by</span>
							<Button
								className="m-sort-button"
								onClick={sortingClickHandler}
								endIcon={<KeyboardArrowDownRoundedIcon />}
							>
								{filterSortName}
							</Button>

							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler}>
								<MenuItem onClick={sortingHandler} id="new" disableRipple>
									New
								</MenuItem>
								<MenuItem onClick={sortingHandler} id="lowest" disableRipple>
									Lowest Price
								</MenuItem>
								<MenuItem onClick={sortingHandler} id="highest" disableRipple>
									Highest Price
								</MenuItem>
								<MenuItem onClick={sortingHandler} id="popular" disableRipple>
									Most Popular
								</MenuItem>
								<MenuItem onClick={sortingHandler} id="liked" disableRipple>
									Most Liked
								</MenuItem>
							</Menu>
						</div>
					</Stack>

					{renderActiveFilters(true)}

					<Typography className="m-result-count">
						Showing {products?.length || 0} of {total || 0} pieces
					</Typography>

					{/* FILTER BUTTON */}
					<Stack className="m-filter-bar">
						<Button className="m-filter-btn" onClick={() => setFilterOpen(true)}>
							Filter
						</Button>
					</Stack>

					{/* LIST / CONTENT */}
					<Stack className="m-content" spacing={2}>
						{getProductsLoading && renderSkeletonCards(true)}

						{!getProductsLoading && products?.length === 0 && renderEmptyState(true)}

						{!getProductsLoading && products?.length > 0 && (
							<div className="m-product-grid">
								{products.map((product: Product) => (
									<MainProductCard product={product} onLike={onLike} key={product?._id} />
								))}
							</div>
						)}
					</Stack>

					{/* PAGINATION + TOTAL */}
					{!getProductsLoading && products.length > 0 && (
						<Stack className="m-pagination" spacing={1}>
							<Pagination
								size="small"
								page={currentPage}
								count={Math.ceil(total / searchFilter.limit)}
								onChange={handlePaginationChange}
								shape="circular"
								color="secondary"
							/>
							<Typography className="m-total">Showing {products.length} of {total} pieces</Typography>
						</Stack>
					)}

					{/* FILTER DRAWER (BOTTOM SHEET) */}
					<Drawer
						anchor="bottom"
						open={filterOpen}
						onClose={() => setFilterOpen(false)}
						PaperProps={{
							sx: {
								borderTopLeftRadius: '16px',
								borderTopRightRadius: '16px',
								maxHeight: '85vh',
								padding: '16px',
							},
						}}
					>
						<Stack spacing={2}>
							{/* The same filter component is used for mobile. */}
							{/* @ts-ignore */}
							<Filter
								searchFilter={searchFilter}
								setSearchFilter={setSearchFilter}
								initialInput={initialInput}
							/>

							<Button
								variant="contained"
								fullWidth
								onClick={() => setFilterOpen(false)}
								sx={{ background: '#000', color: '#fff', borderRadius: '12px' }}
							>
								Apply Filter
							</Button>
						</Stack>
					</Drawer>
				</div>
			</div>
		);
	}

	/* DESKTOP LAYOUT */
	return (
		<div id="product-list-page" style={{ position: 'relative' }}>
			<div className="container">
				<Box component={'div'} className={'right'}>
					<span>Sort by</span>
					<div>
						<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
							{filterSortName}
						</Button>
						<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
							<MenuItem
								onClick={sortingHandler}
								id={'new'}
								disableRipple
								sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
							>
								New
							</MenuItem>
							<MenuItem
								onClick={sortingHandler}
								id={'lowest'}
								disableRipple
								sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
							>
								Lowest Price
							</MenuItem>
							<MenuItem
								onClick={sortingHandler}
								id={'highest'}
								disableRipple
								sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
							>
								Highest Price
							</MenuItem>
							<MenuItem
								onClick={sortingHandler}
								id={'popular'}
								disableRipple
								sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
							>
								Most Popular
							</MenuItem>
							<MenuItem
								onClick={sortingHandler}
								id={'liked'}
								disableRipple
								sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
							>
								Most Liked
							</MenuItem>
						</Menu>
					</div>
				</Box>
				<Stack className={'product-page'}>
					<Stack className={'filter-config'}>
						{/* @ts-ignore */}
						<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
					</Stack>
					<Stack className="main-config" mb={'76px'}>
						<Stack className="result-toolbar">
							<Typography className="result-count">
								Showing {products?.length || 0} of {total || 0} pieces
							</Typography>
							{renderActiveFilters()}
						</Stack>
						{getProductsLoading && renderSkeletonCards()}
						{!getProductsLoading && products?.length === 0 && renderEmptyState()}
						{!getProductsLoading && products?.length > 0 && (
							<Stack className={'list-config'}>
								{products.map((product: Product) => {
									return <MainProductCard product={product} onLike={onLike} key={product?._id} />;
								})}
							</Stack>
						)}
						<Stack className="pagination-config">
							{products.length !== 0 && (
								<Stack className="pagination-box">
									<Pagination
										page={currentPage}
										count={Math.ceil(total / searchFilter.limit)}
										onChange={handlePaginationChange}
										shape="circular"
										color="secondary"
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

							{products.length !== 0 && (
								<Stack className="total-result">
									<Typography>Showing {products.length} of {total} pieces</Typography>
								</Stack>
							)}
						</Stack>
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

ProductList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(ProductList);
