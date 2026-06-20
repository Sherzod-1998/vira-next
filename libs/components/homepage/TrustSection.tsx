import React from 'react';

const TrustSection = () => {
	return (
		<section className="trust-section">
			<div className="trust-inner">
				<div className="trust-header">
					<span className="trust-eyebrow">THE VIRA PROMISE</span>
					<h2 className="trust-title">Why Buy With Confidence</h2>
				</div>

				<div className="trust-grid">
					<div className="trust-card">
						<div className="trust-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 32 32"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.75"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M16 3 L28 8 L28 16 C28 22.627 22.627 28 16 28 C9.373 28 4 22.627 4 16 L4 8 Z" />
								<polyline points="11,16 14.5,19.5 21,13" />
							</svg>
						</div>
						<h3>Verified Sellers</h3>
						<p>Every seller is identity-verified before listing a single piece.</p>
					</div>

					<div className="trust-card">
						<div className="trust-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 32 32"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.75"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<rect x="4" y="6" width="24" height="20" rx="3" />
								<line x1="4" y1="13" x2="28" y2="13" />
								<circle cx="16" cy="21" r="3" />
								<line x1="16" y1="18" x2="16" y2="13" />
							</svg>
						</div>
						<h3>Authenticity Guarantee</h3>
						<p>Each item is checked so you only receive the genuine article.</p>
					</div>

					<div className="trust-card">
						<div className="trust-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 32 32"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.75"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<rect x="7" y="14" width="18" height="13" rx="2" />
								<path d="M11 14 L11 10 C11 6.686 13.686 4 16 4 C18.314 4 21 6.686 21 10 L21 14" />
								<circle cx="16" cy="21" r="1.5" fill="currentColor" />
							</svg>
						</div>
						<h3>Buyer Protection</h3>
						<p>Your purchase is fully covered until it safely arrives.</p>
					</div>

					<div className="trust-card">
						<div className="trust-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 32 32"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.75"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="16" cy="16" r="12" />
								<path d="M16 9 L16 12" />
								<path d="M16 20 L16 23" />
								<path d="M12 12.5 C12 11.119 13.119 10 14.5 10 L17.5 10 C18.881 10 20 11.119 20 12.5 C20 13.881 18.881 15 17.5 15 L14.5 15 C13.119 15 12 16.119 12 17.5 C12 18.881 13.119 20 14.5 20 L17.5 20 C18.881 20 20 18.881 20 17.5" />
							</svg>
						</div>
						<h3>Secure Escrow Payment</h3>
						<p>Funds are released to the seller only once you confirm.</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TrustSection;
