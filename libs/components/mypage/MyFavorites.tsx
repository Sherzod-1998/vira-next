import React, { useState } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Skeleton, Stack, Typography } from '@mui/material';
import { Product } from '../../types/product/product';
import { T } from '../../types/common';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { GET_FAVORITES } from '../../../apollo/user/query';
import { Messages } from '../../config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import ProductCard from '../product/ProductCard';

const MyFavorites: NextPage = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('mypage');
	const [myFavorites, setMyFavorites] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFavorites, setSearchFavorites] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const {
		loading: getFavoritesLoading,
		data: getFavoritesData,
		error: getFavoritesError,
		refetch: getFavoritesRefetch,
	} = useQuery(GET_FAVORITES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFavorites },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMyFavorites(data.getFavorites?.list);
			setTotal(data.getFavorites?.metaCounter?.[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFavorites({ ...searchFavorites, page: value });
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
			await getFavoritesRefetch({ input: searchFavorites });
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const renderSkeletonCards = () => (
		<>
			{Array.from({ length: 6 }).map((_, index) => (
				<Stack className="card-config" key={`favorite-skeleton-${index}`}>
					<Skeleton variant="rectangular" className="top" width="100%" height={180} />
					<Stack className="bottom">
						<Stack className="name-address">
							<Skeleton variant="text" width="70%" height={24} />
							<Skeleton variant="text" width="50%" height={20} />
						</Stack>
					</Stack>
				</Stack>
			))}
		</>
	);

	if (device === 'mobile') {
		return <div>VIRA MY FAVORITES MOBILE</div>;
	} else {
		return (
			<div id="my-favorites-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">{t('favorites.title')}</Typography>
						<Typography className="sub-title">{t('subtitle')}</Typography>
					</Stack>
				</Stack>
				<Stack className="favorites-list-box">
					{getFavoritesLoading ? (
						renderSkeletonCards()
					) : myFavorites?.length ? (
						myFavorites?.map((product: Product) => {
							return <ProductCard product={product} likeProductHandler={likeProductHandler} myFavorites={true} />;
						})
					) : (
						<Stack className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<Typography>{t('favorites.empty')}</Typography>
						</Stack>
					)}
				</Stack>
				{myFavorites?.length ? (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(total / searchFavorites.limit)}
								page={searchFavorites.page}
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
							<Typography>{t('favorites.totalCount', { count: total, suffix: total > 1 ? 'ies' : 'y' })}</Typography>
						</Stack>
					</Stack>
				) : null}
			</div>
		);
	}
};

export default MyFavorites;
