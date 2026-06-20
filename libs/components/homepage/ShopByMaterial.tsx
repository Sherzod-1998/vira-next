import React from 'react';
import { useRouter } from 'next/router';
import { ProductMaterial } from '../../enums/product.enum';

interface MaterialItem {
	key: ProductMaterial;
	label: string;
	img: string;
}

const MATERIALS: MaterialItem[] = [
	{ key: ProductMaterial.GOLD, label: 'Gold', img: '/img/collections/gold-bars.jpg' },
	{ key: ProductMaterial.SILVER, label: 'Silver', img: '/img/collections/rings.jpg' },
	{ key: ProductMaterial.PLATINUM, label: 'Platinum', img: '/img/collections/chains.jpg' },
	{ key: ProductMaterial.DIAMOND, label: 'Diamond', img: '/img/collections/necklaces.jpg' },
	{ key: ProductMaterial.PEARL, label: 'Pearl', img: '/img/banner/circle.jpg' },
];

const ShopByMaterial: React.FC = () => {
	const router = useRouter();

	const handleClick = (materialKey: ProductMaterial) => {
		router.push({
			pathname: '/product',
			query: {
				input: JSON.stringify({ page: 1, limit: 9, search: { materialList: [materialKey] } }),
			},
		});
	};

	return (
		<section className="material-section">
			<div className="material-inner">
				<div className="material-header">
					<p className="material-eyebrow">CHOOSE YOUR METAL</p>
					<h2 className="material-title">Shop by Material</h2>
				</div>

				<div className="material-cards">
					{MATERIALS.map((item) => (
						<div key={item.key} className="material-card" onClick={() => handleClick(item.key)}>
							<div className="material-circle">
								<img src={item.img} alt={item.label} />
							</div>
							<p className="material-name">{item.label}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default ShopByMaterial;
