import React, { useState, useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface SellerCardProps {
  seller: any;
  likeMemberHandler: (user: any, id: string) => void | Promise<void>;
}

const SellerCard: React.FC<SellerCardProps> = ({ seller, likeMemberHandler }) => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);

  const imagePath: string = seller?.memberImage
    ? `${REACT_APP_API_URL}/${seller?.memberImage}`
    : '/img/profile/defaultUser.svg';

  const getLikedFromServer = (s: any) =>
    !!(s?.meLiked && s.meLiked[0]?.myFavorite);

  const [isLiked, setIsLiked] = useState<boolean>(getLikedFromServer(seller));
  const [likeCount, setLikeCount] = useState<number>(seller?.memberLikes || 0);

  // 🔄 props o‘zgarsa – local state sync
  useEffect(() => {
    setIsLiked(getLikedFromServer(seller));
    setLikeCount(seller?.memberLikes || 0);
  }, [seller?._id, seller?.meLiked, seller?.memberLikes]);

  const handleLikeClick = async () => {
    if (!user?._id) {
      alert('Avval tizimga kiring.');
      return;
    }

    const prevLiked = isLiked;
    const prevCount = likeCount;

    const nextLiked = !prevLiked;
    setIsLiked(nextLiked);
    setLikeCount((c) => (nextLiked ? c + 1 : Math.max(c - 1, 0)));

    try {
      await likeMemberHandler(user, seller?._id);
    } catch (e) {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  /* 🔹 MOBILE CARD */
  if (device === 'mobile') {
    return (
      <Stack className="m-seller-card">
        <Link
          href={{
            pathname: '/seller/detail',
            query: { sellerId: seller?._id },
          }}
        >
          <Box className="m-left">
            <div
              className="m-avatar"
              style={{
                backgroundImage: `url(${imagePath})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <span className="m-badge">
              {seller?.memberProducts} products
            </span>
          </Box>
        </Link>

        <Box className="m-right">
          <div className="m-info">
            <Link
              href={{
                pathname: '/seller/detail',
                query: { sellerId: seller?._id },
              }}
            >
              <strong>{seller?.memberFullName ?? seller?.memberNick}</strong>
            </Link>
            <span className="m-role">seller</span>
          </div>

          <div className="m-meta">
            <div className="m-meta-item">
              <RemoveRedEyeIcon className="m-icon" />
              <span>{seller?.memberViews}</span>
            </div>

            <button
              type="button"
              className="m-like-btn"
              onClick={handleLikeClick}
            >
              {isLiked ? (
                <FavoriteIcon className="m-like-icon active" />
              ) : (
                <FavoriteBorderIcon className="m-like-icon" />
              )}
              <span>{likeCount}</span>
            </button>
          </div>
        </Box>
      </Stack>
    );
  }

  /* 🔹 DESKTOP CARD */
  return (
    <Stack className="seller-general-card">
      <Link
        href={{
          pathname: '/seller/detail',
          query: { sellerId: seller?._id },
        }}
      >
        <Box
          component="div"
          className="seller-img"
          style={{
            backgroundImage: `url(${imagePath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div>{seller?.memberProducts} products</div>
        </Box>
      </Link>

      <Stack className="seller-desc">
        <Box component="div" className="seller-info">
          <Link
            href={{
              pathname: '/seller/detail',
              query: { sellerId: seller?._id },
            }}
          >
            <strong>{seller?.memberFullName ?? seller?.memberNick}</strong>
          </Link>
          <span>seller</span>
        </Box>

        <Box component="div" className="buttons">
          <IconButton>
            <RemoveRedEyeIcon />
          </IconButton>

          <Typography className="view-cnt">
            {seller?.memberViews}
          </Typography>

          <IconButton onClick={handleLikeClick}>
            {isLiked ? (
              <FavoriteIcon style={{ color: 'rgba(146, 106, 84, 1)' }} />
            ) : (
              <FavoriteBorderIcon style={{ color: '#9a9fa5' }} />
            )}
          </IconButton>

          <Typography className="view-cnt">
            {likeCount}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
};

export default SellerCard;