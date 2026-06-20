import React, { useState, useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import Link from 'next/link';
import { getMemberImage } from '../../config';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { sweetMixinErrorAlert } from '../../sweetAlert';

interface SellerCardProps {
  seller: any;
  likeMemberHandler: (user: any, id: string) => void | Promise<void>;
}

const SellerCard: React.FC<SellerCardProps> = ({ seller, likeMemberHandler }) => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);

  const imagePath: string = getMemberImage(seller?.memberImage);

  const getLikedFromServer = (s: any) =>
    !!(s?.meLiked && s.meLiked[0]?.myFavorite);

  const [isLiked, setIsLiked] = useState<boolean>(getLikedFromServer(seller));
  const [likeCount, setLikeCount] = useState<number>(seller?.memberLikes || 0);
  const isVerified = (seller?.memberRank || 0) > 0;

  // Keep local like state synced when seller props change.
  useEffect(() => {
    setIsLiked(getLikedFromServer(seller));
    setLikeCount(seller?.memberLikes || 0);
  }, [seller?._id, seller?.meLiked, seller?.memberLikes]);

  const handleLikeClick = async () => {
    if (!user?._id) {
      sweetMixinErrorAlert('Please log in first').then();
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

  /* MOBILE CARD */
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
              <strong>
                {seller?.memberFullName ?? seller?.memberNick}
                {isVerified && (
                  <span className="m-verified-badge">
                    <VerifiedOutlinedIcon />
                    Verified Seller
                  </span>
                )}
              </strong>
            </Link>
            <span className="m-role">seller</span>
          </div>

          <div className="m-meta">
            <div className="m-meta-item">
              <RemoveRedEyeIcon className="m-icon" />
              <span>{seller?.memberViews}</span>
            </div>
            <div className="m-meta-item">
              <PeopleAltOutlinedIcon className="m-icon" />
              <span>{seller?.memberFollowers ?? 0}</span>
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

  /* DESKTOP CARD */
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
          {isVerified && (
            <span className="verified-badge">
              <VerifiedOutlinedIcon />
              Verified Seller
            </span>
          )}
          <span>seller</span>
        </Box>

        <Box component="div" className="buttons">
          <IconButton>
            <RemoveRedEyeIcon />
          </IconButton>

          <Typography className="view-cnt">
            {seller?.memberViews}
          </Typography>

          <IconButton>
            <PeopleAltOutlinedIcon />
          </IconButton>

          <Typography className="view-cnt">
            {seller?.memberFollowers ?? 0}
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
