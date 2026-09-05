import { formatterStr } from '../utils';

describe('formatterStr', () => {
	it('formats a positive number with thousands separators', () => {
		expect(formatterStr(1234567)).toBe('1,234,567');
	});

	it('returns an empty string for zero', () => {
		expect(formatterStr(0)).toBe('');
	});

	it('returns an empty string for undefined input', () => {
		expect(formatterStr(undefined)).toBe('');
	});
});
