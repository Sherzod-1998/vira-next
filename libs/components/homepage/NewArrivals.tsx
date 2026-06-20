'use client';

import React from 'react';
import { Stack } from '@mui/material';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';

import { GET_PRODUCTS } from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { Direction } from '../../enums/common.enum';
import { Product } from '../../types/product/product';
import MainProductCard from './MainProductCard';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const newArrivalsInput = {
	page: 1,
	limit: 10,
	sort: 'createdAt',
	direction: Direction.DESC,
	search: {
		materialList: undefined,
	},
};

const NewArrivals: React.FC = () => {
	const device = useDeviceDetect();
	const isMobile = device === 'mobile';

	const variables = React.useMemo(() => ({ input: newArrivalsInput }), []);

	const { data, refetch } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables,
		notifyOnNetworkStatusChange: true,
	});

	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const onLike = async (id: string) => {
		try {
			await likeTargetProduct({ variables: { input: id } });
			await refetch(variables);
		} catch (e) {
			console.log('like error:', (e as any)?.message);
		}
	};

	const items: Product[] = data?.getProducts?.list ?? [];

	// Swiper config — mobile and desktop variants (mirrors ProductsTabsSection)
	const mobileSwiperProps = {
		modules: [Autoplay, Pagination],
		pagination: { el: '.swiper-new-pagination', clickable: true },
		spaceBetween: 12,
		slidesPerView: 1.2 as const,
		centeredSlides: true,
	};

	const desktopSwiperProps = {
		modules: [Autoplay, Navigation, Pagination],
		navigation: { prevEl: '.swiper-new-prev', nextEl: '.swiper-new-next' },
		pagination: { el: '.swiper-new-pagination', clickable: true },
		spaceBetween: 20,
		slidesPerView: 4 as const,
		breakpoints: {
			0: { slidesPerView: 1, spaceBetween: 12 },
			600: { slidesPerView: 2, spaceBetween: 14 },
			900: { slidesPerView: 3, spaceBetween: 18 },
			1200: { slidesPerView: 4, spaceBetween: 20 },
		},
	};

	const swiperProps = isMobile ? mobileSwiperProps : desktopSwiperProps;

	return (
		<Stack className={`new-arrivals ${isMobile ? 'mobile' : ''}`} direction="column" justifyContent="center">
			<div className="new-arrivals__inner">
				{/* Section header */}
				<div className="new-arrivals__header">
					<div className="new-arrivals__header-left">
						<p className="new-arrivals__eyebrow">FRESH FROM OUR SELLERS</p>
						<h2 className="new-arrivals__title">New Arrivals</h2>
					</div>

					<div className="new-arrivals__header-right">
						{!isMobile && (
							<div className="new-arrivals__nav-btns">
								<button className="swiper-new-prev new-arrivals__nav-btn" aria-label="Previous">
									&#8592;
								</button>
								<button className="swiper-new-next new-arrivals__nav-btn" aria-label="Next">
									&#8594;
								</button>
							</div>
						)}
						<Link href="/product?tab=top" className="new-arrivals__view-all">
							View all <span className="new-arrivals__view-all-arrow">&#8594;</span>
						</Link>
					</div>
				</div>

				{/* Carousel */}
				<div className="new-arrivals__carousel">
					<Swiper {...swiperProps}>
						{items.map((p) => (
							<SwiperSlide key={p._id}>
								<MainProductCard product={p} onLike={onLike} />
							</SwiperSlide>
						))}
					</Swiper>
					<div className="swiper-new-pagination" />
				</div>
			</div>
		</Stack>
	);
};

export default NewArrivals;
