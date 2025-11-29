import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
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
import { Stack, Box } from '@mui/material';
import moment from 'moment';

const Footer = () => {
	const device = useDeviceDetect();

	/** 📱 MOBILE FOOTER **/
	if (device === 'mobile') {
		return (
			<Stack className="footer-container mobile-footer">
				{/* SUBSCRIBE BLOCK */}
				<Stack className="m-subscribe">
					<div className="m-subscribe-text">
						<span>Subscribe to VIRA</span>
						<p>Get updates about new products & special offers.</p>
					</div>
					<div className="m-subscribe-input">
						<p>your email here</p>
						<button className="m-subscribe-button">
							<span>send</span>
						</button>
					</div>
				</Stack>

				{/* MAIN INFO */}
				<Stack className="m-main" spacing={3}>
					{/* Brand & short desc */}
					<Box className="m-brand">
						<span className="m-logo">vira</span>
						<p className="m-desc">
							Building modern solutions that connect creativity, technology, and people in one seamless experience.
						</p>

						<div className="m-store-badges">
							<img src="/img/logo/appstore.png" alt="App store" />
							<img src="/img/logo/appstore.png" alt="App store" />
						</div>
					</Box>

					{/* Address & contact */}
					<Box className="m-block">
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

					{/* Links: Get To Know Us */}
					<Box className="m-block">
						<h3 className="m-title">Get To Know Us</h3>
						<ul className="m-list">
							<li>
								<a href="#">Careers</a>
							</li>
							<li>
								<a href="#">About Us</a>
							</li>
							<li>
								<a href="#">Investor Relations</a>
							</li>
							<li>
								<a href="#">Devices</a>
							</li>
							<li>
								<a href="#">Customer Reviews</a>
							</li>
							<li>
								<a href="#">Social Responsibility</a>
							</li>
							<li>
								<a href="#">Store Locations</a>
							</li>
						</ul>
					</Box>

					{/* Links: Legal */}
					<Box className="m-block">
						<h3 className="m-title">Legal</h3>
						<ul className="m-list">
							<li>
								<a href="#">Privacy Policy</a>
							</li>
							<li>
								<a href="#">Terms Of Use</a>
							</li>
							<li>
								<a href="#">Legal</a>
							</li>
							<li>
								<a href="#">Site Map</a>
							</li>
							<li>
								<a href="#">Tracking Order</a>
							</li>
							<li>
								<a href="#">Investors</a>
							</li>
						</ul>
					</Box>
				</Stack>

				{/* BOTTOM */}
				<Stack className="m-bottom" spacing={1}>
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

	/** 🖥 DESKTOP FOOTER (o‘z holicha qoladi) **/
	return (
		<Stack className={'footer-container'}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" className="subscribe">
				<div className="left-content">
					<span>Subscribe Our Newsletter & Delivery !</span>
					<p>Get E-mail updates about our latest shop and special offers.</p>
				</div>
				<div className="right-content">
					<p>your mail id here</p>
					<button className="button-border">
						<p>send message</p>
					</button>
				</div>
			</Stack>

			<Stack className={'main'} direction="row" justifyContent="space-between" alignItems="flex-start">
				<Stack direction="column" className={'first'}>
					<span>vira</span>
					<p>
						Building modern solutions that connect creativity,
						<br /> technology, and people in one seamless experience.
					</p>
					<Stack style={{ marginTop: 36 }} direction="row" justifyContent="space-between">
						<img src="/img/logo/appstore.png" alt="" />
						<img src="/img/logo/appstore.png" alt="" />
					</Stack>
				</Stack>
				<Stack className="footer-address" spacing={2}>
					<h2 className="title">Our address</h2>

					<Stack direction="row" alignItems="center" spacing={1} className="info">
						<FaMapMarkerAlt className="icon" />
						<p>77 Myeongdong-gil, Jung-gu, Seoul 04536, South Korea.</p>
					</Stack>

					<Stack direction="row" alignItems="center" spacing={1} className="info">
						<FaPhoneAlt className="icon" />
						<a href="tel:+1800396756">+82 10 9910 5777</a>
					</Stack>

					<Stack direction="row" alignItems="center" spacing={1} className="info">
						<FaEnvelope className="icon" />
						<a href="mailto:support@anikalan.com">support@vira.com</a>
					</Stack>

					<Stack direction="row" spacing={2} className="socials">
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
				<Stack className="footer-links">
					<h2 className="title">Get To Know Us</h2>
					<ul>
						<li>
							<a href="#">Careers</a>
						</li>
						<li>
							<a href="#">About Us</a>
						</li>
						<li>
							<a href="#">Investor Relations</a>
						</li>
						<li>
							<a href="#">Devices</a>
						</li>
						<li>
							<a href="#">Customer Reviews</a>
						</li>
						<li>
							<a href="#">Social Responsibility</a>
						</li>
						<li>
							<a href="#">Store Locations</a>
						</li>
					</ul>
				</Stack>
				<Stack className="footer-legal">
					<h2 className="title">Legal</h2>
					<ul>
						<li>
							<a href="#">Privacy Policy</a>
						</li>
						<li>
							<a href="#">Terms Of Use</a>
						</li>
						<li>
							<a href="#">Legal</a>
						</li>
						<li>
							<a href="#">Site Map</a>
						</li>
						<li>
							<a href="#">Tracking Order</a>
						</li>
						<li>
							<a href="#">Investors</a>
						</li>
					</ul>
				</Stack>
				<Stack className={'fifth'}></Stack>
			</Stack>

			<div className="footer-bottom">
				<hr className="divider" />
				<div className="content">
					<p className="copy">©VIRA all rights Reserved</p>
					<div className="links">
						<a href="#">Terms & Condition</a>
						<span>|</span>
						<a href="#">Privacy Policy</a>
					</div>
				</div>
			</div>
		</Stack>
	);
};

export default Footer;
