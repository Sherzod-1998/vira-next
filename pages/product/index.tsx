import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import ProductCard from '../../libs/components/product/ProductCard';
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

	// 🔹 MOBILE FILTER DRAWER HOLATI
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
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		console.log('searchFilter', searchFilter);
	}, [searchFilter]);

	/** HANDLERS **/
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
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'productPrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'productPrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	/* 📱 MOBILE LAYOUT */
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
							</Menu>
						</div>
					</Stack>

					{/* FILTER BUTTON */}
					<Stack className="m-filter-bar">
						<Button className="m-filter-btn" onClick={() => setFilterOpen(true)}>
							Filter
						</Button>
					</Stack>

					{/* LIST / CONTENT */}
					<Stack className="m-content" spacing={2}>
						{getProductsLoading && (
							<div className="m-loading">
								<p>Loading products...</p>
							</div>
						)}

						{!getProductsLoading && products?.length === 0 && (
							<div className="m-no-data">
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No products found!</p>
							</div>
						)}

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
							<Typography className="m-total">
								Total {total} product{total > 1 ? 's' : ''} available
							</Typography>
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
							{/* Asl Filter component - mobil uchun ham o‘sha */}
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

	/* 💻 DESKTOP LAYOUT */
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
						</Menu>
					</div>
				</Box>
				<Stack className={'product-page'}>
					<Stack className={'filter-config'}>
						{/* @ts-ignore */}
						<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
					</Stack>
					<Stack className="main-config" mb={'76px'}>
						<Stack className={'list-config'}>
							{products?.length === 0 ? (
								<div className={'no-data'}>
									<img src="/img/icons/icoAlert.svg" alt="" />
									<p>No Products found!</p>
								</div>
							) : (
								products.map((product: Product) => {
									return <MainProductCard product={product} onLike={onLike} key={product?._id} />;
								})
							)}
						</Stack>
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
									<Typography>
										Total {total} product{total > 1 ? 's' : ''} available
									</Typography>
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