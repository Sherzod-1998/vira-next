import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductStatus } from '../../enums/product.enum';

export interface MainProductCardProps {
	product: Product;
	onLike: (id: string) => Promise<void> | void;
}

const MainProductCard: React.FC<MainProductCardProps> = ({ product, onLike }) => {
	const router = useRouter();
	const device = useDeviceDetect();
	const isMobile = device === 'mobile';

	const data = product;


	const initialLiked = Array.isArray(data?.meLiked) && data.meLiked.length > 0;

	const [liked, setLiked] = useState<boolean>(initialLiked);
	const [likeCount, setLikeCount] = useState<number>(data?.productLikes ?? 0);

	const pushDetailHandler = async (productId: string) => {
		if (!productId) return;
		await router.push({ pathname: '/product/detail', query: { id: productId } });
	};

	const imageUrl = data?.productImages?.[0]
		? `${REACT_APP_API_URL}/${data.productImages[0]}`
		: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80';
	const isSold = data?.productStatus === ProductStatus.SOLD;

	const onLikeClick = async (e?: React.SyntheticEvent) => {
		e?.stopPropagation();

		// optimistic update: like/unlike + counter sync
		setLiked((prevLiked) => {
			setLikeCount((prevCount) => {
				return prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1;
			});
			return !prevLiked;
		});

		await onLike(data?._id);
	};

	return (
		<Stack
			className={`product-card ${isMobile ? 'mobile' : ''}`}
			direction="column"
			onClick={() => pushDetailHandler(data._id)}
			sx={{ position: 'relative' }}
		>
			{/* Image */}
			<Box className="product-image" sx={{ backgroundImage: `url('${imageUrl}')` }}>
				<Box className="product-label">{data.productMaterial}</Box>
				{isSold && <Box className="sold-badge">SOLD</Box>}
			</Box>

			{/* Info */}
			<Stack
				className="product-info"
				direction="column"
				onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()}
			>
				<Typography className="product-category">{data.productType}</Typography>
				<Typography className="product-name">{data.productTitle}</Typography>

				{/* Rating */}
				<Stack className="rating" direction="row" alignItems="center" spacing={1}>
					<Stack className="stars" direction="row" spacing={0.5}>
						{[1, 2, 3, 4, 5].map((n) => (
							<span key={n} className={`star${Math.round(data.productRank ?? 0) >= n ? '' : ' star--empty'}`}>
								★
							</span>
						))}
					</Stack>
					<Typography className="review-count">{data.productViews ?? 0} views</Typography>
				</Stack>

				{/* Price row */}
				<Stack className="price-row" direction="row" alignItems="center" justifyContent="space-between">
					<Box>
						<span className="price">${data.productPrice}</span>
					</Box>
				</Stack>

				{/* Like pill */}
				<Stack className="meta" direction="row">
					<Stack
						className={`meta-pill is-like ${liked ? 'is-active' : ''}`}
						direction="row"
						alignItems="center"
						justifyContent="center"
						spacing={1}
						role="button"
						onClick={onLikeClick}
					>
						<FavoriteTwoToneIcon className="meta-icon" fontSize="small" />
						<span className="meta-text">Like</span>
						<span className="meta-count">{likeCount}</span>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default MainProductCard;
