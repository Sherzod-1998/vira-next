import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import GorgeousCollection from '../libs/components/homepage/GorgeousCollection';
import Statistics from '../libs/components/homepage/Statistics';
import TrendProducts from '../libs/components/homepage/TrendProducts';
import PopularProducts from '../libs/components/homepage/PopularProducts';
import TopProducts from '../libs/components/homepage/TopProducts';
import TopSellers from '../libs/components/homepage/TopSellers';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import HeroSections from '../libs/components/homepage/HeroSections';

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
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<GorgeousCollection />
				<HeroSections/>
				<TrendProducts />
				<PopularProducts />
				<TopProducts />
				<TopSellers />
				<CommunityBoards />
				
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
