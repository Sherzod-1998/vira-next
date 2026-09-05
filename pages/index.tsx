import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import GorgeousCollection from '../libs/components/homepage/GorgeousCollection';
import TopSellers from '../libs/components/homepage/TopSellers';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import HeroSections from '../libs/components/homepage/HeroSections';
import ExquisiteJewelry from '../libs/components/homepage/ExquisitiveJewelry';
import ProductsTabsSection from '../libs/components/homepage/ProductsTabsSection';
import BenefitsRow from '../libs/components/homepage/BenefitsRow';
import ShopByOccasion from '../libs/components/homepage/ShopByOccasion';
import NewArrivals from '../libs/components/homepage/NewArrivals';
import ShopByMaterial from '../libs/components/homepage/ShopByMaterial';
import TrustSection from '../libs/components/homepage/TrustSection';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<GorgeousCollection />
				<ShopByOccasion />
				<ProductsTabsSection />
				<NewArrivals />
				<HeroSections />
				<ShopByMaterial />
				<TopSellers />
				<TrustSection />
				<CommunityBoards />
				<BenefitsRow />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<GorgeousCollection />
				<ShopByOccasion />
				<ProductsTabsSection />
				<NewArrivals />
				<HeroSections />
				<ShopByMaterial />
				<ExquisiteJewelry />
				<TopSellers />
				<TrustSection />
				<CommunityBoards />
				<BenefitsRow />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
