import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const Accordion = styled((props: AccordionProps) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	'&:not(:last-child)': {
		borderBottom: 0,
	},
	'&:before': {
		display: 'none',
	},
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation('cs');
	const [category, setCategory] = useState<string>('product');
	const [expanded, setExpanded] = useState<string | false>('panel1');
	const [searchText, setSearchText] = useState<string>('');

	const changeCategoryHandler = (category: string) => {
		setCategory(category);
		setExpanded(false);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const data: Record<string, { id: string; subject: string; content: string }[]> = {
		product: [
			{
				id: '00f5a45ed8897f8090116a01',
				subject: 'Are the products displayed on the site reliable?',
				content: 'Of course, we only have verified products.',
			},
			{
				id: '00f5a45ed8897f8090116a22',
				subject: 'What types of products do you offer?',
				content: 'We offer various categories of products from different sellers.',
			},
			{
				id: '00f5a45ed8897f8090116a21',
				subject: 'How can I search for products on your website?',
				content: 'Simply use our search bar to filter by category, price range, or keywords.',
			},
			{
				id: '00f5a45ed8897f8090116a23',
				subject: 'Do you provide assistance for first-time buyers?',
				content: 'Yes, we guide you through the process and help find suitable options.',
			},
			{
				id: '00f5a45ed8897f8090116a24',
				subject: 'What should I consider when buying a product?',
				content: 'Check seller reliability, reviews, product details, and return policy.',
			},
			{
				id: '00f5a45ed8897f8090116a25',
				subject: 'How long does the buying process typically take?',
				content: 'It depends on the product and seller, but usually very quick.',
			},
			{
				id: '00f5a45ed8897f8090116a29',
				subject: 'What happens if I encounter issues with the product after purchase?',
				content: 'Contact the seller or CS center, we will try to help resolve the issue.',
			},
			{
				id: '00f5a45ed8897f8090116a28',
				subject: 'Do you offer products in specific locations?',
				content: 'Some products can be filtered by region or delivery area.',
			},
			{
				id: '00f5a45ed8897f8090116a27',
				subject: 'Can I sell my products through your website?',
				content: 'Yes, you can register as a seller and upload your products.',
			},
			{
				id: '00f5a45ed8897f8090116b99',
				subject: 'What if I need help understanding product details?',
				content: 'You can ask the seller in comments or contact our CS center.',
			},
		],
		payment: [
			{
				id: '00f5a45ed8897f8090116a02',
				subject: 'How can I make the payment?',
				content: 'You make the payment through the supported payment methods during checkout.',
			},
			{
				id: '00f5a45ed8897f8090116a91',
				subject: 'Are there any additional fees for using your services?',
				content: 'Normally, buyers do not pay extra fees. Some sellers may have shipping costs.',
			},
			{
				id: '00f5a45ed8897f8090116a92',
				subject: 'Is there an option for installment payments?',
				content: 'Installment may depend on the payment provider, not directly from us.',
			},
			{
				id: '00f5a45ed8897f8090116a93',
				subject: 'Is my payment information secure on your website?',
				content: 'Yes, we use secure payment gateways and encryption.',
			},
			{
				id: '00f5a45ed8897f8090116a94',
				subject: 'Can I make payments online through your website?',
				content: 'Yes, you can pay online with your preferred payment method.',
			},
			{
				id: '00f5a45ed8897f8090116a95',
				subject: "What happens if there's an issue with my payment?",
				content: 'Please contact our CS center, and we will check the payment status.',
			},
			{
				id: '00f5a45ed8897f8090116a96',
				subject: 'Do you offer refunds for payments made?',
				content: 'Refund policy depends on the product and seller policy.',
			},
			{
				id: '00f5a45ed8897f8090116a97',
				subject: 'Are there any discounts or incentives?',
				content: 'Sometimes we run events or coupon promotions.',
			},
			{
				id: '00f5a45ed8897f8090116a99',
				subject: 'How long does it take for payments to be processed?',
				content: 'Usually payments are processed instantly, but can vary by method.',
			},
			{
				id: '00f5a45ed8897f8090116a98',
				subject: 'Are there penalties for late payments?',
				content: 'Late payment is usually not applicable for normal orders.',
			},
		],
		buyers: [
			{
				id: '00f5a45ed8897f8090116a03',
				subject: 'What should buyers pay attention to?',
				content: 'Check product details, seller info, and reviews carefully.',
			},
			{
				id: '00f5a45ed8897f8090116a85',
				subject: 'How can I determine if a product is within my budget?',
				content: 'Filter by price and compare different products before buying.',
			},
			{
				id: '00f5a45ed8897f8090116a84',
				subject: 'What documents do I need to provide?',
				content: 'Usually no documents are required, only your account and payment info.',
			},
			{
				id: '00f5a45ed8897f8090116a83',
				subject: 'What factors should I consider when choosing a product?',
				content: 'Quality, price, seller rating, and delivery time.',
			},
			{
				id: '00f5a45ed8897f8090116a82',
				subject: 'Can I negotiate the price?',
				content: 'Some sellers may offer discounts, but direct negotiation is not standard.',
			},
			{
				id: '00f5a45ed8897f8090116a81',
				subject: 'What are some red flags to watch out for?',
				content: 'Very low price, no description, no reviews, or suspicious seller info.',
			},
			{
				id: '00f5a45ed8897f8090116a80',
				subject: 'Do you provide assistance with product issues?',
				content: 'You can contact CS, we will try to mediate with the seller.',
			},
			{
				id: '00f5a45ed8897f8090116a79',
				subject: 'How long does it take to find the right product?',
				content: 'Depends on your needs; use our filters to search faster.',
			},
			{
				id: '00f5a45ed8897f8090116a78',
				subject: 'What are the advantages of using your platform?',
				content: 'Multiple sellers, various products, and integrated community & CS.',
			},
			{
				id: '00f5a45ed8897f8090116a77',
				subject: 'What happens if I change my mind?',
				content: 'Check the cancel/refund policy of the seller and product.',
			},
		],
		sellers: [
			{
				id: '00f5a45ed8897f8090116a04',
				subject: 'What do I need to do if I want to become a seller?',
				content: 'Apply for seller registration and follow our verification process.',
			},
			{
				id: '00f5a45ed8897f8090116a62',
				subject: 'What qualifications do I need to become a seller?',
				content: 'Basic identity verification and agreement to our terms.',
			},
			{
				id: '00f5a45ed8897f8090116a63',
				subject: 'How do I find buyers as a new seller?',
				content: 'Upload high-quality products and describe them clearly.',
			},
			{
				id: '00f5a45ed8897f8090116a64',
				subject: 'What are effective marketing strategies?',
				content: 'Use good images, descriptions, and share on social media.',
			},
			{
				id: '00f5a45ed8897f8090116a65',
				subject: 'How do I handle negotiations?',
				content: 'Set reasonable prices and respond politely to customers.',
			},
			{
				id: '00f5a45ed8897f8090116a66',
				subject: 'How do I stay updated with trends?',
				content: 'Watch market trends and see what customers like.',
			},
			{
				id: '00f5a45ed8897f8090116a67',
				subject: 'How do I handle difficult customers?',
				content: 'Stay polite and try to solve the issue calmly.',
			},
			{
				id: '00f5a45ed8897f8090116a68',
				subject: 'What tools should I use as a seller?',
				content: 'Use our dashboard, analytics, and messaging tools.',
			},
			{
				id: '00f5a45ed8897f8090116a69',
				subject: 'How do I ensure compliance with rules?',
				content: 'Read our seller policy and follow guidelines.',
			},
			{
				id: '00f5a45ed8897f8090116a70',
				subject: 'How can I grow my business?',
				content: 'Maintain quality, respond fast, and get good reviews.',
			},
		],
		membership: [
			{
				id: '00f5a45ed8897f8090116a05',
				subject: 'Do you have a membership service?',
				content: 'Membership service is not available yet.',
			},
			{
				id: '00f5a45ed8897f8090116a60',
				subject: 'What are the benefits of membership?',
				content: 'Currently no membership, so no special benefits yet.',
			},
			{
				id: '00f5a45ed8897f8090116a59',
				subject: 'Is there a fee for membership?',
				content: 'No, because membership is not implemented.',
			},
			{
				id: '00f5a45ed8897f8090116a58',
				subject: 'Will membership give exclusive content?',
				content: 'Not at the moment.',
			},
			{
				id: '00f5a45ed8897f8090116a57',
				subject: 'How can I sign up for membership?',
				content: 'Sign-up is not yet available.',
			},
			{
				id: '00f5a45ed8897f8090116a56',
				subject: 'Do members receive discounts?',
				content: 'No membership discounts exist yet.',
			},
			{
				id: '00f5a45ed8897f8090116a55',
				subject: 'Are there plans to introduce membership?',
				content: 'We may consider it in the future.',
			},
			{
				id: '00f5a45ed8897f8090116a54',
				subject: 'What benefits can members expect?',
				content: 'This is still under consideration.',
			},
			{
				id: '00f5a45ed8897f8090116a33',
				subject: 'Do you offer premium membership?',
				content: 'No premium membership yet.',
			},
			{
				id: '00f5a45ed8897f8090116a32',
				subject: 'Will membership grant access to exclusive deals?',
				content: 'Not yet.',
			},
		],
		community: [
			{
				id: '00f5a45ed8897f8090116a06',
				subject: 'What if there is abusive behavior in community?',
				content: 'Please report it immediately or contact admin.',
			},
			{
				id: '00f5a45ed8897f8090116a44',
				subject: 'How can I participate in the community?',
				content: 'Create an account and start writing posts or comments.',
			},
			{
				id: '00f5a45ed8897f8090116a45',
				subject: 'Are there guidelines for posting?',
				content: 'Yes, follow our community guidelines.',
			},
			{
				id: '00f5a45ed8897f8090116a46',
				subject: 'What if I see spam?',
				content: 'Report spam to admin.',
			},
			{
				id: '00f5a45ed8897f8090116a47',
				subject: 'Can I connect with members outside?',
				content: 'We do not provide direct external contact tools.',
			},
			{
				id: '00f5a45ed8897f8090116a48',
				subject: 'Can I share personal experiences?',
				content: 'Yes, as long as it is relevant and respectful.',
			},
			{
				id: '00f5a45ed8897f8090116a49',
				subject: 'How can I ensure privacy?',
				content: 'Do not share sensitive personal information.',
			},
			{
				id: '00f5a45ed8897f8090116a50',
				subject: 'How can I contribute positively?',
				content: 'Respect others and post helpful content.',
			},
			{
				id: '00f5a45ed8897f8090116a51',
				subject: 'What if I notice misinformation?',
				content: 'Provide correct info or report the post.',
			},
			{
				id: '00f5a45ed8897f8090116a52',
				subject: 'Are there moderators?',
				content: 'Yes, we have moderators to oversee content.',
			},
		],
		other: [
			{
				id: '00f5a45ed8897f8090116a40',
				subject: 'Who should I contact if I want to buy your site?',
				content: 'We have no plans to sell the site.',
			},
			{
				id: '00f5a45ed8897f8090116a39',
				subject: 'Can I advertise my services?',
				content: 'We currently do not provide advertising slots.',
			},
			{
				id: '00f5a45ed8897f8090116a38',
				subject: 'Are there sponsorship opportunities?',
				content: 'Not at this moment.',
			},
			{
				id: '00f5a45ed8897f8090116a36',
				subject: 'Can I contribute guest posts?',
				content: 'Guest posts are not accepted now.',
			},
			{
				id: '00f5a45ed8897f8090116a35',
				subject: 'Is there a referral program?',
				content: 'No referral program yet.',
			},
			{
				id: '00f5a45ed8897f8090116a34',
				subject: 'Do you offer affiliate partnerships?',
				content: 'Not at this time.',
			},
			{
				id: '00f5a45ed8897f8090116a33',
				subject: 'Can I purchase merchandise?',
				content: 'We do not sell merchandise yet.',
			},
			{
				id: '00f5a45ed8897f8090116a32',
				subject: 'Are there any job openings?',
				content: 'Currently no open positions.',
			},
			{
				id: '00f5a45ed8897f8090116a31',
				subject: 'Do you host events or webinars?',
				content: 'We are not hosting events yet.',
			},
			{
				id: '00f5a45ed8897f8090116a30',
				subject: 'Can I request custom features?',
				content: 'We are not taking custom feature requests now.',
			},
		],
	};
	const visibleItems = (data[category] || []).filter((item) => {
		const query = searchText.trim().toLowerCase();
		if (!query) return true;
		return `${item.subject} ${item.content}`.toLowerCase().includes(query);
	});

	const renderSearch = (mobile = false) => (
		<Box className={mobile ? 'm-faq-search' : 'faq-search'} component="div">
			<input
				type="text"
				aria-label={t('faq.searchLabel')}
				placeholder={t('faq.searchPlaceholder')}
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
			/>
			{searchText && (
				<button type="button" onClick={() => setSearchText('')} aria-label={t('faq.clearSearch')}>
					✕
				</button>
			)}
		</Box>
	);

	const renderNoResults = (mobile = false) => (
		<Stack className={mobile ? 'm-faq-no-results' : 'faq-no-results'}>
			<Typography>{t('faq.noResults.title')}</Typography>
			<span>{t('faq.noResults.subtitle')}</span>
		</Stack>
	);

	// MOBILE LAYOUT
	if (device === 'mobile') {
		return (
			<Stack className="m-faq-content">
				{renderSearch(true)}
				<Box className="m-categories" component="div">
					<div
						className={category === 'product' ? 'active' : ''}
						onClick={() => changeCategoryHandler('product')}
					>
						{t('faq.categories.product')}
					</div>
					<div
						className={category === 'payment' ? 'active' : ''}
						onClick={() => changeCategoryHandler('payment')}
					>
						{t('faq.categories.payment')}
					</div>
					<div
						className={category === 'buyers' ? 'active' : ''}
						onClick={() => changeCategoryHandler('buyers')}
					>
						{t('faq.categories.buyers')}
					</div>
					<div
						className={category === 'sellers' ? 'active' : ''}
						onClick={() => changeCategoryHandler('sellers')}
					>
						{t('faq.categories.sellers')}
					</div>
					<div
						className={category === 'membership' ? 'active' : ''}
						onClick={() => changeCategoryHandler('membership')}
					>
						{t('faq.categories.membership')}
					</div>
					<div
						className={category === 'community' ? 'active' : ''}
						onClick={() => changeCategoryHandler('community')}
					>
						{t('faq.categories.community')}
					</div>
					<div
						className={category === 'other' ? 'active' : ''}
						onClick={() => changeCategoryHandler('other')}
					>
						{t('faq.categories.other')}
					</div>
				</Box>
				<Box className="m-wrap" component="div">
					{visibleItems.length === 0 && renderNoResults(true)}
					{visibleItems.length > 0 &&
						visibleItems.map((ele) => (
							<Accordion
								expanded={expanded === ele.id}
								onChange={handleChange(ele.id)}
								key={ele.id}
							>
								<AccordionSummary
									id="panel1d-header"
									className="m-question"
									aria-controls="panel1d-content"
									aria-label={expanded === ele.id ? t('faq.collapseAnswer') : t('faq.expandAnswer')}
								>
									<Typography className="badge" variant="h4">
										Q
									</Typography>
									<Typography>{ele.subject}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Stack className="m-answer flex-box">
										<Typography className="badge" variant="h4">
											A
										</Typography>
										<Typography>{ele.content}</Typography>
									</Stack>
								</AccordionDetails>
							</Accordion>
						))}
				</Box>
			</Stack>
		);
	}

	// PC LAYOUT
	return (
		<Stack className={'faq-content'}>
			{renderSearch()}
			<Box className={'categories'} component={'div'}>
				<div
					className={category === 'product' ? 'active' : ''}
					onClick={() => changeCategoryHandler('product')}
				>
					{t('faq.categories.product')}
				</div>
				<div
					className={category === 'payment' ? 'active' : ''}
					onClick={() => changeCategoryHandler('payment')}
				>
					{t('faq.categories.payment')}
				</div>
				<div
					className={category === 'buyers' ? 'active' : ''}
					onClick={() => changeCategoryHandler('buyers')}
				>
					{t('faq.categories.buyers')}
				</div>
				<div
					className={category === 'sellers' ? 'active' : ''}
					onClick={() => changeCategoryHandler('sellers')}
				>
					{t('faq.categories.sellers')}
				</div>
				<div
					className={category === 'membership' ? 'active' : ''}
					onClick={() => changeCategoryHandler('membership')}
				>
					{t('faq.categories.membership')}
				</div>
				<div
					className={category === 'community' ? 'active' : ''}
					onClick={() => changeCategoryHandler('community')}
				>
					{t('faq.categories.community')}
				</div>
				<div
					className={category === 'other' ? 'active' : ''}
					onClick={() => changeCategoryHandler('other')}
				>
					{t('faq.categories.other')}
				</div>
			</Box>
			<Box className={'wrap'} component={'div'}>
				{visibleItems.length === 0 && renderNoResults()}
				{visibleItems.length > 0 &&
					visibleItems.map((ele) => (
						<Accordion
							expanded={expanded === ele.id}
							onChange={handleChange(ele.id)}
							key={ele.id}
						>
							<AccordionSummary
								id="panel1d-header"
								className="question"
								aria-controls="panel1d-content"
								aria-label={expanded === ele.id ? t('faq.collapseAnswer') : t('faq.expandAnswer')}
							>
								<Typography className="badge" variant={'h4'}>
									Q
								</Typography>
								<Typography>{ele.subject}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Stack className={'answer flex-box'}>
									<Typography className="badge" variant={'h4'} color={'primary'}>
										A
									</Typography>
									<Typography>{ele.content}</Typography>
								</Stack>
							</AccordionDetails>
						</Accordion>
					))}
			</Box>
		</Stack>
	);
};

export default Faq;
