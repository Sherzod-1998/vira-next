import { useState } from 'react';

import {
	FaInstagram,
	FaFacebookF,
	FaTimes,
	FaYoutube,
	FaPinterest,
	FaMapMarkerAlt,
	FaPhoneAlt,
	FaEnvelope,
} from 'react-icons/fa';

import useDeviceDetect from '../hooks/useDeviceDetect';

// ✅ MUHIM: alohida import
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import moment from 'moment';

const Footer = () => {
	const device = useDeviceDetect();
	const [email, setEmail] = useState('');

	const subscribe = () => {
		if (email.trim()) {
			setEmail('');
		}
	};

	/** 📱 MOBILE FOOTER **/
	if (device === 'mobile') {
		return (
			<Stack component="div" className="footer-container mobile-footer">
				{/* SUBSCRIBE BLOCK */}
				<Stack component="div" className="m-subscribe">
					<div className="m-subscribe-text">
						<span>Subscribe to VIRA</span>
						<p>Get updates about new products & special offers.</p>
					</div>

					<div className="m-subscribe-input">
						<input
							type="email"
							name="email"
							className="m-input"
							placeholder="Enter your email"
							aria-label="Email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
						/>
						<button
							className="m-subscribe-button"
							onClick={subscribe}
							style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
						>
							<span>send</span>
						</button>
					</div>
				</Stack>

				{/* MAIN */}
				<Stack component="div" className="m-main" spacing={3}>
					{/* Brand */}
					<Box component="div" className="m-brand">
						<span className="m-logo">vira</span>
						<p className="m-desc">
							Discover, buy, and sell authenticated fine jewelry from verified sellers around the world — where
							every piece is genuine and every purchase is protected.
						</p>

						<div className="m-store-badges">
							<img src="/img/logo/appstore.png" alt="App store" />
							<img src="/img/logo/playstore.png" alt="Play store" />
						</div>
					</Box>

					{/* LINKS */}
					<Box component="div" className="m-two-col">
						{/* Our Address */}
						<Box component="div" className="m-block">
							<h3 className="m-title">Our address</h3>

							<div className="m-info">
								<FaMapMarkerAlt className="m-icon" />
								<p>77 Myeongdong-gil, Jung-gu, Seoul 04536, South Korea.</p>
							</div>

							<div className="m-info">
								<FaPhoneAlt className="m-icon" />
								<a href="tel:+821099105777">+82 10 9910 5777</a>
							</div>

							<div className="m-info">
								<FaEnvelope className="m-icon" />
								<a href="mailto:support@vira.com">support@vira.com</a>
							</div>

							<div className="m-socials">
								<a href="#">
									<FaInstagram />
								</a>
								<a href="#">
									<FaFacebookF />
								</a>
								<a href="#">
									<FaYoutube />
								</a>
								<a href="#">
									<FaPinterest />
								</a>
							</div>
						</Box>

						{/* Get To Know Us */}
						<Box component="div" className="m-block">
							<h3 className="m-title">Get To Know Us</h3>
							<ul className="m-list">
								<li>
									<a href="/about">About Us</a>
								</li>
								<li>
									<a href="/seller">Browse Sellers</a>
								</li>
								<li>
									<a href="/community?articleCategory=FREE">Community</a>
								</li>
								<li>
									<a href="/cs">Customer Support</a>
								</li>
								<li>
									<a href="/mypage?category=addProduct">Sell on Vira</a>
								</li>
							</ul>
						</Box>
					</Box>

					{/* Legal */}
					<Box component="div" className="m-block">
						<h3 className="m-title">Legal</h3>
						<ul className="m-list">
							<li>
								<a href="/cs">Privacy Policy</a>
							</li>
							<li>
								<a href="/cs">Terms Of Use</a>
							</li>
							<li>
								<a href="/cs">Legal</a>
							</li>
							<li>
								<a href="/cs">Site Map</a>
							</li>
							<li>
								<a href="/cs">Tracking Order</a>
							</li>
							<li>
								<a href="/cs">Investors</a>
							</li>
						</ul>
					</Box>
				</Stack>

				{/* BOTTOM */}
				<Stack component="div" className="m-bottom" spacing={1}>
					<hr className="m-divider" />
					<div className="footer-trust">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
						<span>Secure Escrow Payment · Buyer Protection · Authenticity Guaranteed</span>
					</div>
					<div className="m-bottom-content">
						<p className="m-copy">© VIRA {moment().year()} - All rights reserved</p>
						<div className="m-bottom-links">
							<a href="/cs">Terms & Condition</a>
							<span>|</span>
							<a href="/cs">Privacy Policy</a>
						</div>
					</div>
				</Stack>
			</Stack>
		);
	}

	/** 🖥 DESKTOP FOOTER **/
	return (
		<Stack component="div" className="footer-container">
			<Stack
				component="div"
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				className="subscribe"
			>
				<div className="left-content">
					<span>Subscribe Our Newsletter & Delivery !</span>
					<p>Get E-mail updates about our latest shop and special offers.</p>
				</div>
				<div className="right-content">
					<input
						className="news-input"
						type="email"
						placeholder="Enter your email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<button className="button-border" onClick={subscribe}>
						<p>send message</p>
					</button>
				</div>
			</Stack>

			<Stack
				component="div"
				className="main"
				direction="row"
				justifyContent="space-between"
				alignItems="flex-start"
			>
				<Stack component="div" direction="column" className="first">
					<span>vira</span>
					<p>
						Discover, buy, and sell authenticated fine jewelry from verified sellers around the world — where every
						piece is genuine and every purchase is protected.
					</p>
					<Stack component="div" style={{ marginTop: 36 }} direction="row" justifyContent="space-between">
						<img src="/img/logo/appstore.png" alt="App store" />
						<img src="/img/logo/playstore.png" alt="Play store" />
					</Stack>
				</Stack>

				<Stack component="div" className="footer-address" spacing={2}>
					<h2 className="title">Our address</h2>

					<Stack component="div" direction="row" alignItems="center" spacing={1} className="info">
						<FaMapMarkerAlt className="icon" />
						<p>77 Myeongdong-gil, Jung-gu, Seoul 04536, South Korea.</p>
					</Stack>

					<Stack component="div" direction="row" alignItems="center" spacing={1} className="info">
						<FaPhoneAlt className="icon" />
						<a href="tel:+821099105777">+82 10 9910 5777</a>
					</Stack>

					<Stack component="div" direction="row" alignItems="center" spacing={1} className="info">
						<FaEnvelope className="icon" />
						<a href="mailto:support@vira.com">support@vira.com</a>
					</Stack>

					<Stack component="div" direction="row" spacing={2} className="socials">
						<a href="#">
							<FaInstagram />
						</a>
						<a href="#">
							<FaFacebookF />
						</a>
						<a href="#">
							<FaTimes />
						</a>
						<a href="#">
							<FaYoutube />
						</a>
						<a href="#">
							<FaPinterest />
						</a>
					</Stack>
				</Stack>

				<Stack component="div" className="footer-links">
					<h2 className="title">Get To Know Us</h2>
					<ul>
						<li>
							<a href="/about">About Us</a>
						</li>
						<li>
							<a href="/seller">Browse Sellers</a>
						</li>
						<li>
							<a href="/community?articleCategory=FREE">Community</a>
						</li>
						<li>
							<a href="/cs">Customer Support</a>
						</li>
						<li>
							<a href="/mypage?category=addProduct">Sell on Vira</a>
						</li>
					</ul>
				</Stack>

				<Stack component="div" className="footer-legal">
					<h2 className="title">Legal</h2>
					<ul>
						<li>
							<a href="/cs">Privacy Policy</a>
						</li>
						<li>
							<a href="/cs">Terms Of Use</a>
						</li>
						<li>
							<a href="/cs">Legal</a>
						</li>
						<li>
							<a href="/cs">Site Map</a>
						</li>
						<li>
							<a href="/cs">Tracking Order</a>
						</li>
						<li>
							<a href="/cs">Investors</a>
						</li>
					</ul>
				</Stack>

				<Stack component="div" className="footer-links footer-shop">
					<h2 className="title">Shop</h2>
					<ul>
						<li>
							<a href="/product">All Jewelry</a>
						</li>
						<li>
							<a href="/seller">Sellers</a>
						</li>
						<li>
							<a href="/product?tab=top">New Arrivals</a>
						</li>
						<li>
							<a href="/community?articleCategory=FREE">Community</a>
						</li>
					</ul>
				</Stack>
			</Stack>

			<div className="footer-bottom">
				<hr className="divider" />
				<div className="footer-trust">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
						<path d="M7 11V7a5 5 0 0 1 10 0v4" />
					</svg>
					<span>Secure Escrow Payment · Buyer Protection · Authenticity Guaranteed</span>
				</div>
				<div className="content">
					<p className="copy">© VIRA {moment().year()} - All rights Reserved</p>
					<div className="links">
						<a href="/cs">Terms & Condition</a>
						<span>|</span>
						<a href="/cs">Privacy Policy</a>
					</div>
				</div>
			</div>
		</Stack>
	);
};

export default Footer;
