import { Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { ProductType } from '../../enums/product.enum';
import { GET_CATEGORY_COUNTS } from '../../../apollo/user/query';
import GorgeousCollectionCard from './GorgeousCollectionCard';

// ——— UI kolleksiyalar (enum bilan)
type CollectionItem = { src: string; type: ProductType; i18nKey: string };

const COLLECTIONS: CollectionItem[] = [
  { src: '/img/collections/chains.jpg',     type: ProductType.CHAIN,    i18nKey: 'chains' },
  { src: '/img/collections/rings.jpg',      type: ProductType.RING,     i18nKey: 'rings' },
  { src: '/img/collections/ear-hooks.jpg',  type: ProductType.EARRING,  i18nKey: 'ear-hooks' },
  { src: '/img/collections/bracelets.jpg',  type: ProductType.BRACELET, i18nKey: 'bracelets' },
  { src: '/img/collections/bangles.jpg',    type: ProductType.OTHER,    i18nKey: 'bangles' },
  { src: '/img/collections/necklaces.jpg',  type: ProductType.NECKLACE, i18nKey: 'necklaces' },
  { src: '/img/collections/set.jpg',        type: ProductType.SET,      i18nKey: 'set' },
  { src: '/img/collections/watch.jpg',      type: ProductType.WATCH,    i18nKey: 'watch' },
  { src: '/img/collections/brooch.jpg',     type: ProductType.BROOCH,   i18nKey: 'brooch' },
];

const WINDOW = 5;
const STEP = 4;

const GorgeousCollection = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [page, setPage] = useState(0);

  // ——— Counts: enum -> count dictionary
  const [counts, setCounts] = useState<Record<ProductType, number>>({} as any);

  /** APOLLO REQUESTS **/
  const {
    loading: getCountsLoading,
    data: getCountsData,
    error: getCountsError,
    refetch: refetchCounts,
  } = useQuery(GET_CATEGORY_COUNTS, {
    fetchPolicy: 'cache-and-network',
    variables: { input: null }, // xohlasangiz typelarni cheklash mumkin
    notifyOnNetworkStatusChange: true,
    onCompleted: (res: any) => {
      const map = {} as Record<ProductType, number>;
      res?.categoryCounts?.forEach((row: { type: ProductType; count: number }) => {
        map[row.type] = row.count ?? 0;
      });
      setCounts(map);
    },
  });

  // ——— Pager
  const maxStart = Math.max(0, COLLECTIONS.length - WINDOW);
  const totalPages = 1 + Math.ceil(maxStart / STEP);
  const start = Math.min(page * STEP, maxStart);
  const pageItems = useMemo(() => COLLECTIONS.slice(start, start + WINDOW), [start]);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  // ——— Navigatsiya (enum bilan)
  const navigateToCategory = (type: ProductType) => {
    const input = {
      page: 1,
      limit: 9,
      sort: 'createdAt',
      direction: 'DESC',
      search: { typeList: [type] },
    };

    // siz xohlagan URL ko‘rinishi uchun (faqat qo‘shtirnoqlar kodlanadi):
    const encodeQuotesOnly = (obj: unknown) => JSON.stringify(obj).replace(/"/g, '%22');
    router.push(`/product?input=${encodeQuotesOnly(input)}`);
  };

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
              <div className={`circle-container${getCountsLoading ? ' is-animating' : ''}`}>
                {pageItems.map((item) => {
                  const label = t(item.i18nKey);
                  const count = counts[item.type] ?? 0;

                  return (
                    <GorgeousCollectionCard
                      key={item.src}
                      src={item.src}
                      label={label}
                      count={count}
                      onClick={() => navigateToCategory(item.type)}
                    />
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

        {getCountsError && (
          <Typography color="error" sx={{ mt: 1, px: 2 }}>
            Counts yuklashda xatolik: {getCountsError.message}
          </Typography>
        )}
      </div>
    </Stack>
  );
};

export default GorgeousCollection;
