import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';

interface TopsellerProps {
	seller: Member;
}
const TopsellerCard = (props: TopsellerProps) => {
	const { seller } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const sellerImage = seller?.memberImage
		? `${process.env.REACT_APP_API_URL}/${seller?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-seller-card">
				<img src={sellerImage} alt="" />

				<strong>{seller?.memberNick}</strong>
				<span>{seller?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-seller-card">
				<img src={sellerImage} alt="" />

				<strong>{seller?.memberNick}</strong>
				<span>{seller?.memberType}</span>
			</Stack>
		);
	}
};

export default TopsellerCard;
