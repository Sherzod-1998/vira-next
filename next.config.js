/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
		REACT_APP_API_WS: process.env.REACT_APP_API_WS,
		NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
	},
	images: {
		// Product/member images are served from the backend API (REACT_APP_API_URL,
		// e.g. http://localhost:3007 in dev). The host is env-driven so we can't know
		// the exact production hostname here — remotePatterns below allow any host
		// over http/https so next/image works across dev and prod backends.
		remotePatterns: [
			{
				protocol: 'http',
				hostname: '**',
			},
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;
