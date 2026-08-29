import React, { useState } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { Pagination, Skeleton, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductCard } from './ProductCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Product } from '../../types/product/product';
import { sellerProductsInquiry } from '../../types/product/product.input';
import { T } from '../../types/common';
import { ProductStatus } from '../../enums/product.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { GET_SELLER_PRODUCTS } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';


const MyProducts: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const { t } = useTranslation('mypage');
	const [searchFilter, setSearchFilter] = useState<sellerProductsInquiry>(initialInput);
	const [sellerProducts, setsellerProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	const {
		loading: getSellerProductsLoading,
		data: getSellerProductsData,
		error: getSellerProductsError,
		refetch: getSellerProductsRefetch,
	} = useQuery(GET_SELLER_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setsellerProducts(data?.getSellerProducts?.list);
			setTotal(data?.getSellerProducts?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: ProductStatus) => {
		setSearchFilter({ ...searchFilter, search: { productStatus: value } });
	};

	const deleteProductHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert(t('products.deleteConfirm'))) {
				await updateProduct({
					variables: {
						input: {
							_id: id,
							productStatus: 'DELETE',
						},
					},
				});

				await getSellerProductsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const updateProductHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(t('products.statusConfirm', { status }))) {
				await updateProduct({
					variables: {
						input: {
							_id: id,
							productStatus: status,
						},
					},
				});
				await getSellerProductsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'SELLER') {
		router.back();
	}

	const renderSkeletonRows = () => (
		<>
			{Array.from({ length: 5 }).map((_, index) => (
				<Stack className="product-card-box" key={`product-skeleton-${index}`}>
					<Stack className="image-box">
						<Skeleton variant="rectangular" width="100%" height="100%" />
					</Stack>
					<Stack className="information-box">
						<Skeleton variant="text" width="70%" height={22} />
						<Skeleton variant="text" width="50%" height={18} />
						<Skeleton variant="text" width="30%" height={20} />
					</Stack>
					<Stack className="date-box">
						<Skeleton variant="text" width="80%" height={18} />
					</Stack>
					<Stack className="status-box">
						<Skeleton variant="rounded" width={70} height={26} />
					</Stack>
					<Stack className="views-box">
						<Skeleton variant="text" width={30} height={18} />
					</Stack>
					{searchFilter.search.productStatus === 'ACTIVE' && (
						<Stack className="action-box">
							<Skeleton variant="circular" width={28} height={28} />
							<Skeleton variant="circular" width={28} height={28} />
						</Stack>
					)}
				</Stack>
			))}
		</>
	);

	if (device === 'mobile') {
		return <div>VIRA PRODUCTS MOBILE</div>;
	} else {
		return (
			<div id="my-product-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">{t('products.title')}</Typography>
						<Typography className="sub-title">{t('subtitle')}</Typography>
					</Stack>
				</Stack>
				<Stack className="product-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(ProductStatus.ACTIVE)}
							className={searchFilter.search.productStatus === 'ACTIVE' ? 'active-tab-name' : 'tab-name'}
						>
							{t('products.onSale')}
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(ProductStatus.SOLD)}
							className={searchFilter.search.productStatus === 'SOLD' ? 'active-tab-name' : 'tab-name'}
						>
							{t('products.onSold')}
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">{t('products.listingTitle')}</Typography>
							<Typography className="title-text">{t('products.datePublished')}</Typography>
							<Typography className="title-text">{t('products.status')}</Typography>
							<Typography className="title-text">{t('products.view')}</Typography>
							{searchFilter.search.productStatus === 'ACTIVE' && (
								<Typography className="title-text">{t('products.action')}</Typography>
							)}
						</Stack>

						{getSellerProductsLoading ? (
							renderSkeletonRows()
						) : sellerProducts?.length === 0 ? (
							<Stack className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<Typography>{t('products.empty')}</Typography>
							</Stack>
						) : (
							sellerProducts.map((product: Product) => {
								return (
									<ProductCard
										product={product}
										deleteProductHandler={deleteProductHandler}
										updateProductHandler={updateProductHandler}
									/>
								);
							})
						)}

						{sellerProducts.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
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
								<Stack className="total-result">
									<Typography>{t('products.totalCount', { count: total })}</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			productStatus: 'ACTIVE',
		},
	},
};

export default MyProducts;
