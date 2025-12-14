import moment from 'moment';
import useDeviceDetect from '../hooks/useDeviceDetect';

// MUI (ALOHIDA IMPORT — MUHIM)
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// Icons
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

const Footer = () => {
	const device = useDeviceDetect();

	/* =========================
	   📱 MOBILE FOOTER
	========================= */
	if (device === 'mobile') {
		return (
			<Stack component="div" className="footer-container mobile-footer">
				{/* SUBSCRIBE */}
				<Stack component="div" className="m-subscribe">
					<div className="m-subscribe-text">
						<span>Subscribe to VIRA</span>
						<p>Get updates about new products & special offers.</p>
					</div>

					<div className="m-subscribe-input">
						<input
							type="email"
							className="m-input"
							placeholder="Enter your email"
							aria-label="Email address"
						/>
						<button className="m-subscribe-button">
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
							Building modern solutions that connect creativity, technology, and people in one seamless
							experience.
						</p>

						<div className="m-store-badges">
							<img src="/img/logo/appstore.png" alt="App Store" />
							<img src="/img/logo/appstore.png" alt="Google Play" />
						</div>
					</Box>

					{/* TWO COL */}
					<Box component="div" className="m-two-col">
						{/* Address */}
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
								<a href="#"><FaInstagram /></a>
								<a href="#"><FaFacebookF /></a>
								<a href="#"><FaYoutube /></a>
								<a href="#"><FaPinterest /></a>
							</div>
						</Box>

						{/* Links */}
						<Box component="div" className="m-block">
							<h3 className="m-title">Get To Know Us</h3>
							<ul className="m-list">
								<li><a href="#">Careers</a></li>
								<li><a href="#">About Us</a></li>
								<li><a href="#">Investor Relations</a></li>
								<li><a href="#">Devices</a></li>
								<li><a href="#">Customer Reviews</a></li>
								<li><a href="#">Social Responsibility</a></li>
								<li><a href="#">Store Locations</a></li>
							</ul>
						</Box>
					</Box>

					{/* Legal */}
					<Box component="div" className="m-block">
						<h3 className="m-title">Legal</h3>
						<ul className="m-list">
							<li><a href="#">Privacy Policy</a></li>
							<li><a href="#">Terms Of Use</a></li>
							<li><a href="#">Legal</a></li>
							<li><a href="#">Site Map</a></li>
							<li><a href="#">Tracking Order</a></li>
							<li><a href="#">Investors</a></li>
						</ul>
					</Box>
				</Stack>

				{/* BOTTOM */}
				<Stack component="div" className="m-bottom" spacing={1}>
					<hr className="m-divider" />
					<div className="m-bottom-content">
						<p className="m-copy">© VIRA {moment().year()} - All rights reserved</p>
						<div className="m-bottom-links">
							<a href="#">Terms & Condition</a>
							<span>|</span>
							<a href="#">Privacy Policy</a>
						</div>
					</div>
				</Stack>
			</Stack>
		);
	}

	/* =========================
	   🖥 DESKTOP FOOTER
	========================= */
	return (
		<Stack component="div" className="footer-container">
			<Stack component="div" direction="row" justifyContent="space-between" className="subscribe">
				<div>
					<span>Subscribe Our Newsletter & Delivery !</span>
					<p>Get E-mail updates about our latest shop and special offers.</p>
				</div>
				<button className="button-border">
					<p>send message</p>
				</button>
			</Stack>

			<Stack component="div" direction="row" justifyContent="space-between" className="main">
				<Stack component="div" className="first">
					<span>vira</span>
					<p>
						Building modern solutions that connect creativity,<br />
						technology, and people in one seamless experience.
					</p>
					<Stack component="div" direction="row" spacing={2}>
						<img src="/img/logo/appstore.png" alt="" />
						<img src="/img/logo/appstore.png" alt="" />
					</Stack>
				</Stack>

				<Stack component="div" className="footer-address" spacing={2}>
					<h2>Our address</h2>
					<p><FaMapMarkerAlt /> Seoul, South Korea</p>
					<a href="tel:+821099105777"><FaPhoneAlt /> +82 10 9910 5777</a>
					<a href="mailto:support@vira.com"><FaEnvelope /> support@vira.com</a>
				</Stack>
			</Stack>

			<div className="footer-bottom">
				<p>© VIRA {moment().year()} - All rights reserved</p>
			</div>
		</Stack>
	);
};

export default Footer;
