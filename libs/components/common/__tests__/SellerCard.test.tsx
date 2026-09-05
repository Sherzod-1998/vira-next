import React from 'react';
import { render, screen } from '@testing-library/react';
import SellerCard from '../SellerCard';

jest.mock('next-i18next', () => ({
	useTranslation: () => ({
		t: (key: string, opts?: any) => {
			if (key === 'card.productsCount') return `${opts?.count ?? 0} products`;
			return key;
		},
	}),
}));

const mockSeller = {
	_id: 'seller-1',
	memberFullName: 'Jane Doe',
	memberNick: 'janed',
	memberImage: '/img/profile/jane.png',
	memberProducts: 12,
	memberViews: 340,
	memberFollowers: 8,
	memberLikes: 5,
	memberRank: 0,
	meLiked: [],
};

describe('SellerCard', () => {
	it('renders the seller name, view count and product count', () => {
		render(<SellerCard seller={mockSeller} likeMemberHandler={jest.fn()} />);

		expect(screen.getByText('Jane Doe')).toBeInTheDocument();
		expect(screen.getByText('340')).toBeInTheDocument();
		expect(screen.getByText('12 products')).toBeInTheDocument();
	});

	it('falls back to memberNick when memberFullName is missing', () => {
		const sellerWithoutFullName = { ...mockSeller, memberFullName: undefined };
		render(<SellerCard seller={sellerWithoutFullName} likeMemberHandler={jest.fn()} />);

		expect(screen.getByText('janed')).toBeInTheDocument();
	});
});
