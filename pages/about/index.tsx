import React, { useState } from 'react';
import { NextPage } from 'next';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Typography } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { GET_SELLERS } from '../../apollo/user/query';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { Member } from '../../libs/types/member/member';
import { T } from '../../libs/types/common';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import SellerCard from '../../libs/components/common/SellerCard';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// 'seller' is required here even though this page's own copy isn't
		// translated — the reused SellerCard component calls useTranslation('seller')
		// internally, and without this the namespace is missing so it renders raw
		// keys like "card.productsCount" instead of the translated text.
		...(await serverSideTranslations(locale as string, ['common', 'seller'])),
	},
});

const About: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [sellers, setSellers] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const { refetch: getSellersRefetch } = useQuery(GET_SELLERS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: { page: 1, limit: 4, sort: 'memberRank', direction: 'DESC', search: {} } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setSellers(data?.getSellers?.list ?? []);
		},
	});

	/** HANDLERS **/
	const likeMemberHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			await likeTargetMember({ variables: { input: id } });
			await getSellersRefetch();
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
			throw err;
		}
	};

	/* MOBILE LAYOUT */
	if (device === 'mobile') {
		return (
			<Stack className={'m-about-page'}>
				<Stack className={'m-intro'}>
					<Typography className={'m-headline'}>
						Where Fine Jewelry Meets Trust.
					</Typography>
					<Typography className={'m-desc'}>
						Vira is a marketplace for discovering, buying, and selling fine jewelry from verified sellers around
						the world. Every seller is identity-checked, every purchase is protected by secure escrow payment, and
						every piece is backed by an authenticity guarantee.
					</Typography>
				</Stack>

				<Stack className={'m-boxes'}>
					<div className={'m-box'}>
						<div className={'m-icon'}>
							<img src="/img/icons/security.svg" alt="" />
						</div>
						<span>Certified Authenticity</span>
						<p>Every listing is reviewed so you only ever receive the genuine article.</p>
					</div>
					<div className={'m-box'}>
						<div className={'m-icon'}>
							<img src="/img/icons/securePayment.svg" alt="" />
						</div>
						<span>Secure Escrow Payment</span>
						<p>Funds stay protected and only reach the seller once you confirm your order.</p>
					</div>
				</Stack>

				<Stack className={'m-stats'}>
					<div className={'m-banner'}>
						<img src="/img/banner/header1.jpg" alt="" />
					</div>
					<Stack className={'m-info'}>
						<Box component={'div'}>
							<strong>15K+</strong>
							<p>Certified Pieces</p>
						</Box>
						<Box component={'div'}>
							<strong>3K+</strong>
							<p>Verified Sellers</p>
						</Box>
						<Box component={'div'}>
							<strong>50K+</strong>
							<p>Happy Collectors</p>
						</Box>
					</Stack>
				</Stack>

				<Stack className={'m-sellers'}>
					<span className={'m-title'}>Featured Sellers</span>
					<p className={'m-subdesc'}>A few of the verified sellers building their reputation on Vira</p>
					<Stack className={'m-wrap'}>
						{sellers.map((seller: Member) => (
							<SellerCard seller={seller} likeMemberHandler={likeMemberHandler} key={seller?._id} />
						))}
					</Stack>
				</Stack>

				<Stack className={'m-help'}>
					<strong>Need help? Talk to our team.</strong>
					<p>Reach out with any question about buying, selling, or verifying a piece.</p>
					<div className={'m-black'} onClick={() => router.push('/cs')}>
						Contact Us
						<img src="/img/icons/rightup.svg" alt="" />
					</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'about-page'}>
				<Stack className={'intro'}>
					<Stack className={'container'}>
							<Stack className={'left'}>
								<strong>Where Fine Jewelry Meets Trust.</strong>
							</Stack>
						<Stack className={'right'}>
							<p>
								Vira is a marketplace for discovering, buying, and selling fine jewelry — connecting collectors
								with verified sellers from around the world. Every seller on Vira is identity-checked before they
								can list a single piece, and every listing is reviewed so buyers can shop with confidence.
								<br />
								<br />
								Every purchase is protected by secure escrow payment: funds are held safely and only released to
								the seller once you confirm the order has arrived as described. For sellers, Vira offers a
								trusted stage to reach real collectors and build a lasting reputation.
							</p>
							<Stack className={'boxes'}>
								<div className={'box'}>
									<div>
										<img src="/img/icons/security.svg" alt="" />
									</div>
									<span>Certified Authenticity</span>
									<p>Every listing is reviewed so you only ever receive the genuine article.</p>
								</div>
								<div className={'box'}>
									<div>
										<img src="/img/icons/securePayment.svg" alt="" />
									</div>
									<span>Secure Escrow Payment</span>
									<p>Funds stay protected and only reach the seller once you confirm your order.</p>
								</div>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'statistics'}>
					<Stack className={'container'}>
						<Stack className={'banner'}>
							<img src="/img/banner/header1.jpg" alt="" />
						</Stack>
						<Stack className={'info'}>
							<Box component={'div'}>
								<strong>15K+</strong>
								<p>Certified Pieces</p>
							</Box>
							<Box component={'div'}>
								<strong>3K+</strong>
								<p>Verified Sellers</p>
							</Box>
							<Box component={'div'}>
								<strong>50K+</strong>
								<p>Happy Collectors</p>
							</Box>
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'sellers'}>
					<Stack className={'container'}>
						<span className={'title'}>Featured Sellers</span>
						<p className={'desc'}>A few of the verified sellers building their reputation on Vira</p>
						<Stack className={'wrap'}>
							{sellers.map((seller: Member) => (
								<SellerCard seller={seller} likeMemberHandler={likeMemberHandler} key={seller?._id} />
							))}
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'options'}>
					<img src="/img/banner/circle.jpg" alt="" className={'about-banner'} />
					<Stack className={'container'}>
						<strong>Let’s find the right way to sell your jewelry</strong>
						<Stack className={'box'}>
							<div className={'icon-box'}>
								<img src="/img/icons/security.svg" alt="" />
							</div>
							<div className={'text-box'}>
								<span>Secure Listings</span>
								<p>Every listing is protected by our verification and escrow system, so buyers can purchase with confidence.</p>
							</div>
						</Stack>
						<Stack className={'box'}>
							<div className={'icon-box'}>
								<img src="/img/icons/keywording.svg" alt="" />
							</div>
							<div className={'text-box'}>
								<span>Smart Discovery Tools</span>
								<p>Tag your pieces by material, gemstone, and occasion so the right collectors find them fast.</p>
							</div>
						</Stack>
						<Stack className={'box'}>
							<div className={'icon-box'}>
								<img src="/img/icons/investment.svg" alt="" />
							</div>
							<div className={'text-box'}>
								<span>Real Growth Potential</span>
								<p>Track views, likes, and sales as your seller profile builds a lasting reputation on Vira.</p>
							</div>
						</Stack>
						<Stack className={'btn'} onClick={() => router.push('/seller')}>
							Learn More
							<img src="/img/icons/rightup.svg" alt="" />
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'partners'}>
					<Stack className={'container'}>
							<span>Trusted by the world&apos;s best</span>
						<Stack className={'wrap'}>
							<img src="/img/icons/brands/amazon.svg" alt="" />
							<img src="/img/icons/brands/amd.svg" alt="" />
							<img src="/img/icons/brands/cisco.svg" alt="" />
							<img src="/img/icons/brands/dropcam.svg" alt="" />
							<img src="/img/icons/brands/spotify.svg" alt="" />
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'help'}>
					<Stack className={'container'}>
						<Box component={'div'} className={'left'}>
							<strong>Need help? Talk to our team.</strong>
							<p>Reach out with any question about buying, selling, or verifying a piece.</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'white'} onClick={() => router.push('/cs')}>
								Contact Us
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
							<div className={'black'}>
								<img src="/img/icons/call.svg" alt="" />
								920 851 9087
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(About);
