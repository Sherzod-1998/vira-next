import { getMemberImage, REACT_APP_API_URL } from '../config';

describe('getMemberImage', () => {
	it('returns the default avatar when no image is provided', () => {
		expect(getMemberImage(undefined)).toBe('/img/profile/defaultUser.svg');
		expect(getMemberImage('')).toBe('/img/profile/defaultUser.svg');
	});

	it('returns an absolute http(s) URL unchanged', () => {
		const url = 'https://cdn.example.com/avatar.png';
		expect(getMemberImage(url)).toBe(url);
	});

	it('returns a root-relative path unchanged', () => {
		expect(getMemberImage('/img/profile/custom.svg')).toBe('/img/profile/custom.svg');
	});

	it('prefixes a relative path with the API URL', () => {
		expect(getMemberImage('uploads/member/avatar.png')).toBe(`${REACT_APP_API_URL}/uploads/member/avatar.png`);
	});
});
