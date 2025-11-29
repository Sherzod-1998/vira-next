'use client';

import React from 'react';
import { Box, Tabs, Tab, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';

import { GET_PRODUCTS } from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { Direction } from '../../enums/common.enum';
import { ProductsInquiry } from '../../types/product/product.input';
import { Product } from '../../types/product/product';
import MainProductCard from './MainProductCard';
import useDeviceDetect from '../../hooks/useDeviceDetect';

type TabKey = 'popular' | 'trending' | 'top';
const TAB_INDEX: Record<TabKey, number> = { popular: 0, trending: 1, top: 2 };
const INDEX_TAB: Record<number, TabKey> = { 0: 'popular', 1: 'trending', 2: 'top' };

function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`products-tabpanel-${index}`}
			aria-labelledby={`products-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
		</div>
	);
}

const a11y = (i: number) => ({ id: `products-tab-${i}`, 'aria-controls': `products-tabpanel-${i}` });

const inputs: Record<TabKey, ProductsInquiry> = {
	popular: {
		page: 1,
		limit: 12,
		sort: 'productViews',
		direction: Direction.DESC,
		search: {
			materialList: undefined,
		},
	},
	trending: {
		page: 1,
		limit: 12,
		sort: 'productLikes',
		direction: Direction.DESC,
		search: {
			materialList: undefined,
		},
	},
	top: {
		page: 1,
		limit: 12,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			materialList: undefined,
		},
	},
};

const ProductsTabsSection: React.FC = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const isMobile = device === 'mobile';

	const initialKey = (router.query.tab as TabKey) || 'popular';
	const [value, setValue] = React.useState<number>(TAB_INDEX[initialKey] ?? 0);

	const key = INDEX_TAB[value];
	const variables = React.useMemo(() => ({ input: inputs[key] }), [key]);

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

	const handleChange = (_e: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
		router.replace({ pathname: router.pathname, query: { ...router.query, tab: INDEX_TAB[newValue] } }, undefined, {
			shallow: true,
		});
	};

	// 🔹 Swiper config – mobile va desktop uchun alohida
	const mobileSwiperProps = {
		modules: [Autoplay, Pagination],
		pagination: { el: '.swiper-tabs-pagination', clickable: true },
		spaceBetween: 12,
		slidesPerView: 1.2 as const,
		centeredSlides: true,
	};

	const desktopSwiperProps = {
		modules: [Autoplay, Navigation, Pagination],
		navigation: { prevEl: '.swiper-tabs-prev', nextEl: '.swiper-tabs-next' },
		pagination: { el: '.swiper-tabs-pagination', clickable: true },
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
		<Stack className={`products-tabs-section ${isMobile ? 'mobile' : ''}`} direction="column" justifyContent="center">
			<Box className="products-tabs car-like">
				<Box className="products-tabs__header">
					<h2 className="products-tabs__title">Featured Product Listings</h2>

					<div className="products-tabs__nav">
						<div className="dots">
							<span className="dot" />
							<span className="dot" />
							<span className="dot" />
						</div>
					</div>
				</Box>

				<Tabs value={value} onChange={handleChange} aria-label="Product tabs" className="products-tabs__tabs">
					<Tab label="Popular Products" {...a11y(0)} />
					<Tab label="Trending Products" {...a11y(1)} />
					<Tab label="Top Products" {...a11y(2)} />
				</Tabs>

				<TabPanel value={value} index={TAB_INDEX['popular']}>
					<Stack className="products-tabs__panel">
						<Swiper key="popular" {...swiperProps}>
							{items.map((p) => (
								<SwiperSlide key={p._id}>
									<MainProductCard product={p} onLike={onLike} />
								</SwiperSlide>
							))}
						</Swiper>
						<div className="swiper-tabs-pagination" />
					</Stack>
				</TabPanel>

				<TabPanel value={value} index={TAB_INDEX['trending']}>
					<Stack className="products-tabs__panel">
						<Swiper key="trending" {...swiperProps}>
							{items.map((p) => (
								<SwiperSlide key={p._id}>
									<MainProductCard product={p} onLike={onLike} />
								</SwiperSlide>
							))}
						</Swiper>
						<div className="swiper-tabs-pagination" />
					</Stack>
				</TabPanel>

				<TabPanel value={value} index={TAB_INDEX['top']}>
					<Stack className="products-tabs__panel">
						<Swiper key="top" {...swiperProps}>
							{items.map((p) => (
								<SwiperSlide key={p._id}>
									<MainProductCard product={p} onLike={onLike} />
								</SwiperSlide>
							))}
						</Swiper>
						<div className="swiper-tabs-pagination" />
					</Stack>
				</TabPanel>
			</Box>
		</Stack>
	);
};

export default ProductsTabsSection;
