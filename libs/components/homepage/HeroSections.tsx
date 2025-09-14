'use client';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COMMENTS_SUMMARY } from '../../../apollo/user/query';

// 1) API bazaviy URL (.env ichidan)
const apiBase = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

// 2) URL helper – to‘liq yoki nisbiy yo‘lni tekshiradi
function resolveUrl(path?: string | null) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path; // allaqachon to‘liq URL
  const rel = String(path).replace(/^\/+/, '');
  return apiBase ? `${apiBase}/${rel}` : `/${rel}`;
}

const HeroSections = () => {
  const { data, loading, error } = useQuery(GET_COMMENTS_SUMMARY, {
    fetchPolicy: 'cache-and-network',
  });

  const darkCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = darkCardRef.current;
    if (!root) return;

    const slides = Array.from(root.querySelectorAll<HTMLDivElement>('.card-bg'));
    if (slides.length < 2) return;

    let i = 0;
    const tick = () => {
      const curr = slides[i];
      const next = slides[(i + 1) % slides.length];
      curr.classList.remove('is-visible');
      next.classList.add('is-visible');
      i = (i + 1) % slides.length;
    };

    const timer = setInterval(tick, 4000);
    return () => clearInterval(timer);
  }, []);

  // Backenddan kelayotgan ma’lumotlar
  const summary = data?.commentsSummary;
  const total = summary?.total ?? 0;
  const recentCommenters = summary?.recentCommenters ?? [];

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error loading comments</div>;

  return (
    <section className="hero" aria-label="Hero – Rishi Jewelry Collections">
      <Container maxWidth={false} className="hero__container">
        <Grid container spacing={4} alignItems="flex-start">
          {/* Title */}
          <Grid item xs={12} md={7}>
            <h1 className="hero__title">
              VIRA COUPLE <span className="hero__gradA">RINGS</span> &{' '}
              <span className="hero__gradB">DIAMONDS</span> ARE THE
              <br /> NEW COLLECTIONS
            </h1>
          </Grid>

          {/* Right copy + CTA */}
          <Grid item xs={12} md={5}>
            <Typography className="hero__copy">
              Explore our latest couple rings & diamond collections,
              <br /> designed to shine on every occasion.
            </Typography>
            <Button variant="outlined" className="hero__cta">
              MORE DETAILS
            </Button>
          </Grid>
        </Grid>

        {/* Bottom row */}
        <Grid container spacing={4} className="hero__cards">
          {/* Comments card */}
          <Grid item xs={12} md={4}>
            <div className="card card--light">
              <div className="card__avatars">
                {recentCommenters.map((user: any) => {
                  const src = resolveUrl(user?.avatarUrl);
                  return (
                    <img
                      key={user.id}
                      src={src || '/img/profile/defaultUser.svg'}
                      alt="user avatar"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          '/img/profile/defaultUser.svg';
                      }}
                    />
                  );
                })}
                <span className="pill">+{total}</span>
              </div>

              <div className="card__headline">
                <span className="star">⭐</span>
                <span className="card__headline-text">
                  {total.toLocaleString()} COMMENTS
                </span>
              </div>

              <h3 className="card__title">What People Say About Our Jewelry</h3>

              <p className="card__text">
                Read the voices of our community. Thousands of comments sharing
                their experience and love for our collections.
              </p>
            </div>
          </Grid>

          {/* Dark banner (auto-rotate bg) */}
          <Grid item xs={12} md={5}>
								<Box className="card card--dark" ref={darkCardRef}>
									{/* background layers */}
									{['/img/collections/1.jpg', '/img/collections/2.jpg'].map((src, i) => (
										<div
											key={src}
											className={`card-bg ${i === 0 ? 'is-visible' : ''}`}
											data-index={i}
											style={{ backgroundImage: `url('${src}')` }}
											aria-hidden="true"
										/>
									))}
									{/* gradient overlay */}
									<div className="card-overlay" />
		  
									<p className="card__kicker">SPECIAL EDITIONS</p>
									<h3 className="card__dark-title">
										NECKLACES &<br /> RINGS
									</h3>
									<p className="card__dark-text">
										Embrace the unseen magic of uniqueness. Where elegance finds extraordinary.
									</p>
									<Button variant="contained" className="card__dark-btn">
										MORE DETAILS
									</Button>
								</Box>
							</Grid>

          {/* Pale product */}
          <Grid item xs={12} md={3}>
            <Box className="card card--pale">
              <div className="pale__meta">
                <h4>GOLD BANGLES</h4>
                <button className="tiny-badge" aria-label="See more">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
};

export default HeroSections;
