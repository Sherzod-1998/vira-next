import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularProductCard from './PopularProductCard';
import { Product } from '../../types/product/product';
import Link from 'next/link';
import { ProductsInquiry } from '../../types/product/product.input';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';

interface PopularProductsProps {
	initialInput: ProductsInquiry;
}

const PopularProducts = (props: PopularProductsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularProducts, setPopularProducts] = useState<Product[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setPopularProducts(data?.getProducts?.list);
		},
	});

	/** HANDLERS **/

	if (!popularProducts) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular products</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-product-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularProducts.map((product: Product) => {
								return (
									<SwiperSlide key={product._id} className={'popular-product-slide'}>
										<PopularProductCard
											product={product}
											likeProductHandler={function (user: any, id: string): Promise<void> | void {
												throw new Error('Function not implemented.');
											}}
										/>
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular products</span>
							
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/product'}>
									<span>See All Categories</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-product-swiper'}
							// desktopda 4 ta ko‘rsatamiz
							slidesPerView={3}
							
							centeredSlides={false}
							
							
							
							breakpoints={{
								0: { slidesPerView: 1, spaceBetween: 16 },
								600: { slidesPerView: 2, spaceBetween: 18 },
								900: { slidesPerView: 3, spaceBetween: 22 },
								1200: { slidesPerView: 4, spaceBetween: 25 },
							}}
						>
							{popularProducts.map((product: Product) => (
								<SwiperSlide key={product._id} className={'popular-product-slide'}>
									<PopularProductCard
										product={product}
										likeProductHandler={() => {
											/* popular’da ishlatmaymiz */
										}}
									/>
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'productViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularProducts;
