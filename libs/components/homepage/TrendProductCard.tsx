import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TrendProductCardProps {
  product: Product;
  likeProductHandler: (user: any, id: string) => Promise<void> | void;
}

const TrendProductCard = ({ product, likeProductHandler }: TrendProductCardProps) => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
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

  const onLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // card navigate bo‘lmasin
    // optimistic toggle
    setLiked((prev) => !prev);
    setLikeCount((c) => (liked ? Math.max(0, c - 1) : c + 1));
    try {
      await likeProductHandler(user, data?._id);
    } catch {
      // revert on error
      setLiked((prev) => !prev);
      setLikeCount((c) => (liked ? c + 1 : Math.max(0, c - 1)));
    }
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
        <Box className="product-label">Trending</Box>
      </Box>

      {/* Info */}
      <Stack className="product-info" direction="column" onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}>
        <Typography className="product-category">{data.productAddress}</Typography>
        <Typography className="product-name">{data.productTitle}</Typography>

        <Stack className="rating" direction="row" alignItems="center" spacing={1}>
          <Stack className="stars" direction="row" spacing={0.5}>
            <span className="star">★</span><span className="star">★</span>
            <span className="star">★</span><span className="star">★</span>
            <span className="star">★</span>
          </Stack>
          <Typography className="review-count">{data.productViews ?? 0} reviews</Typography>
        </Stack>

        {/* Narx qatori */}
        <Stack className="price-row" direction="row" alignItems="center" justifyContent="space-between">
          <Box><span className="price">${data.productPrice}</span></Box>

          <button
            className="add-to-cart"
            aria-label="Add to cart"
            onClick={(e) => {
              e.stopPropagation(); // card navigate bo‘lmasin
              likeProductHandler(user, data?._id);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </Stack>

        {/* ↓ Pastdagi like & views — eng pastda */}
        <Stack className="meta" direction="row" spacing={1.5}>
          <Stack className="meta-pill" direction="row" alignItems="center" spacing={0.5} onClick={(e)=>e.stopPropagation()}>
            <RemoveRedEyeIcon className="meta-icon" fontSize="small" />
            <span className="meta-count">{data?.productViews ?? 0}</span>
          </Stack>

          <Stack
            className={`meta-pill is-like ${liked ? 'is-active' : ''}`}
            direction="row"
            alignItems="center"
            spacing={0.5}
            role="button"
            onClick={onLikeClick}
          >
            <FavoriteTwoToneIcon className="meta-icon" fontSize="small" />
            <span className="meta-count">{likeCount}</span>
          </Stack>
        </Stack>
      </Stack>

      <Box className="product-quick-view">Quick view</Box>
    </Stack>
  );
};

export default TrendProductCard;
