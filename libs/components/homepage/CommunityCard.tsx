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

const stripHtml = (html?: string) =>
	(html || '')
		.replace(/<[^>]*>/g, '')
		.replace(/\s+/g, ' ')
		.trim();

const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

const CommunityCard = ({ vertical, article, index }: CommunityCardProps): React.ReactElement | null => {
	const device = useDeviceDetect();

	const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || '';
	const articleImage = article?.articleImage ? `${apiUrl}/${article?.articleImage}` : '/img/event.svg';

	const previewText = truncate(
		stripHtml((article as any)?.articleDescription || (article as any)?.articleContent || '') ||
			article?.articleTitle ||
			'',
		140,
	);

	const commentsCount = (article as any)?.articleComments ?? 0;
	const tags: string[] = [
		(article as any)?.articleFormat,
		article?.articleCategory,
		...(Array.isArray((article as any)?.tags) ? (article as any).tags.slice(0, 2) : []),
	].filter(Boolean) as string[];

	/* 🔹 MOBILE CARD */
	if (device === 'mobile') {
		return (
			<Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
				<Box component="div" className="mobile-post-card">
					<div className="media">
						<img src={articleImage} alt="" />
						<span className="date-badge">
							<Moment format="DD MMM YYYY">{article?.createdAt}</Moment>
						</span>
					</div>

					<div className="card-body">
						{!!tags.length && (
							<div className="meta-chips">
								{tags.map((t, i) => (
									<span className="chip" key={`${t}-${i}`}>
										{t}
									</span>
								))}
							</div>
						)}

						<h3 className="title">{article?.articleTitle}</h3>

						{previewText && <p className="excerpt">{previewText}</p>}

						<div className="card-footer">
							<strong>
								{commentsCount} Comment{commentsCount <= 1 ? '' : 's'}
							</strong>
							<span className="round-btn" aria-hidden>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
									<path
										d="M5 19L19 5M19 5v14M19 5H5"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
						</div>
					</div>
				</Box>
			</Link>
		);
	}

	/* 🔹 DESKTOP: horizontal card */
	if (!vertical) {
		return (
			<Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
				<Box component="div" className="post-card">
					<div className="media">
						<img src={articleImage} alt="" />
						<span className="date-badge">
							<Moment format="DD MMMM YYYY">{article?.createdAt}</Moment>
						</span>
					</div>

					<div className="card-body">
						{!!tags.length && (
							<div className="meta-chips">
								{tags.map((t, i) => (
									<span className="chip" key={`${t}-${i}`}>
										{t}
									</span>
								))}
							</div>
						)}
						<h3 className="title">{article?.articleTitle}</h3>
						{previewText && <p className="excerpt">{previewText}</p>}
						<div className="card-footer">
							<strong>
								{commentsCount} Comment{commentsCount <= 1 ? '' : 's'}
							</strong>
							<span className="round-btn" aria-hidden>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
									<path
										d="M5 19L19 5M19 5v14M19 5H5"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
						</div>
					</div>
				</Box>
			</Link>
		);
	}

	// Ensure the component always returns a valid React node (avoid `undefined`)
	return null;

};

export default CommunityCard;
