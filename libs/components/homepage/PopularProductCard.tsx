import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';

interface PopularProductCardProps {
	product: Product;
	// prop qolaversin, lekin bu cardda ishlatmaymiz
	likeProductHandler: (user: any, id: string) => Promise<void> | void;
}

const PopularProductCard = ({ product }: PopularProductCardProps) => {
	const router = useRouter();
	const data = product;

	const pushDetailHandler = async (productId: string) => {
		if (!productId) return;
		await router.push({ pathname: '/product/detail', query: { id: productId } });
	};

	const imageUrl = data?.productImages?.[0]
		? `${REACT_APP_API_URL}/${data.productImages[0]}`
		: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80';

	// reviews soni sifatida hozircha views’dan foydalanamiz (agar alohida field bo‘lsa shuni qo‘ying)
	const reviews = data?.productViews ?? 0;

	return (
		<Stack
			className="product-card"
			direction="column"
			onClick={() => pushDetailHandler(data._id)}
			sx={{ position: 'relative' }}
		>
			{/* Rasm */}
			<Box className="product-image" sx={{ backgroundImage: `url('${imageUrl}')` }}>
				{data.productMaterial && <Box className="product-label">{data.productMaterial}</Box>}
			</Box>

			{/* Info */}
			<Stack
				className="product-info"
				direction="column"
				onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()}
			>
				<Typography className="product-category">{data.productType}</Typography>
				<Typography className="product-name">{data.productTitle}</Typography>

				{/* O‘rtadagi “stars + reviews” BLOKNI OLIB TASHLADIK */}

				{/* Narx qatori */}
				<Stack className="price-row" direction="row" alignItems="center" justifyContent="space-between">
					<Box>
						<span className="price">${data.productPrice}</span>
					</Box>
				</Stack>

				{/* Pastdagi pill: endi bu yerda yulduz + reviews (NO-CLICK) */}
				<Stack className="meta" direction="row">
					<Stack
						className="meta-pill is-static"
						direction="row"
						alignItems="center"
						justifyContent="center"
						spacing={1}
					>
						{/* 5 ta yulduz (static) */}
						<span className="stars-inline" aria-hidden>
							<StarIcon fontSize="small" />
							<StarIcon fontSize="small" />
							<StarIcon fontSize="small" />
							<StarIcon fontSize="small" />
							<StarIcon fontSize="small" />
						</span>
						<span className="meta-text">{reviews} reviews</span>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default PopularProductCard;
