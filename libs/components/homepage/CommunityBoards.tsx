import React from 'react';
import Link from 'next/link';
import { Stack, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import CommunityCard from './CommunityCard';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { BoardArticle } from '../../types/board-article/board-article';
import { T } from '../../types/common';

const CommunityBoards = () => {
	const device = useDeviceDetect();
	const {
		loading: getLatestLoading,
		data: getLatestData,
		error: getLatestError,
		refetch: refetchLatest,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: 'DESC',
				search: {},
			},
		},
		notifyOnNetworkStatusChange: true,
	});

	const latestArticles: BoardArticle[] = (getLatestData as T)?.getBoardArticles?.list ?? [];

	if (device === 'mobile') {
		return (
			<Stack className="community-board p-4">
				<Typography variant="h6" sx={{ mb: 2 }}>
					COMMUNITY BOARD HIGHLIGHTS
				</Typography>
				{/* Mobil uchun ham 2x2 saqlaymiz */}
				<div className="latest-grid">
					{latestArticles.map((article, index) => (
						<CommunityCard key={article?._id} vertical={false} article={article} index={index} />
					))}
				</div>
			</Stack>
		);
	}

	return (
		<Stack className="community-board">
			<Stack className="container">
				<Stack>
					<Typography variant="h1">COMMUNITY BOARD HIGHLIGHTS</Typography>
				</Stack>

				<Stack className="community-main">
					<Stack className="community-right">
						<Stack className="content-top">
						</Stack>

						<div className="latest-grid">
							{latestArticles.map((article, index) => (
								<CommunityCard key={article?._id} vertical={false} article={article} index={index} />
							))}
						</div>

						{/* Xatolik / loading holatlari */}
						{getLatestLoading && <div className="grid-placeholder">Loading...</div>}
						{getLatestError && <div className="grid-error">Maqolalarni yuklashda xatolik yuz berdi.</div>}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default CommunityBoards;
