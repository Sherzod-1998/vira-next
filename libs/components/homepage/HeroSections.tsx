'use client';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEffect } from 'react';

const HeroSections = () => {
	// mockData.ts
	const commentsMock = {
		count: 2000,
		commenters: [
			{ id: 1, avatar: '/img/profile/sample.jpg' },
			{ id: 2, avatar: '/img/profile/sample.jpg' },
			{ id: 3, avatar: '/img/profile/sample.jpg' },
		],
	};

	const { count, commenters } = commentsMock;

	useEffect(() => {
		const root = document.querySelector('.card.card--dark');
		if (!root) return;

		const slides = Array.from(root.querySelectorAll<HTMLDivElement>('.card-bg'));
		let idx = 0;
		const next = () => {
			slides.forEach((el, i) => el.classList.toggle('is-visible', i === idx));
			idx = (idx + 1) % slides.length;
		};

		next(); // initial
		const id = setInterval(next, 4000); // har 4 soniyada almashsin
		return () => clearInterval(id);
	}, []);

	return (
		<section className="hero" aria-label="Hero – Rishi Jewelry Collections">
			<Container maxWidth={false} className="hero__container">
				<Grid container spacing={4} alignItems="flex-start">
					{/* Title */}
					<Grid item xs={12} md={7}>
						<h1 className="hero__title">
							VIRA COUPLE <span className="hero__gradA">RINGS</span> & <span className="hero__gradB">DIAMONDS</span> ARE
							THE
							<br /> NEW COLLECTIONS
						</h1>
					</Grid>

					{/* Right copy + CTA */}
					<Grid item xs={12} md={5}>
						<Typography className="hero__copy">
							Explore our latest couple rings & diamond collections,<br /> designed to shine on every occasion.
						</Typography>
						<Button variant="outlined" className="hero__cta">
							MORE DETAILS
						</Button>
					</Grid>
				</Grid>

				{/* Bottom row */}
				<Grid container spacing={4} className="hero__cards">
					{/* Reviews card */}
					<Grid item xs={12} md={4}>
						<div className="card card--light">
							<div className="card__avatars">
								{commenters.map((user) => (
									<img key={user.id} src={user.avatar} alt="user avatar" />
								))}
								<span className="pill">+{count}</span>
							</div>

							<div className="card__headline">
								<span className="star">⭐</span>
								<span className="card__headline-text">{count.toLocaleString()} COMMENTS</span>
							</div>

							<h3 className="card__title">What People Say About Our Jewelry</h3>

							<p className="card__text">
								Read the voices of our community. Thousands of comments sharing their experience and love for our
								collections.
							</p>
						</div>
					</Grid>

					{/* Dark banner */}
					<Grid item xs={12} md={5}>
						<Box className="card card--dark">
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
								<button className="tiny-badge">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										fill="none"
										viewBox="0 0 24 24"
										stroke="white"
										strokeWidth="2"
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
