import { Stack } from '@mui/material';
import { Box, Container, Grid, Typography } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import router from 'next/router';

type Stat = { value: string; label: string };

const STATS: Stat[] = [
	{ value: '650+', label: 'Unique Jewellery Pieces' },
	{ value: '47+', label: 'International Awards' },
	{ value: '12+', label: 'Years On The Market' },
	{ value: '550K', label: "Customer's Feedback" },
];

export default function ExquisiteSection() {
	return (
		<Stack
			className="exquisiteivesection"
			direction="column"
			justifyContent="center"
		>
			<Stack
				className="top-content"
				direction="row"
				justifyContent="center"
				alignItems="flex-end"
				sx={{ position: 'relative', width: '100%' }}
			>
				<div className="left-card">
					<div className="badge">
						<h1>EXQUISITE JEWELRY</h1>
					</div>

					<div className="left">
						<img src="/img/exquisitive-jewelry/girl.png" alt="Uniqueness" className="model" />
					</div>
				</div>
				<div className="center">
					<p className="kicker">our recent products</p>

					<h2 className="title" style={{ textTransform: 'uppercase' }}>
						jewels enhanced with rings, <br />
						necklaces, earrings, bracelets, <br />
						and more.
					</h2>

					<p className="desc">
						From timeless solitaires to rare heirloom pieces, every item on Vira is curated for those who appreciate true
						craftsmanship. Discover jewelry that carries meaning — verified, authentic, and ready to become part of your
						story.
					</p>

					<div className="cta-row">
						<button
      className="btn"
      onClick={() => router.push('/product')}
    >
      MORE DETAILS
    </button>
						<div className="phone">
							<div className="phone-icon">
								<PhoneIcon sx={{ color: 'black', fontSize: 32 }} />
							</div>
							<div className="phone-text">
								<span>Get In Touch</span>
								<strong>+82 10 9910 5777</strong>
							</div>
						</div>
					</div>
				</div>
				<div className="right">
					<div className="arch">
						<img
							src="/img/collections/ear-hooks.jpg" // <-- public/ ichida
							alt="Earring close-up"
							className="photo"
						/>
					</div>

				
				</div>
			</Stack>
			<Stack
				className="bottom-content"
				direction="row"
				alignItems="space-between"
				justifyContent="space-between"
				sx={{ width: '100%' }}
			>
				<Stack className="item" spacing={1}>
					<Typography component="h3" className="value">
						650+
					</Typography>
					<Typography className="label">Unique Jewellery Pieces</Typography>
				</Stack>

				<Stack className="item" spacing={1}>
					<Typography component="h3" className="value">
						47+
					</Typography>
					<Typography className="label">International Awards</Typography>
				</Stack>

				<Stack className="item" spacing={1}>
					<Typography component="h3" className="value">
						12+
					</Typography>
					<Typography className="label">Years On The Market</Typography>
				</Stack>

				<Stack className="item" spacing={1}>
					<Typography component="h3" className="value">
						550K
					</Typography>
					<Typography className="label">Customer&apos;s Feedback</Typography>
				</Stack>
			</Stack>
		</Stack>
	);
}
