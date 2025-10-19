import React from 'react';
import Link from 'next/link';
import { Box } from '@mui/material';
import Moment from 'react-moment';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { BoardArticle } from '../../types/board-article/board-article';

interface CommunityCardProps {
	vertical: boolean;
	article: BoardArticle;
	index: number;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { vertical, article, index } = props;
	const device = useDeviceDetect();

	const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || '';
	const articleImage = article?.articleImage ? `${apiUrl}/${article?.articleImage}` : '/img/event.svg';

	if (device === 'mobile') {
		// Mobil: soddalashtirilgan card
		return (
			<Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
				<Box component="div" className="horizontal-card">
					<img src={articleImage} alt="" />
					<div>
						<strong>{article?.articleTitle}</strong>
						<span>
							<Moment format="DD.MM.YY">{article?.createdAt}</Moment>
						</span>
					</div>
				</Box>
			</Link>
		);
	}

	// Desktop: biz horizontal card ishlatyapmiz (2x2 grid)
	if (!vertical) {
		return (
			<Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
				<Box component="div" className="horizontal-card">
					<img src={articleImage} alt="" />
					<div>
						<strong>{article?.articleTitle}</strong>
						<span>
							<Moment format="DD.MM.YY">{article?.createdAt}</Moment>
						</span>
					</div>
				</Box>
			</Link>
		);
	}

	// Kerak bo'lsa vertical holat ham saqlanadi
	return (
		<Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
			<Box component="div" className="vertical-card">
				<div className="community-img" style={{ backgroundImage: `url(${articleImage})` }}>
					<div>{index + 1}</div>
				</div>
				<strong>{article?.articleTitle}</strong>
				<span>Free Board</span>
			</Box>
		</Link>
	);
};

export default CommunityCard;
