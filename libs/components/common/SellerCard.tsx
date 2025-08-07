import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface sellerCardProps {
	seller: any;
	likeMemberHandler: any;
}

const sellerCard = (props: sellerCardProps) => {
	const { seller, likeMemberHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = seller?.memberImage
		? `${REACT_APP_API_URL}/${seller?.memberImage}`
		: '/img/profile/defaultUser.svg';

	if (device === 'mobile') {
		return <div>SELLER CARD</div>;
	} else {
		return (
			<Stack className="seller-general-card">
				<Link
					href={{
						pathname: '/seller/detail',
						query: { sellerId: seller?._id },
					}}
				>
					<Box
						component={'div'}
						className={'seller-img'}
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

				<Stack className={'seller-desc'}>
					<Box component={'div'} className={'seller-info'}>
						<Link
							href={{
								pathname: '/seller/detail',
								query: { sellerId: 'id' },
							}}
						>
							<strong>{seller?.memberFullName ?? seller?.memberNick}</strong>
						</Link>
						<span>seller</span>
					</Box>
					<Box component={'div'} className={'buttons'}>
						<IconButton color={'default'}>
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{seller?.memberViews}</Typography>
						<IconButton color={'default'} onClick={() => likeMemberHandler(user, seller?._id)}>
							{seller?.meLiked && seller?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon color={'primary'} />
							) : (
								<FavoriteBorderIcon />
							)}
						</IconButton>
						<Typography className="view-cnt">{seller?.memberLikes}</Typography>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default sellerCard;
