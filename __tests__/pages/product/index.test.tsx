import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import ProductList from '../../../pages/product/index';

// Regression test for the pagination bug: `handlePaginationChange` used to
// mutate the `searchFilter` state directly instead of going through
// `pushSearchFilter`, which silently broke navigation to page 2+ (the
// GraphQL query variables never picked up the new page). This test mounts
// the real page and asserts that clicking page 2 fires a second GET_PRODUCTS
// request with `page: 2` merged into the existing search filter.

jest.mock('../../../libs/components/layout/LayoutBasic', () => ({
	__esModule: true,
	// Bypass the real layout (Top/Footer/Chat) and just render the page.
	default: (Component: any) => (props: any) => <Component {...props} />,
}));

jest.mock('../../../libs/components/product/Filter', () => ({
	__esModule: true,
	default: () => null,
}));

jest.mock('../../../libs/components/homepage/MainProductCard', () => ({
	__esModule: true,
	default: ({ product }: any) => <div>{product?.productTitle}</div>,
}));

jest.mock('../../../libs/hooks/useDeviceDetect', () => ({
	__esModule: true,
	default: () => 'desktop',
}));

const push = jest.fn().mockResolvedValue(true);

jest.mock('next/router', () => ({
	useRouter: () => ({
		push,
		query: {},
		pathname: '/product',
	}),
}));

jest.mock('next-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => (opts ? `${key}:${JSON.stringify(opts)}` : key),
	}),
}));

const initialInput = {
	page: 1,
	limit: 9,
	sort: 'createdAt',
	direction: 'DESC',
	search: {
		pricesRange: { start: 0, end: 2000000 },
	},
};

const buildProducts = (count: number, page: number) =>
	Array.from({ length: count }).map((_, i) => ({
		_id: `product-${page}-${i}`,
		productType: 'RING',
		productStatus: 'ACTIVE',
		productLocation: 'SEOUL',
		productAddress: 'Some address',
		productTitle: `Product ${page}-${i}`,
		productPrice: 1000,
		productMaterial: 'GOLD',
		productViews: 0,
		productLikes: 0,
		productComments: 0,
		productRank: 0,
		productImages: [],
		productDesc: null,
		memberId: 'member-1',
		soldAt: null,
		deletedAt: null,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		memberData: null,
		meLiked: [],
	}));

const pageOneMock = {
	request: { query: GET_PRODUCTS, variables: { input: initialInput } },
	result: {
		data: {
			getProducts: {
				list: buildProducts(9, 1),
				metaCounter: [{ total: 20 }],
			},
		},
	},
};

const pageTwoMock = {
	request: { query: GET_PRODUCTS, variables: { input: { ...initialInput, page: 2 } } },
	result: {
		data: {
			getProducts: {
				list: buildProducts(9, 2),
				metaCounter: [{ total: 20 }],
			},
		},
	},
};

describe('ProductList pagination', () => {
	it('requests page 2 with the merged search filter when the user clicks page 2', async () => {
		render(
			<MockedProvider mocks={[pageOneMock, pageTwoMock]} addTypename={false}>
				<ProductList initialInput={initialInput} />
			</MockedProvider>,
		);

		// Wait for the initial page-1 request to resolve and render.
		await screen.findByText('Product 1-0');

		const pageTwoButton = screen.getByRole('button', { name: 'Go to page 2' });
		await userEvent.click(pageTwoButton);

		// If the bug were still present, the query variables would never
		// update and this second page's products would never appear.
		await waitFor(() => expect(screen.getByText('Product 2-0')).toBeInTheDocument());

		expect(push).toHaveBeenCalledWith(
			`/product?input=${JSON.stringify({ ...initialInput, page: 2 })}`,
			`/product?input=${JSON.stringify({ ...initialInput, page: 2 })}`,
			{ scroll: false },
		);
	});
});
