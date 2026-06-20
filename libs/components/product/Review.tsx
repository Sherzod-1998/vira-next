import React from 'react';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Comment } from '../../types/comment/comment';
import { getMemberImage, REACT_APP_API_URL } from '../../config';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface ReviewProps {
	comment: Comment;
}

const Review = ({ comment }: ReviewProps) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const imagePath: string = getMemberImage(comment?.memberData?.memberImage);

	/** HANDLERS **/
	const goMemberPage = (id: string) => {
		if (!id) return;
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	/** 🔹 MOBILE LAYOUT */
	if (device === 'mobile') {
		return (
			<Stack className="m-review">
				<Stack direction="row" spacing={1.5} alignItems="center" className="m-review-header">
					<div className="m-review-avatar">
						<img src={imagePath} alt="" />
					</div>

					<Stack spacing={0.2}>
						<Typography
							className="m-review-name"
							onClick={() => goMemberPage(comment?.memberData?._id as string)}
						>
							{comment.memberData?.memberNick || 'Anonymous'}
						</Typography>
						<Typography className="m-review-date">
							<Moment format="YYYY.MM.DD HH:mm">{comment.createdAt}</Moment>
						</Typography>
					</Stack>
				</Stack>

				<Typography className="m-review-text">
					{comment.commentContent}
				</Typography>
			</Stack>
		);
	}

	return (
		<Stack className={'review-config'}>
			<Stack className={'review-mb-info'}>
				<Stack className={'img-name-box'}>
					<img src={imagePath} alt="" className={'img-box'} />
					<Stack>
						<Typography className={'name'} onClick={() => goMemberPage(comment?.memberData?._id as string)}>
							{comment.memberData?.memberNick}
						</Typography>
						<Typography className={'date'}>
							<Moment format={'DD MMMM, YYYY'}>{comment.createdAt}</Moment>
						</Typography>
					</Stack>
				</Stack>
			</Stack>
			<Stack className={'desc-box'}>
				<Typography className={'description'}>{comment.commentContent}</Typography>
			</Stack>
		</Stack>
	);
};

export default Review;