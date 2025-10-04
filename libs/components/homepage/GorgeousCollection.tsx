import { Box, Stack } from '@mui/material';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const images = [
  '/img/collections/chains.jpg',
  '/img/collections/rings.jpg',
  '/img/collections/ear-hooks.jpg',
  '/img/collections/bracelets.jpg',
  '/img/collections/bangles.jpg',
  '/img/collections/necklaces.jpg',
  '/img/collections/set.jpg',
  '/img/collections/watch.jpg',
  '/img/collections/brooch.jpg',
];

const WINDOW = 5;
const STEP = 4; 

const GorgeousCollection = () => {
  const { t } = useTranslation('common');
  const [page, setPage] = useState(0);

  const maxStart = Math.max(0, images.length - WINDOW);
  const totalPages = 1 + Math.ceil(maxStart / STEP);

  const start = Math.min(page * STEP, maxStart);

  const pageItems = useMemo(() => images.slice(start, start + WINDOW), [start]);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <Stack
      className="gorgeous_collection_stack"
      justifyContent="center"
      alignItems="center"
      sx={{ width: '100%', height: '100%' }}
    >
      <div className="gorgeous_collections">
        <Stack alignItems="left" className="gorgeous_collection_inner">
          <Box component="div" className="left">
            <span>gorgeous collections</span>
          </Box>

          <div className="bottom_content">
            <button className="nav-btn prev" onClick={prev} disabled={page === 0} aria-label="Previous">
              ‹
            </button>

            <Stack
              className="bottom_content_stack"
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ width: '100%', height: '100%' }}
            >
              <div className="circle-container">
                {pageItems.map((src) => {
                  const key = src.split('/').pop()?.split('.')[0] ?? '';
                  return (
                    <div key={src} className="circle-img-wrapper">
                      <div className="circle-figure">
                        <img src={src} alt={t(key)} className="circle-img" />
                      </div>
                      <div className="circle-img-label">{t(key)}</div>
                    </div>
                  );
                })}
              </div>
            </Stack>

            <button className="nav-btn next" onClick={next} disabled={page >= totalPages - 1} aria-label="Next">
              ›
            </button>

            <div className="pager-dots">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === page ? 'is-active' : ''}`}
                  onClick={() => setPage(i)}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </Stack>
      </div>
    </Stack>
  );
};

export default GorgeousCollection;
