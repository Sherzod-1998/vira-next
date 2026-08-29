import React from 'react';
import Link from 'next/link';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { BoardArticle } from '../../types/board-article/board-article';

interface CommunityCardProps {
  vertical: boolean;
  article: BoardArticle;
  index: number;
}

/* utils */
const stripHtml = (html?: string) =>
  (html || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const truncate = (s: string, n: number) =>
  s.length > n ? s.slice(0, n - 1) + '…' : s;

const CommunityCard: React.FC<CommunityCardProps> = ({
  vertical,
  article,
}) => {
  const device = useDeviceDetect();

  /* ✅ SAFETY: article bo‘lmasa */
  if (!article) return null;

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.REACT_APP_API_URL ||
    '';

  const articleImage = article.articleImage
    ? `${apiUrl}/${article.articleImage}`
    : '/img/event.svg';

  const previewText = truncate(
    stripHtml(
      (article as any)?.articleDescription ||
        (article as any)?.articleContent ||
        article.articleTitle ||
        '',
    ),
    140,
  );

  const commentsCount = (article as any)?.articleComments ?? 0;

  const tags: string[] = [
    (article as any)?.articleFormat,
    article.articleCategory,
    ...(Array.isArray((article as any)?.tags)
      ? (article as any).tags.slice(0, 2)
      : []),
  ].filter(Boolean) as string[];

  const href = `/community/detail?articleCategory=${article.articleCategory}&id=${article._id}`;

  /* ================= MOBILE ================= */
  if (device === 'mobile') {
    return (
      <Link href={href}>
        <Box component="div" className="mobile-post-card">
          <div className="media">
            <img src={articleImage} alt={article.articleTitle} />
            <span className="date-badge">
              {dayjs(article.createdAt).format('DD MMM YYYY')}
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

            <h3 className="title">{article.articleTitle}</h3>

            {previewText && (
              <p className="excerpt">{previewText}</p>
            )}

            <div className="card-footer">
              <strong>
                {commentsCount} Comment
                {commentsCount === 1 ? '' : 's'}
              </strong>
              <span className="round-btn" aria-hidden>
                ↗
              </span>
            </div>
          </div>
        </Box>
      </Link>
    );
  }

  /* ================= DESKTOP – HORIZONTAL ================= */
  if (!vertical) {
    return (
      <Link href={href}>
        <Box component="div" className="post-card">
          <div className="media">
            <img src={articleImage} alt={article.articleTitle} />
            <span className="date-badge">
              {dayjs(article.createdAt).format('DD MMMM YYYY')}
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

            <h3 className="title">{article.articleTitle}</h3>

            {previewText && (
              <p className="excerpt">{previewText}</p>
            )}

            <div className="card-footer">
              <strong>
                {commentsCount} Comment
                {commentsCount === 1 ? '' : 's'}
              </strong>
              <span className="round-btn" aria-hidden>
                ↗
              </span>
            </div>
          </div>
        </Box>
      </Link>
    );
  }

  /* ================= DESKTOP – VERTICAL (hozircha yo‘q) ================= */
  return null;
};

export default CommunityCard;
