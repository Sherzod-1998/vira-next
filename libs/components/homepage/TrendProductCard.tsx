import React from 'react';
import { Stack, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
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
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);

  const pushDetailHandler = async (productId: string) => {
    if (!productId) return;
    await router.push({ pathname: './product/detail', query: { id: productId } });
  };

  return (
    <Stack className="trend-card-box" key={product._id}>
      <Box
        component="div"
        className="card-img"
        style={{ backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages?.[0]})` }}
        onClick={() => pushDetailHandler(product._id)}
      >
        {/* yuqori chap — material badge */}
        <div className="material">
          {product?.productMaterial ?? 'Gold / Diamond'}
        </div>

        {/* o‘ngda — ikon + count (hover’da chiqadi, mobile’da doimiy) */}
        <div className="img-actions" onClick={(e) => e.stopPropagation()}>
          <div className="img-action-row">
            <IconButton className="img-action" size="small">
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>
            <span className="img-count">{product?.productViews ?? 0}</span>
          </div>
          <div className="img-action-row">
            <IconButton
              className="img-action"
              size="small"
              onClick={() => likeProductHandler(user, product?._id)}
            >
              <FavoriteTwoToneIcon />
            </IconButton>
            <span className="img-count">{product?.productLikes ?? 0}</span>
          </div>
        </div>
      </Box>

      {/* pastki ma’lumot */}
      <Box component="div" className="info">
        <strong className="title" onClick={() => pushDetailHandler(product._id)}>
          {product.productTitle}
        </strong>
        <div className="price">${product.productPrice}</div>
      </Box>
    </Stack>
  );
};

export default TrendProductCard;
