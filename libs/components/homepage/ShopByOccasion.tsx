import React from 'react';
import { useRouter } from 'next/router';

interface Occasion {
	label: string;
	image: string;
}

const OCCASIONS: Occasion[] = [
	{ label: 'Engagement', image: '/img/collections/rings.jpg' },
	{ label: 'Wedding', image: '/img/collections/set.jpg' },
	{ label: 'Anniversary', image: '/img/collections/necklaces.jpg' },
	{ label: 'Gifts', image: '/img/collections/bracelets.jpg' },
];

const ShopByOccasion = () => {
	const router = useRouter();

	return (
		<section className="occasion-section">
			<div className="occasion-inner">
				<div className="occasion-header">
					<p className="occasion-eyebrow">FIND THE MOMENT</p>
					<h2 className="occasion-title">Shop by Occasion</h2>
				</div>

				<div className="occasion-grid">
					{OCCASIONS.map((item) => (
						<div
							key={item.label}
							className="occasion-card"
							style={{ backgroundImage: `url(${item.image})` }}
							onClick={() => router.push('/product')}
						>
							<div className="overlay" />
							<div className="occasion-card__label">
								<span className="occasion-card__name">{item.label}</span>
								<span className="occasion-card__cta">Explore &rarr;</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default ShopByOccasion;
