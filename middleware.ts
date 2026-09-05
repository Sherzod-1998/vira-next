import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side gate for the admin UI. A client-decoded JWT payload (used for
 * rendering decisions elsewhere in the app) is never trusted for this check —
 * the accessToken cookie is only used as the bearer token to ask the backend's
 * `checkMyRole` query, which re-verifies the token's signature and returns the
 * real memberType. Anyone without a verified ADMIN role never reaches the
 * admin pages, regardless of what a forged/edited client-side token claims.
 */
export async function middleware(request: NextRequest) {
	const token = request.cookies.get('accessToken')?.value;

	if (!token) {
		return NextResponse.redirect(new URL('/account/join', request.url));
	}

	try {
		const graphqlUrl = process.env.REACT_APP_API_GRAPHQL_URL ?? 'http://localhost:3007/graphql';
		const res = await fetch(graphqlUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ query: '{ checkMyRole }' }),
		});

		const { data, errors } = await res.json();

		if (errors || data?.checkMyRole !== 'ADMIN') {
			return NextResponse.redirect(new URL('/', request.url));
		}
	} catch {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: '/_admin/:path*',
};
