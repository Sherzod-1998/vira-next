import { useMemo } from 'react';
import { ApolloClient, ApolloLink, InMemoryCache, split, from, NormalizedCacheObject } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { getJwtToken, logOut } from '../libs/auth';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { sweetErrorAlert } from '../libs/sweetAlert';
import { socketVar } from './store';
let apolloClient: ApolloClient<NormalizedCacheObject>;

function getHeaders() {
	const headers = {} as HeadersInit;
	const token = getJwtToken();
	// @ts-ignore
	if (token) headers['Authorization'] = `Bearer ${token}`;
	return headers;
}

const tokenRefreshLink = new TokenRefreshLink({
	accessTokenField: 'accessToken',
	isTokenValidOrUndefined: () => {
		return true;
	}, // @ts-ignore
	fetchAccessToken: () => {
		// There is no refresh-token endpoint/mutation exposed by this codebase (verified: no
		// "refresh" mutation/query in apollo/user or apollo/admin), so a real token refresh
		// can't be implemented here. Instead of silently returning null and leaving the app
		// in a half-logged-in state, clear the stale session and let the normal
		// auth-required redirect handle re-login.
		if (typeof window !== 'undefined') logOut();
		return null;
	},
});

//custom WebSocket client
class LoggingWebSocket {
	private socket: WebSocket;
	constructor(url: string) {
		// Token is sent as a post-connect 'auth' message instead of a URL query
		// param, so it never lands in proxy/server access logs or browser history.
		this.socket = new WebSocket(url);
		socketVar(this.socket);

		this.socket.onopen = () => {
			const token = getJwtToken();
			if (token) this.socket.send(JSON.stringify({ event: 'auth', token }));
		};
		this.socket.onmessage = (msg) => {};
		this.socket.onerror = (error) => {};
	}

	send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {
		this.socket.send(data);
	}

	close() {
		this.socket.close();
	}
}

function createIsomorphicLink() {
	if (typeof window !== 'undefined') {
		const jwtToken = getJwtToken();

		const authLink = new ApolloLink((operation, forward) => {
			operation.setContext(({ headers = {} }) => ({
				headers: {
					...headers,
					...getHeaders(),
				},
			}));
			return forward(operation);
		});

		// @ts-ignore
		const link = new createUploadLink({
			uri: process.env.REACT_APP_API_GRAPHQL_URL,
		});

		/* WEBSOCKET SUBSCRIPTION LINK */
		const wsLink =
			jwtToken &&
			new WebSocketLink({
				uri: process.env.REACT_APP_API_WS ?? 'ws://127.0.0.1:3007',
				options: {
					reconnect: false,
					timeout: 30000,
					connectionParams: () => {
						return { headers: getHeaders() };
					},
				},
				webSocketImpl: LoggingWebSocket,
			});

		const errorLink = onError(({ graphQLErrors, networkError, response }) => {
			if (graphQLErrors) {
				graphQLErrors.map(({ message, locations, path, extensions }) => {
					console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
					const lowerMessage = message?.toLowerCase?.() || '';
					const isAuthError =
						extensions?.code === 'UNAUTHENTICATED' ||
						extensions?.code === 'FORBIDDEN' ||
						lowerMessage.includes('jwt expired') ||
						lowerMessage.includes('unauthenticated') ||
						lowerMessage.includes('unauthorized');
					if (isAuthError) {
						// Auth failure from the server: drop the stale session instead of leaving
						// the app in a broken half-logged-in state.
						logOut();
						return;
					}
					if (!message.includes('input')) sweetErrorAlert(message);
				});
			}
			if (networkError) {
				console.error(`[Network error]: ${networkError}`);
				// @ts-ignore
				if (networkError?.statusCode === 401) logOut();
			}
		});

		const splitLink = wsLink
			? split(
					({ query }) => {
						const definition = getMainDefinition(query);
						return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
					},
					wsLink,
					authLink.concat(link),
				)
			: authLink.concat(link);

		return from([errorLink, tokenRefreshLink, splitLink]);
	}
}

function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: createIsomorphicLink(),
		cache: new InMemoryCache(),
		resolvers: {},
	});
}

export function initializeApollo(initialState = null) {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) _apolloClient.cache.restore(initialState);
	if (typeof window === 'undefined') return _apolloClient;
	if (!apolloClient) apolloClient = _apolloClient;

	return _apolloClient;
}

export function useApollo(initialState: any) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}
