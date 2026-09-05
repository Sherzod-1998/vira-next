import React, { useState } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Skeleton, Stack, Typography } from '@mui/material';
import ProductCard from '../product/ProductCard';
import { Product } from '../../types/product/product';
import { T } from '../../types/common';
import { useQuery } from '@apollo/client';
import { GET_VISITED } from '../../../apollo/user/query';

const RecentlyVisited: NextPage = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('mypage');
	const [recentlyVisited, setRecentlyVisited] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchVisited, setSearchVisited] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/

	const {
		loading: getVisitedLoading,
		data: getVisitedData,
		error: getVisitedError,
		refetch: getVisitedRefetch,
	} = useQuery(GET_VISITED, {
		fetchPolicy: 'network-only',
		variables: { input: searchVisited },
		onCompleted: (data: T) => {
			setRecentlyVisited(data.getVisited?.list);
			setTotal(data.getVisited?.metaCounter?.[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchVisited({ ...searchVisited, page: value });
	};

	const renderSkeletonCards = () => (
		<>
			{Array.from({ length: 6 }).map((_, index) => (
				<Stack className="card-config" key={`recently-visited-skeleton-${index}`}>
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
		return <div>VIRA RECENTLY VISITED MOBILE</div>;
	} else {
		return (
			<div id="my-favorites-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">{t('recentlyVisited.title')}</Typography>
						<Typography className="sub-title">{t('subtitle')}</Typography>
					</Stack>
				</Stack>
				<Stack className="favorites-list-box">
					{getVisitedLoading ? (
						renderSkeletonCards()
					) : recentlyVisited?.length ? (
						recentlyVisited?.map((product: Product) => {
							return <ProductCard product={product} recentlyVisited={true} />;
						})
					) : (
						<Stack className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<Typography>{t('recentlyVisited.empty')}</Typography>
						</Stack>
					)}
				</Stack>
				{recentlyVisited?.length ? (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(total / searchVisited.limit)}
								page={searchVisited.page}
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
							<Typography>
								{t('recentlyVisited.totalCount', { count: total, suffix: total > 1 ? 'ies' : 'y' })}
							</Typography>
						</Stack>
					</Stack>
				) : null}
			</div>
		);
	}
};

export default RecentlyVisited;
