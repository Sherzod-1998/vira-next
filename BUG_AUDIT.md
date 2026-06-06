# Vira Next Bug Audit

Audit date: 2026-04-30

Scope: `pages`, `libs`, `apollo`, config files, public assets, and dependency health.

## Verification Summary

- `npx tsc --noEmit --pretty false`: passed.
- `npm run lint`: passed with no warnings or errors.
- `npm run build`: passed, but emitted `react-i18next` initialization warnings during SSG and an outdated `caniuse-lite` warning.
- `npm audit --omit=dev --audit-level=moderate`: not usable because this repo has `yarn.lock`, not `package-lock.json`.
- `yarn audit --groups dependencies --level moderate`: failed with 326 vulnerabilities: 10 critical, 165 high, 136 moderate, 15 low.

## Subagent Split

- Routing/pages audit: public routes, query parsing, redirects, SSR/SSG timing.
- Auth/session audit: localStorage tokens, JWT handling, role guards, login/signup flow.
- Apollo/API audit: GraphQL variables, public selections, upload/error handling, websocket setup.
- Homepage/UI audit: active homepage components, broken routes, broken assets, UI state bugs.
- Shared helpers audit: helper links, common components, utility functions, type holes.
- Build/config audit: env setup, Docker, dependency compatibility, i18n warnings.

## Critical / High Findings

### 1. Public GraphQL selections request `accessToken`

Severity: Critical

Evidence:

- `apollo/user/query.ts:35`
- `apollo/user/query.ts:76`
- `apollo/user/query.ts:174`
- `apollo/user/query.ts:341`
- `apollo/user/query.ts:393`
- `apollo/user/query.ts:444`
- `apollo/user/query.ts:513`
- `apollo/user/query.ts:567`
- `apollo/user/mutation.ts:100`
- `libs/types/member/member.ts:34`

Bug: Generic public/member queries request `accessToken` from `Member` and nested `memberData` objects. If the backend returns this field, tokens can leak through public list/detail queries and Apollo cache.

Impact: Account takeover risk if another user's token is exposed.

Fix: Remove `accessToken` from all non-auth selections and from the generic `Member` type. Return tokens only from dedicated login/signup/update-auth payloads. Also ensure backend resolvers never expose `accessToken` on public member objects.

### 2. Admin UI trusts unverified decoded JWT claims

Severity: High

Evidence:

- `libs/auth/index.ts:146`
- `libs/components/layout/LayoutAdmin.tsx:42`
- `libs/components/layout/LayoutAdmin.tsx:61`

Bug: `jwt-decode` is used to populate `userVar`, and admin UI access checks `user.memberType`. The frontend never verifies the token signature.

Impact: A forged localStorage token with `memberType: ADMIN` can render admin pages and attempt admin GraphQL actions. Backend authorization may still block this, but the frontend guard is not trustworthy.

Fix: Gate admin pages with server-verified current-user/session data. Keep backend authorization mandatory on every admin resolver.

### 3. Tokens are stored in `localStorage`

Severity: High

Evidence:

- `libs/auth/index.ts:20`
- `libs/auth/index.ts:31`
- `apollo/client.ts:17`

Bug: Bearer tokens are read from and written to `localStorage`.

Impact: Any XSS can steal long-lived account tokens directly.

Fix: Prefer `HttpOnly`, `Secure`, `SameSite` cookies. If bearer access tokens remain client-side, keep them short-lived and in memory, backed by a secure refresh cookie.

### 4. JWT is sent in websocket query strings

Severity: High

Evidence:

- `apollo/client.ts:36`
- `libs/components/Chat.tsx:49`

Bug: Websocket URLs include `?token=...`.

Impact: Tokens may be captured by server logs, proxy logs, analytics, browser history/debug tools, or network traces.

Fix: Authenticate websockets with secure cookies, `connectionParams`, or an initial auth message over `wss://`. Do not put bearer tokens in URLs.

### 5. Public `JSON.parse(router.query.input)` can crash pages

Severity: High

Evidence:

- `pages/product/index.tsx:33`
- `pages/product/index.tsx:67`
- `pages/seller/index.tsx:32`
- `pages/seller/index.tsx:60`

Bug: Query-string JSON is parsed during render/effect without type checks or `try/catch`.

Impact: Visiting `/product?input=bad` or `/seller?input=bad` can crash the public page. Repeated query params can also pass an array instead of a string.

Fix: Parse only when `typeof router.query.input === 'string'`, wrap in `try/catch`, validate the object shape, and fall back to `initialInput`.

### 6. Product edit form sends the wrong GraphQL variable

Severity: High

Evidence:

- `apollo/user/query.ts:97`
- `libs/components/mypage/AddNewProduct.tsx:60`
- `libs/components/mypage/AddNewProduct.tsx:62`
- `libs/components/mypage/AddNewProduct.tsx:169`

Bug: `GET_PRODUCT` declares `$productId`, but the edit form calls it with `variables: { input: router.query.productId }`.

Impact: Editing an existing product can fail to preload product data, and save can proceed with a missing `_id`.

Fix: Use `variables: { productId: router.query.productId }` after validating that `productId` is a string.

### 7. Product detail comments query uses stale variables

Severity: High

Evidence:

- `pages/product/detail.tsx:122`
- `pages/product/detail.tsx:125`
- `pages/product/detail.tsx:127`
- `pages/product/detail.tsx:154`

Bug: The query skips based on `commentInquiry.search.commentRefId`, but sends `initialComment`, whose `commentRefId` is empty. The effect then manually refetches with the real inquiry.

Impact: Apollo can request comments with an empty `commentRefId`, causing wrong comments, empty data, or server validation errors.

Fix: Use `variables: { input: commentInquiry }`, skip until `commentInquiry.search.commentRefId` exists, and remove the redundant refetch effect.

### 8. Community detail can query before `router.query.id` is ready

Severity: High

Evidence:

- `pages/community/detail.tsx:48`
- `pages/community/detail.tsx:80`
- `pages/community/detail.tsx:82`
- `pages/community/detail.tsx:97`

Bug: `GET_BOARD_ARTICLE` receives `articleId` from `router.query.id`, but the query can run before the router is ready. `GET_COMMENTS` also starts with default `commentRefId: ''`.

Impact: Initial page load can produce GraphQL errors for required `String!` variables or fetch comments for an empty reference.

Fix: Gate on `router.isReady`, validate `typeof query.id === 'string'`, and add `skip` conditions for both article and comments queries.

### 9. Notification links use wrong route/query names

Severity: High

Evidence:

- `libs/helpers/getNotificationLink.ts:3`
- `libs/helpers/getNotificationLink.ts:7`
- `libs/helpers/getNotificationLink.ts:11`
- `pages/product/detail.tsx:137`
- `pages/community/detail.tsx:48`

Bug: Notification helpers return `productId` and `articleId`, but detail pages read `id`. Author links return `/seller/{id}`, but the app has no `pages/seller/[id]` route.

Impact: Clicking notifications opens pages that do not load the intended product/article/seller.

Fix: Return `/product/detail?id=...`, `/community/detail?id=...&articleCategory=...` when available, and route authors to an existing page such as `/member?memberId=...` or `/seller/detail?sellerId=...`.

### 10. Login/signup can redirect after failed auth and accepts unsafe referrers

Severity: High

Evidence:

- `libs/auth/index.ts:32`
- `libs/auth/index.ts:38`
- `libs/auth/index.ts:85`
- `pages/account/join.tsx:42`
- `pages/account/join.tsx:51`

Bug: `logIn` and `signUp` catch errors internally and do not rethrow/return failure. The page then pushes `router.query.referrer` directly.

Impact: Failed auth can still continue navigation flow. A malicious or malformed `referrer` can create open redirect behavior or bad route values.

Fix: Make auth helpers return a success boolean or rethrow. Only redirect on success. Accept only internal string paths starting with `/` but not `//`; otherwise fall back to `/`.

### 11. Production env is incomplete in Docker/deploy setup

Severity: High

Evidence:

- `docker-compose.yml:8`
- `docker-compose.yml:18`
- `next.config.js:5`
- `next.config.js:6`
- `next.config.js:7`
- `.gitignore:28`
- `libs/config.ts:1`

Bug: Docker only sets `PORT`, while required API vars are likely in ignored `.env.local`. Missing `REACT_APP_API_URL` becomes the literal string `"undefined"` via `libs/config.ts`.

Impact: Fresh deploys can build successfully but ship broken API/image/websocket URLs.

Fix: Provide required env through compose `env_file`/secrets and fail fast when `REACT_APP_API_URL`, `REACT_APP_API_GRAPHQL_URL`, or `REACT_APP_API_WS` are missing. Avoid stringifying undefined env values.

### 12. Dependency audit has critical/high vulnerabilities

Severity: High

Evidence:

- `package.json:50`
- `package.json:61`
- `yarn audit --groups dependencies --level moderate`

Bug: Legacy dependencies such as `react-scripts@4` and `next-images` pull old webpack/Babel/workbox packages. `yarn audit` reported 326 vulnerabilities, including 10 critical and 165 high.

Impact: Security and supply-chain risk, plus stale tooling risk in production dependencies.

Fix: Remove unused `react-scripts` and `next-images` if not required. Re-run `yarn install`, then `yarn audit`. Upgrade or replace remaining vulnerable packages.

## Medium Findings

### 13. `/mypage` auth guard races token hydration

Severity: Medium

Evidence:

- `pages/mypage/index.tsx:42`
- `libs/components/layout/LayoutBasic.tsx:34`

Bug: `/mypage` redirects when `userVar` is initially empty. Layout token hydration runs separately in an effect after first render.

Impact: Authenticated direct loads can be bounced to `/`.

Fix: Add an auth-loading state/provider. Run route guards only after token hydration completes.

### 14. Expired token handling leaves stale UI state

Severity: Medium

Evidence:

- `libs/auth/index.ts:22`
- `apollo/client.ts:98`
- `apollo/client.ts:107`

Bug: Expired JWT handling removes `accessToken`, but does not clear `userVar`, Apollo cache, sockets, or redirect. The 401 branch is empty.

Impact: UI can remain visually logged in while requests fail.

Fix: Centralize auth failure handling to clear reactive vars, reset Apollo cache, close sockets, and route to login/home.

### 15. Seller-only checks run after protected hooks and redirect during render

Severity: Medium

Evidence:

- `libs/components/mypage/AddNewProduct.tsx:60`
- `libs/components/mypage/AddNewProduct.tsx:184`
- `libs/components/mypage/MyProducts.tsx:34`
- `libs/components/mypage/MyProducts.tsx:90`

Bug: Seller checks happen after queries/hooks are initialized, and `router.back()` is called during render.

Impact: Unauthorized users can trigger protected queries before redirect. Render-time navigation can cause unstable UI behavior.

Fix: Compute auth readiness first, use `skip` on seller-only queries, redirect inside `useEffect`, and render `null` or a loading state while deciding.

### 16. Raw upload requests bypass Apollo auth/error handling

Severity: Medium

Evidence:

- `libs/components/mypage/AddNewProduct.tsx:116`
- `libs/components/mypage/MyProfile.tsx:60`
- `libs/components/community/Teditor.tsx:57`

Bug: Uploads use raw `axios.post` to GraphQL. GraphQL `errors` returned with HTTP 200 are not checked before reading `response.data.data`.

Impact: Upload failures can be treated as success or show vague errors. Auth refresh/error handling is duplicated and inconsistent.

Fix: Use Apollo upload mutations, or explicitly check `response.data.errors` and share auth/error handling.

### 17. Apollo websocket link is only created if token exists at first client build

Severity: Medium

Evidence:

- `apollo/client.ts:79`
- `apollo/client.ts:131`

Bug: `wsLink` is conditional on `jwtToken` when the singleton Apollo client is first initialized. If the user logs in later, the client is not recreated and `socketVar` may remain `null`.

Impact: Real-time notifications can fail until a reload.

Fix: Use a lazy websocket link with dynamic auth, recreate/reset Apollo on login, or move notifications to a proper `useSubscription` flow.

### 18. Homepage "MORE DETAILS" points to a missing route

Severity: Medium

Evidence:

- `libs/components/homepage/HeaderContent.tsx:83`
- `libs/components/homepage/HeaderContent.tsx:164`
- `pages/about/index.tsx:1`

Bug: Buttons navigate to `/about-us`, but the existing route is `/about`.

Impact: Homepage CTA opens a 404.

Fix: Change target to `/about`, preferably using `next/link` or `router.push`.

### 19. Missing public image assets cause broken images

Severity: Medium

Evidence:

- `pages/about/index.tsx:53` references `/img/banner/header1.svg`, but only `header1.jpg` and `header1.webp` exist.
- `pages/about/index.tsx:83` references `/img/banner/aboutBanner.svg`, which does not exist.
- `pages/product/detail.tsx:207` and `pages/product/detail.tsx:403` reference `/img/product/bigImage.png`, but `public/img/product` does not exist.
- `libs/components/homepage/CommunityCard.tsx:40` references `/img/event.svg`, which does not exist.
- `libs/components/product/ProductCard.tsx:28` references `/img/banner/header1.svg`, which does not exist.

Impact: Users see broken images on about, product detail, homepage community cards, and product cards with missing images.

Fix: Point to existing assets such as `/img/banner/header1.webp` or `/img/community/communityImg.png`, or add the missing files.

### 20. About page lacks i18n static props

Severity: Medium

Evidence:

- `pages/about/index.tsx:154`
- `libs/components/layout/LayoutBasic.tsx:20`
- `libs/components/Top.tsx:109`

Bug: `/about` uses translated layout/top components, but does not call `serverSideTranslations`.

Impact: Build emits `react-i18next` initialization warnings and translations may be unavailable on SSG output.

Fix: Add `getStaticProps` with `serverSideTranslations(locale, ['common'])` to `pages/about/index.tsx`.

### 21. Common community card like click also navigates

Severity: Medium

Evidence:

- `libs/components/common/CommunityCard.tsx:55`
- `libs/components/common/CommunityCard.tsx:93`
- `libs/components/common/CommunityCard.tsx:116`
- `libs/components/common/CommunityCard.tsx:139`

Bug: The card itself navigates on click. Like buttons call `likeArticleHandler`, but do not stop propagation in the card component.

Impact: Liking an article can also open the detail page.

Fix: Call `e.stopPropagation()` inside both mobile and desktop like handlers before invoking the mutation.

### 22. Product like UI does not roll back failed optimistic updates

Severity: Medium

Evidence:

- `libs/components/homepage/MainProductCard.tsx:39`
- `libs/components/homepage/MainProductCard.tsx:47`

Bug: The card flips `liked` and `likeCount` before awaiting `onLike`. If unauthenticated or failed, state is not restored.

Impact: UI can show a product as liked even though the backend rejected the action.

Fix: Wrap `await onLike(...)` in `try/catch` and roll back on failure. Also sync local state when `product.meLiked` or `product.productLikes` changes.

### 23. Community list mutates props/default input during render

Severity: Medium

Evidence:

- `pages/community/index.tsx:32`
- `pages/community/index.tsx:33`
- `pages/community/index.tsx:35`
- `pages/community/index.tsx:476`

Bug: The page mutates `initialInput.search.articleCategory` during render when URL query exists.

Impact: React state is seeded from a mutated object, making category state easier to leak or desync across renders.

Fix: Derive initial category before `useState`, or update `searchCommunity` inside an effect. Do not mutate props/default objects.

### 24. Community tab URL hides the selected category

Severity: Medium

Evidence:

- `pages/community/index.tsx:78`
- `pages/community/index.tsx:83`

Bug: `router.push` passes a query object, but uses `router.pathname` as the `as` URL, hiding `?articleCategory=...`.

Impact: Refresh/share/back can lose the selected tab.

Fix: Omit the `as` argument or include the query in it.

### 25. Seller detail query param handling is too loose

Severity: Medium

Evidence:

- `pages/seller/detail.tsx:124`
- `pages/seller/detail.tsx:125`
- `pages/seller/detail.tsx:126`

Bug: `router.query.sellerId as string` can be an array, and the effect depends on the whole router object.

Impact: Duplicate query params can send an array to a `String!` GraphQL variable. Same-route seller changes may not update cleanly.

Fix: Depend on `router.query.sellerId`, require `typeof sellerId === 'string'`, and ignore invalid values.

### 26. Language menu can store an empty/invalid locale

Severity: Medium

Evidence:

- `libs/components/Top.tsx:227`
- `libs/components/Top.tsx:229`
- `libs/components/Top.tsx:230`
- `libs/components/Top.tsx:232`

Bug: `langChoice` reads `e.target.id`. If the click target is a child node without an id, it stores an empty locale.

Impact: Language switching can push an invalid locale route or show a broken flag path.

Fix: Use `e.currentTarget.id` and type the handler as `React.MouseEvent<HTMLLIElement>`.

### 27. `ScrollControls` is not SSR-safe and leaks a scroll listener

Severity: Medium

Evidence:

- `libs/components/common/ScrollControls.tsx:51`
- `libs/components/common/ScrollControls.tsx:52`
- `libs/components/common/ScrollControls.tsx:53`
- `libs/components/common/ScrollControls.tsx:128`
- `libs/components/common/ScrollControls.tsx:138`

Bug: `document.createElement` runs during render via `useState` initializers. An anonymous `scroll` listener is added and never removed; cleanup removes `onScrollEnd`, which was not registered.

Impact: SSR/tests can crash with `document is not defined` if this component is rendered. Strict Mode/remounts can leak event listeners and timers.

Fix: Create DOM nodes in a client-only effect or render this component with `dynamic(..., { ssr: false })`. Store the debounced scroll handler in a named function and remove it in cleanup.

### 28. Public role/status fields are client-controlled in signup/update types

Severity: Medium

Evidence:

- `pages/account/join.tsx:23`
- `pages/account/join.tsx:119`
- `libs/auth/index.ts:91`
- `libs/types/member/member.update.ts:5`
- `libs/types/member/member.update.ts:6`

Bug: Public signup lets the client choose `memberType`, and shared update types include role/status fields.

Impact: If backend validation is weak, users may assign elevated roles/statuses.

Fix: Split public self-update/signup inputs from admin inputs. Server should default signup role/status and only allow role/status changes in admin-only resolvers.

## Low Findings

### 29. `formatterStr(0)` renders blank

Severity: Low

Evidence:

- `libs/utils.ts:5`

Bug: The utility treats `0` as falsy and returns an empty string.

Impact: Valid zero prices/counters render blank and become indistinguishable from missing values.

Fix: Use `value == null ? '' : numeral(value).format('0,0')`.

### 30. Notification status union collapses to `string`

Severity: Low

Evidence:

- `libs/types/notification/notification.ts:1`

Bug: A union like `'WAIT' | 'READ' | string` is just `string`.

Impact: TypeScript cannot catch invalid notification statuses.

Fix: Use a strict union or enum such as `'WAIT' | 'READ'`.

### 31. Invalid flex alignment value

Severity: Low

Evidence:

- `libs/components/homepage/GorgeousCollection.tsx:133`

Bug: `alignItems="left"` is not a valid flex alignment value.

Impact: The prop is ignored.

Fix: Use `alignItems="flex-start"`.

### 32. `eslint-config-next` version does not match Next

Severity: Low

Evidence:

- `package.json:48`
- `package.json:96`

Bug: `next` is `14.2.0`, but `eslint-config-next` is `12.1.0`.

Impact: Linting uses an outdated Next rule/plugin set and may miss modern Next issues.

Fix: Align `eslint-config-next` with `next`, e.g. `14.2.0`.

### 33. Legacy/unused toolchain dependencies remain in production dependencies

Severity: Low

Evidence:

- `package.json:50`
- `package.json:61`

Bug: `next-images` and `react-scripts@4` are legacy dependencies for a Next 14 project.

Impact: They increase install size, audit noise, and stale webpack/Babel/ESLint risk.

Fix: Remove them unless a confirmed import/runtime path requires them.

## Suggested Fix Order

1. Remove `accessToken` from public GraphQL selections and verify backend never exposes it publicly.
2. Harden auth/session handling: secure token storage, websocket auth, expired-token cleanup, server-verified admin/current-user checks.
3. Fix broken GraphQL variables and router-readiness issues in product/community/seller detail pages.
4. Guard all query-string JSON parsing and sanitize login referrers.
5. Fix broken notification links and homepage/about/product broken routes/assets.
6. Clean up deployment env validation and dependency vulnerabilities.
7. Address UI correctness issues: optimistic like rollback, language click target, event propagation, `ScrollControls` cleanup.

