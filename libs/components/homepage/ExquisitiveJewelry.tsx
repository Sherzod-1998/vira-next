import { Stack } from '@mui/material';
import { Box, Container, Grid, Typography } from '@mui/material';

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
			spacing={2}
			justifyContent="space-around"
			alignItems="center"
			sx={{ my: 4 }}
		>
			<Stack className="top-content">1</Stack>
			<Stack className="bottom-content" direction="row" alignItems="space-around" justifyContent="space-around" sx={{ width: '100%' }}>
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
