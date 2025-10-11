import React from 'react';

const BenefitsRow = () => {
	return (
		<section className="benefits">
			<div className="grid">
				<div className="card">
					<div className="icon-wrap">
						<img src="/img/benefitsrow/card.png" alt="payment" />
					</div>
					<h3>Secure Payment</h3>
					<p>All transactions are protected with the latest encryption technology.</p>
				</div>

				<div className="card">
					<div className="icon-wrap">
						<img src="/img/benefitsrow/shop.png" alt="store" />
					</div>
					<h3>Easy Pickup</h3>
					<div className="divider" />
					<p>Order online and pick up your products quickly from our store.</p>
				</div>

				<div className="card">
					<div className="icon-wrap">
						<img src="/img/benefitsrow/discount.png" alt="offer" />
					</div>
					<h3>Special Offers</h3>
					<div className="divider" />
					<p>Enjoy seasonal discounts and limited-time deals every month.</p>
				</div>

				<div className="card">
					<div className="icon-wrap">
						<img src="/img/benefitsrow/package.png" alt="shipping" />
					</div>
					<h3>Worldwide Delivery</h3>
					<p>We ship to over 100+ countries with trusted global couriers.</p>
				</div>
			</div>
		</section>
	);
};

export default BenefitsRow;
