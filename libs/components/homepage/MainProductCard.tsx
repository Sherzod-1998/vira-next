import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';

export interface MainProductCardProps {
  product: Product;
  onLike: (id: string) => Promise<void> | void;
}

const MainProductCard: React.FC<MainProductCardProps> = ({ product, onLike }) => {
  const router = useRouter();
  const data = product;

  // Local UI state (optimistic)
  const [liked, setLiked] = useState<boolean>(Boolean((data as any)?.isLiked));
  const [likeCount, setLikeCount] = useState<number>(data?.productLikes ?? 0);

  const pushDetailHandler = async (productId: string) => {
    if (!productId) return;
    await router.push({ pathname: '/product/detail', query: { id: productId } });
  };

  const imageUrl = data?.productImages?.[0]
    ? `${REACT_APP_API_URL}/${data.productImages[0]}`
    : 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80';

  const onLikeClick = async (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    // optimistic toggle
    setLiked((prev) => !prev);
    setLikeCount((c) => (liked ? Math.max(0, c - 1) : c + 1));
    await onLike(data?._id);
  };

  return (
    <Stack
      className="product-card"
      direction="column"
      onClick={() => pushDetailHandler(data._id)}
      sx={{ position: 'relative' }}
    >
      {/* Rasm */}
      <Box className="product-image" sx={{ backgroundImage: `url('${imageUrl}')` }}>
        <Box className="product-label">{data.productMaterial}</Box>
      </Box>

      {/* Info */}
      <Stack
        className="product-info"
        direction="column"
        onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()}
      >
        <Typography className="product-category">{data.productType}</Typography>
        <Typography className="product-name">{data.productTitle}</Typography>

        {/* xuddi sizdagi rating bloki */}
        <Stack className="rating" direction="row" alignItems="center" spacing={1}>
          <Stack className="stars" direction="row" spacing={0.5}>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
          </Stack>
          <Typography className="review-count">{data.productViews ?? 0} reviews</Typography>
        </Stack>

        {/* Narx qatori */}
        <Stack className="price-row" direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <span className="price">${data.productPrice}</span>
          </Box>
        </Stack>

        {/* Like pill — xuddi o‘sha classlar bilan */}
        <Stack className="meta" direction="row">
          <Stack
            className={`meta-pill is-like ${liked ? 'is-active' : ''}`}
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onLikeClick();
            }}
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
