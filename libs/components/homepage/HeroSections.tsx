'use client';
import { useRouter } from 'next/router';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COMMENTS_SUMMARY } from '../../../apollo/user/query';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const apiBase = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

function resolveUrl(path?: string | null) {
	if (!path) return '';
	if (/^https?:\/\//i.test(path)) return path;
	const rel = String(path).replace(/^\/+/, '');
	return apiBase ? `${apiBase}/${rel}` : `/${rel}`;
}
function encodeQuotesOnly(obj: any) {
	return JSON.stringify(obj).replace(/"/g, '%22');
}

const HeroSections = () => {
	const router = useRouter();
	const darkCardRef = useRef<HTMLDivElement | null>(null);
	const device = useDeviceDetect();

	// Dark card background image rotation (desktop + mobile uchun ham ishlayveradi)
	useEffect(() => {
		const root = darkCardRef.current;
		if (!root) return;

		const slides = Array.from(root.querySelectorAll<HTMLDivElement>('.card-bg'));
		if (slides.length === 0) return;

		const raf = requestAnimationFrame(() => {
			slides.forEach((s, idx) => s.classList.toggle('is-visible', idx === 0));
		});

		if (slides.length > 1) {
			let i = 0;
			const tick = () => {
				const curr = slides[i];
				const next = slides[(i + 1) % slides.length];
				curr?.classList.remove('is-visible');
				next?.classList.add('is-visible');
				i = (i + 1) % slides.length;
			};
			const timer = window.setInterval(tick, 4000);
			return () => {
				cancelAnimationFrame(raf);
				window.clearInterval(timer);
			};
		}

		return () => cancelAnimationFrame(raf);
	}, []);

	// MORE DETAILS → product sahifasini NECKLACE+RING bilan ochish
	const handleMoreDetails = () => {
		const input = {
			page: 1,
			limit: 9,
			sort: 'createdAt',
			direction: 'DESC',
			search: {
				pricesRange: { start: 0, end: 2000000 },
				typeList: ['RING', 'NECKLACE'],
			},
		};
		router.push(`/product?input=${encodeQuotesOnly(input)}`);
	};

	// WATCHES belgisi → faqat WATCH filtri bilan ochish
	const handleSeeWatches = () => {
		const input = {
			page: 1,
			limit: 9,
			sort: 'createdAt',
			direction: 'DESC',
			search: {
				pricesRange: { start: 0, end: 2000000 },
				typeList: ['WATCH'],
			},
		};
		router.push(`/product?input=${encodeQuotesOnly(input)}`);
	};

	// Kommentlar
	const { data, loading, error } = useQuery(GET_COMMENTS_SUMMARY, {
		fetchPolicy: 'cache-and-network',
	});

	const summary = data?.commentsSummary;
	const total = summary?.total ?? 0;
	const recentCommenters = summary?.recentCommenters ?? [];

	/* 🔹 LOADING / ERROR ni layoutni buzmasdan ko‘rsatish uchun */
	const commentsTitle =
		error ? 'Reviews temporary unavailable' : `${total.toLocaleString()} Reviews`;
	const commentsText = loading
		? 'Loading community feedback…'
		: 'Read the voices of our community. Thousands of comments sharing their experience and love for our collections.';

	/* 🔹 1) MOBILE LAYOUT – alohida markup + alohida SCSS */
	if (device === 'mobile') {
		return (
			<section className="hero-mobile" aria-label="Hero – VIRA Jewelry Collections">
				<Box className="hero-mobile__inner">
					{/* Top text */}
					<Box className="hero-mobile__top">
						<h1 className="hero-mobile__title">
							VIRA COUPLE{' '}
							<span className="hero-mobile__gradA">RINGS</span> &{' '}
							<span className="hero-mobile__gradB">DIAMONDS</span>
						</h1>
						<p className="hero-mobile__copy">
							Explore our latest couple rings & diamond collections,
							designed to shine on every occasion.
						</p>
						<Button
							variant="contained"
							className="hero-mobile__cta"
							onClick={handleMoreDetails}
						>
							SHOP NOW
						</Button>
					</Box>

					{/* Dark card – first */}
					<Box className="hero-mobile__card card card--dark" ref={darkCardRef}>
						{['/img/collections/1.jpg', '/img/collections/2.jpg'].map((src, i) => (
							<div
								key={src}
								className={`card-bg ${i === 0 ? 'is-visible' : ''}`}
								data-index={i}
								style={{ backgroundImage: `url('${src}')` }}
								aria-hidden="true"
							/>
						))}
						<div className="card-overlay" />

						<p className="card__kicker">SPECIAL EDITIONS</p>
						<h3 className="card__dark-title">
							NECKLACES &<br /> RINGS
						</h3>
						<p className="card__dark-text">
							Embrace the unseen magic of uniqueness. Where elegance finds extraordinary.
						</p>
						<Button
							variant="contained"
							className="card__dark-btn"
							onClick={handleMoreDetails}
						>
							MORE DETAILS
						</Button>
					</Box>

					{/* Comments card */}
					<Box className="hero-mobile__card card card--light">
						<div className="card__avatars">
							{recentCommenters.slice(0, 3).map((user: any) => {
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
							{total > 0 && <span className="pill">+{total}</span>}
						</div>

						<div className="card__headline">
							<span className="star">⭐</span>
							<span className="card__headline-text">{commentsTitle}</span>
						</div>

						<h3 className="card__title">What People Say</h3>

						<p className="card__text">{commentsText}</p>
					</Box>

					{/* Watches card */}
					<Box className="hero-mobile__card card card--pale" onClick={handleSeeWatches}>
						<div className="pale__meta">
							<h4>WATCHES</h4>
							<button
								type="button"
								className="tiny-badge"
								aria-label="See watches"
							>
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
				</Box>
			</section>
		);
	}

	/* 🔹 2) DESKTOP LAYOUT – sening eski varianting (ozgina loading/error fix bilan) */
	return (
		<section className="hero" aria-label="Hero – VIRA Jewelry Collections">
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
						<Button
							variant="outlined"
							className="hero__cta"
							onClick={handleMoreDetails}
						>
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
								{total > 0 && <span className="pill">+{total}</span>}
							</div>

							<div className="card__headline">
								<span className="star">⭐</span>
								<span className="card__headline-text">{commentsTitle}</span>
							</div>

							<h3 className="card__title">What People Say About Our Jewelry</h3>

							<p className="card__text">{commentsText}</p>
						</div>
					</Grid>

					{/* Dark banner (auto-rotate bg) */}
					<Grid item xs={12} md={5}>
						<Box className="card card--dark" ref={darkCardRef}>
							{['/img/collections/1.jpg', '/img/collections/2.jpg'].map((src, i) => (
								<div
									key={src}
									className={`card-bg ${i === 0 ? 'is-visible' : ''}`}
									data-index={i}
									style={{ backgroundImage: `url('${src}')` }}
									aria-hidden="true"
								/>
							))}
							<div className="card-overlay" />

							<p className="card__kicker">SPECIAL EDITIONS</p>
							<h3 className="card__dark-title">
								NECKLACES &<br /> RINGS
							</h3>
							<p className="card__dark-text">
								Embrace the unseen magic of uniqueness. Where elegance finds extraordinary.
							</p>
							<Button
								variant="contained"
								className="card__dark-btn"
								onClick={handleMoreDetails}
							>
								MORE DETAILS
							</Button>
						</Box>
					</Grid>

					{/* Pale product */}
					<Grid item xs={12} md={3}>
						<Box className="card card--pale">
							<div className="pale__meta">
								<h4>WATCHES</h4>
								<button
									type="button"
									className="tiny-badge"
									aria-label="See more"
									onClick={handleSeeWatches}
								>
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