import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import GorgeousCollection from '../libs/components/homepage/GorgeousCollection';
import TrendProducts from '../libs/components/homepage/TrendProducts';
import TopProducts from '../libs/components/homepage/TopProducts';
import TopSellers from '../libs/components/homepage/TopSellers';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import HeroSections from '../libs/components/homepage/HeroSections';
import ExquisiteJewelry from '../libs/components/homepage/ExquisitiveJewelry';
import ProductsTabsSection from '../libs/components/homepage/ProductsTabsSection';
import BenefitsRow from '../libs/components/homepage/BenefitsRow';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <Stack className={'home-page'}>
			<GorgeousCollection />
			<ProductsTabsSection />
			<HeroSections />
			<TopSellers />
			<CommunityBoards />
		</Stack>;
	} else {
		return (
			<Stack className={'home-page'}>
				<GorgeousCollection />
				<ProductsTabsSection />
				<HeroSections />
				<ExquisiteJewelry />
				<TopSellers />
				<CommunityBoards />
				<BenefitsRow />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
