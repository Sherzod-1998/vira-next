import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { FaInstagram, FaFacebookF, FaTimes, FaYoutube, FaPinterest, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';
// import { Span } from 'next/dist/trace';

const Footer = () => {
	const device = useDeviceDetect();

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoWhite.svg" alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>total free customer care</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>nee live</span>
							<p>+82 10 4867 2909</p>
							<span>Support?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Search</strong>
								<span>Product for Rent</span>
								<span>Product Low to hide</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>Discover</strong>
								<span>Seoul</span>
								<span>Gyeongido</span>
								<span>Busan</span>
								<span>Jejudo</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© Vira - All rights reserved. Vira {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack direction='row' alignItems='center' justifyContent='space-between' className='subscribe'>
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

				<Stack
					className={'main'}
					direction='row'
					justifyContent='space-between'
					alignItems='flex-start'>
					<Stack direction='column' className={'first'}>
						<span>vira</span>
						<p>Building modern solutions that connect creativity,
							<br /> technology, and people in one seamless experience.</p>
						<Stack style={{ marginTop: 36 }} direction='row' justifyContent='space-between'>
							<img src="/img/logo/appstore.png" alt="" />
							<img src="/img/logo/appstore.png" alt="" />
						</Stack>
					</Stack>
					<Stack className="footer-address" spacing={2}>
						<h2 className="title">Our address</h2>

						{/* Address */}
						<Stack direction="row" alignItems="center" spacing={1} className="info">
							<FaMapMarkerAlt className="icon" />
							<p>9826 Painter Ave, Whittier, CA, United States.</p>
						</Stack>

						{/* Phone */}
						<Stack direction="row" alignItems="center" spacing={1} className="info">
							<FaPhoneAlt className="icon" />
							<a href="tel:+1800396756">+1 800 396 756</a>
						</Stack>

						{/* Email */}
						<Stack direction="row" alignItems="center" spacing={1} className="info">
							<FaEnvelope className="icon" />
							<a href="mailto:support@anikalan.com">support@anikalan.com</a>
						</Stack>

						{/* Social Icons */}
						<Stack direction="row" spacing={2} className="socials">
							<a href="#"><FaInstagram /></a>
							<a href="#"><FaFacebookF /></a>
							<a href="#"><FaTimes /></a>
							<a href="#"><FaYoutube /></a>
							<a href="#"><FaPinterest /></a>
						</Stack>
					</Stack>
					<Stack className="footer-links">
						<h2 className="title">Get To Know Us</h2>
						<ul>
							<li><a href="#">Careers</a></li>
							<li><a href="#">About Us</a></li>
							<li><a href="#">Investor Relations</a></li>
							<li><a href="#">Devices</a></li>
							<li><a href="#">Customer Reviews</a></li>
							<li><a href="#">Social Responsibility</a></li>
							<li><a href="#">Store Locations</a></li>
						</ul>
					</Stack>
					<Stack className="footer-legal">
						<h2 className="title">Legal</h2>
						<ul>
							<li><a href="#">Privacy Policy</a></li>
							<li><a href="#">Terms Of Use</a></li>
							<li><a href="#">Legal</a></li>
							<li><a href="#">Site Map</a></li>
							<li><a href="#">Tracking Order</a></li>
							<li><a href="#">Investors</a></li>
						</ul>
					</Stack>
					<Stack className={'fifth'}>
					</Stack>
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
	}
};

export default Footer;
