import { n as __exportAll, r as __toESM, t as __commonJSMin } from "./rolldown-runtime-B-1-B7_t.js";
import { $ as ABSOLUTE_URL_REGEX, E as ErrorResponseImpl, F as isBrowser$1, H as redirect, I as isRouteErrorResponse, J as require_react, K as resolveTo, L as joinPaths, N as getResolveToMatches, O as convertRouteMatchToUiMatch, P as getRoutePattern, Q as warning, R as matchPath, V as parseToInfo, X as invariant$1, Y as createPath, Z as parsePath, a as isFogOfWarEnabled, c as StreamTransfer, f as escapeHtml, h as IDLE_NAVIGATION, i as getPartialManifest, j as data, k as convertRoutesToDataRoutes, m as IDLE_FETCHER, n as siteBasePathContext, p as IDLE_BLOCKER, q as stripBasename, t as cloudflareContext, u as singleFetchUrl, v as hasInvalidProtocol, z as matchRoutes } from "./cloudflare-DhtSclJy.js";
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/context.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var DataRouterContext = import_react.createContext(null);
DataRouterContext.displayName = "DataRouter";
var DataRouterStateContext = import_react.createContext(null);
DataRouterStateContext.displayName = "DataRouterState";
var RSCRouterContext = import_react.createContext(false);
function useIsRSCRouterContext() {
	return import_react.useContext(RSCRouterContext);
}
var ViewTransitionContext = import_react.createContext({ isTransitioning: false });
ViewTransitionContext.displayName = "ViewTransition";
var FetchersContext = import_react.createContext(/* @__PURE__ */ new Map());
FetchersContext.displayName = "Fetchers";
var AwaitContext = import_react.createContext(null);
AwaitContext.displayName = "Await";
var NavigationContext = import_react.createContext(null);
NavigationContext.displayName = "Navigation";
var LocationContext = import_react.createContext(null);
LocationContext.displayName = "Location";
var RouteContext = import_react.createContext({
	outlet: null,
	matches: [],
	isDataRoute: false
});
RouteContext.displayName = "Route";
var RouteErrorContext = import_react.createContext(null);
RouteErrorContext.displayName = "RouteError";
//#endregion
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/errors.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var ERROR_DIGEST_BASE = "REACT_ROUTER_ERROR";
var ERROR_DIGEST_REDIRECT = "REDIRECT";
var ERROR_DIGEST_ROUTE_ERROR_RESPONSE = "ROUTE_ERROR_RESPONSE";
function decodeRedirectErrorDigest(digest) {
	if (digest.startsWith(`${ERROR_DIGEST_BASE}:${ERROR_DIGEST_REDIRECT}:{`)) try {
		let parsed = JSON.parse(digest.slice(28));
		if (typeof parsed === "object" && parsed && typeof parsed.status === "number" && typeof parsed.statusText === "string" && typeof parsed.location === "string" && typeof parsed.reloadDocument === "boolean" && typeof parsed.replace === "boolean") return parsed;
	} catch {}
}
function decodeRouteErrorResponseDigest(digest) {
	if (digest.startsWith(`${ERROR_DIGEST_BASE}:${ERROR_DIGEST_ROUTE_ERROR_RESPONSE}:{`)) try {
		let parsed = JSON.parse(digest.slice(40));
		if (typeof parsed === "object" && parsed && typeof parsed.status === "number" && typeof parsed.statusText === "string") return new ErrorResponseImpl(parsed.status, parsed.statusText, parsed.data);
	} catch {}
}
//#endregion
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/hooks.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
/**
* Resolves a URL against the current {@link Location}.
*
* @example
* import { useHref } from "react-router";
*
* function SomeComponent() {
*   let href = useHref("some/where");
*   // "/resolved/some/where"
* }
*
* @public
* @category Hooks
* @param to The path to resolve
* @param options Options
* @param options.relative Defaults to `"route"` so routing is relative to the
* route tree.
* Set to `"path"` to make relative routing operate against path segments.
* @returns The resolved href string
*/
function useHref(to, { relative } = {}) {
	invariant$1(useInRouterContext(), `useHref() may be used only in the context of a <Router> component.`);
	let { basename, navigator } = import_react.useContext(NavigationContext);
	let { hash, pathname, search } = useResolvedPath(to, { relative });
	let joinedPathname = pathname;
	if (basename !== "/") joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
	return navigator.createHref({
		pathname: joinedPathname,
		search,
		hash
	});
}
/**
* Returns `true` if this component is a descendant of a {@link Router}, useful
* to ensure a component is used within a {@link Router}.
*
* @public
* @category Hooks
* @mode framework
* @mode data
* @returns Whether the component is within a {@link Router} context
*/
function useInRouterContext() {
	return import_react.useContext(LocationContext) != null;
}
/**
* Returns the current {@link Location}. This can be useful if you'd like to
* perform some side effect whenever it changes.
*
* @example
* import * as React from 'react'
* import { useLocation } from 'react-router'
*
* function SomeComponent() {
*   let location = useLocation()
*
*   React.useEffect(() => {
*     // Google Analytics
*     ga('send', 'pageview')
*   }, [location]);
*
*   return (
*     // ...
*   );
* }
*
* @public
* @category Hooks
* @returns The current {@link Location} object
*/
function useLocation() {
	invariant$1(useInRouterContext(), `useLocation() may be used only in the context of a <Router> component.`);
	return import_react.useContext(LocationContext).location;
}
var navigateEffectWarning = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
/**
* Returns a function that lets you navigate programmatically in the browser in
* response to user interactions or effects.
*
* It's often better to use {@link redirect} in [`action`](../../start/framework/route-module#action)/[`loader`](../../start/framework/route-module#loader)
* functions than this hook.
*
* The returned function signature is `navigate(to, options?)`/`navigate(delta)` where:
*
* * `to` can be a string path, a {@link To} object, or a number (delta)
* * `options` contains options for modifying the navigation
*   * These options work in all modes (Framework, Data, and Declarative):
*     * `relative`: `"route"` or `"path"` to control relative routing logic
*     * `replace`: Replace the current entry in the [`History`](https://developer.mozilla.org/en-US/docs/Web/API/History) stack
*     * `state`: Optional [`history.state`](https://developer.mozilla.org/en-US/docs/Web/API/History/state) to include with the new {@link Location}
*   * These options only work in Framework and Data modes:
*     * `flushSync`: Wrap the DOM updates in [`ReactDom.flushSync`](https://react.dev/reference/react-dom/flushSync)
*     * `preventScrollReset`: Do not scroll back to the top of the page after navigation
*     * `viewTransition`: Enable [`document.startViewTransition`](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) for this navigation
*
* @example
* import { useNavigate } from "react-router";
*
* function SomeComponent() {
*   let navigate = useNavigate();
*   return (
*     <button onClick={() => navigate(-1)}>
*       Go Back
*     </button>
*   );
* }
*
* @additionalExamples
* ### Navigate to another path
*
* ```tsx
* navigate("/some/route");
* navigate("/some/route?search=param");
* ```
*
* ### Navigate with a {@link To} object
*
* All properties are optional.
*
* ```tsx
* navigate(
*   {
*     pathname: "/some/route",
*     search: "?search=param",
*     hash: "#hash",
*   },
*   {
*     state: { some: "state" },
*   },
* );
* ```
*
* If you use `state`, that will be available on the {@link Location} object on
* the next page. Access it with `useLocation().state` (see {@link useLocation}).
*
* ### Navigate back or forward in the history stack
*
* ```tsx
* // back
* // often used to close modals
* navigate(-1);
*
* // forward
* // often used in a multistep wizard workflows
* navigate(1);
* ```
*
* Be cautious with `navigate(number)`. If your application can load up to a
* route that has a button that tries to navigate forward/back, there may not be
* a [`History`](https://developer.mozilla.org/en-US/docs/Web/API/History)
* entry to go back or forward to, or it can go somewhere you don't expect
* (like a different domain).
*
* Only use this if you're sure they will have an entry in the [`History`](https://developer.mozilla.org/en-US/docs/Web/API/History)
* stack to navigate to.
*
* ### Replace the current entry in the history stack
*
* This will remove the current entry in the [`History`](https://developer.mozilla.org/en-US/docs/Web/API/History)
* stack, replacing it with a new one, similar to a server side redirect.
*
* ```tsx
* navigate("/some/route", { replace: true });
* ```
*
* ### Prevent Scroll Reset
*
* [MODES: framework, data]
*
* <br/>
* <br/>
*
* To prevent {@link ScrollRestoration | `<ScrollRestoration>`} from resetting
* the scroll position, use the `preventScrollReset` option.
*
* ```tsx
* navigate("?some-tab=1", { preventScrollReset: true });
* ```
*
* For example, if you have a tab interface connected to search params in the
* middle of a page, and you don't want it to scroll to the top when a tab is
* clicked.
*
* ### Return Type Augmentation
*
* Internally, `useNavigate` uses a separate implementation when you are in
* Declarative mode versus Data/Framework mode - the primary difference being
* that the latter is able to return a stable reference that does not change
* identity across navigations. The implementation in Data/Framework mode also
* returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* that resolves when the navigation is completed. This means the return type of
* `useNavigate` is `void | Promise<void>`. This is accurate, but can lead to
* some red squigglies based on the union in the return value:
*
* - If you're using `typescript-eslint`, you may see errors from
*   [`@typescript-eslint/no-floating-promises`](https://typescript-eslint.io/rules/no-floating-promises)
* - In Framework/Data mode, `React.use(navigate())` will show a false-positive
*   `Argument of type 'void | Promise<void>' is not assignable to parameter of
*   type 'Usable<void>'` error
*
* The easiest way to work around these issues is to augment the type based on the
* router you're using:
*
* ```ts
* // If using <BrowserRouter>
* declare module "react-router" {
*   interface NavigateFunction {
*     (to: To, options?: NavigateOptions): void;
*     (delta: number): void;
*   }
* }
*
* // If using <RouterProvider> or Framework mode
* declare module "react-router" {
*   interface NavigateFunction {
*     (to: To, options?: NavigateOptions): Promise<void>;
*     (delta: number): Promise<void>;
*   }
* }
* ```
*
* @public
* @category Hooks
* @returns A navigate function for programmatic navigation
*/
function useNavigate() {
	let { isDataRoute } = import_react.useContext(RouteContext);
	return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
	invariant$1(useInRouterContext(), `useNavigate() may be used only in the context of a <Router> component.`);
	let dataRouterContext = import_react.useContext(DataRouterContext);
	let { basename, navigator } = import_react.useContext(NavigationContext);
	let { matches } = import_react.useContext(RouteContext);
	let { pathname: locationPathname } = useLocation();
	let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
	let activeRef = import_react.useRef(false);
	import_react.useLayoutEffect(() => {
		activeRef.current = true;
	});
	return import_react.useCallback((to, options = {}) => {
		warning(activeRef.current, navigateEffectWarning);
		if (!activeRef.current) return;
		if (typeof to === "number") {
			navigator.go(to);
			return;
		}
		let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");
		if (dataRouterContext == null && basename !== "/") path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
		(!!options.replace ? navigator.replace : navigator.push)(path, options.state, options);
	}, [
		basename,
		navigator,
		routePathnamesJson,
		locationPathname,
		dataRouterContext
	]);
}
var OutletContext = import_react.createContext(null);
/**
* Returns the element for the child route at this level of the route
* hierarchy. Used internally by {@link Outlet | `<Outlet>`} to render child
* routes.
*
* @public
* @category Hooks
* @param context The context to pass to the outlet
* @returns The child route element or `null` if no child routes match
*/
function useOutlet(context) {
	let outlet = import_react.useContext(RouteContext).outlet;
	return import_react.useMemo(() => outlet && /* @__PURE__ */ import_react.createElement(OutletContext.Provider, { value: context }, outlet), [outlet, context]);
}
/**
* Returns an object of key/value-pairs of the dynamic params from the current
* URL that were matched by the routes. Child routes inherit all params from
* their parent routes.
*
* Assuming a route pattern like `/posts/:postId` is matched by `/posts/123`
* then `params.postId` will be `"123"`.
*
* @example
* import { useParams } from "react-router";
*
* function SomeComponent() {
*   let params = useParams();
*   params.postId;
* }
*
* @additionalExamples
* ### Basic Usage
*
* ```tsx
* import { useParams } from "react-router";
*
* // given a route like:
* <Route path="/posts/:postId" element={<Post />} />;
*
* // or a data route like:
* createBrowserRouter([
*   {
*     path: "/posts/:postId",
*     component: Post,
*   },
* ]);
*
* // or in routes.ts
* route("/posts/:postId", "routes/post.tsx");
* ```
*
* Access the params in a component:
*
* ```tsx
* import { useParams } from "react-router";
*
* export default function Post() {
*   let params = useParams();
*   return <h1>Post: {params.postId}</h1>;
* }
* ```
*
* ### Multiple Params
*
* Patterns can have multiple params:
*
* ```tsx
* "/posts/:postId/comments/:commentId";
* ```
*
* All will be available in the params object:
*
* ```tsx
* import { useParams } from "react-router";
*
* export default function Post() {
*   let params = useParams();
*   return (
*     <h1>
*       Post: {params.postId}, Comment: {params.commentId}
*     </h1>
*   );
* }
* ```
*
* ### Catchall Params
*
* Catchall params are defined with `*`:
*
* ```tsx
* "/files/*";
* ```
*
* The matched value will be available in the params object as follows:
*
* ```tsx
* import { useParams } from "react-router";
*
* export default function File() {
*   let params = useParams();
*   let catchall = params["*"];
*   // ...
* }
* ```
*
* You can destructure the catchall param:
*
* ```tsx
* export default function File() {
*   let { "*": catchall } = useParams();
*   console.log(catchall);
* }
* ```
*
* @public
* @category Hooks
* @returns An object containing the dynamic route parameters
*/
function useParams() {
	let { matches } = import_react.useContext(RouteContext);
	return matches[matches.length - 1]?.params ?? {};
}
/**
* Resolves the pathname of the given `to` value against the current
* {@link Location}. Similar to {@link useHref}, but returns a
* {@link Path} instead of a string.
*
* @example
* import { useResolvedPath } from "react-router";
*
* function SomeComponent() {
*   // if the user is at /dashboard/profile
*   let path = useResolvedPath("../accounts");
*   path.pathname; // "/dashboard/accounts"
*   path.search; // ""
*   path.hash; // ""
* }
*
* @public
* @category Hooks
* @param to The path to resolve
* @param options Options
* @param options.relative Defaults to `"route"` so routing is relative to the route tree.
*                         Set to `"path"` to make relative routing operate against path segments.
* @returns The resolved {@link Path} object with `pathname`, `search`, and `hash`
*/
function useResolvedPath(to, { relative } = {}) {
	let { matches } = import_react.useContext(RouteContext);
	let { pathname: locationPathname } = useLocation();
	let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
	return import_react.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [
		to,
		routePathnamesJson,
		locationPathname,
		relative
	]);
}
function useRoutesImpl(routes, locationArg, dataRouterOpts) {
	invariant$1(useInRouterContext(), `useRoutes() may be used only in the context of a <Router> component.`);
	let { navigator } = import_react.useContext(NavigationContext);
	let { matches: parentMatches } = import_react.useContext(RouteContext);
	let routeMatch = parentMatches[parentMatches.length - 1];
	let parentParams = routeMatch ? routeMatch.params : {};
	routeMatch && routeMatch.pathname;
	let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
	routeMatch && routeMatch.route;
	let locationFromContext = useLocation();
	let location;
	if (locationArg) {
		let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
		invariant$1(parentPathnameBase === "/" || parsedLocationArg.pathname?.startsWith(parentPathnameBase), `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${parentPathnameBase}" but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`);
		location = parsedLocationArg;
	} else location = locationFromContext;
	let pathname = location.pathname || "/";
	let remainingPathname = pathname;
	if (parentPathnameBase !== "/") {
		let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
		remainingPathname = "/" + pathname.replace(/^\//, "").split("/").slice(parentSegments.length).join("/");
	}
	let matches = dataRouterOpts && dataRouterOpts.state.matches.length ? dataRouterOpts.state.matches.map((m) => Object.assign(m, { route: dataRouterOpts.manifest[m.route.id] || m.route })) : matchRoutes(routes, { pathname: remainingPathname });
	let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
		params: Object.assign({}, parentParams, match.params),
		pathname: joinPaths([parentPathnameBase, navigator.encodeLocation ? navigator.encodeLocation(match.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")).pathname : match.pathname]),
		pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([parentPathnameBase, navigator.encodeLocation ? navigator.encodeLocation(match.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")).pathname : match.pathnameBase])
	})), parentMatches, dataRouterOpts);
	if (locationArg && renderedMatches) return /* @__PURE__ */ import_react.createElement(LocationContext.Provider, { value: {
		location: {
			pathname: "/",
			search: "",
			hash: "",
			state: null,
			key: "default",
			mask: void 0,
			...location
		},
		navigationType: "POP"
	} }, renderedMatches);
	return renderedMatches;
}
function DefaultErrorComponent() {
	let error = useRouteError();
	let message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : JSON.stringify(error);
	let stack = error instanceof Error ? error.stack : null;
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, /* @__PURE__ */ import_react.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ import_react.createElement("h3", { style: { fontStyle: "italic" } }, message), stack ? /* @__PURE__ */ import_react.createElement("pre", { style: {
		padding: "0.5rem",
		backgroundColor: "rgba(200,200,200, 0.5)"
	} }, stack) : null, null);
}
var defaultErrorElement = /* @__PURE__ */ import_react.createElement(DefaultErrorComponent, null);
var RenderErrorBoundary = class extends import_react.Component {
	constructor(props) {
		super(props);
		this.state = {
			location: props.location,
			revalidation: props.revalidation,
			error: props.error
		};
	}
	static contextType = RSCRouterContext;
	static getDerivedStateFromError(error) {
		return { error };
	}
	static getDerivedStateFromProps(props, state) {
		if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") return {
			error: props.error,
			location: props.location,
			revalidation: props.revalidation
		};
		return {
			error: props.error !== void 0 ? props.error : state.error,
			location: state.location,
			revalidation: props.revalidation || state.revalidation
		};
	}
	componentDidCatch(error, errorInfo) {
		if (this.props.onError) this.props.onError(error, errorInfo);
		else console.error("React Router caught the following error during render", error);
	}
	render() {
		let error = this.state.error;
		if (this.context && typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
			const decoded = decodeRouteErrorResponseDigest(error.digest);
			if (decoded) error = decoded;
		}
		let result = error !== void 0 ? /* @__PURE__ */ import_react.createElement(RouteContext.Provider, { value: this.props.routeContext }, /* @__PURE__ */ import_react.createElement(RouteErrorContext.Provider, {
			value: error,
			children: this.props.component
		})) : this.props.children;
		if (this.context) return /* @__PURE__ */ import_react.createElement(RSCErrorHandler, { error }, result);
		return result;
	}
};
var errorRedirectHandledMap = /* @__PURE__ */ new WeakMap();
function RSCErrorHandler({ children, error }) {
	let { basename } = import_react.useContext(NavigationContext);
	if (typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
		let redirect = decodeRedirectErrorDigest(error.digest);
		if (redirect) {
			let existingRedirect = errorRedirectHandledMap.get(error);
			if (existingRedirect) throw existingRedirect;
			let parsed = parseToInfo(redirect.location, basename);
			let target = parsed.absoluteURL || parsed.to;
			if (hasInvalidProtocol(target)) throw new Error("Invalid redirect location");
			if (isBrowser$1 && !errorRedirectHandledMap.get(error)) if (parsed.isExternal || redirect.reloadDocument) window.location.href = target;
			else {
				const redirectPromise = Promise.resolve().then(() => window.__reactRouterDataRouter.navigate(parsed.to, { replace: redirect.replace }));
				errorRedirectHandledMap.set(error, redirectPromise);
				throw redirectPromise;
			}
			return /* @__PURE__ */ import_react.createElement("meta", {
				httpEquiv: "refresh",
				content: `0;url=${target}`
			});
		}
	}
	return children;
}
function RenderedRoute({ routeContext, match, children }) {
	let dataRouterContext = import_react.useContext(DataRouterContext);
	if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
	return /* @__PURE__ */ import_react.createElement(RouteContext.Provider, { value: routeContext }, children);
}
function _renderMatches(matches, parentMatches = [], dataRouterOpts) {
	let dataRouterState = dataRouterOpts?.state;
	if (matches == null) {
		if (!dataRouterState) return null;
		if (dataRouterState.errors) matches = dataRouterState.matches;
		else if (parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) matches = dataRouterState.matches;
		else return null;
	}
	let renderedMatches = matches;
	let errors = dataRouterState?.errors;
	if (errors != null) {
		let errorIndex = renderedMatches.findIndex((m) => m.route.id && errors?.[m.route.id] !== void 0);
		invariant$1(errorIndex >= 0, `Could not find a matching route for errors on route IDs: ${Object.keys(errors).join(",")}`);
		renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
	}
	let renderFallback = false;
	let fallbackIndex = -1;
	if (dataRouterOpts && dataRouterState) {
		renderFallback = dataRouterState.renderFallback;
		for (let i = 0; i < renderedMatches.length; i++) {
			let match = renderedMatches[i];
			if (match.route.HydrateFallback || match.route.hydrateFallbackElement) fallbackIndex = i;
			if (match.route.id) {
				let { loaderData, errors } = dataRouterState;
				let needsToRunLoader = match.route.loader && !loaderData.hasOwnProperty(match.route.id) && (!errors || errors[match.route.id] === void 0);
				if (match.route.lazy || needsToRunLoader) {
					if (dataRouterOpts.isStatic) renderFallback = true;
					if (fallbackIndex >= 0) renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
					else renderedMatches = [renderedMatches[0]];
					break;
				}
			}
		}
	}
	let onErrorHandler = dataRouterOpts?.onError;
	let onError = dataRouterState && onErrorHandler ? (error, errorInfo) => {
		onErrorHandler(error, {
			location: dataRouterState.location,
			params: dataRouterState.matches?.[0]?.params ?? {},
			pattern: getRoutePattern(dataRouterState.matches),
			errorInfo
		});
	} : void 0;
	return renderedMatches.reduceRight((outlet, match, index) => {
		let error;
		let shouldRenderHydrateFallback = false;
		let errorElement = null;
		let hydrateFallbackElement = null;
		if (dataRouterState) {
			error = errors && match.route.id ? errors[match.route.id] : void 0;
			errorElement = match.route.errorElement || defaultErrorElement;
			if (renderFallback) {
				if (fallbackIndex < 0 && index === 0) {
					warningOnce("route-fallback", false, "No `HydrateFallback` element provided to render during initial hydration");
					shouldRenderHydrateFallback = true;
					hydrateFallbackElement = null;
				} else if (fallbackIndex === index) {
					shouldRenderHydrateFallback = true;
					hydrateFallbackElement = match.route.hydrateFallbackElement || null;
				}
			}
		}
		let matches = parentMatches.concat(renderedMatches.slice(0, index + 1));
		let getChildren = () => {
			let children;
			if (error) children = errorElement;
			else if (shouldRenderHydrateFallback) children = hydrateFallbackElement;
			else if (match.route.Component) children = /* @__PURE__ */ import_react.createElement(match.route.Component, null);
			else if (match.route.element) children = match.route.element;
			else children = outlet;
			return /* @__PURE__ */ import_react.createElement(RenderedRoute, {
				match,
				routeContext: {
					outlet,
					matches,
					isDataRoute: dataRouterState != null
				},
				children
			});
		};
		return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ import_react.createElement(RenderErrorBoundary, {
			location: dataRouterState.location,
			revalidation: dataRouterState.revalidation,
			component: errorElement,
			error,
			children: getChildren(),
			routeContext: {
				outlet: null,
				matches,
				isDataRoute: true
			},
			onError
		}) : getChildren();
	}, null);
}
function getDataRouterConsoleError$1(hookName) {
	return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext$2(hookName) {
	let ctx = import_react.useContext(DataRouterContext);
	invariant$1(ctx, getDataRouterConsoleError$1(hookName));
	return ctx;
}
function useDataRouterState$1(hookName) {
	let state = import_react.useContext(DataRouterStateContext);
	invariant$1(state, getDataRouterConsoleError$1(hookName));
	return state;
}
function useRouteContext(hookName) {
	let route = import_react.useContext(RouteContext);
	invariant$1(route, getDataRouterConsoleError$1(hookName));
	return route;
}
function useCurrentRouteId(hookName) {
	let route = useRouteContext(hookName);
	let thisRoute = route.matches[route.matches.length - 1];
	invariant$1(thisRoute.route.id, `${hookName} can only be used on routes that contain a unique "id"`);
	return thisRoute.route.id;
}
/**
* Returns the ID for the nearest contextual route
*
* @category Hooks
* @returns The ID of the nearest contextual route
*/
function useRouteId() {
	return useCurrentRouteId("useRouteId");
}
/**
* Returns the current {@link Navigation}, defaulting to an "idle" navigation
* when no navigation is in progress. You can use this to render pending UI
* (like a global spinner) or read [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
* from a form navigation.
*
* @example
* import { useNavigation } from "react-router";
*
* function SomeComponent() {
*   let navigation = useNavigation();
*   navigation.state;
*   navigation.formData;
*   // etc.
* }
*
* @public
* @category Hooks
* @mode framework
* @mode data
* @returns The current {@link Navigation} object
*/
function useNavigation() {
	let state = useDataRouterState$1("useNavigation");
	return import_react.useMemo(() => {
		let { matches, historyAction, ...rest } = state.navigation;
		return rest;
	}, [state.navigation]);
}
/**
* Returns the active route matches, useful for accessing `loaderData` for
* parent/child routes or the route [`handle`](../../start/framework/route-module#handle)
* property
*
* Pairing the route `handle` with `useMatches` gets very powerful since you can put
* whatever you want on a route handle and have access to `useMatches` anywhere.
* Please see the [handle](../../how-to/using-handle) documentation for an example
* of breadcrumbs via `useMatches`/`handle`.
*
* ```tsx
* import { useMatches } from "react-router";
*
* function SomeComponent() {
*   const matches = useMatches();
*   // matches[i].id          // route id
*   // matches[i].pathname    // the portion of the URL the route matched
*   // matches[i].params      // the parsed params from the URL
*   // matches[i].loaderData  // the data from the loader
*   // matches[i].handle      // the route handle with any app specific data
* }
* ```
*
* <docs-info>useMatches only works with a data router like `createBrowserRouter`,
* since they know the full route tree up front and can provide all of the current
* matches. Additionally, `useMatches` will not match down into any descendant route
* trees since the router isn't aware of the descendant routes.</docs-info>
*
* @public
* @category Hooks
* @mode framework
* @mode data
* @returns An array of {@link UIMatch | UI matches} for the current route hierarchy
*/
function useMatches() {
	let { matches, loaderData } = useDataRouterState$1("useMatches");
	return import_react.useMemo(() => matches.map((m) => convertRouteMatchToUiMatch(m, loaderData)), [matches, loaderData]);
}
/**
* Returns the data from the closest route
* [`loader`](../../start/framework/route-module#loader) or
* [`clientLoader`](../../start/framework/route-module#clientloader).
*
* @example
* import { useLoaderData } from "react-router";
*
* export async function loader() {
*   return await fakeDb.invoices.findAll();
* }
*
* export default function Invoices() {
*   let invoices = useLoaderData<typeof loader>();
*   // ...
* }
*
* @public
* @category Hooks
* @mode framework
* @mode data
* @returns The data returned from the route's [`loader`](../../start/framework/route-module#loader) or [`clientLoader`](../../start/framework/route-module#clientloader) function
*/
function useLoaderData() {
	let state = useDataRouterState$1("useLoaderData");
	let routeId = useCurrentRouteId("useLoaderData");
	return state.loaderData[routeId];
}
/**
* Returns the [`loader`](../../start/framework/route-module#loader) data for a
* given route by route ID.
*
* Route IDs are created automatically. They are simply the path of the route file
* relative to the app folder without the extension.
*
* | Route Filename               | Route ID               |
* | ---------------------------- | ---------------------- |
* | `app/root.tsx`               | `"root"`               |
* | `app/routes/teams.tsx`       | `"routes/teams"`       |
* | `app/whatever/teams.$id.tsx` | `"whatever/teams.$id"` |
*
* @example
* import { useRouteLoaderData } from "react-router";
*
* function SomeComponent() {
*   const { user } = useRouteLoaderData("root");
* }
*
* // You can also specify your own route ID's manually in your routes.ts file:
* route("/", "containers/app.tsx", { id: "app" })
* useRouteLoaderData("app");
*
* @public
* @category Hooks
* @mode framework
* @mode data
* @param routeId The ID of the route to return loader data from
* @returns The data returned from the specified route's [`loader`](../../start/framework/route-module#loader)
* function, or `undefined` if not found
*/
function useRouteLoaderData(routeId) {
	return useDataRouterState$1("useRouteLoaderData").loaderData[routeId];
}
/**
* Returns the [`action`](../../start/framework/route-module#action) data from
* the most recent `POST` navigation form submission or `undefined` if there
* hasn't been one.
*
* @example
* import { Form, useActionData } from "react-router";
*
* export async function action({ request }) {
*   const body = await request.formData();
*   const name = body.get("visitorsName");
*   return { message: `Hello, ${name}` };
* }
*
* export default function Invoices() {
*   const data = useActionData();
*   return (
*     <Form method="post">
*       <input type="text" name="visitorsName" />
*       {data ? data.message : "Waiting..."}
*     </Form>
*   );
* }
*
* @public
* @category Hooks
* @mode framework
* @mode data
* @returns The data returned from the route's [`action`](../../start/framework/route-module#action)
* function, or `undefined` if no [`action`](../../start/framework/route-module#action)
* has been called
*/
function useActionData() {
	let state = useDataRouterState$1("useActionData");
	let routeId = useCurrentRouteId("useLoaderData");
	return state.actionData ? state.actionData[routeId] : void 0;
}
/**
* Accesses the error thrown during an
* [`action`](../../start/framework/route-module#action),
* [`loader`](../../start/framework/route-module#loader),
* or component render to be used in a route module
* [`ErrorBoundary`](../../start/framework/route-module#errorboundary).
*
* @example
* export function ErrorBoundary() {
*   const error = useRouteError();
*   return <div>{error.message}</div>;
* }
*
* @public
* @category Hooks
* @mode framework
* @mode data
* @returns The error that was thrown during route [loading](../../start/framework/route-module#loader),
* [`action`](../../start/framework/route-module#action) execution, or rendering
*/
function useRouteError() {
	let error = import_react.useContext(RouteErrorContext);
	let state = useDataRouterState$1("useRouteError");
	let routeId = useCurrentRouteId("useRouteError");
	if (error !== void 0) return error;
	return state.errors?.[routeId];
}
function useNavigateStable() {
	let { router } = useDataRouterContext$2("useNavigate");
	let id = useCurrentRouteId("useNavigate");
	let activeRef = import_react.useRef(false);
	import_react.useLayoutEffect(() => {
		activeRef.current = true;
	});
	return import_react.useCallback(async (to, options = {}) => {
		warning(activeRef.current, navigateEffectWarning);
		if (!activeRef.current) return;
		if (typeof to === "number") await router.navigate(to);
		else await router.navigate(to, {
			fromRouteId: id,
			...options
		});
	}, [router, id]);
}
var alreadyWarned$1 = {};
function warningOnce(key, cond, message) {
	if (!cond && !alreadyWarned$1[key]) {
		alreadyWarned$1[key] = true;
		warning(false, message);
	}
}
//#endregion
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/server-runtime/warnings.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var alreadyWarned = {};
function warnOnce(condition, message) {
	if (!condition && !alreadyWarned[message]) {
		alreadyWarned[message] = true;
		console.warn(message);
	}
}
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
import_react.memo(DataRoutes);
function DataRoutes({ routes, manifest, future, state, isStatic, onError }) {
	return useRoutesImpl(routes, void 0, {
		manifest,
		state,
		isStatic,
		onError,
		future
	});
}
/**
* Renders the matching child route of a parent route or nothing if no child
* route matches.
*
* @example
* import { Outlet } from "react-router";
*
* export default function SomeParent() {
*   return (
*     <div>
*       <h1>Parent Content</h1>
*       <Outlet />
*     </div>
*   );
* }
*
* @public
* @category Components
* @param props Props
* @param {OutletProps.context} props.context n/a
* @returns React element for the rendered outlet or `null` if no child route matches.
*/
function Outlet(props) {
	return useOutlet(props.context);
}
/**
* Provides location context for the rest of the app.
*
* Note: You usually won't render a `<Router>` directly. Instead, you'll render a
* router that is more specific to your environment such as a {@link BrowserRouter}
* in web browsers or a {@link ServerRouter} for server rendering.
*
* @public
* @category Declarative Routers
* @mode declarative
* @param props Props
* @param {RouterProps.basename} props.basename n/a
* @param {RouterProps.children} props.children n/a
* @param {RouterProps.location} props.location n/a
* @param {RouterProps.navigationType} props.navigationType n/a
* @param {RouterProps.navigator} props.navigator n/a
* @param {RouterProps.static} props.static n/a
* @param {RouterProps.useTransitions} props.useTransitions n/a
* @returns React element for the rendered router or `null` if the location does
* not match the {@link props.basename}
*/
function Router({ basename: basenameProp = "/", children = null, location: locationProp, navigationType = "POP", navigator, static: staticProp = false, useTransitions }) {
	invariant$1(!useInRouterContext(), "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");
	let basename = basenameProp.replace(/^\/*/, "/");
	let navigationContext = import_react.useMemo(() => ({
		basename,
		navigator,
		static: staticProp,
		useTransitions,
		future: {}
	}), [
		basename,
		navigator,
		staticProp,
		useTransitions
	]);
	if (typeof locationProp === "string") locationProp = parsePath(locationProp);
	let { pathname = "/", search = "", hash = "", state = null, key = "default", mask } = locationProp;
	let locationContext = import_react.useMemo(() => {
		let trailingPathname = stripBasename(pathname, basename);
		if (trailingPathname == null) return null;
		return {
			location: {
				pathname: trailingPathname,
				search,
				hash,
				state,
				key,
				mask
			},
			navigationType
		};
	}, [
		basename,
		pathname,
		search,
		hash,
		state,
		key,
		navigationType,
		mask
	]);
	warning(locationContext != null, `<Router basename="${basename}"> is not able to match the URL "${pathname}${search}${hash}" because it does not start with the basename, so the <Router> won't render anything.`);
	if (locationContext == null) return null;
	return /* @__PURE__ */ import_react.createElement(NavigationContext.Provider, { value: navigationContext }, /* @__PURE__ */ import_react.createElement(LocationContext.Provider, {
		children,
		value: locationContext
	}));
}
import_react.Component;
function useRouteComponentProps() {
	return {
		params: useParams(),
		loaderData: useLoaderData(),
		actionData: useActionData(),
		matches: useMatches()
	};
}
function withComponentProps(Component) {
	return function WithComponentProps() {
		const props = useRouteComponentProps();
		return import_react.createElement(Component, props);
	};
}
function useHydrateFallbackProps() {
	return {
		params: useParams(),
		loaderData: useLoaderData(),
		actionData: useActionData()
	};
}
function withHydrateFallbackProps(HydrateFallback) {
	return function WithHydrateFallbackProps() {
		const props = useHydrateFallbackProps();
		return import_react.createElement(HydrateFallback, props);
	};
}
function useErrorBoundaryProps() {
	return {
		params: useParams(),
		loaderData: useLoaderData(),
		actionData: useActionData(),
		error: useRouteError()
	};
}
function withErrorBoundaryProps(ErrorBoundary) {
	return function WithErrorBoundaryProps() {
		const props = useErrorBoundaryProps();
		return import_react.createElement(ErrorBoundary, props);
	};
}
//#endregion
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/dom/dom.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var defaultEncType = "application/x-www-form-urlencoded";
function isHtmlElement(object) {
	return typeof HTMLElement !== "undefined" && object instanceof HTMLElement;
}
function isButtonElement(object) {
	return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
	return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
	return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function isModifiedEvent(event) {
	return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
	return event.button === 0 && (!target || target === "_self") && !isModifiedEvent(event);
}
var _formDataSupportsSubmitter = null;
function isFormDataSubmitterSupported() {
	if (_formDataSupportsSubmitter === null) try {
		new FormData(document.createElement("form"), 0);
		_formDataSupportsSubmitter = false;
	} catch (e) {
		_formDataSupportsSubmitter = true;
	}
	return _formDataSupportsSubmitter;
}
var supportedFormEncTypes = /* @__PURE__ */ new Set([
	"application/x-www-form-urlencoded",
	"multipart/form-data",
	"text/plain"
]);
function getFormEncType(encType) {
	if (encType != null && !supportedFormEncTypes.has(encType)) {
		warning(false, `"${encType}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${defaultEncType}"`);
		return null;
	}
	return encType;
}
function getFormSubmissionInfo(target, basename) {
	let method;
	let action;
	let encType;
	let formData;
	let body;
	if (isFormElement(target)) {
		let attr = target.getAttribute("action");
		action = attr ? stripBasename(attr, basename) : null;
		method = target.getAttribute("method") || "get";
		encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
		formData = new FormData(target);
	} else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
		let form = target.form;
		if (form == null) throw new Error(`Cannot submit a <button> or <input type="submit"> without a <form>`);
		let attr = target.getAttribute("formaction") || form.getAttribute("action");
		action = attr ? stripBasename(attr, basename) : null;
		method = target.getAttribute("formmethod") || form.getAttribute("method") || "get";
		encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
		formData = new FormData(form, target);
		if (!isFormDataSubmitterSupported()) {
			let { name, type, value } = target;
			if (type === "image") {
				let prefix = name ? `${name}.` : "";
				formData.append(`${prefix}x`, "0");
				formData.append(`${prefix}y`, "0");
			} else if (name) formData.append(name, value);
		}
	} else if (isHtmlElement(target)) throw new Error("Cannot submit element that is not <form>, <button>, or <input type=\"submit|image\">");
	else {
		method = "get";
		action = null;
		encType = defaultEncType;
		body = target;
	}
	if (formData && encType === "text/plain") {
		body = formData;
		formData = void 0;
	}
	return {
		action,
		method: method.toLowerCase(),
		encType,
		formData,
		body
	};
}
//#endregion
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/dom/ssr/invariant.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
function invariant(value, message) {
	if (value === false || value === null || typeof value === "undefined") throw new Error(message);
}
//#endregion
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/dom/ssr/routeModules.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
async function loadRouteModule(route, routeModulesCache) {
	if (route.id in routeModulesCache) return routeModulesCache[route.id];
	try {
		let routeModule = await import(
			/* @vite-ignore */
			/* webpackIgnore: true */
			route.module
);
		routeModulesCache[route.id] = routeModule;
		return routeModule;
	} catch (error) {
		console.error(`Error loading route module \`${route.module}\`, reloading page...`);
		console.error(error);
		if (window.__reactRouterContext && window.__reactRouterContext.isSpaMode && void 0);
		window.location.reload();
		return new Promise(() => {});
	}
}
//#endregion
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/dom/ssr/links.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
/**
* Gets all the links for a set of matches. The modules are assumed to have been
* loaded already.
*/
function getKeyedLinksForMatches(matches, routeModules, manifest) {
	return dedupeLinkDescriptors(matches.map((match) => {
		let module = routeModules[match.route.id];
		let route = manifest.routes[match.route.id];
		return [route && route.css ? route.css.map((href) => ({
			rel: "stylesheet",
			href
		})) : [], module?.links?.() || []];
	}).flat(2), getModuleLinkHrefs(matches, manifest));
}
function isPageLinkDescriptor(object) {
	return object != null && typeof object.page === "string";
}
function isHtmlLinkDescriptor(object) {
	if (object == null) return false;
	if (object.href == null) return object.rel === "preload" && typeof object.imageSrcSet === "string" && typeof object.imageSizes === "string";
	return typeof object.rel === "string" && typeof object.href === "string";
}
async function getKeyedPrefetchLinks(matches, manifest, routeModules) {
	return dedupeLinkDescriptors((await Promise.all(matches.map(async (match) => {
		let route = manifest.routes[match.route.id];
		if (route) {
			let mod = await loadRouteModule(route, routeModules);
			return mod.links ? mod.links() : [];
		}
		return [];
	}))).flat(1).filter(isHtmlLinkDescriptor).filter((link) => link.rel === "stylesheet" || link.rel === "preload").map((link) => link.rel === "stylesheet" ? {
		...link,
		rel: "prefetch",
		as: "style"
	} : {
		...link,
		rel: "prefetch"
	}));
}
function getNewMatchesForLinks(page, nextMatches, currentMatches, manifest, location, mode) {
	let isNew = (match, index) => {
		if (!currentMatches[index]) return true;
		return match.route.id !== currentMatches[index].route.id;
	};
	let matchPathChanged = (match, index) => {
		return currentMatches[index].pathname !== match.pathname || currentMatches[index].route.path?.endsWith("*") && currentMatches[index].params["*"] !== match.params["*"];
	};
	if (mode === "assets") return nextMatches.filter((match, index) => isNew(match, index) || matchPathChanged(match, index));
	if (mode === "data") return nextMatches.filter((match, index) => {
		let manifestRoute = manifest.routes[match.route.id];
		if (!manifestRoute || !manifestRoute.hasLoader) return false;
		if (isNew(match, index) || matchPathChanged(match, index)) return true;
		if (match.route.shouldRevalidate) {
			let routeChoice = match.route.shouldRevalidate({
				currentUrl: new URL(location.pathname + location.search + location.hash, window.origin),
				currentParams: currentMatches[0]?.params || {},
				nextUrl: new URL(page, window.origin),
				nextParams: match.params,
				defaultShouldRevalidate: true
			});
			if (typeof routeChoice === "boolean") return routeChoice;
		}
		return true;
	});
	return [];
}
function getModuleLinkHrefs(matches, manifest, { includeHydrateFallback } = {}) {
	return dedupeHrefs(matches.map((match) => {
		let route = manifest.routes[match.route.id];
		if (!route) return [];
		let hrefs = [route.module];
		if (route.clientActionModule) hrefs = hrefs.concat(route.clientActionModule);
		if (route.clientLoaderModule) hrefs = hrefs.concat(route.clientLoaderModule);
		if (includeHydrateFallback && route.hydrateFallbackModule) hrefs = hrefs.concat(route.hydrateFallbackModule);
		if (route.imports) hrefs = hrefs.concat(route.imports);
		return hrefs;
	}).flat(1));
}
function dedupeHrefs(hrefs) {
	return [...new Set(hrefs)];
}
function sortKeys(obj) {
	let sorted = {};
	let keys = Object.keys(obj).sort();
	for (let key of keys) sorted[key] = obj[key];
	return sorted;
}
function dedupeLinkDescriptors(descriptors, preloads) {
	let set = /* @__PURE__ */ new Set();
	let preloadsSet = new Set(preloads);
	return descriptors.reduce((deduped, descriptor) => {
		if (preloads && !isPageLinkDescriptor(descriptor) && descriptor.as === "script" && descriptor.href && preloadsSet.has(descriptor.href)) return deduped;
		let key = JSON.stringify(sortKeys(descriptor));
		if (!set.has(key)) {
			set.add(key);
			deduped.push({
				key,
				link: descriptor
			});
		}
		return deduped;
	}, []);
}
//#endregion
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/dom/ssr/fallback.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
function RemixRootDefaultHydrateFallback() {
	let { nonce } = useFrameworkContext();
	return /* @__PURE__ */ import_react.createElement(BoundaryShell, {
		title: "Loading...",
		renderScripts: true
	}, null);
}
//#endregion
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/dom/ssr/routes.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
function groupRoutesByParentId(manifest) {
	let routes = {};
	Object.values(manifest).forEach((route) => {
		if (route) {
			let parentId = route.parentId || "";
			if (!routes[parentId]) routes[parentId] = [];
			routes[parentId].push(route);
		}
	});
	return routes;
}
function getRouteComponents(route, routeModule, isSpaMode) {
	let Component = getRouteModuleComponent(routeModule);
	let HydrateFallback = routeModule.HydrateFallback && (!isSpaMode || route.id === "root") ? routeModule.HydrateFallback : route.id === "root" ? RemixRootDefaultHydrateFallback : void 0;
	let ErrorBoundary = routeModule.ErrorBoundary ? routeModule.ErrorBoundary : route.id === "root" ? () => /* @__PURE__ */ import_react.createElement(RemixRootDefaultErrorBoundary, { error: useRouteError() }) : void 0;
	if (route.id === "root" && routeModule.Layout) return {
		...Component ? { element: /* @__PURE__ */ import_react.createElement(routeModule.Layout, null, /* @__PURE__ */ import_react.createElement(Component, null)) } : { Component },
		...ErrorBoundary ? { errorElement: /* @__PURE__ */ import_react.createElement(routeModule.Layout, null, /* @__PURE__ */ import_react.createElement(ErrorBoundary, null)) } : { ErrorBoundary },
		...HydrateFallback ? { hydrateFallbackElement: /* @__PURE__ */ import_react.createElement(routeModule.Layout, null, /* @__PURE__ */ import_react.createElement(HydrateFallback, null)) } : { HydrateFallback }
	};
	return {
		Component,
		ErrorBoundary,
		HydrateFallback
	};
}
function createServerRoutes(manifest, routeModules, future, isSpaMode, parentId = "", routesByParentId = groupRoutesByParentId(manifest), spaModeLazyPromise = Promise.resolve({ Component: () => null })) {
	return (routesByParentId[parentId] || []).map((route) => {
		let routeModule = routeModules[route.id];
		invariant(routeModule, "No `routeModule` available to create server routes");
		let dataRoute = {
			...getRouteComponents(route, routeModule, isSpaMode),
			caseSensitive: route.caseSensitive,
			id: route.id,
			index: route.index,
			path: route.path,
			handle: routeModule.handle,
			lazy: isSpaMode ? () => spaModeLazyPromise : void 0,
			loader: route.hasLoader || route.hasClientLoader ? () => null : void 0
		};
		let children = createServerRoutes(manifest, routeModules, future, isSpaMode, route.id, routesByParentId, spaModeLazyPromise);
		if (children.length > 0) dataRoute.children = children;
		return dataRoute;
	});
}
function getRouteModuleComponent(routeModule) {
	if (routeModule.default == null) return void 0;
	if (!(typeof routeModule.default === "object" && Object.keys(routeModule.default).length === 0)) return routeModule.default;
}
function shouldHydrateRouteLoader(routeId, clientLoader, hasLoader, isSpaMode) {
	return isSpaMode && routeId !== "root" || clientLoader != null && (clientLoader.hydrate === true || hasLoader !== true);
}
//#endregion
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/dom/ssr/components.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
function useDataRouterContext$1() {
	let context = import_react.useContext(DataRouterContext);
	invariant(context, "You must render this element inside a <DataRouterContext.Provider> element");
	return context;
}
function useDataRouterStateContext() {
	let context = import_react.useContext(DataRouterStateContext);
	invariant(context, "You must render this element inside a <DataRouterStateContext.Provider> element");
	return context;
}
var FrameworkContext = import_react.createContext(void 0);
FrameworkContext.displayName = "FrameworkContext";
function useFrameworkContext() {
	let context = import_react.useContext(FrameworkContext);
	invariant(context, "You must render this element inside a <HydratedRouter> element");
	return context;
}
function usePrefetchBehavior(prefetch, theirElementProps) {
	let frameworkContext = import_react.useContext(FrameworkContext);
	let [maybePrefetch, setMaybePrefetch] = import_react.useState(false);
	let [shouldPrefetch, setShouldPrefetch] = import_react.useState(false);
	let { onFocus, onBlur, onMouseEnter, onMouseLeave, onTouchStart } = theirElementProps;
	let ref = import_react.useRef(null);
	import_react.useEffect(() => {
		if (prefetch === "render") setShouldPrefetch(true);
		if (prefetch === "viewport") {
			let callback = (entries) => {
				entries.forEach((entry) => {
					setShouldPrefetch(entry.isIntersecting);
				});
			};
			let observer = new IntersectionObserver(callback, { threshold: .5 });
			if (ref.current) observer.observe(ref.current);
			return () => {
				observer.disconnect();
			};
		}
	}, [prefetch]);
	import_react.useEffect(() => {
		if (maybePrefetch) {
			let id = setTimeout(() => {
				setShouldPrefetch(true);
			}, 100);
			return () => {
				clearTimeout(id);
			};
		}
	}, [maybePrefetch]);
	let setIntent = () => {
		setMaybePrefetch(true);
	};
	let cancelIntent = () => {
		setMaybePrefetch(false);
		setShouldPrefetch(false);
	};
	if (!frameworkContext) return [
		false,
		ref,
		{}
	];
	if (prefetch !== "intent") return [
		shouldPrefetch,
		ref,
		{}
	];
	return [
		shouldPrefetch,
		ref,
		{
			onFocus: composeEventHandlers(onFocus, setIntent),
			onBlur: composeEventHandlers(onBlur, cancelIntent),
			onMouseEnter: composeEventHandlers(onMouseEnter, setIntent),
			onMouseLeave: composeEventHandlers(onMouseLeave, cancelIntent),
			onTouchStart: composeEventHandlers(onTouchStart, setIntent)
		}
	];
}
function composeEventHandlers(theirHandler, ourHandler) {
	return (event) => {
		theirHandler && theirHandler(event);
		if (!event.defaultPrevented) ourHandler(event);
	};
}
function getActiveMatches(matches, errors, isSpaMode) {
	if (isSpaMode && !isHydrated) return [matches[0]];
	if (errors) {
		let errorIdx = matches.findIndex((m) => errors[m.route.id] !== void 0);
		return matches.slice(0, errorIdx + 1);
	}
	return matches;
}
var CRITICAL_CSS_DATA_ATTRIBUTE = "data-react-router-critical-css";
/**
* Renders all the [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)
* tags created by the route module's [`links`](../../start/framework/route-module#links)
* export. You should render it inside the [`<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head)
* of your document.
*
* @example
* import { Links } from "react-router";
*
* export default function Root() {
*   return (
*     <html>
*       <head>
*         <Links />
*       </head>
*       <body></body>
*     </html>
*   );
* }
*
* @public
* @category Components
* @mode framework
* @param props Props
* @param {LinksProps.nonce} props.nonce n/a
* @param {LinksProps.crossOrigin} props.crossOrigin n/a
* @returns A collection of React elements for [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)
* tags
*/
function Links({ nonce, crossOrigin }) {
	let { isSpaMode, manifest, routeModules, criticalCss, nonce: contextNonce } = useFrameworkContext();
	let { errors, matches: routerMatches } = useDataRouterStateContext();
	let matches = getActiveMatches(routerMatches, errors, isSpaMode);
	let keyedLinks = import_react.useMemo(() => getKeyedLinksForMatches(matches, routeModules, manifest), [
		matches,
		routeModules,
		manifest
	]);
	if (nonce == null && contextNonce) nonce = contextNonce;
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, typeof criticalCss === "string" ? /* @__PURE__ */ import_react.createElement("style", {
		[CRITICAL_CSS_DATA_ATTRIBUTE]: "",
		nonce,
		dangerouslySetInnerHTML: { __html: criticalCss }
	}) : null, typeof criticalCss === "object" ? /* @__PURE__ */ import_react.createElement("link", {
		[CRITICAL_CSS_DATA_ATTRIBUTE]: "",
		rel: "stylesheet",
		href: criticalCss.href,
		nonce,
		crossOrigin
	}) : null, keyedLinks.map(({ key, link }) => isPageLinkDescriptor(link) ? /* @__PURE__ */ import_react.createElement(PrefetchPageLinks, {
		key,
		nonce,
		...link,
		crossOrigin: link.crossOrigin ?? crossOrigin
	}) : /* @__PURE__ */ import_react.createElement("link", {
		key,
		nonce,
		...link,
		crossOrigin: link.crossOrigin ?? crossOrigin
	})));
}
/**
* Renders [`<link rel=prefetch|modulepreload>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement/rel)
* tags for modules and data of another page to enable an instant navigation to
* that page. [`<Link prefetch>`](./Link#prefetch) uses this internally, but you
* can render it to prefetch a page for any other reason.
*
* For example, you may render one of this as the user types into a search field
* to prefetch search results before they click through to their selection.
*
* @example
* import { PrefetchPageLinks } from "react-router";
*
* <PrefetchPageLinks page="/absolute/path" />
*
* @public
* @category Components
* @mode framework
* @param props Props
* @param {PageLinkDescriptor.page} props.page n/a
* @param props.linkProps Additional props to spread onto the [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)
* tags, such as [`crossOrigin`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement/crossOrigin),
* [`integrity`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement/integrity),
* [`rel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement/rel),
* etc.
* @returns A collection of React elements for [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)
* tags
*/
function PrefetchPageLinks({ page, ...linkProps }) {
	let rsc = useIsRSCRouterContext();
	let { nonce: contextNonce } = useFrameworkContext();
	let { router } = useDataRouterContext$1();
	let matches = import_react.useMemo(() => matchRoutes(router.routes, page, router.basename), [
		router.routes,
		page,
		router.basename
	]);
	if (!matches) return null;
	if (linkProps.nonce == null && contextNonce) linkProps = {
		...linkProps,
		nonce: contextNonce
	};
	if (rsc) return /* @__PURE__ */ import_react.createElement(RSCPrefetchPageLinksImpl, {
		page,
		matches,
		...linkProps
	});
	return /* @__PURE__ */ import_react.createElement(PrefetchPageLinksImpl, {
		page,
		matches,
		...linkProps
	});
}
function useKeyedPrefetchLinks(matches) {
	let { manifest, routeModules } = useFrameworkContext();
	let [keyedPrefetchLinks, setKeyedPrefetchLinks] = import_react.useState([]);
	import_react.useEffect(() => {
		let interrupted = false;
		getKeyedPrefetchLinks(matches, manifest, routeModules).then((links) => {
			if (!interrupted) setKeyedPrefetchLinks(links);
		});
		return () => {
			interrupted = true;
		};
	}, [
		matches,
		manifest,
		routeModules
	]);
	return keyedPrefetchLinks;
}
function RSCPrefetchPageLinksImpl({ page, matches: nextMatches, ...linkProps }) {
	let location = useLocation();
	let dataHrefs = import_react.useMemo(() => {
		if (page === location.pathname + location.search + location.hash) return [];
		let url = singleFetchUrl(page, "rsc");
		let hasSomeRoutesWithShouldRevalidate = false;
		let targetRoutes = [];
		for (let match of nextMatches) if (typeof match.route.shouldRevalidate === "function") hasSomeRoutesWithShouldRevalidate = true;
		else targetRoutes.push(match.route.id);
		if (hasSomeRoutesWithShouldRevalidate && targetRoutes.length > 0) url.searchParams.set("_routes", targetRoutes.join(","));
		return [url.pathname + url.search];
	}, [
		page,
		location,
		nextMatches
	]);
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, dataHrefs.map((href) => /* @__PURE__ */ import_react.createElement("link", {
		key: href,
		rel: "prefetch",
		as: "fetch",
		href,
		...linkProps
	})));
}
function PrefetchPageLinksImpl({ page, matches: nextMatches, ...linkProps }) {
	let location = useLocation();
	let { manifest, routeModules } = useFrameworkContext();
	let { loaderData, matches } = useDataRouterStateContext();
	let newMatchesForData = import_react.useMemo(() => getNewMatchesForLinks(page, nextMatches, matches, manifest, location, "data"), [
		page,
		nextMatches,
		matches,
		manifest,
		location
	]);
	let newMatchesForAssets = import_react.useMemo(() => getNewMatchesForLinks(page, nextMatches, matches, manifest, location, "assets"), [
		page,
		nextMatches,
		matches,
		manifest,
		location
	]);
	let dataHrefs = import_react.useMemo(() => {
		if (page === location.pathname + location.search + location.hash) return [];
		let routesParams = /* @__PURE__ */ new Set();
		let foundOptOutRoute = false;
		nextMatches.forEach((m) => {
			let manifestRoute = manifest.routes[m.route.id];
			if (!manifestRoute || !manifestRoute.hasLoader) return;
			if (!newMatchesForData.some((m2) => m2.route.id === m.route.id) && m.route.id in loaderData && routeModules[m.route.id]?.shouldRevalidate) foundOptOutRoute = true;
			else if (manifestRoute.hasClientLoader) foundOptOutRoute = true;
			else routesParams.add(m.route.id);
		});
		if (routesParams.size === 0) return [];
		let url = singleFetchUrl(page, "data");
		if (foundOptOutRoute && routesParams.size > 0) url.searchParams.set("_routes", nextMatches.filter((m) => routesParams.has(m.route.id)).map((m) => m.route.id).join(","));
		return [url.pathname + url.search];
	}, [
		loaderData,
		location,
		manifest,
		newMatchesForData,
		nextMatches,
		page,
		routeModules
	]);
	let moduleHrefs = import_react.useMemo(() => getModuleLinkHrefs(newMatchesForAssets, manifest), [newMatchesForAssets, manifest]);
	let keyedPrefetchLinks = useKeyedPrefetchLinks(newMatchesForAssets);
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, dataHrefs.map((href) => /* @__PURE__ */ import_react.createElement("link", {
		key: href,
		rel: "prefetch",
		as: "fetch",
		href,
		...linkProps
	})), moduleHrefs.map((href) => /* @__PURE__ */ import_react.createElement("link", {
		key: href,
		rel: "modulepreload",
		href,
		...linkProps
	})), keyedPrefetchLinks.map(({ key, link }) => /* @__PURE__ */ import_react.createElement("link", {
		key,
		nonce: linkProps.nonce,
		...link,
		crossOrigin: link.crossOrigin ?? linkProps.crossOrigin
	})));
}
/**
* Renders all the [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)
* tags created by the route module's [`meta`](../../start/framework/route-module#meta)
* export. You should render it inside the [`<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head)
* of your document.
*
* @example
* import { Meta } from "react-router";
*
* export default function Root() {
*   return (
*     <html>
*       <head>
*         <Meta />
*       </head>
*     </html>
*   );
* }
*
* @public
* @category Components
* @mode framework
* @returns A collection of React elements for [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)
* tags
*/
function Meta() {
	let { isSpaMode, routeModules } = useFrameworkContext();
	let { errors, matches: routerMatches, loaderData } = useDataRouterStateContext();
	let location = useLocation();
	let _matches = getActiveMatches(routerMatches, errors, isSpaMode);
	let error = null;
	if (errors) error = errors[_matches[_matches.length - 1].route.id];
	let meta = [];
	let leafMeta = null;
	let matches = [];
	for (let i = 0; i < _matches.length; i++) {
		let _match = _matches[i];
		let routeId = _match.route.id;
		let data = loaderData[routeId];
		let params = _match.params;
		let routeModule = routeModules[routeId];
		let routeMeta = [];
		let match = {
			id: routeId,
			loaderData: data,
			meta: [],
			params: _match.params,
			pathname: _match.pathname,
			handle: _match.route.handle,
			error
		};
		matches[i] = match;
		if (routeModule?.meta) routeMeta = typeof routeModule.meta === "function" ? routeModule.meta({
			loaderData: data,
			params,
			location,
			matches,
			error
		}) : Array.isArray(routeModule.meta) ? [...routeModule.meta] : routeModule.meta;
		else if (leafMeta) routeMeta = [...leafMeta];
		routeMeta = routeMeta || [];
		if (!Array.isArray(routeMeta)) throw new Error("The route at " + _match.route.path + " returns an invalid value. All route meta functions must return an array of meta objects.\n\nTo reference the meta function API, see https://reactrouter.com/start/framework/route-module#meta");
		match.meta = routeMeta;
		matches[i] = match;
		meta = [...routeMeta];
		leafMeta = meta;
	}
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, meta.flat().map((metaProps) => {
		if (!metaProps) return null;
		if ("tagName" in metaProps) {
			let { tagName, ...rest } = metaProps;
			if (!isValidMetaTag(tagName)) {
				console.warn(`A meta object uses an invalid tagName: ${tagName}. Expected either 'link' or 'meta'`);
				return null;
			}
			let Comp = tagName;
			return /* @__PURE__ */ import_react.createElement(Comp, {
				key: JSON.stringify(rest),
				...rest
			});
		}
		if ("title" in metaProps) return /* @__PURE__ */ import_react.createElement("title", { key: "title" }, String(metaProps.title));
		if ("charset" in metaProps) {
			metaProps.charSet ??= metaProps.charset;
			delete metaProps.charset;
		}
		if ("charSet" in metaProps && metaProps.charSet != null) return typeof metaProps.charSet === "string" ? /* @__PURE__ */ import_react.createElement("meta", {
			key: "charSet",
			charSet: metaProps.charSet
		}) : null;
		if ("script:ld+json" in metaProps) try {
			let json = JSON.stringify(metaProps["script:ld+json"]);
			return /* @__PURE__ */ import_react.createElement("script", {
				key: `script:ld+json:${json}`,
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: escapeHtml(json) }
			});
		} catch (e) {
			return null;
		}
		return /* @__PURE__ */ import_react.createElement("meta", {
			key: JSON.stringify(metaProps),
			...metaProps
		});
	}));
}
function isValidMetaTag(tagName) {
	return typeof tagName === "string" && /^(meta|link)$/.test(tagName);
}
/**
* Tracks whether hydration is finished, so scripts can be skipped
* during client-side updates.
*/
var isHydrated = false;
function setIsHydrated() {
	isHydrated = true;
}
/**
* Renders the client runtime of your app. It should be rendered inside the
* [`<body>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body)
*  of the document.
*
* If server rendering, you can omit `<Scripts/>` and the app will work as a
* traditional web app without JavaScript, relying solely on HTML and browser
* behaviors.
*
* @example
* import { Scripts } from "react-router";
*
* export default function Root() {
*   return (
*     <html>
*       <head />
*       <body>
*         <Scripts />
*       </body>
*     </html>
*   );
* }
*
* @public
* @category Components
* @mode framework
* @param scriptProps Additional props to spread onto the [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
* tags, such as [`crossOrigin`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/crossOrigin),
* [`nonce`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/nonce),
* etc.
* @returns A collection of React elements for [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
* tags
*/
function Scripts(scriptProps) {
	let { manifest, serverHandoffString, isSpaMode, renderMeta, routeDiscovery, ssr, nonce: contextNonce } = useFrameworkContext();
	let { router, static: isStatic, staticContext } = useDataRouterContext$1();
	let { matches: routerMatches } = useDataRouterStateContext();
	let isRSCRouterContext = useIsRSCRouterContext();
	let enableFogOfWar = isFogOfWarEnabled(routeDiscovery, ssr);
	if (scriptProps.nonce == null && contextNonce) scriptProps = {
		...scriptProps,
		nonce: contextNonce
	};
	if (renderMeta) renderMeta.didRenderScripts = true;
	let matches = getActiveMatches(routerMatches, null, isSpaMode);
	import_react.useEffect(() => {
		setIsHydrated();
	}, []);
	let initialScripts = import_react.useMemo(() => {
		if (isRSCRouterContext) return null;
		let contextScript = staticContext ? `window.__reactRouterContext = ${serverHandoffString};window.__reactRouterContext.stream = new ReadableStream({start(controller){window.__reactRouterContext.streamController = controller;}}).pipeThrough(new TextEncoderStream());` : " ";
		let routeModulesScript = !isStatic ? " " : `${manifest.hmr?.runtime ? `import ${JSON.stringify(manifest.hmr.runtime)};` : ""}${!enableFogOfWar ? `import ${JSON.stringify(manifest.url)}` : ""};
${matches.map((match, routeIndex) => {
			let routeVarName = `route${routeIndex}`;
			let manifestEntry = manifest.routes[match.route.id];
			invariant(manifestEntry, `Route ${match.route.id} not found in manifest`);
			let { clientActionModule, clientLoaderModule, clientMiddlewareModule, hydrateFallbackModule, module } = manifestEntry;
			let chunks = [
				...clientActionModule ? [{
					module: clientActionModule,
					varName: `${routeVarName}_clientAction`
				}] : [],
				...clientLoaderModule ? [{
					module: clientLoaderModule,
					varName: `${routeVarName}_clientLoader`
				}] : [],
				...clientMiddlewareModule ? [{
					module: clientMiddlewareModule,
					varName: `${routeVarName}_clientMiddleware`
				}] : [],
				...hydrateFallbackModule ? [{
					module: hydrateFallbackModule,
					varName: `${routeVarName}_HydrateFallback`
				}] : [],
				{
					module,
					varName: `${routeVarName}_main`
				}
			];
			if (chunks.length === 1) return `import * as ${routeVarName} from ${JSON.stringify(module)};`;
			return [chunks.map((chunk) => `import * as ${chunk.varName} from "${chunk.module}";`).join("\n"), `const ${routeVarName} = {${chunks.map((chunk) => `...${chunk.varName}`).join(",")}};`].join("\n");
		}).join("\n")}
  ${enableFogOfWar ? `window.__reactRouterManifest = ${JSON.stringify(getPartialManifest(manifest, router), null, 2)};` : ""}
  window.__reactRouterRouteModules = {${matches.map((match, index) => `${JSON.stringify(match.route.id)}:route${index}`).join(",")}};

import(${JSON.stringify(manifest.entry.module)});`;
		return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, /* @__PURE__ */ import_react.createElement("script", {
			...scriptProps,
			suppressHydrationWarning: true,
			dangerouslySetInnerHTML: { __html: contextScript },
			type: void 0
		}), /* @__PURE__ */ import_react.createElement("script", {
			...scriptProps,
			suppressHydrationWarning: true,
			dangerouslySetInnerHTML: { __html: routeModulesScript },
			type: "module",
			async: true
		}));
	}, []);
	let preloads = isHydrated || isRSCRouterContext ? [] : [...new Set(manifest.entry.imports.concat(getModuleLinkHrefs(matches, manifest, { includeHydrateFallback: true })))];
	let sri = typeof manifest.sri === "object" ? manifest.sri : {};
	warnOnce(!isRSCRouterContext, "The <Scripts /> element is a no-op when using RSC and can be safely removed.");
	return isHydrated || isRSCRouterContext ? null : /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, typeof manifest.sri === "object" ? /* @__PURE__ */ import_react.createElement("script", {
		...scriptProps,
		"rr-importmap": "",
		type: "importmap",
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: JSON.stringify({ integrity: sri }) }
	}) : null, !enableFogOfWar ? /* @__PURE__ */ import_react.createElement("link", {
		rel: "modulepreload",
		href: manifest.url,
		crossOrigin: scriptProps.crossOrigin,
		integrity: sri[manifest.url],
		nonce: scriptProps.nonce,
		suppressHydrationWarning: true
	}) : null, /* @__PURE__ */ import_react.createElement("link", {
		rel: "modulepreload",
		href: manifest.entry.module,
		crossOrigin: scriptProps.crossOrigin,
		integrity: sri[manifest.entry.module],
		nonce: scriptProps.nonce,
		suppressHydrationWarning: true
	}), preloads.map((path) => /* @__PURE__ */ import_react.createElement("link", {
		key: path,
		rel: "modulepreload",
		href: path,
		crossOrigin: scriptProps.crossOrigin,
		integrity: sri[path],
		nonce: scriptProps.nonce,
		suppressHydrationWarning: true
	})), initialScripts);
}
function mergeRefs(...refs) {
	return (value) => {
		refs.forEach((ref) => {
			if (typeof ref === "function") ref(value);
			else if (ref != null) ref.current = value;
		});
	};
}
//#endregion
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/dom/ssr/errorBoundaries.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var RemixErrorBoundary = class extends import_react.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: props.error || null,
			location: props.location
		};
	}
	static getDerivedStateFromError(error) {
		return { error };
	}
	static getDerivedStateFromProps(props, state) {
		if (state.location !== props.location) return {
			error: props.error || null,
			location: props.location
		};
		return {
			error: props.error || state.error,
			location: state.location
		};
	}
	render() {
		if (this.state.error) return /* @__PURE__ */ import_react.createElement(RemixRootDefaultErrorBoundary, {
			error: this.state.error,
			isOutsideRemixApp: true
		});
		else return this.props.children;
	}
};
/**
* When app's don't provide a root level ErrorBoundary, we default to this.
*/
function RemixRootDefaultErrorBoundary({ error, isOutsideRemixApp }) {
	let { nonce } = useFrameworkContext();
	console.error(error);
	let heyDeveloper = /* @__PURE__ */ import_react.createElement("script", {
		nonce,
		dangerouslySetInnerHTML: { __html: `
        console.log(
          "💿 Hey developer 👋. You can provide a way better UX than this when your app throws errors. Check out https://reactrouter.com/how-to/error-boundary for more information."
        );
      ` }
	});
	if (isRouteErrorResponse(error)) return /* @__PURE__ */ import_react.createElement(BoundaryShell, { title: "Unhandled Thrown Response!" }, /* @__PURE__ */ import_react.createElement("h1", { style: { fontSize: "24px" } }, error.status, " ", error.statusText), null);
	let errorInstance;
	if (error instanceof Error) errorInstance = error;
	else {
		let errorString = error == null ? "Unknown Error" : typeof error === "object" && "toString" in error ? error.toString() : JSON.stringify(error);
		errorInstance = new Error(errorString);
	}
	return /* @__PURE__ */ import_react.createElement(BoundaryShell, {
		title: "Application Error!",
		isOutsideRemixApp
	}, /* @__PURE__ */ import_react.createElement("h1", { style: { fontSize: "24px" } }, "Application Error"), /* @__PURE__ */ import_react.createElement("pre", { style: {
		padding: "2rem",
		background: "hsla(10, 50%, 50%, 0.1)",
		color: "red",
		overflow: "auto"
	} }, errorInstance.stack), heyDeveloper);
}
function BoundaryShell({ title, renderScripts, isOutsideRemixApp, children }) {
	let { routeModules } = useFrameworkContext();
	if (routeModules.root?.Layout && !isOutsideRemixApp) return children;
	return /* @__PURE__ */ import_react.createElement("html", { lang: "en" }, /* @__PURE__ */ import_react.createElement("head", null, /* @__PURE__ */ import_react.createElement("meta", { charSet: "utf-8" }), /* @__PURE__ */ import_react.createElement("meta", {
		name: "viewport",
		content: "width=device-width,initial-scale=1,viewport-fit=cover"
	}), /* @__PURE__ */ import_react.createElement("title", null, title)), /* @__PURE__ */ import_react.createElement("body", null, /* @__PURE__ */ import_react.createElement("main", { style: {
		fontFamily: "system-ui, sans-serif",
		padding: "2rem"
	} }, children, renderScripts ? /* @__PURE__ */ import_react.createElement(Scripts, null) : null)));
}
//#endregion
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/dom/lib.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
try {
	if (isBrowser) window.__reactRouterVersion = "8.3.0";
} catch (e) {}
/**
* A declarative {@link Router | `<Router>`} that accepts a pre-instantiated
* `history` object.
* It's important to note that using your own `history` object is highly discouraged
* and may add two versions of the `history` library to your bundles unless you use
* the same version of the `history` library that React Router uses internally.
*
* @name unstable_HistoryRouter
* @public
* @category Declarative Routers
* @mode declarative
* @param props Props
* @param {HistoryRouterProps.basename} props.basename n/a
* @param {HistoryRouterProps.children} props.children n/a
* @param {HistoryRouterProps.history} props.history n/a
* @param {HistoryRouterProps.useTransitions} props.useTransitions n/a
* @returns A declarative {@link Router | `<Router>`} using the provided history
* implementation for client-side routing.
*/
function HistoryRouter({ basename, children, history, useTransitions }) {
	let [state, setStateImpl] = import_react.useState({
		action: history.action,
		location: history.location
	});
	let setState = import_react.useCallback((newState) => {
		if (useTransitions === false) setStateImpl(newState);
		else import_react.startTransition(() => setStateImpl(newState));
	}, [useTransitions]);
	import_react.useLayoutEffect(() => history.listen(setState), [history, setState]);
	return /* @__PURE__ */ import_react.createElement(Router, {
		basename,
		children,
		location: state.location,
		navigationType: state.action,
		navigator: history,
		useTransitions
	});
}
HistoryRouter.displayName = "unstable_HistoryRouter";
/**
* A progressively enhanced [`<a href>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
* wrapper to enable navigation with client-side routing.
*
* @example
* import { Link } from "react-router";
*
* <Link to="/dashboard">Dashboard</Link>;
*
* <Link
*   to={{
*     pathname: "/some/path",
*     search: "?query=string",
*     hash: "#hash",
*   }}
* />;
*
* @public
* @category Components
* @param {LinkProps.discover} props.discover [modes: framework] n/a
* @param {LinkProps.prefetch} props.prefetch [modes: framework] n/a
* @param {LinkProps.preventScrollReset} props.preventScrollReset [modes: framework, data] n/a
* @param {LinkProps.relative} props.relative n/a
* @param {LinkProps.reloadDocument} props.reloadDocument n/a
* @param {LinkProps.replace} props.replace n/a
* @param {LinkProps.state} props.state n/a
* @param {LinkProps.to} props.to n/a
* @param {LinkProps.viewTransition} props.viewTransition [modes: framework, data] n/a
* @param {LinkProps.defaultShouldRevalidate} props.defaultShouldRevalidate n/a
* @param {LinkProps.mask} props.mask [modes: framework, data] n/a
*/
var Link = import_react.forwardRef(function LinkWithRef({ onClick, discover = "render", prefetch = "none", relative, reloadDocument, replace, mask, state, target, to, preventScrollReset, viewTransition, defaultShouldRevalidate, ...rest }, forwardedRef) {
	let { basename, navigator, useTransitions } = import_react.useContext(NavigationContext);
	let isAbsolute = typeof to === "string" && ABSOLUTE_URL_REGEX.test(to);
	let parsed = parseToInfo(to, basename);
	to = parsed.to;
	let href = useHref(to, { relative });
	let location = useLocation();
	let maskedHref = null;
	if (mask) {
		let resolved = resolveTo(mask, [], location.mask ? location.mask.pathname : "/", true);
		if (basename !== "/") resolved.pathname = resolved.pathname === "/" ? basename : joinPaths([basename, resolved.pathname]);
		maskedHref = navigator.createHref(resolved);
	}
	let [shouldPrefetch, prefetchRef, prefetchHandlers] = usePrefetchBehavior(prefetch, rest);
	let internalOnClick = useLinkClickHandler(to, {
		replace,
		mask,
		state,
		target,
		preventScrollReset,
		relative,
		viewTransition,
		defaultShouldRevalidate,
		useTransitions
	});
	function handleClick(event) {
		if (onClick) onClick(event);
		if (!event.defaultPrevented) internalOnClick(event);
	}
	let isSpaLink = !(parsed.isExternal || reloadDocument);
	let link = /* @__PURE__ */ import_react.createElement("a", {
		...rest,
		...prefetchHandlers,
		href: (isSpaLink ? maskedHref : void 0) || parsed.absoluteURL || href,
		onClick: isSpaLink ? handleClick : onClick,
		ref: mergeRefs(forwardedRef, prefetchRef),
		target,
		"data-discover": !isAbsolute && discover === "render" ? "true" : void 0
	});
	return shouldPrefetch && !isAbsolute ? /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, link, /* @__PURE__ */ import_react.createElement(PrefetchPageLinks, { page: href })) : link;
});
Link.displayName = "Link";
/**
* Wraps {@link Link | `<Link>`} with additional props for styling active and
* pending states.
*
* - Automatically applies classes to the link based on its `active` and `pending`
* states, see {@link NavLinkProps.className}
*   - Note that `pending` is only available with Framework and Data modes.
* - Automatically applies `aria-current="page"` to the link when the link is active.
* See [`aria-current`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current)
* on MDN.
* - States are additionally available through the className, style, and children
* render props. See {@link NavLinkRenderProps}.
*
* @example
* <NavLink to="/message">Messages</NavLink>
*
* // Using render props
* <NavLink
*   to="/messages"
*   className={({ isActive, isPending }) =>
*     isPending ? "pending" : isActive ? "active" : ""
*   }
* >
*   Messages
* </NavLink>
*
* @public
* @category Components
* @param {NavLinkProps.caseSensitive} props.caseSensitive n/a
* @param {NavLinkProps.children} props.children n/a
* @param {NavLinkProps.className} props.className n/a
* @param {NavLinkProps.discover} props.discover [modes: framework] n/a
* @param {NavLinkProps.end} props.end n/a
* @param {NavLinkProps.prefetch} props.prefetch [modes: framework] n/a
* @param {NavLinkProps.preventScrollReset} props.preventScrollReset [modes: framework, data] n/a
* @param {NavLinkProps.relative} props.relative n/a
* @param {NavLinkProps.reloadDocument} props.reloadDocument n/a
* @param {NavLinkProps.replace} props.replace n/a
* @param {NavLinkProps.state} props.state n/a
* @param {NavLinkProps.style} props.style n/a
* @param {NavLinkProps.to} props.to n/a
* @param {NavLinkProps.viewTransition} props.viewTransition [modes: framework, data] n/a
*/
var NavLink = import_react.forwardRef(function NavLinkWithRef({ "aria-current": ariaCurrentProp = "page", caseSensitive = false, className: classNameProp = "", end = false, style: styleProp, to, viewTransition, children, ...rest }, ref) {
	let path = useResolvedPath(to, { relative: rest.relative });
	let location = useLocation();
	let routerState = import_react.useContext(DataRouterStateContext);
	let { navigator, basename } = import_react.useContext(NavigationContext);
	let isTransitioning = routerState != null && useViewTransitionState(path) && viewTransition === true;
	let toPathname = navigator.encodeLocation ? navigator.encodeLocation(path).pathname : path.pathname;
	let locationPathname = location.pathname;
	let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
	if (!caseSensitive) {
		locationPathname = locationPathname.toLowerCase();
		nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
		toPathname = toPathname.toLowerCase();
	}
	if (nextLocationPathname && basename) nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
	const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
	let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
	let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(endSlashPosition) === "/");
	let renderProps = {
		isActive,
		isPending,
		isTransitioning
	};
	let ariaCurrent = isActive ? ariaCurrentProp : void 0;
	let className;
	if (typeof classNameProp === "function") className = classNameProp(renderProps);
	else className = [
		classNameProp,
		isActive ? "active" : null,
		isPending ? "pending" : null,
		isTransitioning ? "transitioning" : null
	].filter(Boolean).join(" ");
	let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
	return /* @__PURE__ */ import_react.createElement(Link, {
		...rest,
		"aria-current": ariaCurrent,
		className,
		ref,
		style,
		to,
		viewTransition
	}, typeof children === "function" ? children(renderProps) : children);
});
NavLink.displayName = "NavLink";
/**
* A progressively enhanced HTML [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
* that submits data to actions via [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch),
* activating pending states in {@link useNavigation} which enables advanced
* user interfaces beyond a basic HTML [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form).
* After a form's `action` completes, all data on the page is automatically
* revalidated to keep the UI in sync with the data.
*
* Because it uses the HTML form API, server rendered pages are interactive at a
* basic level before JavaScript loads. Instead of React Router managing the
* submission, the browser manages the submission as well as the pending states
* (like the spinning favicon). After JavaScript loads, React Router takes over
* enabling web application user experiences.
*
* `Form` is most useful for submissions that should also change the URL or
* otherwise add an entry to the browser history stack. For forms that shouldn't
* manipulate the browser [`History`](https://developer.mozilla.org/en-US/docs/Web/API/History)
* stack, use {@link FetcherWithComponents.Form | `<fetcher.Form>`}.
*
* @example
* import { Form } from "react-router";
*
* function NewEvent() {
*   return (
*     <Form action="/events" method="post">
*       <input name="title" type="text" />
*       <input name="description" type="text" />
*     </Form>
*   );
* }
*
* @public
* @category Components
* @mode framework
* @mode data
* @param {FormProps.action} action n/a
* @param {FormProps.discover} discover n/a
* @param {FormProps.encType} encType n/a
* @param {FormProps.fetcherKey} fetcherKey n/a
* @param {FormProps.method} method n/a
* @param {FormProps.navigate} navigate n/a
* @param {FormProps.preventScrollReset} preventScrollReset n/a
* @param {FormProps.relative} relative n/a
* @param {FormProps.reloadDocument} reloadDocument n/a
* @param {FormProps.replace} replace n/a
* @param {FormProps.state} state n/a
* @param {FormProps.viewTransition} viewTransition n/a
* @param {FormProps.defaultShouldRevalidate} defaultShouldRevalidate n/a
* @returns A progressively enhanced [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) component
*/
var Form = import_react.forwardRef(({ discover = "render", fetcherKey, navigate, reloadDocument, replace, state, method = "get", action, onSubmit, relative, preventScrollReset, viewTransition, defaultShouldRevalidate, ...props }, forwardedRef) => {
	let { useTransitions } = import_react.useContext(NavigationContext);
	let submit = useSubmit();
	let formAction = useFormAction(action, { relative });
	let formMethod = method.toLowerCase() === "get" ? "get" : "post";
	let isAbsolute = typeof action === "string" && ABSOLUTE_URL_REGEX.test(action);
	let submitHandler = (event) => {
		onSubmit && onSubmit(event);
		if (event.defaultPrevented) return;
		event.preventDefault();
		let submitter = event.nativeEvent.submitter;
		let submitMethod = submitter?.getAttribute("formmethod") || method;
		let doSubmit = () => submit(submitter || event.currentTarget, {
			fetcherKey,
			method: submitMethod,
			navigate,
			replace,
			state,
			relative,
			preventScrollReset,
			viewTransition,
			defaultShouldRevalidate
		});
		if (useTransitions && navigate !== false) import_react.startTransition(() => doSubmit());
		else doSubmit();
	};
	return /* @__PURE__ */ import_react.createElement("form", {
		ref: forwardedRef,
		method: formMethod,
		action: formAction,
		onSubmit: reloadDocument ? onSubmit : submitHandler,
		...props,
		"data-discover": !isAbsolute && discover === "render" ? "true" : void 0
	});
});
Form.displayName = "Form";
/**
* Emulates the browser's scroll restoration on location changes. Apps should only render one of these, right before the {@link Scripts} component.
*
* ```tsx
* import { ScrollRestoration } from "react-router";
*
* export default function Root() {
*   return (
*     <html>
*       <body>
*         <ScrollRestoration />
*         <Scripts />
*       </body>
*     </html>
*   );
* }
* ```
*
* This component renders an inline `<script>` to prevent scroll flashing. The
* `nonce` prop will be passed down to the script tag to allow CSP nonce usage.
* If not provided in Framework Mode, it will default to any
* {@link ServerRouter | `<ServerRouter nonce>`} prop.
*
* ```tsx
* <ScrollRestoration nonce={cspNonce} />
* ```
*
* @public
* @category Components
* @mode framework
* @mode data
* @param props Props
* @param {ScrollRestorationProps.getKey} props.getKey n/a
* @param {ScriptsProps.nonce} props.nonce n/a
* @param {ScrollRestorationProps.storageKey} props.storageKey n/a
* @returns A [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
* tag that restores scroll positions on navigation.
*/
function ScrollRestoration({ getKey, storageKey, ...props }) {
	let remixContext = import_react.useContext(FrameworkContext);
	let { basename } = import_react.useContext(NavigationContext);
	let location = useLocation();
	let matches = useMatches();
	useScrollRestoration({
		getKey,
		storageKey
	});
	let ssrKey = import_react.useMemo(() => {
		if (!remixContext || !getKey) return null;
		let userKey = getScrollRestorationKey(location, matches, basename, getKey);
		return userKey !== location.key ? userKey : null;
	}, []);
	if (!remixContext || remixContext.isSpaMode) return null;
	let restoreScroll = ((storageKey, restoreKey) => {
		if (!window.history.state || !window.history.state.key) {
			let key = Math.random().toString(32).slice(2);
			window.history.replaceState({ key }, "");
		}
		try {
			let storedY = JSON.parse(sessionStorage.getItem(storageKey) || "{}")[restoreKey || window.history.state.key];
			if (typeof storedY === "number") window.scrollTo(0, storedY);
		} catch (error) {
			console.error(error);
			sessionStorage.removeItem(storageKey);
		}
	}).toString();
	if (props.nonce == null && remixContext?.nonce) props.nonce = remixContext.nonce;
	return /* @__PURE__ */ import_react.createElement("script", {
		...props,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: `(${restoreScroll})(${escapeHtml(JSON.stringify(storageKey || SCROLL_RESTORATION_STORAGE_KEY))}, ${escapeHtml(JSON.stringify(ssrKey))})` }
	});
}
ScrollRestoration.displayName = "ScrollRestoration";
function getDataRouterConsoleError(hookName) {
	return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext(hookName) {
	let ctx = import_react.useContext(DataRouterContext);
	invariant$1(ctx, getDataRouterConsoleError(hookName));
	return ctx;
}
function useDataRouterState(hookName) {
	let state = import_react.useContext(DataRouterStateContext);
	invariant$1(state, getDataRouterConsoleError(hookName));
	return state;
}
/**
* Handles the click behavior for router {@link Link | `<Link>`} components.This
* is useful if you need to create custom {@link Link | `<Link>`} components with
* the same click behavior we use in our exported {@link Link | `<Link>`}.
*
* @public
* @category Hooks
* @param to The URL to navigate to, can be a string or a partial {@link Path}.
* @param options Options
* @param options.preventScrollReset Whether to prevent the scroll position from
* being reset to the top of the viewport on completion of the navigation when
* using the {@link ScrollRestoration} component. Defaults to `false`.
* @param options.relative The {@link RelativeRoutingType | relative routing type}
* to use for the link. Defaults to `"route"`.
* @param options.replace Whether to replace the current [`History`](https://developer.mozilla.org/en-US/docs/Web/API/History)
* entry instead of pushing a new one. Defaults to `false`.
* @param options.state The state to add to the [`History`](https://developer.mozilla.org/en-US/docs/Web/API/History)
* entry for this navigation. Defaults to `undefined`.
* @param options.target The target attribute for the link. Defaults to `undefined`.
* @param options.viewTransition Enables a [View Transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
* for this navigation. To apply specific styles during the transition, see
* {@link useViewTransitionState}. Defaults to `false`.
* @param options.defaultShouldRevalidate Specify the default revalidation
* behavior for the navigation. When not specified, loaders revalidate
* according to the router's standard revalidation behavior.
* @param options.mask Masked location to display in the browser instead
* of the router location. Defaults to `undefined`.
* @param options.useTransitions Wraps the navigation in
* [`React.startTransition`](https://react.dev/reference/react/startTransition)
* for concurrent rendering. Defaults to `false`.
* @returns A click handler function that can be used in a custom {@link Link} component.
*/
function useLinkClickHandler(to, { target, replace: replaceProp, mask, state, preventScrollReset, relative, viewTransition, defaultShouldRevalidate, useTransitions } = {}) {
	let navigate = useNavigate();
	let location = useLocation();
	let path = useResolvedPath(to, { relative });
	return import_react.useCallback((event) => {
		if (shouldProcessLinkClick(event, target)) {
			event.preventDefault();
			let replace = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
			let doNavigate = () => navigate(to, {
				replace,
				mask,
				state,
				preventScrollReset,
				relative,
				viewTransition,
				defaultShouldRevalidate
			});
			if (useTransitions) import_react.startTransition(() => doNavigate());
			else doNavigate();
		}
	}, [
		location,
		navigate,
		path,
		replaceProp,
		mask,
		state,
		target,
		to,
		preventScrollReset,
		relative,
		viewTransition,
		defaultShouldRevalidate,
		useTransitions
	]);
}
var fetcherId = 0;
var getUniqueFetcherId = () => `__${String(++fetcherId)}__`;
/**
* The imperative version of {@link Form | `<Form>`} that lets you submit a form
* from code instead of a user interaction.
*
* @example
* import { useSubmit } from "react-router";
*
* function SomeComponent() {
*   const submit = useSubmit();
*   return (
*     <Form onChange={(event) => submit(event.currentTarget)} />
*   );
* }
*
* @public
* @category Hooks
* @mode framework
* @mode data
* @returns A function that can be called to submit a {@link Form} imperatively.
*/
function useSubmit() {
	let { router } = useDataRouterContext("useSubmit");
	let { basename } = import_react.useContext(NavigationContext);
	let currentRouteId = useRouteId();
	let routerFetch = router.fetch;
	let routerNavigate = router.navigate;
	return import_react.useCallback(async (target, options = {}) => {
		let { action, method, encType, formData, body } = getFormSubmissionInfo(target, basename);
		if (options.navigate === false) await routerFetch(options.fetcherKey || getUniqueFetcherId(), currentRouteId, options.action || action, {
			defaultShouldRevalidate: options.defaultShouldRevalidate,
			preventScrollReset: options.preventScrollReset,
			formData,
			body,
			formMethod: options.method || method,
			formEncType: options.encType || encType,
			flushSync: options.flushSync
		});
		else await routerNavigate(options.action || action, {
			defaultShouldRevalidate: options.defaultShouldRevalidate,
			preventScrollReset: options.preventScrollReset,
			formData,
			body,
			formMethod: options.method || method,
			formEncType: options.encType || encType,
			replace: options.replace,
			state: options.state,
			fromRouteId: currentRouteId,
			flushSync: options.flushSync,
			viewTransition: options.viewTransition
		});
	}, [
		routerFetch,
		routerNavigate,
		basename,
		currentRouteId
	]);
}
/**
* Resolves the URL to the closest route in the component hierarchy instead of
* the current URL of the app.
*
* This is used internally by {@link Form} to resolve the `action` to the closest
* route, but can be used generically as well.
*
* ```ts
* import { useFormAction } from "react-router";
*
* function SomeComponent() {
*   // closest route URL
*   let action = useFormAction();
*
*   // closest route URL + "destroy"
*   let destroyAction = useFormAction("destroy");
* }
* ```
*
* <docs-info>This hook adds a `basename` if your app specifies one, so that it
* can be used with raw `<form>` elements in a progressively enhanced way.  If
* you are using this to provide an `action` to `<Form>` or `fetcher.submit`, you
* will need to remove the `basename` since both of those will prepend it
* internally.</docs-info>
*
*
* @public
* @category Hooks
* @mode framework
* @mode data
* @param action The action to append to the closest route URL. Defaults to the
* closest route URL.
* @param options Options
* @param options.relative The relative routing type to use when resolving the
* action. Defaults to `"route"`.
* @returns The resolved action URL.
*/
function useFormAction(action, { relative } = {}) {
	let { basename } = import_react.useContext(NavigationContext);
	let routeContext = import_react.useContext(RouteContext);
	invariant$1(routeContext, "useFormAction must be used inside a RouteContext");
	let [match] = routeContext.matches.slice(-1);
	let path = { ...useResolvedPath(action ? action : ".", { relative }) };
	let location = useLocation();
	if (action == null) {
		path.search = location.search;
		let params = new URLSearchParams(path.search);
		let indexValues = params.getAll("index");
		if (indexValues.some((v) => v === "")) {
			params.delete("index");
			indexValues.filter((v) => v).forEach((v) => params.append("index", v));
			let qs = params.toString();
			path.search = qs ? `?${qs}` : "";
		}
	}
	if ((!action || action === ".") && match.route.index) path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
	if (basename !== "/") path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
	return createPath(path);
}
var SCROLL_RESTORATION_STORAGE_KEY = "react-router-scroll-positions";
var savedScrollPositions = {};
function getScrollRestorationKey(location, matches, basename, getKey) {
	let key = null;
	if (getKey) if (basename !== "/") key = getKey({
		...location,
		pathname: stripBasename(location.pathname, basename) || location.pathname
	}, matches);
	else key = getKey(location, matches);
	if (key == null) key = location.key;
	return key;
}
/**
* When rendered inside a {@link RouterProvider}, will restore scroll positions
* on navigations
*
* <!--
* Not marked `@public` because we only export as UNSAFE_ and therefore we don't
* maintain an .md file for this hook
* -->
*
* @name UNSAFE_useScrollRestoration
* @category Hooks
* @mode framework
* @mode data
* @param options Options
* @param options.getKey A function that returns a key to use for scroll restoration.
* This is useful for custom scroll restoration logic, such as using only the pathname
* so that subsequent navigations to prior paths will restore the scroll. Defaults
* to `location.key`.
* @param options.storageKey The key to use for storing scroll positions in
* `sessionStorage`. Defaults to `"react-router-scroll-positions"`.
* @returns {void}
*/
function useScrollRestoration({ getKey, storageKey } = {}) {
	let { router } = useDataRouterContext("useScrollRestoration");
	let { restoreScrollPosition, preventScrollReset } = useDataRouterState("useScrollRestoration");
	let { basename } = import_react.useContext(NavigationContext);
	let location = useLocation();
	let matches = useMatches();
	let navigation = useNavigation();
	import_react.useEffect(() => {
		window.history.scrollRestoration = "manual";
		return () => {
			window.history.scrollRestoration = "auto";
		};
	}, []);
	usePageHide(import_react.useCallback(() => {
		if (navigation.state === "idle") {
			let key = getScrollRestorationKey(location, matches, basename, getKey);
			savedScrollPositions[key] = window.scrollY;
		}
		try {
			sessionStorage.setItem(storageKey || SCROLL_RESTORATION_STORAGE_KEY, JSON.stringify(savedScrollPositions));
		} catch (error) {
			warning(false, `Failed to save scroll positions in sessionStorage, <ScrollRestoration /> will not work properly (${error}).`);
		}
		window.history.scrollRestoration = "auto";
	}, [
		navigation.state,
		getKey,
		basename,
		location,
		matches,
		storageKey
	]));
	if (typeof document !== "undefined") {
		import_react.useLayoutEffect(() => {
			try {
				let sessionPositions = sessionStorage.getItem(storageKey || SCROLL_RESTORATION_STORAGE_KEY);
				if (sessionPositions) savedScrollPositions = JSON.parse(sessionPositions);
			} catch (e) {}
		}, [storageKey]);
		import_react.useLayoutEffect(() => {
			let disableScrollRestoration = router?.enableScrollRestoration(savedScrollPositions, () => window.scrollY, getKey ? (location, matches) => getScrollRestorationKey(location, matches, basename, getKey) : void 0);
			return () => disableScrollRestoration && disableScrollRestoration();
		}, [
			router,
			basename,
			getKey
		]);
		import_react.useLayoutEffect(() => {
			if (restoreScrollPosition === false) return;
			if (typeof restoreScrollPosition === "number") {
				window.scrollTo(0, restoreScrollPosition);
				return;
			}
			try {
				if (location.hash) {
					let el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
					if (el) {
						el.scrollIntoView();
						return;
					}
				}
			} catch {
				warning(false, `"${location.hash.slice(1)}" is not a decodable element ID. The view will not scroll to it.`);
			}
			if (preventScrollReset === true) return;
			window.scrollTo(0, 0);
		}, [
			location,
			restoreScrollPosition,
			preventScrollReset
		]);
	}
}
function usePageHide(callback, options) {
	let { capture } = options || {};
	import_react.useEffect(() => {
		let opts = capture != null ? { capture } : void 0;
		window.addEventListener("pagehide", callback, opts);
		return () => {
			window.removeEventListener("pagehide", callback, opts);
		};
	}, [callback, capture]);
}
/**
* This hook returns `true` when there is an active [View Transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
* and the specified location matches either side of the navigation (the URL you are
* navigating **to** or the URL you are navigating **from**). This can be used to apply finer-grained styles to
* elements to further customize the view transition. This requires that view
* transitions have been enabled for the given navigation via {@link LinkProps.viewTransition}
* (or the `Form`, `submit`, or `navigate` call)
*
* @public
* @category Hooks
* @mode framework
* @mode data
* @param to The {@link To} location to compare against the active transition's current
* and next URLs.
* @param options Options
* @param options.relative The relative routing type to use when resolving the
* `to` location, defaults to `"route"`. See {@link RelativeRoutingType} for
* more details.
* @returns `true` if there is an active [View Transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
* and the resolved path matches the transition's destination or source pathname, otherwise `false`.
*/
function useViewTransitionState(to, { relative } = {}) {
	let vtContext = import_react.useContext(ViewTransitionContext);
	invariant$1(vtContext != null, "`useViewTransitionState` must be used within `react-router/dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");
	let { basename } = useDataRouterContext("useViewTransitionState");
	let path = useResolvedPath(to, { relative });
	if (!vtContext.isTransitioning) return false;
	let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
	let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
	return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}
//#endregion
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/dom/server.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
/**
* A {@link DataRouter} that may not navigate to any other {@link Location}.
* This is useful on the server where there is no stateful UI.
*
* @example
* export async function handleRequest(request: Request) {
*   let { query, dataRoutes } = createStaticHandler(routes);
*   let context = await query(request));
*
*   if (context instanceof Response) {
*     return context;
*   }
*
*   let router = createStaticRouter(dataRoutes, context);
*   return new Response(
*     ReactDOMServer.renderToString(<StaticRouterProvider ... />),
*     { headers: { "Content-Type": "text/html" } }
*   );
* }
*
* @public
* @category Data Routers
* @mode data
* @param props Props
* @param {StaticRouterProviderProps.context} props.context n/a
* @param {StaticRouterProviderProps.hydrate} props.hydrate n/a
* @param {StaticRouterProviderProps.nonce} props.nonce n/a
* @param {StaticRouterProviderProps.router} props.router n/a
* @returns A React element that renders the static router provider
*/
function StaticRouterProvider({ context, router, hydrate = true, nonce }) {
	invariant$1(router && context, "You must provide `router` and `context` to <StaticRouterProvider>");
	let dataRouterContext = {
		router,
		navigator: getStatelessNavigator(),
		static: true,
		staticContext: context,
		basename: context.basename || "/"
	};
	let fetchersContext = /* @__PURE__ */ new Map();
	let hydrateScript = "";
	if (hydrate !== false) {
		let data = {
			loaderData: context.loaderData,
			actionData: context.actionData,
			errors: serializeErrors(context.errors)
		};
		hydrateScript = `window.__staticRouterHydrationData = JSON.parse(${escapeHtml(JSON.stringify(JSON.stringify(data)))});`;
	}
	let { state } = dataRouterContext.router;
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, /* @__PURE__ */ import_react.createElement(DataRouterContext.Provider, { value: dataRouterContext }, /* @__PURE__ */ import_react.createElement(DataRouterStateContext.Provider, { value: state }, /* @__PURE__ */ import_react.createElement(FetchersContext.Provider, { value: fetchersContext }, /* @__PURE__ */ import_react.createElement(ViewTransitionContext.Provider, { value: { isTransitioning: false } }, /* @__PURE__ */ import_react.createElement(Router, {
		basename: dataRouterContext.basename,
		location: state.location,
		navigationType: state.historyAction,
		navigator: dataRouterContext.navigator,
		static: dataRouterContext.static,
		useTransitions: false
	}, /* @__PURE__ */ import_react.createElement(DataRoutes, {
		manifest: router.manifest,
		routes: router.routes,
		future: router.future,
		state,
		isStatic: true
	})))))), hydrateScript ? /* @__PURE__ */ import_react.createElement("script", {
		suppressHydrationWarning: true,
		nonce,
		dangerouslySetInnerHTML: { __html: hydrateScript }
	}) : null);
}
function serializeErrors(errors) {
	if (!errors) return null;
	let entries = Object.entries(errors);
	let serialized = {};
	for (let [key, val] of entries) if (isRouteErrorResponse(val)) serialized[key] = {
		...val,
		__type: "RouteErrorResponse"
	};
	else if (val instanceof Error) serialized[key] = {
		message: val.message,
		__type: "Error",
		...val.name !== "Error" ? { __subType: val.name } : {}
	};
	else serialized[key] = val;
	return serialized;
}
function getStatelessNavigator() {
	return {
		createHref,
		encodeLocation,
		push(to) {
			throw new Error(`You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)})\` somewhere in your app.`);
		},
		replace(to) {
			throw new Error(`You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere in your app.`);
		},
		go(delta) {
			throw new Error(`You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${delta})\` somewhere in your app.`);
		},
		back() {
			throw new Error("You cannot use navigator.back() on the server because it is a stateless environment.");
		},
		forward() {
			throw new Error("You cannot use navigator.forward() on the server because it is a stateless environment.");
		}
	};
}
/**
* Create a static {@link DataRouter} for server-side rendering
*
* @example
* export async function handleRequest(request: Request) {
*   let { query, dataRoutes } = createStaticHandler(routes);
*   let context = await query(request);
*
*   if (context instanceof Response) {
*     return context;
*   }
*
*   let router = createStaticRouter(dataRoutes, context);
*   return new Response(
*     ReactDOMServer.renderToString(<StaticRouterProvider ... />),
*     { headers: { "Content-Type": "text/html" } }
*   );
* }
*
* @public
* @category Data Routers
* @mode data
* @param routes The route objects to create a static {@link DataRouter} for
* @param context The {@link StaticHandlerContext} returned from {@link StaticHandler}'s
* `query`
* @param opts Options
* @param opts.future Future flags for the static {@link DataRouter}
* @param opts.branches Optional pre-computed route branches
* @returns A static {@link DataRouter} that can be used to render the provided routes
*/
function createStaticRouter(routes, context, opts = {}) {
	let manifest = {};
	let dataRoutes = convertRoutesToDataRoutes(routes, void 0, void 0, manifest);
	let matches = context.matches.map((match) => {
		let route = manifest[match.route.id] || match.route;
		return {
			...match,
			route
		};
	});
	let msg = (method) => `You cannot use router.${method}() on the server because it is a stateless environment`;
	return {
		get basename() {
			return context.basename;
		},
		get future() {
			return { ...opts?.future };
		},
		get state() {
			return {
				historyAction: "POP",
				location: context.location,
				matches,
				loaderData: context.loaderData,
				actionData: context.actionData,
				errors: context.errors,
				initialized: true,
				renderFallback: false,
				navigation: IDLE_NAVIGATION,
				restoreScrollPosition: null,
				preventScrollReset: false,
				revalidation: "idle",
				fetchers: /* @__PURE__ */ new Map(),
				blockers: /* @__PURE__ */ new Map()
			};
		},
		get routes() {
			return dataRoutes;
		},
		get branches() {
			return opts.branches;
		},
		get manifest() {
			return manifest;
		},
		get window() {},
		initialize() {
			throw msg("initialize");
		},
		subscribe() {
			throw msg("subscribe");
		},
		enableScrollRestoration() {
			throw msg("enableScrollRestoration");
		},
		navigate() {
			throw msg("navigate");
		},
		fetch() {
			throw msg("fetch");
		},
		revalidate() {
			throw msg("revalidate");
		},
		createHref,
		encodeLocation,
		getFetcher() {
			return IDLE_FETCHER;
		},
		deleteFetcher() {
			throw msg("deleteFetcher");
		},
		resetFetcher() {
			throw msg("resetFetcher");
		},
		dispose() {
			throw msg("dispose");
		},
		getBlocker() {
			return IDLE_BLOCKER;
		},
		deleteBlocker() {
			throw msg("deleteBlocker");
		},
		patchRoutes() {
			throw msg("patchRoutes");
		},
		_internalFetchControllers: /* @__PURE__ */ new Map(),
		_internalSetRoutes() {
			throw msg("_internalSetRoutes");
		},
		_internalSetStateDoNotUseOrYouWillBreakYourApp() {
			throw msg("_internalSetStateDoNotUseOrYouWillBreakYourApp");
		}
	};
}
function createHref(to) {
	return typeof to === "string" ? to : createPath(to);
}
function encodeLocation(to) {
	let href = typeof to === "string" ? to : createPath(to);
	href = href.replace(/ $/, "%20");
	let encoded = ABSOLUTE_URL_REGEX.test(href) ? new URL(href) : new URL(href, "http://localhost");
	return {
		pathname: encoded.pathname,
		search: encoded.search,
		hash: encoded.hash
	};
}
//#endregion
//#region node_modules/.pnpm/react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/react-router/dist/production/lib/dom/ssr/server.js
/**
* react-router v8.3.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
/**
* The server entry point for a React Router app in Framework Mode. This
* component is used to generate the HTML in the response from the server. See
* [`entry.server.tsx`](../framework-conventions/entry.server.tsx).
*
* @public
* @category Framework Routers
* @mode framework
* @param props Props
* @param {ServerRouterProps.context} props.context n/a
* @param {ServerRouterProps.nonce} props.nonce n/a
* @param {ServerRouterProps.url} props.url n/a
* @returns A React element that represents the server-rendered application.
*/
function ServerRouter({ context, url, nonce }) {
	if (typeof url === "string") url = new URL(url);
	let { manifest, routeModules, criticalCss, serverHandoffString } = context;
	let routes = createServerRoutes(manifest.routes, routeModules, context.future, context.isSpaMode);
	context.staticHandlerContext.loaderData = { ...context.staticHandlerContext.loaderData };
	for (let match of context.staticHandlerContext.matches) {
		let routeId = match.route.id;
		let route = routeModules[routeId];
		let manifestRoute = context.manifest.routes[routeId];
		if (route && manifestRoute && shouldHydrateRouteLoader(routeId, route.clientLoader, manifestRoute.hasLoader, context.isSpaMode) && (route.HydrateFallback || !manifestRoute.hasLoader)) delete context.staticHandlerContext.loaderData[routeId];
	}
	let router = createStaticRouter(routes, context.staticHandlerContext, { branches: context.branches });
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, /* @__PURE__ */ import_react.createElement(FrameworkContext.Provider, { value: {
		manifest,
		routeModules,
		criticalCss,
		serverHandoffString,
		future: context.future,
		ssr: context.ssr,
		isSpaMode: context.isSpaMode,
		routeDiscovery: context.routeDiscovery,
		nonce,
		serializeError: context.serializeError,
		renderMeta: context.renderMeta
	} }, /* @__PURE__ */ import_react.createElement(RemixErrorBoundary, { location: router.state.location }, /* @__PURE__ */ import_react.createElement(StaticRouterProvider, {
		router,
		context: context.staticHandlerContext,
		hydrate: false
	}))), context.serverHandoffStream ? /* @__PURE__ */ import_react.createElement(import_react.Suspense, null, /* @__PURE__ */ import_react.createElement(StreamTransfer, {
		context,
		identifier: 0,
		reader: context.serverHandoffStream.getReader(),
		textDecoder: new TextDecoder(),
		nonce
	})) : null);
}
//#endregion
//#region node_modules/.pnpm/isbot@5.2.1/node_modules/isbot/index.mjs
var fullPattern = " daum[ /]| deusu/|(?:^|[^g])news(?!sapphire)|(?<! channel/|google/)google(?!(?:wv|app|/google| pixel))|(?<! cu)bots?(?:\\b|_)|(?<!cam)scan|(?<!lib)http|24x7|;\\s\\w+;$|@[a-z][\\w-]+\\.|\\(\\)|\\.com\\b|\\b\\w+\\.ai|\\bbw/|\\bdlc\\b|\\bort/|\\bperl\\b|\\btime/|\\||^[<\\(;]|^[\\w \\.\\-\\(?:\\):%]+(?:/v?\\d+(?:\\.\\d+)?(?:\\.\\d{1,10})*?)?(?:,|$)|^[\\w\\-]+/[\\w]+$|^[^ ]{50,}$|^\\d+\\b|^\\w*search\\b|^\\w+/[\\w\\(\\)]*$|^\\w+/\\d\\.\\d\\s\\([\\w@]+\\)$|^active|^ad muncher|^amaya|^apache/|^avsdevicesdk/|^azure|^biglotron|^blackbox exporter|^bot|^clamav[ /]|^claude-code/|^client/|^cobweb/|^custom|^ddg[_-]android|^discourse|^dispatch/\\d|^downcast/|^duckduckgo|^email|^exodusmovement|^facebook|^getright/|^gozilla/|^hobbit|^hotzonu|^hwcdn/|^igetter/|^jeode/|^jetty/|^jigsaw|^microsoft bits|^movabletype|^mozilla/\\d\\.\\d\\s[\\w\\.-]+$|^mozilla/\\d\\.\\d\\s\\((?:compatible;)?(?:\\s?[\\w\\d-.]+\\/\\d+\\.\\d+)?\\)$|^navermailapp|^netsurf|^offline|^openai/|^owler|^php|^postman|^ps_daily/|^python|^rank|^read|^reed|^remove\\.bg/|^rest|^rss|^snapchat|^sora |^space bison|^stape/|^svn|^swcd |^taringa|^thumbor/|^track|^w3c|^webbandit/|^webcopier|^wget|^whatsapp|^wordpress|^xenu link sleuth|^yahoo|^yandex|^zdm/\\d|^zoom marketplace/|abuse|advisor|agent\\b|analyzer|archive|ask jeeves/teoma|attracta|audit|bluecoat drtr|browsex|burpcollaborator|capture|catch|check\\b|checker|chrome-lighthouse|chromeframe|classifier|cloudflare|collapsify\\b|convertify|cookiehubverify/|crawl|cursor/|cypress/|dareboost|datanyze|dejaclick|detect|discovery|dmbrowser|download|exaleadcloudview|feed|fetcher|firephp|foregenix|functionize|grab|hardenize\\b|headless|hotjar|httrack|hubspot marketing grader|ibisbrowser|infrawatch|insight|inspect|iplabel|java(?!;)|library|linkcheck|linktiger|mail\\.ru/|manager|manus-user/|marketgoo/|measure|monitor\\b|neustar wpm|node\\b|nutch|offbyone|openvas|optimize|pageburst|pagespeed|parser|phantomjs|pingdom|playwright|powermarks|preview|productfinder|prospectingstudio|proxy|ptst[ /]\\d|radar|readable/|retriever|rexx;|rigor|rss\\b|scrape|securityheaders|selenium|server|silktide|sindup/|sogou|sparkler/|speedcurve|spider|splash|statuscake|supercleaner|synapse|synthetic|testlocally|tools|torrent|transcoder|upday/|url|validator|virtuoso|wappalyzer|watchtowr|webglance|webkit2png|whatcms/|xtate/";
var naivePattern = /bot|crawl|http|lighthouse|scan|search|spider/i;
var pattern;
function getPattern() {
	if (pattern instanceof RegExp) return pattern;
	try {
		pattern = new RegExp(fullPattern, "i");
	} catch (error) {
		pattern = naivePattern;
	}
	return pattern;
}
var isNonEmptyString = (value) => typeof value === "string" && value !== "";
function isBot(userAgent) {
	return isNonEmptyString(userAgent) && getPattern().test(userAgent);
}
var isbot = isBot;
//#endregion
//#region node_modules/.pnpm/react-dom@19.2.8_react@19.2.8/node_modules/react-dom/cjs/react-dom.production.js
/**
* @license React
* react-dom.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_dom_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	function formatProdErrorMessage(code) {
		var url = "https://react.dev/errors/" + code;
		if (1 < arguments.length) {
			url += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var i = 2; i < arguments.length; i++) url += "&args[]=" + encodeURIComponent(arguments[i]);
		}
		return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function noop() {}
	var Internals = {
		d: {
			f: noop,
			r: function() {
				throw Error(formatProdErrorMessage(522));
			},
			D: noop,
			C: noop,
			L: noop,
			m: noop,
			X: noop,
			S: noop,
			M: noop
		},
		p: 0,
		findDOMNode: null
	};
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	function createPortal$1(children, containerInfo, implementation) {
		var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
		return {
			$$typeof: REACT_PORTAL_TYPE,
			key: null == key ? null : "" + key,
			children,
			containerInfo,
			implementation
		};
	}
	var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function getCrossOriginStringAs(as, input) {
		if ("font" === as) return "";
		if ("string" === typeof input) return "use-credentials" === input ? input : "";
	}
	exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
	exports.createPortal = function(children, container) {
		var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
		if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType) throw Error(formatProdErrorMessage(299));
		return createPortal$1(children, container, null, key);
	};
	exports.flushSync = function(fn) {
		var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
		try {
			if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
		} finally {
			ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
		}
	};
	exports.preconnect = function(href, options) {
		"string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
	};
	exports.prefetchDNS = function(href) {
		"string" === typeof href && Internals.d.D(href);
	};
	exports.preinit = function(href, options) {
		if ("string" === typeof href && options && "string" === typeof options.as) {
			var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
			"style" === as ? Internals.d.S(href, "string" === typeof options.precedence ? options.precedence : void 0, {
				crossOrigin,
				integrity,
				fetchPriority
			}) : "script" === as && Internals.d.X(href, {
				crossOrigin,
				integrity,
				fetchPriority,
				nonce: "string" === typeof options.nonce ? options.nonce : void 0
			});
		}
	};
	exports.preinitModule = function(href, options) {
		if ("string" === typeof href) if ("object" === typeof options && null !== options) {
			if (null == options.as || "script" === options.as) {
				var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
				Internals.d.M(href, {
					crossOrigin,
					integrity: "string" === typeof options.integrity ? options.integrity : void 0,
					nonce: "string" === typeof options.nonce ? options.nonce : void 0
				});
			}
		} else options ?? Internals.d.M(href);
	};
	exports.preload = function(href, options) {
		if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
			var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
			Internals.d.L(href, as, {
				crossOrigin,
				integrity: "string" === typeof options.integrity ? options.integrity : void 0,
				nonce: "string" === typeof options.nonce ? options.nonce : void 0,
				type: "string" === typeof options.type ? options.type : void 0,
				fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
				referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
				imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
				imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
				media: "string" === typeof options.media ? options.media : void 0
			});
		}
	};
	exports.preloadModule = function(href, options) {
		if ("string" === typeof href) if (options) {
			var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
			Internals.d.m(href, {
				as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
				crossOrigin,
				integrity: "string" === typeof options.integrity ? options.integrity : void 0
			});
		} else Internals.d.m(href);
	};
	exports.requestFormReset = function(form) {
		Internals.d.r(form);
	};
	exports.unstable_batchedUpdates = function(fn, a) {
		return fn(a);
	};
	exports.useFormState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useFormState(action, initialState, permalink);
	};
	exports.useFormStatus = function() {
		return ReactSharedInternals.H.useHostTransitionStatus();
	};
	exports.version = "19.2.8";
}));
//#endregion
//#region node_modules/.pnpm/react-dom@19.2.8_react@19.2.8/node_modules/react-dom/index.js
var require_react_dom = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function checkDCE() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") return;
		try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
		} catch (err) {
			console.error(err);
		}
	}
	checkDCE();
	module.exports = require_react_dom_production();
}));
//#endregion
//#region node_modules/.pnpm/react-dom@19.2.8_react@19.2.8/node_modules/react-dom/cjs/react-dom-server.edge.production.js
/**
* @license React
* react-dom-server.edge.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_dom_server_edge_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	var ReactDOM = require_react_dom();
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
	var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
	var REACT_CONTEXT_TYPE = Symbol.for("react.context");
	var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
	var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
	var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
	var REACT_MEMO_TYPE = Symbol.for("react.memo");
	var REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var REACT_SCOPE_TYPE = Symbol.for("react.scope");
	var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
	var REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden");
	var REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel");
	var REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition");
	var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var isArrayImpl = Array.isArray;
	function murmurhash3_32_gc(key, seed) {
		var remainder = key.length & 3;
		var bytes = key.length - remainder;
		var h1 = seed;
		for (seed = 0; seed < bytes;) {
			var k1 = key.charCodeAt(seed) & 255 | (key.charCodeAt(++seed) & 255) << 8 | (key.charCodeAt(++seed) & 255) << 16 | (key.charCodeAt(++seed) & 255) << 24;
			++seed;
			k1 = 3432918353 * (k1 & 65535) + ((3432918353 * (k1 >>> 16) & 65535) << 16) & 4294967295;
			k1 = k1 << 15 | k1 >>> 17;
			k1 = 461845907 * (k1 & 65535) + ((461845907 * (k1 >>> 16) & 65535) << 16) & 4294967295;
			h1 ^= k1;
			h1 = h1 << 13 | h1 >>> 19;
			h1 = 5 * (h1 & 65535) + ((5 * (h1 >>> 16) & 65535) << 16) & 4294967295;
			h1 = (h1 & 65535) + 27492 + (((h1 >>> 16) + 58964 & 65535) << 16);
		}
		k1 = 0;
		switch (remainder) {
			case 3: k1 ^= (key.charCodeAt(seed + 2) & 255) << 16;
			case 2: k1 ^= (key.charCodeAt(seed + 1) & 255) << 8;
			case 1: k1 ^= key.charCodeAt(seed) & 255, k1 = 3432918353 * (k1 & 65535) + ((3432918353 * (k1 >>> 16) & 65535) << 16) & 4294967295, k1 = k1 << 15 | k1 >>> 17, h1 ^= 461845907 * (k1 & 65535) + ((461845907 * (k1 >>> 16) & 65535) << 16) & 4294967295;
		}
		h1 ^= key.length;
		h1 ^= h1 >>> 16;
		h1 = 2246822507 * (h1 & 65535) + ((2246822507 * (h1 >>> 16) & 65535) << 16) & 4294967295;
		h1 ^= h1 >>> 13;
		h1 = 3266489909 * (h1 & 65535) + ((3266489909 * (h1 >>> 16) & 65535) << 16) & 4294967295;
		return (h1 ^ h1 >>> 16) >>> 0;
	}
	function handleErrorInNextTick(error) {
		setTimeout(function() {
			throw error;
		});
	}
	var LocalPromise = Promise;
	var scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : function(callback) {
		LocalPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
	};
	var currentView = null;
	var writtenBytes = 0;
	function writeChunk(destination, chunk) {
		if (0 !== chunk.byteLength) if (2048 < chunk.byteLength) 0 < writtenBytes && (destination.enqueue(new Uint8Array(currentView.buffer, 0, writtenBytes)), currentView = /* @__PURE__ */ new Uint8Array(2048), writtenBytes = 0), destination.enqueue(chunk);
		else {
			var allowableBytes = currentView.length - writtenBytes;
			allowableBytes < chunk.byteLength && (0 === allowableBytes ? destination.enqueue(currentView) : (currentView.set(chunk.subarray(0, allowableBytes), writtenBytes), destination.enqueue(currentView), chunk = chunk.subarray(allowableBytes)), currentView = /* @__PURE__ */ new Uint8Array(2048), writtenBytes = 0);
			currentView.set(chunk, writtenBytes);
			writtenBytes += chunk.byteLength;
		}
	}
	function writeChunkAndReturn(destination, chunk) {
		writeChunk(destination, chunk);
		return !0;
	}
	function completeWriting(destination) {
		currentView && 0 < writtenBytes && (destination.enqueue(new Uint8Array(currentView.buffer, 0, writtenBytes)), currentView = null, writtenBytes = 0);
	}
	var textEncoder = new TextEncoder();
	function stringToChunk(content) {
		return textEncoder.encode(content);
	}
	function stringToPrecomputedChunk(content) {
		return textEncoder.encode(content);
	}
	function byteLengthOfChunk(chunk) {
		return chunk.byteLength;
	}
	function closeWithError(destination, error) {
		"function" === typeof destination.error ? destination.error(error) : destination.close();
	}
	var assign = Object.assign;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var VALID_ATTRIBUTE_NAME_REGEX = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
	var illegalAttributeNameCache = {};
	var validatedAttributeNameCache = {};
	function isAttributeNameSafe(attributeName) {
		if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) return !0;
		if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return !1;
		if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) return validatedAttributeNameCache[attributeName] = !0;
		illegalAttributeNameCache[attributeName] = !0;
		return !1;
	}
	var unitlessNumbers = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	var aliases = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]);
	var matchHtmlRegExp = /["'&<>]/;
	function escapeTextForBrowser(text) {
		if ("boolean" === typeof text || "number" === typeof text || "bigint" === typeof text) return "" + text;
		text = "" + text;
		var match = matchHtmlRegExp.exec(text);
		if (match) {
			var html = "", index, lastIndex = 0;
			for (index = match.index; index < text.length; index++) {
				switch (text.charCodeAt(index)) {
					case 34:
						match = "&quot;";
						break;
					case 38:
						match = "&amp;";
						break;
					case 39:
						match = "&#x27;";
						break;
					case 60:
						match = "&lt;";
						break;
					case 62:
						match = "&gt;";
						break;
					default: continue;
				}
				lastIndex !== index && (html += text.slice(lastIndex, index));
				lastIndex = index + 1;
				html += match;
			}
			text = lastIndex !== index ? html + text.slice(lastIndex, index) : html;
		}
		return text;
	}
	var uppercasePattern = /([A-Z])/g;
	var msPattern = /^ms-/;
	var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function sanitizeURL(url) {
		return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
	}
	var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	var ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	var sharedNotPendingObject = {
		pending: !1,
		data: null,
		method: null,
		action: null
	};
	var previousDispatcher = ReactDOMSharedInternals.d;
	ReactDOMSharedInternals.d = {
		f: previousDispatcher.f,
		r: previousDispatcher.r,
		D: prefetchDNS,
		C: preconnect,
		L: preload,
		m: preloadModule,
		X: preinitScript,
		S: preinitStyle,
		M: preinitModuleScript
	};
	var PRELOAD_NO_CREDS = [];
	var currentlyFlushingRenderState = null;
	stringToPrecomputedChunk("\"></template>");
	var startInlineScript = stringToPrecomputedChunk("<script");
	var endInlineScript = stringToPrecomputedChunk("<\/script>");
	var startScriptSrc = stringToPrecomputedChunk("<script src=\"");
	var startModuleSrc = stringToPrecomputedChunk("<script type=\"module\" src=\"");
	var scriptNonce = stringToPrecomputedChunk(" nonce=\"");
	var scriptIntegirty = stringToPrecomputedChunk(" integrity=\"");
	var scriptCrossOrigin = stringToPrecomputedChunk(" crossorigin=\"");
	var endAsyncScript = stringToPrecomputedChunk(" async=\"\"><\/script>");
	var startInlineStyle = stringToPrecomputedChunk("<style");
	var scriptRegex = /(<\/|<)(s)(cript)/gi;
	function scriptReplacer(match, prefix, s, suffix) {
		return "" + prefix + ("s" === s ? "\\u0073" : "\\u0053") + suffix;
	}
	var importMapScriptStart = stringToPrecomputedChunk("<script type=\"importmap\">");
	var importMapScriptEnd = stringToPrecomputedChunk("<\/script>");
	function createRenderState(resumableState, nonce, externalRuntimeConfig, importMap, onHeaders, maxHeadersLength) {
		externalRuntimeConfig = "string" === typeof nonce ? nonce : nonce && nonce.script;
		var inlineScriptWithNonce = void 0 === externalRuntimeConfig ? startInlineScript : stringToPrecomputedChunk("<script nonce=\"" + escapeTextForBrowser(externalRuntimeConfig) + "\""), nonceStyle = "string" === typeof nonce ? void 0 : nonce && nonce.style, inlineStyleWithNonce = void 0 === nonceStyle ? startInlineStyle : stringToPrecomputedChunk("<style nonce=\"" + escapeTextForBrowser(nonceStyle) + "\""), idPrefix = resumableState.idPrefix, bootstrapChunks = [], bootstrapScriptContent = resumableState.bootstrapScriptContent, bootstrapScripts = resumableState.bootstrapScripts, bootstrapModules = resumableState.bootstrapModules;
		void 0 !== bootstrapScriptContent && (bootstrapChunks.push(inlineScriptWithNonce), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(endOfStartTag, stringToChunk(("" + bootstrapScriptContent).replace(scriptRegex, scriptReplacer)), endInlineScript));
		bootstrapScriptContent = [];
		void 0 !== importMap && (bootstrapScriptContent.push(importMapScriptStart), bootstrapScriptContent.push(stringToChunk(("" + JSON.stringify(importMap)).replace(scriptRegex, scriptReplacer))), bootstrapScriptContent.push(importMapScriptEnd));
		importMap = onHeaders ? {
			preconnects: "",
			fontPreloads: "",
			highImagePreloads: "",
			remainingCapacity: 2 + ("number" === typeof maxHeadersLength ? maxHeadersLength : 2e3)
		} : null;
		onHeaders = {
			placeholderPrefix: stringToPrecomputedChunk(idPrefix + "P:"),
			segmentPrefix: stringToPrecomputedChunk(idPrefix + "S:"),
			boundaryPrefix: stringToPrecomputedChunk(idPrefix + "B:"),
			startInlineScript: inlineScriptWithNonce,
			startInlineStyle: inlineStyleWithNonce,
			preamble: createPreambleState(),
			externalRuntimeScript: null,
			bootstrapChunks,
			importMapChunks: bootstrapScriptContent,
			onHeaders,
			headers: importMap,
			resets: {
				font: {},
				dns: {},
				connect: {
					default: {},
					anonymous: {},
					credentials: {}
				},
				image: {},
				style: {}
			},
			charsetChunks: [],
			viewportChunks: [],
			hoistableChunks: [],
			preconnects: /* @__PURE__ */ new Set(),
			fontPreloads: /* @__PURE__ */ new Set(),
			highImagePreloads: /* @__PURE__ */ new Set(),
			styles: /* @__PURE__ */ new Map(),
			bootstrapScripts: /* @__PURE__ */ new Set(),
			scripts: /* @__PURE__ */ new Set(),
			bulkPreloads: /* @__PURE__ */ new Set(),
			preloads: {
				images: /* @__PURE__ */ new Map(),
				stylesheets: /* @__PURE__ */ new Map(),
				scripts: /* @__PURE__ */ new Map(),
				moduleScripts: /* @__PURE__ */ new Map()
			},
			nonce: {
				script: externalRuntimeConfig,
				style: nonceStyle
			},
			hoistableState: null,
			stylesToHoist: !1
		};
		if (void 0 !== bootstrapScripts) for (importMap = 0; importMap < bootstrapScripts.length; importMap++) idPrefix = bootstrapScripts[importMap], nonceStyle = inlineScriptWithNonce = void 0, inlineStyleWithNonce = {
			rel: "preload",
			as: "script",
			fetchPriority: "low",
			nonce
		}, "string" === typeof idPrefix ? inlineStyleWithNonce.href = maxHeadersLength = idPrefix : (inlineStyleWithNonce.href = maxHeadersLength = idPrefix.src, inlineStyleWithNonce.integrity = nonceStyle = "string" === typeof idPrefix.integrity ? idPrefix.integrity : void 0, inlineStyleWithNonce.crossOrigin = inlineScriptWithNonce = "string" === typeof idPrefix || null == idPrefix.crossOrigin ? void 0 : "use-credentials" === idPrefix.crossOrigin ? "use-credentials" : ""), idPrefix = resumableState, bootstrapScriptContent = maxHeadersLength, idPrefix.scriptResources[bootstrapScriptContent] = null, idPrefix.moduleScriptResources[bootstrapScriptContent] = null, idPrefix = [], pushLinkImpl(idPrefix, inlineStyleWithNonce), onHeaders.bootstrapScripts.add(idPrefix), bootstrapChunks.push(startScriptSrc, stringToChunk(escapeTextForBrowser(maxHeadersLength)), attributeEnd), externalRuntimeConfig && bootstrapChunks.push(scriptNonce, stringToChunk(escapeTextForBrowser(externalRuntimeConfig)), attributeEnd), "string" === typeof nonceStyle && bootstrapChunks.push(scriptIntegirty, stringToChunk(escapeTextForBrowser(nonceStyle)), attributeEnd), "string" === typeof inlineScriptWithNonce && bootstrapChunks.push(scriptCrossOrigin, stringToChunk(escapeTextForBrowser(inlineScriptWithNonce)), attributeEnd), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(endAsyncScript);
		if (void 0 !== bootstrapModules) for (nonce = 0; nonce < bootstrapModules.length; nonce++) nonceStyle = bootstrapModules[nonce], maxHeadersLength = importMap = void 0, inlineScriptWithNonce = {
			rel: "modulepreload",
			fetchPriority: "low",
			nonce: externalRuntimeConfig
		}, "string" === typeof nonceStyle ? inlineScriptWithNonce.href = bootstrapScripts = nonceStyle : (inlineScriptWithNonce.href = bootstrapScripts = nonceStyle.src, inlineScriptWithNonce.integrity = maxHeadersLength = "string" === typeof nonceStyle.integrity ? nonceStyle.integrity : void 0, inlineScriptWithNonce.crossOrigin = importMap = "string" === typeof nonceStyle || null == nonceStyle.crossOrigin ? void 0 : "use-credentials" === nonceStyle.crossOrigin ? "use-credentials" : ""), nonceStyle = resumableState, inlineStyleWithNonce = bootstrapScripts, nonceStyle.scriptResources[inlineStyleWithNonce] = null, nonceStyle.moduleScriptResources[inlineStyleWithNonce] = null, nonceStyle = [], pushLinkImpl(nonceStyle, inlineScriptWithNonce), onHeaders.bootstrapScripts.add(nonceStyle), bootstrapChunks.push(startModuleSrc, stringToChunk(escapeTextForBrowser(bootstrapScripts)), attributeEnd), externalRuntimeConfig && bootstrapChunks.push(scriptNonce, stringToChunk(escapeTextForBrowser(externalRuntimeConfig)), attributeEnd), "string" === typeof maxHeadersLength && bootstrapChunks.push(scriptIntegirty, stringToChunk(escapeTextForBrowser(maxHeadersLength)), attributeEnd), "string" === typeof importMap && bootstrapChunks.push(scriptCrossOrigin, stringToChunk(escapeTextForBrowser(importMap)), attributeEnd), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(endAsyncScript);
		return onHeaders;
	}
	function createResumableState(identifierPrefix, externalRuntimeConfig, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
		return {
			idPrefix: void 0 === identifierPrefix ? "" : identifierPrefix,
			nextFormID: 0,
			streamingFormat: 0,
			bootstrapScriptContent,
			bootstrapScripts,
			bootstrapModules,
			instructions: 0,
			hasBody: !1,
			hasHtml: !1,
			unknownResources: {},
			dnsResources: {},
			connectResources: {
				default: {},
				anonymous: {},
				credentials: {}
			},
			imageResources: {},
			styleResources: {},
			scriptResources: {},
			moduleUnknownResources: {},
			moduleScriptResources: {}
		};
	}
	function createPreambleState() {
		return {
			htmlChunks: null,
			headChunks: null,
			bodyChunks: null
		};
	}
	function createFormatContext(insertionMode, selectedValue, tagScope, viewTransition) {
		return {
			insertionMode,
			selectedValue,
			tagScope,
			viewTransition
		};
	}
	function createRootFormatContext(namespaceURI) {
		return createFormatContext("http://www.w3.org/2000/svg" === namespaceURI ? 4 : "http://www.w3.org/1998/Math/MathML" === namespaceURI ? 5 : 0, null, 0, null);
	}
	function getChildFormatContext(parentContext, type, props) {
		var subtreeScope = parentContext.tagScope & -25;
		switch (type) {
			case "noscript": return createFormatContext(2, null, subtreeScope | 1, null);
			case "select": return createFormatContext(2, null != props.value ? props.value : props.defaultValue, subtreeScope, null);
			case "svg": return createFormatContext(4, null, subtreeScope, null);
			case "picture": return createFormatContext(2, null, subtreeScope | 2, null);
			case "math": return createFormatContext(5, null, subtreeScope, null);
			case "foreignObject": return createFormatContext(2, null, subtreeScope, null);
			case "table": return createFormatContext(6, null, subtreeScope, null);
			case "thead":
			case "tbody":
			case "tfoot": return createFormatContext(7, null, subtreeScope, null);
			case "colgroup": return createFormatContext(9, null, subtreeScope, null);
			case "tr": return createFormatContext(8, null, subtreeScope, null);
			case "head":
				if (2 > parentContext.insertionMode) return createFormatContext(3, null, subtreeScope, null);
				break;
			case "html": if (0 === parentContext.insertionMode) return createFormatContext(1, null, subtreeScope, null);
		}
		return 6 <= parentContext.insertionMode || 2 > parentContext.insertionMode ? createFormatContext(2, null, subtreeScope, null) : parentContext.tagScope !== subtreeScope ? createFormatContext(parentContext.insertionMode, parentContext.selectedValue, subtreeScope, null) : parentContext;
	}
	function getSuspenseViewTransition(parentViewTransition) {
		return null === parentViewTransition ? null : {
			update: parentViewTransition.update,
			enter: "none",
			exit: "none",
			share: parentViewTransition.update,
			name: parentViewTransition.autoName,
			autoName: parentViewTransition.autoName,
			nameIdx: 0
		};
	}
	function getSuspenseFallbackFormatContext(resumableState, parentContext) {
		parentContext.tagScope & 32 && (resumableState.instructions |= 128);
		return createFormatContext(parentContext.insertionMode, parentContext.selectedValue, parentContext.tagScope | 12, getSuspenseViewTransition(parentContext.viewTransition));
	}
	function getSuspenseContentFormatContext(resumableState, parentContext) {
		resumableState = getSuspenseViewTransition(parentContext.viewTransition);
		var subtreeScope = parentContext.tagScope | 16;
		null !== resumableState && "none" !== resumableState.share && (subtreeScope |= 64);
		return createFormatContext(parentContext.insertionMode, parentContext.selectedValue, subtreeScope, resumableState);
	}
	var textSeparator = stringToPrecomputedChunk("<!-- -->");
	function pushTextInstance(target, text, renderState, textEmbedded) {
		if ("" === text) return textEmbedded;
		textEmbedded && target.push(textSeparator);
		target.push(stringToChunk(escapeTextForBrowser(text)));
		return !0;
	}
	var styleNameCache = /* @__PURE__ */ new Map();
	var styleAttributeStart = stringToPrecomputedChunk(" style=\"");
	var styleAssign = stringToPrecomputedChunk(":");
	var styleSeparator = stringToPrecomputedChunk(";");
	function pushStyleAttribute(target, style) {
		if ("object" !== typeof style) throw Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
		var isFirst = !0, styleName;
		for (styleName in style) if (hasOwnProperty.call(style, styleName)) {
			var styleValue = style[styleName];
			if (null != styleValue && "boolean" !== typeof styleValue && "" !== styleValue) {
				if (0 === styleName.indexOf("--")) {
					var nameChunk = stringToChunk(escapeTextForBrowser(styleName));
					styleValue = stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
				} else nameChunk = styleNameCache.get(styleName), void 0 === nameChunk && (nameChunk = stringToPrecomputedChunk(escapeTextForBrowser(styleName.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern, "-ms-"))), styleNameCache.set(styleName, nameChunk)), styleValue = "number" === typeof styleValue ? 0 === styleValue || unitlessNumbers.has(styleName) ? stringToChunk("" + styleValue) : stringToChunk(styleValue + "px") : stringToChunk(escapeTextForBrowser(("" + styleValue).trim()));
				isFirst ? (isFirst = !1, target.push(styleAttributeStart, nameChunk, styleAssign, styleValue)) : target.push(styleSeparator, nameChunk, styleAssign, styleValue);
			}
		}
		isFirst || target.push(attributeEnd);
	}
	var attributeSeparator = stringToPrecomputedChunk(" ");
	var attributeAssign = stringToPrecomputedChunk("=\"");
	var attributeEnd = stringToPrecomputedChunk("\"");
	var attributeEmptyString = stringToPrecomputedChunk("=\"\"");
	function pushBooleanAttribute(target, name, value) {
		value && "function" !== typeof value && "symbol" !== typeof value && target.push(attributeSeparator, stringToChunk(name), attributeEmptyString);
	}
	function pushStringAttribute(target, name, value) {
		"function" !== typeof value && "symbol" !== typeof value && "boolean" !== typeof value && target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
	}
	var actionJavaScriptURL = stringToPrecomputedChunk(escapeTextForBrowser("javascript:throw new Error('React form unexpectedly submitted.')"));
	var startHiddenInputChunk = stringToPrecomputedChunk("<input type=\"hidden\"");
	function pushAdditionalFormField(value, key) {
		this.push(startHiddenInputChunk);
		validateAdditionalFormField(value);
		pushStringAttribute(this, "name", key);
		pushStringAttribute(this, "value", value);
		this.push(endOfStartTagSelfClosing);
	}
	function validateAdditionalFormField(value) {
		if ("string" !== typeof value) throw Error("File/Blob fields are not yet supported in progressive forms. Will fallback to client hydration.");
	}
	function getCustomFormFields(resumableState, formAction) {
		if ("function" === typeof formAction.$$FORM_ACTION) {
			var id = resumableState.nextFormID++;
			resumableState = resumableState.idPrefix + id;
			try {
				var customFields = formAction.$$FORM_ACTION(resumableState);
				if (customFields) customFields.data?.forEach(validateAdditionalFormField);
				return customFields;
			} catch (x) {
				if ("object" === typeof x && null !== x && "function" === typeof x.then) throw x;
			}
		}
		return null;
	}
	function pushFormActionAttribute(target, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name) {
		var formData = null;
		if ("function" === typeof formAction) {
			var customFields = getCustomFormFields(resumableState, formAction);
			null !== customFields ? (name = customFields.name, formAction = customFields.action || "", formEncType = customFields.encType, formMethod = customFields.method, formTarget = customFields.target, formData = customFields.data) : (target.push(attributeSeparator, stringToChunk("formAction"), attributeAssign, actionJavaScriptURL, attributeEnd), formTarget = formMethod = formEncType = formAction = name = null, injectFormReplayingRuntime(resumableState, renderState));
		}
		null != name && pushAttribute(target, "name", name);
		null != formAction && pushAttribute(target, "formAction", formAction);
		null != formEncType && pushAttribute(target, "formEncType", formEncType);
		null != formMethod && pushAttribute(target, "formMethod", formMethod);
		null != formTarget && pushAttribute(target, "formTarget", formTarget);
		return formData;
	}
	function pushAttribute(target, name, value) {
		switch (name) {
			case "className":
				pushStringAttribute(target, "class", value);
				break;
			case "tabIndex":
				pushStringAttribute(target, "tabindex", value);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				pushStringAttribute(target, name, value);
				break;
			case "style":
				pushStyleAttribute(target, value);
				break;
			case "src":
			case "href": if ("" === value) break;
			case "action":
			case "formAction":
				if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) break;
				value = sanitizeURL("" + value);
				target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
				break;
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "ref": break;
			case "autoFocus":
			case "multiple":
			case "muted":
				pushBooleanAttribute(target, name.toLowerCase(), value);
				break;
			case "xlinkHref":
				if ("function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) break;
				value = sanitizeURL("" + value);
				target.push(attributeSeparator, stringToChunk("xlink:href"), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				"function" !== typeof value && "symbol" !== typeof value && target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				value && "function" !== typeof value && "symbol" !== typeof value && target.push(attributeSeparator, stringToChunk(name), attributeEmptyString);
				break;
			case "capture":
			case "download":
				!0 === value ? target.push(attributeSeparator, stringToChunk(name), attributeEmptyString) : !1 !== value && "function" !== typeof value && "symbol" !== typeof value && target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				"function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value && target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
				break;
			case "rowSpan":
			case "start":
				"function" === typeof value || "symbol" === typeof value || isNaN(value) || target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
				break;
			case "xlinkActuate":
				pushStringAttribute(target, "xlink:actuate", value);
				break;
			case "xlinkArcrole":
				pushStringAttribute(target, "xlink:arcrole", value);
				break;
			case "xlinkRole":
				pushStringAttribute(target, "xlink:role", value);
				break;
			case "xlinkShow":
				pushStringAttribute(target, "xlink:show", value);
				break;
			case "xlinkTitle":
				pushStringAttribute(target, "xlink:title", value);
				break;
			case "xlinkType":
				pushStringAttribute(target, "xlink:type", value);
				break;
			case "xmlBase":
				pushStringAttribute(target, "xml:base", value);
				break;
			case "xmlLang":
				pushStringAttribute(target, "xml:lang", value);
				break;
			case "xmlSpace":
				pushStringAttribute(target, "xml:space", value);
				break;
			default: if (!(2 < name.length) || "o" !== name[0] && "O" !== name[0] || "n" !== name[1] && "N" !== name[1]) {
				if (name = aliases.get(name) || name, isAttributeNameSafe(name)) {
					switch (typeof value) {
						case "function":
						case "symbol": return;
						case "boolean":
							var prefix$8 = name.toLowerCase().slice(0, 5);
							if ("data-" !== prefix$8 && "aria-" !== prefix$8) return;
					}
					target.push(attributeSeparator, stringToChunk(name), attributeAssign, stringToChunk(escapeTextForBrowser(value)), attributeEnd);
				}
			}
		}
	}
	var endOfStartTag = stringToPrecomputedChunk(">");
	var endOfStartTagSelfClosing = stringToPrecomputedChunk("/>");
	function pushInnerHTML(target, innerHTML, children) {
		if (null != innerHTML) {
			if (null != children) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
			if ("object" !== typeof innerHTML || !("__html" in innerHTML)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information.");
			innerHTML = innerHTML.__html;
			null !== innerHTML && void 0 !== innerHTML && target.push(stringToChunk("" + innerHTML));
		}
	}
	function flattenOptionChildren(children) {
		var content = "";
		React.Children.forEach(children, function(child) {
			null != child && (content += child);
		});
		return content;
	}
	var selectedMarkerAttribute = stringToPrecomputedChunk(" selected=\"\"");
	var formReplayingRuntimeScript = stringToPrecomputedChunk("addEventListener(\"submit\",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute(\"formAction\");null!=f&&(e=f,b=null)}\"javascript:throw new Error('React form unexpectedly submitted.')\"===e&&(a.preventDefault(),b?(a=document.createElement(\"input\"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});");
	function injectFormReplayingRuntime(resumableState, renderState) {
		if (0 === (resumableState.instructions & 16)) {
			resumableState.instructions |= 16;
			var preamble = renderState.preamble, bootstrapChunks = renderState.bootstrapChunks;
			(preamble.htmlChunks || preamble.headChunks) && 0 === bootstrapChunks.length ? (bootstrapChunks.push(renderState.startInlineScript), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(endOfStartTag, formReplayingRuntimeScript, endInlineScript)) : bootstrapChunks.unshift(renderState.startInlineScript, endOfStartTag, formReplayingRuntimeScript, endInlineScript);
		}
	}
	var formStateMarkerIsMatching = stringToPrecomputedChunk("<!--F!-->");
	var formStateMarkerIsNotMatching = stringToPrecomputedChunk("<!--F-->");
	function pushLinkImpl(target, props) {
		target.push(startChunkForTag("link"));
		for (var propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
				case "dangerouslySetInnerHTML": throw Error("link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push(endOfStartTagSelfClosing);
		return null;
	}
	var styleRegex = /(<\/|<)(s)(tyle)/gi;
	function styleReplacer(match, prefix, s, suffix) {
		return "" + prefix + ("s" === s ? "\\73 " : "\\53 ") + suffix;
	}
	function pushSelfClosing(target, props, tag) {
		target.push(startChunkForTag(tag));
		for (var propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
				case "dangerouslySetInnerHTML": throw Error(tag + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push(endOfStartTagSelfClosing);
		return null;
	}
	function pushTitleImpl(target, props) {
		target.push(startChunkForTag("title"));
		var children = null, innerHTML = null, propKey;
		for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
					children = propValue;
					break;
				case "dangerouslySetInnerHTML":
					innerHTML = propValue;
					break;
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push(endOfStartTag);
		props = Array.isArray(children) ? 2 > children.length ? children[0] : null : children;
		"function" !== typeof props && "symbol" !== typeof props && null !== props && void 0 !== props && target.push(stringToChunk(escapeTextForBrowser("" + props)));
		pushInnerHTML(target, innerHTML, children);
		target.push(endChunkForTag("title"));
		return null;
	}
	var headPreambleContributionChunk = stringToPrecomputedChunk("<!--head-->");
	var bodyPreambleContributionChunk = stringToPrecomputedChunk("<!--body-->");
	var htmlPreambleContributionChunk = stringToPrecomputedChunk("<!--html-->");
	function pushScriptImpl(target, props) {
		target.push(startChunkForTag("script"));
		var children = null, innerHTML = null, propKey;
		for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
					children = propValue;
					break;
				case "dangerouslySetInnerHTML":
					innerHTML = propValue;
					break;
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push(endOfStartTag);
		pushInnerHTML(target, innerHTML, children);
		"string" === typeof children && target.push(stringToChunk(("" + children).replace(scriptRegex, scriptReplacer)));
		target.push(endChunkForTag("script"));
		return null;
	}
	function pushStartSingletonElement(target, props, tag) {
		target.push(startChunkForTag(tag));
		var innerHTML = tag = null, propKey;
		for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
					tag = propValue;
					break;
				case "dangerouslySetInnerHTML":
					innerHTML = propValue;
					break;
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push(endOfStartTag);
		pushInnerHTML(target, innerHTML, tag);
		return tag;
	}
	function pushStartGenericElement(target, props, tag) {
		target.push(startChunkForTag(tag));
		var innerHTML = tag = null, propKey;
		for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
					tag = propValue;
					break;
				case "dangerouslySetInnerHTML":
					innerHTML = propValue;
					break;
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push(endOfStartTag);
		pushInnerHTML(target, innerHTML, tag);
		return "string" === typeof tag ? (target.push(stringToChunk(escapeTextForBrowser(tag))), null) : tag;
	}
	var leadingNewline = stringToPrecomputedChunk("\n");
	var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
	var validatedTagCache = /* @__PURE__ */ new Map();
	function startChunkForTag(tag) {
		var tagStartChunk = validatedTagCache.get(tag);
		if (void 0 === tagStartChunk) {
			if (!VALID_TAG_REGEX.test(tag)) throw Error("Invalid tag: " + tag);
			tagStartChunk = stringToPrecomputedChunk("<" + tag);
			validatedTagCache.set(tag, tagStartChunk);
		}
		return tagStartChunk;
	}
	var doctypeChunk = stringToPrecomputedChunk("<!DOCTYPE html>");
	function pushStartInstance(target$jscomp$0, type, props, resumableState, renderState, preambleState, hoistableState, formatContext, textEmbedded) {
		switch (type) {
			case "div":
			case "span":
			case "svg":
			case "path": break;
			case "a":
				target$jscomp$0.push(startChunkForTag("a"));
				var children = null, innerHTML = null, propKey;
				for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
					var propValue = props[propKey];
					if (null != propValue) switch (propKey) {
						case "children":
							children = propValue;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML = propValue;
							break;
						case "href":
							"" === propValue ? pushStringAttribute(target$jscomp$0, "href", "") : pushAttribute(target$jscomp$0, propKey, propValue);
							break;
						default: pushAttribute(target$jscomp$0, propKey, propValue);
					}
				}
				target$jscomp$0.push(endOfStartTag);
				pushInnerHTML(target$jscomp$0, innerHTML, children);
				if ("string" === typeof children) {
					target$jscomp$0.push(stringToChunk(escapeTextForBrowser(children)));
					var JSCompiler_inline_result = null;
				} else JSCompiler_inline_result = children;
				return JSCompiler_inline_result;
			case "g":
			case "p":
			case "li": break;
			case "select":
				target$jscomp$0.push(startChunkForTag("select"));
				var children$jscomp$0 = null, innerHTML$jscomp$0 = null, propKey$jscomp$0;
				for (propKey$jscomp$0 in props) if (hasOwnProperty.call(props, propKey$jscomp$0)) {
					var propValue$jscomp$0 = props[propKey$jscomp$0];
					if (null != propValue$jscomp$0) switch (propKey$jscomp$0) {
						case "children":
							children$jscomp$0 = propValue$jscomp$0;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$0 = propValue$jscomp$0;
							break;
						case "defaultValue":
						case "value": break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$0, propValue$jscomp$0);
					}
				}
				target$jscomp$0.push(endOfStartTag);
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$0, children$jscomp$0);
				return children$jscomp$0;
			case "option":
				var selectedValue = formatContext.selectedValue;
				target$jscomp$0.push(startChunkForTag("option"));
				var children$jscomp$1 = null, value = null, selected = null, innerHTML$jscomp$1 = null, propKey$jscomp$1;
				for (propKey$jscomp$1 in props) if (hasOwnProperty.call(props, propKey$jscomp$1)) {
					var propValue$jscomp$1 = props[propKey$jscomp$1];
					if (null != propValue$jscomp$1) switch (propKey$jscomp$1) {
						case "children":
							children$jscomp$1 = propValue$jscomp$1;
							break;
						case "selected":
							selected = propValue$jscomp$1;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$1 = propValue$jscomp$1;
							break;
						case "value": value = propValue$jscomp$1;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$1, propValue$jscomp$1);
					}
				}
				if (null != selectedValue) {
					var stringValue = null !== value ? "" + value : flattenOptionChildren(children$jscomp$1);
					if (isArrayImpl(selectedValue)) {
						for (var i = 0; i < selectedValue.length; i++) if ("" + selectedValue[i] === stringValue) {
							target$jscomp$0.push(selectedMarkerAttribute);
							break;
						}
					} else "" + selectedValue === stringValue && target$jscomp$0.push(selectedMarkerAttribute);
				} else selected && target$jscomp$0.push(selectedMarkerAttribute);
				target$jscomp$0.push(endOfStartTag);
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$1, children$jscomp$1);
				return children$jscomp$1;
			case "textarea":
				target$jscomp$0.push(startChunkForTag("textarea"));
				var value$jscomp$0 = null, defaultValue = null, children$jscomp$2 = null, propKey$jscomp$2;
				for (propKey$jscomp$2 in props) if (hasOwnProperty.call(props, propKey$jscomp$2)) {
					var propValue$jscomp$2 = props[propKey$jscomp$2];
					if (null != propValue$jscomp$2) switch (propKey$jscomp$2) {
						case "children":
							children$jscomp$2 = propValue$jscomp$2;
							break;
						case "value":
							value$jscomp$0 = propValue$jscomp$2;
							break;
						case "defaultValue":
							defaultValue = propValue$jscomp$2;
							break;
						case "dangerouslySetInnerHTML": throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
						default: pushAttribute(target$jscomp$0, propKey$jscomp$2, propValue$jscomp$2);
					}
				}
				null === value$jscomp$0 && null !== defaultValue && (value$jscomp$0 = defaultValue);
				target$jscomp$0.push(endOfStartTag);
				if (null != children$jscomp$2) {
					if (null != value$jscomp$0) throw Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
					if (isArrayImpl(children$jscomp$2)) {
						if (1 < children$jscomp$2.length) throw Error("<textarea> can only have at most one child.");
						value$jscomp$0 = "" + children$jscomp$2[0];
					}
					value$jscomp$0 = "" + children$jscomp$2;
				}
				"string" === typeof value$jscomp$0 && "\n" === value$jscomp$0[0] && target$jscomp$0.push(leadingNewline);
				null !== value$jscomp$0 && target$jscomp$0.push(stringToChunk(escapeTextForBrowser("" + value$jscomp$0)));
				return null;
			case "input":
				target$jscomp$0.push(startChunkForTag("input"));
				var name = null, formAction = null, formEncType = null, formMethod = null, formTarget = null, value$jscomp$1 = null, defaultValue$jscomp$0 = null, checked = null, defaultChecked = null, propKey$jscomp$3;
				for (propKey$jscomp$3 in props) if (hasOwnProperty.call(props, propKey$jscomp$3)) {
					var propValue$jscomp$3 = props[propKey$jscomp$3];
					if (null != propValue$jscomp$3) switch (propKey$jscomp$3) {
						case "children":
						case "dangerouslySetInnerHTML": throw Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
						case "name":
							name = propValue$jscomp$3;
							break;
						case "formAction":
							formAction = propValue$jscomp$3;
							break;
						case "formEncType":
							formEncType = propValue$jscomp$3;
							break;
						case "formMethod":
							formMethod = propValue$jscomp$3;
							break;
						case "formTarget":
							formTarget = propValue$jscomp$3;
							break;
						case "defaultChecked":
							defaultChecked = propValue$jscomp$3;
							break;
						case "defaultValue":
							defaultValue$jscomp$0 = propValue$jscomp$3;
							break;
						case "checked":
							checked = propValue$jscomp$3;
							break;
						case "value":
							value$jscomp$1 = propValue$jscomp$3;
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$3, propValue$jscomp$3);
					}
				}
				var formData = pushFormActionAttribute(target$jscomp$0, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name);
				null !== checked ? pushBooleanAttribute(target$jscomp$0, "checked", checked) : null !== defaultChecked && pushBooleanAttribute(target$jscomp$0, "checked", defaultChecked);
				null !== value$jscomp$1 ? pushAttribute(target$jscomp$0, "value", value$jscomp$1) : null !== defaultValue$jscomp$0 && pushAttribute(target$jscomp$0, "value", defaultValue$jscomp$0);
				target$jscomp$0.push(endOfStartTagSelfClosing);
				formData?.forEach(pushAdditionalFormField, target$jscomp$0);
				return null;
			case "button":
				target$jscomp$0.push(startChunkForTag("button"));
				var children$jscomp$3 = null, innerHTML$jscomp$2 = null, name$jscomp$0 = null, formAction$jscomp$0 = null, formEncType$jscomp$0 = null, formMethod$jscomp$0 = null, formTarget$jscomp$0 = null, propKey$jscomp$4;
				for (propKey$jscomp$4 in props) if (hasOwnProperty.call(props, propKey$jscomp$4)) {
					var propValue$jscomp$4 = props[propKey$jscomp$4];
					if (null != propValue$jscomp$4) switch (propKey$jscomp$4) {
						case "children":
							children$jscomp$3 = propValue$jscomp$4;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$2 = propValue$jscomp$4;
							break;
						case "name":
							name$jscomp$0 = propValue$jscomp$4;
							break;
						case "formAction":
							formAction$jscomp$0 = propValue$jscomp$4;
							break;
						case "formEncType":
							formEncType$jscomp$0 = propValue$jscomp$4;
							break;
						case "formMethod":
							formMethod$jscomp$0 = propValue$jscomp$4;
							break;
						case "formTarget":
							formTarget$jscomp$0 = propValue$jscomp$4;
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$4, propValue$jscomp$4);
					}
				}
				var formData$jscomp$0 = pushFormActionAttribute(target$jscomp$0, resumableState, renderState, formAction$jscomp$0, formEncType$jscomp$0, formMethod$jscomp$0, formTarget$jscomp$0, name$jscomp$0);
				target$jscomp$0.push(endOfStartTag);
				formData$jscomp$0?.forEach(pushAdditionalFormField, target$jscomp$0);
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$2, children$jscomp$3);
				if ("string" === typeof children$jscomp$3) {
					target$jscomp$0.push(stringToChunk(escapeTextForBrowser(children$jscomp$3)));
					var JSCompiler_inline_result$jscomp$0 = null;
				} else JSCompiler_inline_result$jscomp$0 = children$jscomp$3;
				return JSCompiler_inline_result$jscomp$0;
			case "form":
				target$jscomp$0.push(startChunkForTag("form"));
				var children$jscomp$4 = null, innerHTML$jscomp$3 = null, formAction$jscomp$1 = null, formEncType$jscomp$1 = null, formMethod$jscomp$1 = null, formTarget$jscomp$1 = null, propKey$jscomp$5;
				for (propKey$jscomp$5 in props) if (hasOwnProperty.call(props, propKey$jscomp$5)) {
					var propValue$jscomp$5 = props[propKey$jscomp$5];
					if (null != propValue$jscomp$5) switch (propKey$jscomp$5) {
						case "children":
							children$jscomp$4 = propValue$jscomp$5;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$3 = propValue$jscomp$5;
							break;
						case "action":
							formAction$jscomp$1 = propValue$jscomp$5;
							break;
						case "encType":
							formEncType$jscomp$1 = propValue$jscomp$5;
							break;
						case "method":
							formMethod$jscomp$1 = propValue$jscomp$5;
							break;
						case "target":
							formTarget$jscomp$1 = propValue$jscomp$5;
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$5, propValue$jscomp$5);
					}
				}
				var formData$jscomp$1 = null, formActionName = null;
				if ("function" === typeof formAction$jscomp$1) {
					var customFields = getCustomFormFields(resumableState, formAction$jscomp$1);
					null !== customFields ? (formAction$jscomp$1 = customFields.action || "", formEncType$jscomp$1 = customFields.encType, formMethod$jscomp$1 = customFields.method, formTarget$jscomp$1 = customFields.target, formData$jscomp$1 = customFields.data, formActionName = customFields.name) : (target$jscomp$0.push(attributeSeparator, stringToChunk("action"), attributeAssign, actionJavaScriptURL, attributeEnd), formTarget$jscomp$1 = formMethod$jscomp$1 = formEncType$jscomp$1 = formAction$jscomp$1 = null, injectFormReplayingRuntime(resumableState, renderState));
				}
				null != formAction$jscomp$1 && pushAttribute(target$jscomp$0, "action", formAction$jscomp$1);
				null != formEncType$jscomp$1 && pushAttribute(target$jscomp$0, "encType", formEncType$jscomp$1);
				null != formMethod$jscomp$1 && pushAttribute(target$jscomp$0, "method", formMethod$jscomp$1);
				null != formTarget$jscomp$1 && pushAttribute(target$jscomp$0, "target", formTarget$jscomp$1);
				target$jscomp$0.push(endOfStartTag);
				null !== formActionName && (target$jscomp$0.push(startHiddenInputChunk), pushStringAttribute(target$jscomp$0, "name", formActionName), target$jscomp$0.push(endOfStartTagSelfClosing), formData$jscomp$1?.forEach(pushAdditionalFormField, target$jscomp$0));
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$3, children$jscomp$4);
				if ("string" === typeof children$jscomp$4) {
					target$jscomp$0.push(stringToChunk(escapeTextForBrowser(children$jscomp$4)));
					var JSCompiler_inline_result$jscomp$1 = null;
				} else JSCompiler_inline_result$jscomp$1 = children$jscomp$4;
				return JSCompiler_inline_result$jscomp$1;
			case "menuitem":
				target$jscomp$0.push(startChunkForTag("menuitem"));
				for (var propKey$jscomp$6 in props) if (hasOwnProperty.call(props, propKey$jscomp$6)) {
					var propValue$jscomp$6 = props[propKey$jscomp$6];
					if (null != propValue$jscomp$6) switch (propKey$jscomp$6) {
						case "children":
						case "dangerouslySetInnerHTML": throw Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
						default: pushAttribute(target$jscomp$0, propKey$jscomp$6, propValue$jscomp$6);
					}
				}
				target$jscomp$0.push(endOfStartTag);
				return null;
			case "object":
				target$jscomp$0.push(startChunkForTag("object"));
				var children$jscomp$5 = null, innerHTML$jscomp$4 = null, propKey$jscomp$7;
				for (propKey$jscomp$7 in props) if (hasOwnProperty.call(props, propKey$jscomp$7)) {
					var propValue$jscomp$7 = props[propKey$jscomp$7];
					if (null != propValue$jscomp$7) switch (propKey$jscomp$7) {
						case "children":
							children$jscomp$5 = propValue$jscomp$7;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$4 = propValue$jscomp$7;
							break;
						case "data":
							var sanitizedValue = sanitizeURL("" + propValue$jscomp$7);
							if ("" === sanitizedValue) break;
							target$jscomp$0.push(attributeSeparator, stringToChunk("data"), attributeAssign, stringToChunk(escapeTextForBrowser(sanitizedValue)), attributeEnd);
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$7, propValue$jscomp$7);
					}
				}
				target$jscomp$0.push(endOfStartTag);
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$4, children$jscomp$5);
				if ("string" === typeof children$jscomp$5) {
					target$jscomp$0.push(stringToChunk(escapeTextForBrowser(children$jscomp$5)));
					var JSCompiler_inline_result$jscomp$2 = null;
				} else JSCompiler_inline_result$jscomp$2 = children$jscomp$5;
				return JSCompiler_inline_result$jscomp$2;
			case "title":
				var noscriptTagInScope = formatContext.tagScope & 1, isFallback = formatContext.tagScope & 4;
				if (4 === formatContext.insertionMode || noscriptTagInScope || null != props.itemProp) var JSCompiler_inline_result$jscomp$3 = pushTitleImpl(target$jscomp$0, props);
				else isFallback ? JSCompiler_inline_result$jscomp$3 = null : (pushTitleImpl(renderState.hoistableChunks, props), JSCompiler_inline_result$jscomp$3 = void 0);
				return JSCompiler_inline_result$jscomp$3;
			case "link":
				var noscriptTagInScope$jscomp$0 = formatContext.tagScope & 1, isFallback$jscomp$0 = formatContext.tagScope & 4, rel = props.rel, href = props.href, precedence = props.precedence;
				if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$0 || null != props.itemProp || "string" !== typeof rel || "string" !== typeof href || "" === href) {
					pushLinkImpl(target$jscomp$0, props);
					var JSCompiler_inline_result$jscomp$4 = null;
				} else if ("stylesheet" === props.rel) if ("string" !== typeof precedence || null != props.disabled || props.onLoad || props.onError) JSCompiler_inline_result$jscomp$4 = pushLinkImpl(target$jscomp$0, props);
				else {
					var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
					if (null !== resourceState) {
						resumableState.styleResources[href] = null;
						styleQueue || (styleQueue = {
							precedence: stringToChunk(escapeTextForBrowser(precedence)),
							rules: [],
							hrefs: [],
							sheets: /* @__PURE__ */ new Map()
						}, renderState.styles.set(precedence, styleQueue));
						var resource = {
							state: 0,
							props: assign({}, props, {
								"data-precedence": props.precedence,
								precedence: null
							})
						};
						if (resourceState) {
							2 === resourceState.length && adoptPreloadCredentials(resource.props, resourceState);
							var preloadResource = renderState.preloads.stylesheets.get(href);
							preloadResource && 0 < preloadResource.length ? preloadResource.length = 0 : resource.state = 1;
						}
						styleQueue.sheets.set(href, resource);
						hoistableState && hoistableState.stylesheets.add(resource);
					} else if (styleQueue) {
						var resource$9 = styleQueue.sheets.get(href);
						resource$9 && hoistableState && hoistableState.stylesheets.add(resource$9);
					}
					textEmbedded && target$jscomp$0.push(textSeparator);
					JSCompiler_inline_result$jscomp$4 = null;
				}
				else props.onLoad || props.onError ? JSCompiler_inline_result$jscomp$4 = pushLinkImpl(target$jscomp$0, props) : (textEmbedded && target$jscomp$0.push(textSeparator), JSCompiler_inline_result$jscomp$4 = isFallback$jscomp$0 ? null : pushLinkImpl(renderState.hoistableChunks, props));
				return JSCompiler_inline_result$jscomp$4;
			case "script":
				var noscriptTagInScope$jscomp$1 = formatContext.tagScope & 1, asyncProp = props.async;
				if ("string" !== typeof props.src || !props.src || !asyncProp || "function" === typeof asyncProp || "symbol" === typeof asyncProp || props.onLoad || props.onError || 4 === formatContext.insertionMode || noscriptTagInScope$jscomp$1 || null != props.itemProp) var JSCompiler_inline_result$jscomp$5 = pushScriptImpl(target$jscomp$0, props);
				else {
					var key = props.src;
					if ("module" === props.type) {
						var resources = resumableState.moduleScriptResources;
						var preloads = renderState.preloads.moduleScripts;
					} else resources = resumableState.scriptResources, preloads = renderState.preloads.scripts;
					var resourceState$jscomp$0 = resources.hasOwnProperty(key) ? resources[key] : void 0;
					if (null !== resourceState$jscomp$0) {
						resources[key] = null;
						var scriptProps = props;
						if (resourceState$jscomp$0) {
							2 === resourceState$jscomp$0.length && (scriptProps = assign({}, props), adoptPreloadCredentials(scriptProps, resourceState$jscomp$0));
							var preloadResource$jscomp$0 = preloads.get(key);
							preloadResource$jscomp$0 && (preloadResource$jscomp$0.length = 0);
						}
						var resource$jscomp$0 = [];
						renderState.scripts.add(resource$jscomp$0);
						pushScriptImpl(resource$jscomp$0, scriptProps);
					}
					textEmbedded && target$jscomp$0.push(textSeparator);
					JSCompiler_inline_result$jscomp$5 = null;
				}
				return JSCompiler_inline_result$jscomp$5;
			case "style":
				var noscriptTagInScope$jscomp$2 = formatContext.tagScope & 1, precedence$jscomp$0 = props.precedence, href$jscomp$0 = props.href, nonce = props.nonce;
				if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$2 || null != props.itemProp || "string" !== typeof precedence$jscomp$0 || "string" !== typeof href$jscomp$0 || "" === href$jscomp$0) {
					target$jscomp$0.push(startChunkForTag("style"));
					var children$jscomp$6 = null, innerHTML$jscomp$5 = null, propKey$jscomp$8;
					for (propKey$jscomp$8 in props) if (hasOwnProperty.call(props, propKey$jscomp$8)) {
						var propValue$jscomp$8 = props[propKey$jscomp$8];
						if (null != propValue$jscomp$8) switch (propKey$jscomp$8) {
							case "children":
								children$jscomp$6 = propValue$jscomp$8;
								break;
							case "dangerouslySetInnerHTML":
								innerHTML$jscomp$5 = propValue$jscomp$8;
								break;
							default: pushAttribute(target$jscomp$0, propKey$jscomp$8, propValue$jscomp$8);
						}
					}
					target$jscomp$0.push(endOfStartTag);
					var child = Array.isArray(children$jscomp$6) ? 2 > children$jscomp$6.length ? children$jscomp$6[0] : null : children$jscomp$6;
					"function" !== typeof child && "symbol" !== typeof child && null !== child && void 0 !== child && target$jscomp$0.push(stringToChunk(("" + child).replace(styleRegex, styleReplacer)));
					pushInnerHTML(target$jscomp$0, innerHTML$jscomp$5, children$jscomp$6);
					target$jscomp$0.push(endChunkForTag("style"));
					var JSCompiler_inline_result$jscomp$6 = null;
				} else {
					var styleQueue$jscomp$0 = renderState.styles.get(precedence$jscomp$0);
					if (null !== (resumableState.styleResources.hasOwnProperty(href$jscomp$0) ? resumableState.styleResources[href$jscomp$0] : void 0)) {
						resumableState.styleResources[href$jscomp$0] = null;
						styleQueue$jscomp$0 || (styleQueue$jscomp$0 = {
							precedence: stringToChunk(escapeTextForBrowser(precedence$jscomp$0)),
							rules: [],
							hrefs: [],
							sheets: /* @__PURE__ */ new Map()
						}, renderState.styles.set(precedence$jscomp$0, styleQueue$jscomp$0));
						var nonceStyle = renderState.nonce.style;
						if (!nonceStyle || nonceStyle === nonce) {
							styleQueue$jscomp$0.hrefs.push(stringToChunk(escapeTextForBrowser(href$jscomp$0)));
							var target = styleQueue$jscomp$0.rules, children$jscomp$7 = null, innerHTML$jscomp$6 = null, propKey$jscomp$9;
							for (propKey$jscomp$9 in props) if (hasOwnProperty.call(props, propKey$jscomp$9)) {
								var propValue$jscomp$9 = props[propKey$jscomp$9];
								if (null != propValue$jscomp$9) switch (propKey$jscomp$9) {
									case "children":
										children$jscomp$7 = propValue$jscomp$9;
										break;
									case "dangerouslySetInnerHTML": innerHTML$jscomp$6 = propValue$jscomp$9;
								}
							}
							var child$jscomp$0 = Array.isArray(children$jscomp$7) ? 2 > children$jscomp$7.length ? children$jscomp$7[0] : null : children$jscomp$7;
							"function" !== typeof child$jscomp$0 && "symbol" !== typeof child$jscomp$0 && null !== child$jscomp$0 && void 0 !== child$jscomp$0 && target.push(stringToChunk(("" + child$jscomp$0).replace(styleRegex, styleReplacer)));
							pushInnerHTML(target, innerHTML$jscomp$6, children$jscomp$7);
						}
					}
					styleQueue$jscomp$0 && hoistableState && hoistableState.styles.add(styleQueue$jscomp$0);
					textEmbedded && target$jscomp$0.push(textSeparator);
					JSCompiler_inline_result$jscomp$6 = void 0;
				}
				return JSCompiler_inline_result$jscomp$6;
			case "meta":
				var noscriptTagInScope$jscomp$3 = formatContext.tagScope & 1, isFallback$jscomp$1 = formatContext.tagScope & 4;
				if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$3 || null != props.itemProp) var JSCompiler_inline_result$jscomp$7 = pushSelfClosing(target$jscomp$0, props, "meta");
				else textEmbedded && target$jscomp$0.push(textSeparator), JSCompiler_inline_result$jscomp$7 = isFallback$jscomp$1 ? null : "string" === typeof props.charSet ? pushSelfClosing(renderState.charsetChunks, props, "meta") : "viewport" === props.name ? pushSelfClosing(renderState.viewportChunks, props, "meta") : pushSelfClosing(renderState.hoistableChunks, props, "meta");
				return JSCompiler_inline_result$jscomp$7;
			case "listing":
			case "pre":
				target$jscomp$0.push(startChunkForTag(type));
				var children$jscomp$8 = null, innerHTML$jscomp$7 = null, propKey$jscomp$10;
				for (propKey$jscomp$10 in props) if (hasOwnProperty.call(props, propKey$jscomp$10)) {
					var propValue$jscomp$10 = props[propKey$jscomp$10];
					if (null != propValue$jscomp$10) switch (propKey$jscomp$10) {
						case "children":
							children$jscomp$8 = propValue$jscomp$10;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$7 = propValue$jscomp$10;
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$10, propValue$jscomp$10);
					}
				}
				target$jscomp$0.push(endOfStartTag);
				if (null != innerHTML$jscomp$7) {
					if (null != children$jscomp$8) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
					if ("object" !== typeof innerHTML$jscomp$7 || !("__html" in innerHTML$jscomp$7)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information.");
					var html = innerHTML$jscomp$7.__html;
					null !== html && void 0 !== html && ("string" === typeof html && 0 < html.length && "\n" === html[0] ? target$jscomp$0.push(leadingNewline, stringToChunk(html)) : target$jscomp$0.push(stringToChunk("" + html)));
				}
				"string" === typeof children$jscomp$8 && "\n" === children$jscomp$8[0] && target$jscomp$0.push(leadingNewline);
				return children$jscomp$8;
			case "img":
				var pictureOrNoScriptTagInScope = formatContext.tagScope & 3, src = props.src, srcSet = props.srcSet;
				if (!("lazy" === props.loading || !src && !srcSet || "string" !== typeof src && null != src || "string" !== typeof srcSet && null != srcSet || "low" === props.fetchPriority || pictureOrNoScriptTagInScope) && ("string" !== typeof src || ":" !== src[4] || "d" !== src[0] && "D" !== src[0] || "a" !== src[1] && "A" !== src[1] || "t" !== src[2] && "T" !== src[2] || "a" !== src[3] && "A" !== src[3]) && ("string" !== typeof srcSet || ":" !== srcSet[4] || "d" !== srcSet[0] && "D" !== srcSet[0] || "a" !== srcSet[1] && "A" !== srcSet[1] || "t" !== srcSet[2] && "T" !== srcSet[2] || "a" !== srcSet[3] && "A" !== srcSet[3])) {
					null !== hoistableState && formatContext.tagScope & 64 && (hoistableState.suspenseyImages = !0);
					var sizes = "string" === typeof props.sizes ? props.sizes : void 0, key$jscomp$0 = srcSet ? srcSet + "\n" + (sizes || "") : src, promotablePreloads = renderState.preloads.images, resource$jscomp$1 = promotablePreloads.get(key$jscomp$0);
					if (resource$jscomp$1) {
						if ("high" === props.fetchPriority || 10 > renderState.highImagePreloads.size) promotablePreloads.delete(key$jscomp$0), renderState.highImagePreloads.add(resource$jscomp$1);
					} else if (!resumableState.imageResources.hasOwnProperty(key$jscomp$0)) {
						resumableState.imageResources[key$jscomp$0] = PRELOAD_NO_CREDS;
						var input = props.crossOrigin;
						var JSCompiler_inline_result$jscomp$8 = "string" === typeof input ? "use-credentials" === input ? input : "" : void 0;
						var headers = renderState.headers, header;
						headers && 0 < headers.remainingCapacity && "string" !== typeof props.srcSet && ("high" === props.fetchPriority || 500 > headers.highImagePreloads.length) && (header = getPreloadAsHeader(src, "image", {
							imageSrcSet: props.srcSet,
							imageSizes: props.sizes,
							crossOrigin: JSCompiler_inline_result$jscomp$8,
							integrity: props.integrity,
							nonce: props.nonce,
							type: props.type,
							fetchPriority: props.fetchPriority,
							referrerPolicy: props.refererPolicy
						}), 0 <= (headers.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key$jscomp$0] = PRELOAD_NO_CREDS, headers.highImagePreloads && (headers.highImagePreloads += ", "), headers.highImagePreloads += header) : (resource$jscomp$1 = [], pushLinkImpl(resource$jscomp$1, {
							rel: "preload",
							as: "image",
							href: srcSet ? void 0 : src,
							imageSrcSet: srcSet,
							imageSizes: sizes,
							crossOrigin: JSCompiler_inline_result$jscomp$8,
							integrity: props.integrity,
							type: props.type,
							fetchPriority: props.fetchPriority,
							referrerPolicy: props.referrerPolicy
						}), "high" === props.fetchPriority || 10 > renderState.highImagePreloads.size ? renderState.highImagePreloads.add(resource$jscomp$1) : (renderState.bulkPreloads.add(resource$jscomp$1), promotablePreloads.set(key$jscomp$0, resource$jscomp$1)));
					}
				}
				return pushSelfClosing(target$jscomp$0, props, "img");
			case "base":
			case "area":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "param":
			case "source":
			case "track":
			case "wbr": return pushSelfClosing(target$jscomp$0, props, type);
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": break;
			case "head":
				if (2 > formatContext.insertionMode) {
					var preamble = preambleState || renderState.preamble;
					if (preamble.headChunks) throw Error("The `<head>` tag may only be rendered once.");
					null !== preambleState && target$jscomp$0.push(headPreambleContributionChunk);
					preamble.headChunks = [];
					var JSCompiler_inline_result$jscomp$9 = pushStartSingletonElement(preamble.headChunks, props, "head");
				} else JSCompiler_inline_result$jscomp$9 = pushStartGenericElement(target$jscomp$0, props, "head");
				return JSCompiler_inline_result$jscomp$9;
			case "body":
				if (2 > formatContext.insertionMode) {
					var preamble$jscomp$0 = preambleState || renderState.preamble;
					if (preamble$jscomp$0.bodyChunks) throw Error("The `<body>` tag may only be rendered once.");
					null !== preambleState && target$jscomp$0.push(bodyPreambleContributionChunk);
					preamble$jscomp$0.bodyChunks = [];
					var JSCompiler_inline_result$jscomp$10 = pushStartSingletonElement(preamble$jscomp$0.bodyChunks, props, "body");
				} else JSCompiler_inline_result$jscomp$10 = pushStartGenericElement(target$jscomp$0, props, "body");
				return JSCompiler_inline_result$jscomp$10;
			case "html":
				if (0 === formatContext.insertionMode) {
					var preamble$jscomp$1 = preambleState || renderState.preamble;
					if (preamble$jscomp$1.htmlChunks) throw Error("The `<html>` tag may only be rendered once.");
					null !== preambleState && target$jscomp$0.push(htmlPreambleContributionChunk);
					preamble$jscomp$1.htmlChunks = [doctypeChunk];
					var JSCompiler_inline_result$jscomp$11 = pushStartSingletonElement(preamble$jscomp$1.htmlChunks, props, "html");
				} else JSCompiler_inline_result$jscomp$11 = pushStartGenericElement(target$jscomp$0, props, "html");
				return JSCompiler_inline_result$jscomp$11;
			default: if (-1 !== type.indexOf("-")) {
				target$jscomp$0.push(startChunkForTag(type));
				var children$jscomp$9 = null, innerHTML$jscomp$8 = null, propKey$jscomp$11;
				for (propKey$jscomp$11 in props) if (hasOwnProperty.call(props, propKey$jscomp$11)) {
					var propValue$jscomp$11 = props[propKey$jscomp$11];
					if (null != propValue$jscomp$11) {
						var attributeName = propKey$jscomp$11;
						switch (propKey$jscomp$11) {
							case "children":
								children$jscomp$9 = propValue$jscomp$11;
								break;
							case "dangerouslySetInnerHTML":
								innerHTML$jscomp$8 = propValue$jscomp$11;
								break;
							case "style":
								pushStyleAttribute(target$jscomp$0, propValue$jscomp$11);
								break;
							case "suppressContentEditableWarning":
							case "suppressHydrationWarning":
							case "ref": break;
							case "className": attributeName = "class";
							default: if (isAttributeNameSafe(propKey$jscomp$11) && "function" !== typeof propValue$jscomp$11 && "symbol" !== typeof propValue$jscomp$11 && !1 !== propValue$jscomp$11) {
								if (!0 === propValue$jscomp$11) propValue$jscomp$11 = "";
								else if ("object" === typeof propValue$jscomp$11) continue;
								target$jscomp$0.push(attributeSeparator, stringToChunk(attributeName), attributeAssign, stringToChunk(escapeTextForBrowser(propValue$jscomp$11)), attributeEnd);
							}
						}
					}
				}
				target$jscomp$0.push(endOfStartTag);
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$8, children$jscomp$9);
				return children$jscomp$9;
			}
		}
		return pushStartGenericElement(target$jscomp$0, props, type);
	}
	var endTagCache = /* @__PURE__ */ new Map();
	function endChunkForTag(tag) {
		var chunk = endTagCache.get(tag);
		void 0 === chunk && (chunk = stringToPrecomputedChunk("</" + tag + ">"), endTagCache.set(tag, chunk));
		return chunk;
	}
	function hoistPreambleState(renderState, preambleState) {
		renderState = renderState.preamble;
		null === renderState.htmlChunks && preambleState.htmlChunks && (renderState.htmlChunks = preambleState.htmlChunks);
		null === renderState.headChunks && preambleState.headChunks && (renderState.headChunks = preambleState.headChunks);
		null === renderState.bodyChunks && preambleState.bodyChunks && (renderState.bodyChunks = preambleState.bodyChunks);
	}
	function writeBootstrap(destination, renderState) {
		renderState = renderState.bootstrapChunks;
		for (var i = 0; i < renderState.length - 1; i++) writeChunk(destination, renderState[i]);
		return i < renderState.length ? (i = renderState[i], renderState.length = 0, writeChunkAndReturn(destination, i)) : !0;
	}
	var shellTimeRuntimeScript = stringToPrecomputedChunk("requestAnimationFrame(function(){$RT=performance.now()});");
	var placeholder1 = stringToPrecomputedChunk("<template id=\"");
	var placeholder2 = stringToPrecomputedChunk("\"></template>");
	var startActivityBoundary = stringToPrecomputedChunk("<!--&-->");
	var endActivityBoundary = stringToPrecomputedChunk("<!--/&-->");
	var startCompletedSuspenseBoundary = stringToPrecomputedChunk("<!--$-->");
	var startPendingSuspenseBoundary1 = stringToPrecomputedChunk("<!--$?--><template id=\"");
	var startPendingSuspenseBoundary2 = stringToPrecomputedChunk("\"></template>");
	var startClientRenderedSuspenseBoundary = stringToPrecomputedChunk("<!--$!-->");
	var endSuspenseBoundary = stringToPrecomputedChunk("<!--/$-->");
	var clientRenderedSuspenseBoundaryError1 = stringToPrecomputedChunk("<template");
	var clientRenderedSuspenseBoundaryErrorAttrInterstitial = stringToPrecomputedChunk("\"");
	var clientRenderedSuspenseBoundaryError1A = stringToPrecomputedChunk(" data-dgst=\"");
	stringToPrecomputedChunk(" data-msg=\"");
	stringToPrecomputedChunk(" data-stck=\"");
	stringToPrecomputedChunk(" data-cstck=\"");
	var clientRenderedSuspenseBoundaryError2 = stringToPrecomputedChunk("></template>");
	function writeStartPendingSuspenseBoundary(destination, renderState, id) {
		writeChunk(destination, startPendingSuspenseBoundary1);
		if (null === id) throw Error("An ID must have been assigned before we can complete the boundary.");
		writeChunk(destination, renderState.boundaryPrefix);
		writeChunk(destination, stringToChunk(id.toString(16)));
		return writeChunkAndReturn(destination, startPendingSuspenseBoundary2);
	}
	var startSegmentHTML = stringToPrecomputedChunk("<div hidden id=\"");
	var startSegmentHTML2 = stringToPrecomputedChunk("\">");
	var endSegmentHTML = stringToPrecomputedChunk("</div>");
	var startSegmentSVG = stringToPrecomputedChunk("<svg aria-hidden=\"true\" style=\"display:none\" id=\"");
	var startSegmentSVG2 = stringToPrecomputedChunk("\">");
	var endSegmentSVG = stringToPrecomputedChunk("</svg>");
	var startSegmentMathML = stringToPrecomputedChunk("<math aria-hidden=\"true\" style=\"display:none\" id=\"");
	var startSegmentMathML2 = stringToPrecomputedChunk("\">");
	var endSegmentMathML = stringToPrecomputedChunk("</math>");
	var startSegmentTable = stringToPrecomputedChunk("<table hidden id=\"");
	var startSegmentTable2 = stringToPrecomputedChunk("\">");
	var endSegmentTable = stringToPrecomputedChunk("</table>");
	var startSegmentTableBody = stringToPrecomputedChunk("<table hidden><tbody id=\"");
	var startSegmentTableBody2 = stringToPrecomputedChunk("\">");
	var endSegmentTableBody = stringToPrecomputedChunk("</tbody></table>");
	var startSegmentTableRow = stringToPrecomputedChunk("<table hidden><tr id=\"");
	var startSegmentTableRow2 = stringToPrecomputedChunk("\">");
	var endSegmentTableRow = stringToPrecomputedChunk("</tr></table>");
	var startSegmentColGroup = stringToPrecomputedChunk("<table hidden><colgroup id=\"");
	var startSegmentColGroup2 = stringToPrecomputedChunk("\">");
	var endSegmentColGroup = stringToPrecomputedChunk("</colgroup></table>");
	function writeStartSegment(destination, renderState, formatContext, id) {
		switch (formatContext.insertionMode) {
			case 0:
			case 1:
			case 3:
			case 2: return writeChunk(destination, startSegmentHTML), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, stringToChunk(id.toString(16))), writeChunkAndReturn(destination, startSegmentHTML2);
			case 4: return writeChunk(destination, startSegmentSVG), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, stringToChunk(id.toString(16))), writeChunkAndReturn(destination, startSegmentSVG2);
			case 5: return writeChunk(destination, startSegmentMathML), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, stringToChunk(id.toString(16))), writeChunkAndReturn(destination, startSegmentMathML2);
			case 6: return writeChunk(destination, startSegmentTable), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, stringToChunk(id.toString(16))), writeChunkAndReturn(destination, startSegmentTable2);
			case 7: return writeChunk(destination, startSegmentTableBody), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, stringToChunk(id.toString(16))), writeChunkAndReturn(destination, startSegmentTableBody2);
			case 8: return writeChunk(destination, startSegmentTableRow), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, stringToChunk(id.toString(16))), writeChunkAndReturn(destination, startSegmentTableRow2);
			case 9: return writeChunk(destination, startSegmentColGroup), writeChunk(destination, renderState.segmentPrefix), writeChunk(destination, stringToChunk(id.toString(16))), writeChunkAndReturn(destination, startSegmentColGroup2);
			default: throw Error("Unknown insertion mode. This is a bug in React.");
		}
	}
	function writeEndSegment(destination, formatContext) {
		switch (formatContext.insertionMode) {
			case 0:
			case 1:
			case 3:
			case 2: return writeChunkAndReturn(destination, endSegmentHTML);
			case 4: return writeChunkAndReturn(destination, endSegmentSVG);
			case 5: return writeChunkAndReturn(destination, endSegmentMathML);
			case 6: return writeChunkAndReturn(destination, endSegmentTable);
			case 7: return writeChunkAndReturn(destination, endSegmentTableBody);
			case 8: return writeChunkAndReturn(destination, endSegmentTableRow);
			case 9: return writeChunkAndReturn(destination, endSegmentColGroup);
			default: throw Error("Unknown insertion mode. This is a bug in React.");
		}
	}
	var completeSegmentScript1Full = stringToPrecomputedChunk("$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS(\"");
	var completeSegmentScript1Partial = stringToPrecomputedChunk("$RS(\"");
	var completeSegmentScript2 = stringToPrecomputedChunk("\",\"");
	var completeSegmentScriptEnd = stringToPrecomputedChunk("\")<\/script>");
	stringToPrecomputedChunk("<template data-rsi=\"\" data-sid=\"");
	stringToPrecomputedChunk("\" data-pid=\"");
	var completeBoundaryScriptFunctionOnly = stringToPrecomputedChunk("$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if(\"/$\"===d||\"/&\"===d)if(0===h)break;else h--;else\"$\"!==d&&\"$?\"!==d&&\"$~\"!==d&&\"$!\"!==d&&\"&\"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data=\"$\";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data=\"$~\",$RB.push(a,b),2===$RB.length&&(\"number\"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};");
	stringToChunk("$RV=function(A,g){function k(a,b){var e=a.getAttribute(b);e&&(b=a.style,l.push(a,b.viewTransitionName,b.viewTransitionClass),\"auto\"!==e&&(b.viewTransitionClass=e),(a=a.getAttribute(\"vt-name\"))||(a=\"_T_\"+K++ +\"_\"),b.viewTransitionName=a,B=!0)}var B=!1,K=0,l=[];try{var f=document.__reactViewTransition;if(f){f.finished.finally($RV.bind(null,g));return}var m=new Map;for(f=1;f<g.length;f+=2)for(var h=g[f].querySelectorAll(\"[vt-share]\"),d=0;d<h.length;d++){var c=h[d];m.set(c.getAttribute(\"vt-name\"),c)}var u=[];for(h=0;h<g.length;h+=2){var C=g[h],x=C.parentNode;if(x){var v=x.getBoundingClientRect();if(v.left||v.top||v.width||v.height){c=C;for(f=0;c;){if(8===c.nodeType){var r=c.data;if(\"/$\"===r)if(0===f)break;else f--;else\"$\"!==r&&\"$?\"!==r&&\"$~\"!==r&&\"$!\"!==r||f++}else if(1===c.nodeType){d=c;var D=d.getAttribute(\"vt-name\"),y=m.get(D);k(d,y?\"vt-share\":\"vt-exit\");y&&(k(y,\"vt-share\"),m.set(D,null));var E=d.querySelectorAll(\"[vt-share]\");for(d=0;d<E.length;d++){var F=E[d],G=F.getAttribute(\"vt-name\"),\nH=m.get(G);H&&(k(F,\"vt-share\"),k(H,\"vt-share\"),m.set(G,null))}}c=c.nextSibling}for(var I=g[h+1],t=I.firstElementChild;t;)null!==m.get(t.getAttribute(\"vt-name\"))&&k(t,\"vt-enter\"),t=t.nextElementSibling;c=x;do for(var n=c.firstElementChild;n;){var J=n.getAttribute(\"vt-update\");J&&\"none\"!==J&&!l.includes(n)&&k(n,\"vt-update\");n=n.nextElementSibling}while((c=c.parentNode)&&1===c.nodeType&&\"none\"!==c.getAttribute(\"vt-update\"));u.push.apply(u,I.querySelectorAll('img[src]:not([loading=\"lazy\"])'))}}}if(B){var z=\ndocument.__reactViewTransition=document.startViewTransition({update:function(){A(g);for(var a=[document.documentElement.clientHeight,document.fonts.ready],b={},e=0;e<u.length;b={g:b.g},e++)if(b.g=u[e],!b.g.complete){var p=b.g.getBoundingClientRect();0<p.bottom&&0<p.right&&p.top<window.innerHeight&&p.left<window.innerWidth&&(p=new Promise(function(w){return function(q){w.g.addEventListener(\"load\",q);w.g.addEventListener(\"error\",q)}}(b)),a.push(p))}return Promise.race([Promise.all(a),new Promise(function(w){var q=\nperformance.now();setTimeout(w,2300>q&&2E3<q?2300-q:500)})])},types:[]});z.ready.finally(function(){for(var a=l.length-3;0<=a;a-=3){var b=l[a],e=b.style;e.viewTransitionName=l[a+1];e.viewTransitionClass=l[a+1];\"\"===b.getAttribute(\"style\")&&b.removeAttribute(\"style\")}});z.finished.finally(function(){document.__reactViewTransition===z&&(document.__reactViewTransition=null)});$RB=[];return}}catch(a){}A(g)}.bind(null,$RV);");
	var completeBoundaryScript1Partial = stringToPrecomputedChunk("$RC(\"");
	var completeBoundaryWithStylesScript1FullPartial = stringToPrecomputedChunk("$RM=new Map;$RR=function(n,w,p){function u(q){this._p=null;q()}for(var r=new Map,t=document,h,b,e=t.querySelectorAll(\"link[data-precedence],style[data-precedence]\"),v=[],k=0;b=e[k++];)\"not all\"===b.getAttribute(\"media\")?v.push(b):(\"LINK\"===b.tagName&&$RM.set(b.getAttribute(\"href\"),b),r.set(b.dataset.precedence,h=b));e=0;b=[];var l,a;for(k=!0;;){if(k){var f=p[e++];if(!f){k=!1;e=0;continue}var c=!1,m=0;var d=f[m++];if(a=$RM.get(d)){var g=a._p;c=!0}else{a=t.createElement(\"link\");a.href=d;a.rel=\n\"stylesheet\";for(a.dataset.precedence=l=f[m++];g=f[m++];)a.setAttribute(g,f[m++]);g=a._p=new Promise(function(q,x){a.onload=u.bind(a,q);a.onerror=u.bind(a,x)});$RM.set(d,a)}d=a.getAttribute(\"media\");!g||d&&!matchMedia(d).matches||b.push(g);if(c)continue}else{a=v[e++];if(!a)break;l=a.getAttribute(\"data-precedence\");a.removeAttribute(\"media\")}c=r.get(l)||h;c===h&&(h=a);r.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=t.head,c.insertBefore(a,c.firstChild))}if(p=document.getElementById(n))p.previousSibling.data=\n\"$~\";Promise.all(b).then($RC.bind(null,n,w),$RX.bind(null,n,\"CSS failed to load\"))};$RR(\"");
	var completeBoundaryWithStylesScript1Partial = stringToPrecomputedChunk("$RR(\"");
	var completeBoundaryScript2 = stringToPrecomputedChunk("\",\"");
	var completeBoundaryScript3a = stringToPrecomputedChunk("\",");
	var completeBoundaryScript3b = stringToPrecomputedChunk("\"");
	var completeBoundaryScriptEnd = stringToPrecomputedChunk(")<\/script>");
	stringToPrecomputedChunk("<template data-rci=\"\" data-bid=\"");
	stringToPrecomputedChunk("<template data-rri=\"\" data-bid=\"");
	stringToPrecomputedChunk("\" data-sid=\"");
	stringToPrecomputedChunk("\" data-sty=\"");
	var clientRenderScriptFunctionOnly = stringToPrecomputedChunk("$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data=\"$!\",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};");
	var clientRenderScript1Full = stringToPrecomputedChunk("$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data=\"$!\",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX(\"");
	var clientRenderScript1Partial = stringToPrecomputedChunk("$RX(\"");
	var clientRenderScript1A = stringToPrecomputedChunk("\"");
	var clientRenderErrorScriptArgInterstitial = stringToPrecomputedChunk(",");
	var clientRenderScriptEnd = stringToPrecomputedChunk(")<\/script>");
	stringToPrecomputedChunk("<template data-rxi=\"\" data-bid=\"");
	stringToPrecomputedChunk("\" data-dgst=\"");
	stringToPrecomputedChunk("\" data-msg=\"");
	stringToPrecomputedChunk("\" data-stck=\"");
	stringToPrecomputedChunk("\" data-cstck=\"");
	var regexForJSStringsInInstructionScripts = /[<\u2028\u2029]/g;
	function escapeJSStringsForInstructionScripts(input) {
		return JSON.stringify(input).replace(regexForJSStringsInInstructionScripts, function(match) {
			switch (match) {
				case "<": return "\\u003c";
				case "\u2028": return "\\u2028";
				case "\u2029": return "\\u2029";
				default: throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
			}
		});
	}
	var regexForJSStringsInScripts = /[&><\u2028\u2029]/g;
	function escapeJSObjectForInstructionScripts(input) {
		return JSON.stringify(input).replace(regexForJSStringsInScripts, function(match) {
			switch (match) {
				case "&": return "\\u0026";
				case ">": return "\\u003e";
				case "<": return "\\u003c";
				case "\u2028": return "\\u2028";
				case "\u2029": return "\\u2029";
				default: throw Error("escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
			}
		});
	}
	var lateStyleTagResourceOpen1 = stringToPrecomputedChunk(" media=\"not all\" data-precedence=\"");
	var lateStyleTagResourceOpen2 = stringToPrecomputedChunk("\" data-href=\"");
	var lateStyleTagResourceOpen3 = stringToPrecomputedChunk("\">");
	var lateStyleTagTemplateClose = stringToPrecomputedChunk("</style>");
	var currentlyRenderingBoundaryHasStylesToHoist = !1;
	var destinationHasCapacity = !0;
	function flushStyleTagsLateForBoundary(styleQueue) {
		var rules = styleQueue.rules, hrefs = styleQueue.hrefs, i = 0;
		if (hrefs.length) {
			writeChunk(this, currentlyFlushingRenderState.startInlineStyle);
			writeChunk(this, lateStyleTagResourceOpen1);
			writeChunk(this, styleQueue.precedence);
			for (writeChunk(this, lateStyleTagResourceOpen2); i < hrefs.length - 1; i++) writeChunk(this, hrefs[i]), writeChunk(this, spaceSeparator);
			writeChunk(this, hrefs[i]);
			writeChunk(this, lateStyleTagResourceOpen3);
			for (i = 0; i < rules.length; i++) writeChunk(this, rules[i]);
			destinationHasCapacity = writeChunkAndReturn(this, lateStyleTagTemplateClose);
			currentlyRenderingBoundaryHasStylesToHoist = !0;
			rules.length = 0;
			hrefs.length = 0;
		}
	}
	function hasStylesToHoist(stylesheet) {
		return 2 !== stylesheet.state ? currentlyRenderingBoundaryHasStylesToHoist = !0 : !1;
	}
	function writeHoistablesForBoundary(destination, hoistableState, renderState) {
		currentlyRenderingBoundaryHasStylesToHoist = !1;
		destinationHasCapacity = !0;
		currentlyFlushingRenderState = renderState;
		hoistableState.styles.forEach(flushStyleTagsLateForBoundary, destination);
		currentlyFlushingRenderState = null;
		hoistableState.stylesheets.forEach(hasStylesToHoist);
		currentlyRenderingBoundaryHasStylesToHoist && (renderState.stylesToHoist = !0);
		return destinationHasCapacity;
	}
	function flushResource(resource) {
		for (var i = 0; i < resource.length; i++) writeChunk(this, resource[i]);
		resource.length = 0;
	}
	var stylesheetFlushingQueue = [];
	function flushStyleInPreamble(stylesheet) {
		pushLinkImpl(stylesheetFlushingQueue, stylesheet.props);
		for (var i = 0; i < stylesheetFlushingQueue.length; i++) writeChunk(this, stylesheetFlushingQueue[i]);
		stylesheetFlushingQueue.length = 0;
		stylesheet.state = 2;
	}
	var styleTagResourceOpen1 = stringToPrecomputedChunk(" data-precedence=\"");
	var styleTagResourceOpen2 = stringToPrecomputedChunk("\" data-href=\"");
	var spaceSeparator = stringToPrecomputedChunk(" ");
	var styleTagResourceOpen3 = stringToPrecomputedChunk("\">");
	var styleTagResourceClose = stringToPrecomputedChunk("</style>");
	function flushStylesInPreamble(styleQueue) {
		var hasStylesheets = 0 < styleQueue.sheets.size;
		styleQueue.sheets.forEach(flushStyleInPreamble, this);
		styleQueue.sheets.clear();
		var rules = styleQueue.rules, hrefs = styleQueue.hrefs;
		if (!hasStylesheets || hrefs.length) {
			writeChunk(this, currentlyFlushingRenderState.startInlineStyle);
			writeChunk(this, styleTagResourceOpen1);
			writeChunk(this, styleQueue.precedence);
			styleQueue = 0;
			if (hrefs.length) {
				for (writeChunk(this, styleTagResourceOpen2); styleQueue < hrefs.length - 1; styleQueue++) writeChunk(this, hrefs[styleQueue]), writeChunk(this, spaceSeparator);
				writeChunk(this, hrefs[styleQueue]);
			}
			writeChunk(this, styleTagResourceOpen3);
			for (styleQueue = 0; styleQueue < rules.length; styleQueue++) writeChunk(this, rules[styleQueue]);
			writeChunk(this, styleTagResourceClose);
			rules.length = 0;
			hrefs.length = 0;
		}
	}
	function preloadLateStyle(stylesheet) {
		if (0 === stylesheet.state) {
			stylesheet.state = 1;
			var props = stylesheet.props;
			pushLinkImpl(stylesheetFlushingQueue, {
				rel: "preload",
				as: "style",
				href: stylesheet.props.href,
				crossOrigin: props.crossOrigin,
				fetchPriority: props.fetchPriority,
				integrity: props.integrity,
				media: props.media,
				hrefLang: props.hrefLang,
				referrerPolicy: props.referrerPolicy
			});
			for (stylesheet = 0; stylesheet < stylesheetFlushingQueue.length; stylesheet++) writeChunk(this, stylesheetFlushingQueue[stylesheet]);
			stylesheetFlushingQueue.length = 0;
		}
	}
	function preloadLateStyles(styleQueue) {
		styleQueue.sheets.forEach(preloadLateStyle, this);
		styleQueue.sheets.clear();
	}
	stringToPrecomputedChunk("<link rel=\"expect\" href=\"#");
	stringToPrecomputedChunk("\" blocking=\"render\"/>");
	var completedShellIdAttributeStart = stringToPrecomputedChunk(" id=\"");
	function pushCompletedShellIdAttribute(target, resumableState) {
		0 === (resumableState.instructions & 32) && (resumableState.instructions |= 32, target.push(completedShellIdAttributeStart, stringToChunk(escapeTextForBrowser("_" + resumableState.idPrefix + "R_")), attributeEnd));
	}
	var arrayFirstOpenBracket = stringToPrecomputedChunk("[");
	var arraySubsequentOpenBracket = stringToPrecomputedChunk(",[");
	var arrayInterstitial = stringToPrecomputedChunk(",");
	var arrayCloseBracket = stringToPrecomputedChunk("]");
	function writeStyleResourceDependenciesInJS(destination, hoistableState) {
		writeChunk(destination, arrayFirstOpenBracket);
		var nextArrayOpenBrackChunk = arrayFirstOpenBracket;
		hoistableState.stylesheets.forEach(function(resource) {
			if (2 !== resource.state) if (3 === resource.state) writeChunk(destination, nextArrayOpenBrackChunk), writeChunk(destination, stringToChunk(escapeJSObjectForInstructionScripts("" + resource.props.href))), writeChunk(destination, arrayCloseBracket), nextArrayOpenBrackChunk = arraySubsequentOpenBracket;
			else {
				writeChunk(destination, nextArrayOpenBrackChunk);
				var precedence = resource.props["data-precedence"], props = resource.props;
				writeChunk(destination, stringToChunk(escapeJSObjectForInstructionScripts(sanitizeURL("" + resource.props.href))));
				precedence = "" + precedence;
				writeChunk(destination, arrayInterstitial);
				writeChunk(destination, stringToChunk(escapeJSObjectForInstructionScripts(precedence)));
				for (var propKey in props) if (hasOwnProperty.call(props, propKey) && (precedence = props[propKey], null != precedence)) switch (propKey) {
					case "href":
					case "rel":
					case "precedence":
					case "data-precedence": break;
					case "children":
					case "dangerouslySetInnerHTML": throw Error("link is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
					default: writeStyleResourceAttributeInJS(destination, propKey, precedence);
				}
				writeChunk(destination, arrayCloseBracket);
				nextArrayOpenBrackChunk = arraySubsequentOpenBracket;
				resource.state = 3;
			}
		});
		writeChunk(destination, arrayCloseBracket);
	}
	function writeStyleResourceAttributeInJS(destination, name, value) {
		var attributeName = name.toLowerCase();
		switch (typeof value) {
			case "function":
			case "symbol": return;
		}
		switch (name) {
			case "innerHTML":
			case "dangerouslySetInnerHTML":
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "style":
			case "ref": return;
			case "className":
				attributeName = "class";
				name = "" + value;
				break;
			case "hidden":
				if (!1 === value) return;
				name = "";
				break;
			case "src":
			case "href":
				value = sanitizeURL(value);
				name = "" + value;
				break;
			default:
				if (2 < name.length && ("o" === name[0] || "O" === name[0]) && ("n" === name[1] || "N" === name[1]) || !isAttributeNameSafe(name)) return;
				name = "" + value;
		}
		writeChunk(destination, arrayInterstitial);
		writeChunk(destination, stringToChunk(escapeJSObjectForInstructionScripts(attributeName)));
		writeChunk(destination, arrayInterstitial);
		writeChunk(destination, stringToChunk(escapeJSObjectForInstructionScripts(name)));
	}
	function createHoistableState() {
		return {
			styles: /* @__PURE__ */ new Set(),
			stylesheets: /* @__PURE__ */ new Set(),
			suspenseyImages: !1
		};
	}
	function prefetchDNS(href) {
		var request = resolveRequest();
		if (request) {
			var resumableState = request.resumableState, renderState = request.renderState;
			if ("string" === typeof href && href) {
				if (!resumableState.dnsResources.hasOwnProperty(href)) {
					resumableState.dnsResources[href] = null;
					resumableState = renderState.headers;
					var header, JSCompiler_temp;
					if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity) JSCompiler_temp = (header = "<" + ("" + href).replace(regexForHrefInLinkHeaderURLContext, escapeHrefForLinkHeaderURLContextReplacer) + ">; rel=dns-prefetch", 0 <= (resumableState.remainingCapacity -= header.length + 2));
					JSCompiler_temp ? (renderState.resets.dns[href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (header = [], pushLinkImpl(header, {
						href,
						rel: "dns-prefetch"
					}), renderState.preconnects.add(header));
				}
				enqueueFlush(request);
			}
		} else previousDispatcher.D(href);
	}
	function preconnect(href, crossOrigin) {
		var request = resolveRequest();
		if (request) {
			var resumableState = request.resumableState, renderState = request.renderState;
			if ("string" === typeof href && href) {
				var bucket = "use-credentials" === crossOrigin ? "credentials" : "string" === typeof crossOrigin ? "anonymous" : "default";
				if (!resumableState.connectResources[bucket].hasOwnProperty(href)) {
					resumableState.connectResources[bucket][href] = null;
					resumableState = renderState.headers;
					var header, JSCompiler_temp;
					if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity) {
						JSCompiler_temp = "<" + ("" + href).replace(regexForHrefInLinkHeaderURLContext, escapeHrefForLinkHeaderURLContextReplacer) + ">; rel=preconnect";
						if ("string" === typeof crossOrigin) {
							var escapedCrossOrigin = ("" + crossOrigin).replace(regexForLinkHeaderQuotedParamValueContext, escapeStringForLinkHeaderQuotedParamValueContextReplacer);
							JSCompiler_temp += "; crossorigin=\"" + escapedCrossOrigin + "\"";
						}
						JSCompiler_temp = (header = JSCompiler_temp, 0 <= (resumableState.remainingCapacity -= header.length + 2));
					}
					JSCompiler_temp ? (renderState.resets.connect[bucket][href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (bucket = [], pushLinkImpl(bucket, {
						rel: "preconnect",
						href,
						crossOrigin
					}), renderState.preconnects.add(bucket));
				}
				enqueueFlush(request);
			}
		} else previousDispatcher.C(href, crossOrigin);
	}
	function preload(href, as, options) {
		var request = resolveRequest();
		if (request) {
			var resumableState = request.resumableState, renderState = request.renderState;
			if (as && href) {
				switch (as) {
					case "image":
						if (options) {
							var imageSrcSet = options.imageSrcSet;
							var imageSizes = options.imageSizes;
							var fetchPriority = options.fetchPriority;
						}
						var key = imageSrcSet ? imageSrcSet + "\n" + (imageSizes || "") : href;
						if (resumableState.imageResources.hasOwnProperty(key)) return;
						resumableState.imageResources[key] = PRELOAD_NO_CREDS;
						resumableState = renderState.headers;
						var header;
						resumableState && 0 < resumableState.remainingCapacity && "string" !== typeof imageSrcSet && "high" === fetchPriority && (header = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key] = PRELOAD_NO_CREDS, resumableState.highImagePreloads && (resumableState.highImagePreloads += ", "), resumableState.highImagePreloads += header) : (resumableState = [], pushLinkImpl(resumableState, assign({
							rel: "preload",
							href: imageSrcSet ? void 0 : href,
							as
						}, options)), "high" === fetchPriority ? renderState.highImagePreloads.add(resumableState) : (renderState.bulkPreloads.add(resumableState), renderState.preloads.images.set(key, resumableState)));
						break;
					case "style":
						if (resumableState.styleResources.hasOwnProperty(href)) return;
						imageSrcSet = [];
						pushLinkImpl(imageSrcSet, assign({
							rel: "preload",
							href,
							as
						}, options));
						resumableState.styleResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
						renderState.preloads.stylesheets.set(href, imageSrcSet);
						renderState.bulkPreloads.add(imageSrcSet);
						break;
					case "script":
						if (resumableState.scriptResources.hasOwnProperty(href)) return;
						imageSrcSet = [];
						renderState.preloads.scripts.set(href, imageSrcSet);
						renderState.bulkPreloads.add(imageSrcSet);
						pushLinkImpl(imageSrcSet, assign({
							rel: "preload",
							href,
							as
						}, options));
						resumableState.scriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
						break;
					default:
						if (resumableState.unknownResources.hasOwnProperty(as)) {
							if (imageSrcSet = resumableState.unknownResources[as], imageSrcSet.hasOwnProperty(href)) return;
						} else imageSrcSet = {}, resumableState.unknownResources[as] = imageSrcSet;
						imageSrcSet[href] = PRELOAD_NO_CREDS;
						if ((resumableState = renderState.headers) && 0 < resumableState.remainingCapacity && "font" === as && (key = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= key.length + 2))) renderState.resets.font[href] = PRELOAD_NO_CREDS, resumableState.fontPreloads && (resumableState.fontPreloads += ", "), resumableState.fontPreloads += key;
						else switch (resumableState = [], href = assign({
							rel: "preload",
							href,
							as
						}, options), pushLinkImpl(resumableState, href), as) {
							case "font":
								renderState.fontPreloads.add(resumableState);
								break;
							default: renderState.bulkPreloads.add(resumableState);
						}
				}
				enqueueFlush(request);
			}
		} else previousDispatcher.L(href, as, options);
	}
	function preloadModule(href, options) {
		var request = resolveRequest();
		if (request) {
			var resumableState = request.resumableState, renderState = request.renderState;
			if (href) {
				var as = options && "string" === typeof options.as ? options.as : "script";
				switch (as) {
					case "script":
						if (resumableState.moduleScriptResources.hasOwnProperty(href)) return;
						as = [];
						resumableState.moduleScriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
						renderState.preloads.moduleScripts.set(href, as);
						break;
					default:
						if (resumableState.moduleUnknownResources.hasOwnProperty(as)) {
							var resources = resumableState.unknownResources[as];
							if (resources.hasOwnProperty(href)) return;
						} else resources = {}, resumableState.moduleUnknownResources[as] = resources;
						as = [];
						resources[href] = PRELOAD_NO_CREDS;
				}
				pushLinkImpl(as, assign({
					rel: "modulepreload",
					href
				}, options));
				renderState.bulkPreloads.add(as);
				enqueueFlush(request);
			}
		} else previousDispatcher.m(href, options);
	}
	function preinitStyle(href, precedence, options) {
		var request = resolveRequest();
		if (request) {
			var resumableState = request.resumableState, renderState = request.renderState;
			if (href) {
				precedence = precedence || "default";
				var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
				null !== resourceState && (resumableState.styleResources[href] = null, styleQueue || (styleQueue = {
					precedence: stringToChunk(escapeTextForBrowser(precedence)),
					rules: [],
					hrefs: [],
					sheets: /* @__PURE__ */ new Map()
				}, renderState.styles.set(precedence, styleQueue)), precedence = {
					state: 0,
					props: assign({
						rel: "stylesheet",
						href,
						"data-precedence": precedence
					}, options)
				}, resourceState && (2 === resourceState.length && adoptPreloadCredentials(precedence.props, resourceState), (renderState = renderState.preloads.stylesheets.get(href)) && 0 < renderState.length ? renderState.length = 0 : precedence.state = 1), styleQueue.sheets.set(href, precedence), enqueueFlush(request));
			}
		} else previousDispatcher.S(href, precedence, options);
	}
	function preinitScript(src, options) {
		var request = resolveRequest();
		if (request) {
			var resumableState = request.resumableState, renderState = request.renderState;
			if (src) {
				var resourceState = resumableState.scriptResources.hasOwnProperty(src) ? resumableState.scriptResources[src] : void 0;
				null !== resourceState && (resumableState.scriptResources[src] = null, options = assign({
					src,
					async: !0
				}, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.scripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
			}
		} else previousDispatcher.X(src, options);
	}
	function preinitModuleScript(src, options) {
		var request = resolveRequest();
		if (request) {
			var resumableState = request.resumableState, renderState = request.renderState;
			if (src) {
				var resourceState = resumableState.moduleScriptResources.hasOwnProperty(src) ? resumableState.moduleScriptResources[src] : void 0;
				null !== resourceState && (resumableState.moduleScriptResources[src] = null, options = assign({
					src,
					type: "module",
					async: !0
				}, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.moduleScripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
			}
		} else previousDispatcher.M(src, options);
	}
	function adoptPreloadCredentials(target, preloadState) {
		target.crossOrigin ??= preloadState[0];
		target.integrity ??= preloadState[1];
	}
	function getPreloadAsHeader(href, as, params) {
		href = ("" + href).replace(regexForHrefInLinkHeaderURLContext, escapeHrefForLinkHeaderURLContextReplacer);
		as = ("" + as).replace(regexForLinkHeaderQuotedParamValueContext, escapeStringForLinkHeaderQuotedParamValueContextReplacer);
		as = "<" + href + ">; rel=preload; as=\"" + as + "\"";
		for (var paramName in params) hasOwnProperty.call(params, paramName) && (href = params[paramName], "string" === typeof href && (as += "; " + paramName.toLowerCase() + "=\"" + ("" + href).replace(regexForLinkHeaderQuotedParamValueContext, escapeStringForLinkHeaderQuotedParamValueContextReplacer) + "\""));
		return as;
	}
	var regexForHrefInLinkHeaderURLContext = /[<>\r\n]/g;
	function escapeHrefForLinkHeaderURLContextReplacer(match) {
		switch (match) {
			case "<": return "%3C";
			case ">": return "%3E";
			case "\n": return "%0A";
			case "\r": return "%0D";
			default: throw Error("escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
		}
	}
	var regexForLinkHeaderQuotedParamValueContext = /["';,\r\n]/g;
	function escapeStringForLinkHeaderQuotedParamValueContextReplacer(match) {
		switch (match) {
			case "\"": return "%22";
			case "'": return "%27";
			case ";": return "%3B";
			case ",": return "%2C";
			case "\n": return "%0A";
			case "\r": return "%0D";
			default: throw Error("escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
		}
	}
	function hoistStyleQueueDependency(styleQueue) {
		this.styles.add(styleQueue);
	}
	function hoistStylesheetDependency(stylesheet) {
		this.stylesheets.add(stylesheet);
	}
	function hoistHoistables(parentState, childState) {
		childState.styles.forEach(hoistStyleQueueDependency, parentState);
		childState.stylesheets.forEach(hoistStylesheetDependency, parentState);
		childState.suspenseyImages && (parentState.suspenseyImages = !0);
	}
	function hasSuspenseyContent(hoistableState) {
		return 0 < hoistableState.stylesheets.size || hoistableState.suspenseyImages;
	}
	var bind = Function.prototype.bind;
	var supportsRequestStorage = "function" === typeof AsyncLocalStorage;
	var requestStorage = supportsRequestStorage ? new AsyncLocalStorage() : null;
	var REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
	function getComponentNameFromType(type) {
		if (null == type) return null;
		if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
		if ("string" === typeof type) return type;
		switch (type) {
			case REACT_FRAGMENT_TYPE: return "Fragment";
			case REACT_PROFILER_TYPE: return "Profiler";
			case REACT_STRICT_MODE_TYPE: return "StrictMode";
			case REACT_SUSPENSE_TYPE: return "Suspense";
			case REACT_SUSPENSE_LIST_TYPE: return "SuspenseList";
			case REACT_ACTIVITY_TYPE: return "Activity";
		}
		if ("object" === typeof type) switch (type.$$typeof) {
			case REACT_PORTAL_TYPE: return "Portal";
			case REACT_CONTEXT_TYPE: return type.displayName || "Context";
			case REACT_CONSUMER_TYPE: return (type._context.displayName || "Context") + ".Consumer";
			case REACT_FORWARD_REF_TYPE:
				var innerType = type.render;
				type = type.displayName;
				type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
				return type;
			case REACT_MEMO_TYPE: return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
			case REACT_LAZY_TYPE:
				innerType = type._payload;
				type = type._init;
				try {
					return getComponentNameFromType(type(innerType));
				} catch (x) {}
		}
		return null;
	}
	var emptyContextObject = {};
	var currentActiveSnapshot = null;
	function popToNearestCommonAncestor(prev, next) {
		if (prev !== next) {
			prev.context._currentValue = prev.parentValue;
			prev = prev.parent;
			var parentNext = next.parent;
			if (null === prev) {
				if (null !== parentNext) throw Error("The stacks must reach the root at the same time. This is a bug in React.");
			} else {
				if (null === parentNext) throw Error("The stacks must reach the root at the same time. This is a bug in React.");
				popToNearestCommonAncestor(prev, parentNext);
			}
			next.context._currentValue = next.value;
		}
	}
	function popAllPrevious(prev) {
		prev.context._currentValue = prev.parentValue;
		prev = prev.parent;
		null !== prev && popAllPrevious(prev);
	}
	function pushAllNext(next) {
		var parentNext = next.parent;
		null !== parentNext && pushAllNext(parentNext);
		next.context._currentValue = next.value;
	}
	function popPreviousToCommonLevel(prev, next) {
		prev.context._currentValue = prev.parentValue;
		prev = prev.parent;
		if (null === prev) throw Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
		prev.depth === next.depth ? popToNearestCommonAncestor(prev, next) : popPreviousToCommonLevel(prev, next);
	}
	function popNextToCommonLevel(prev, next) {
		var parentNext = next.parent;
		if (null === parentNext) throw Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
		prev.depth === parentNext.depth ? popToNearestCommonAncestor(prev, parentNext) : popNextToCommonLevel(prev, parentNext);
		next.context._currentValue = next.value;
	}
	function switchContext(newSnapshot) {
		var prev = currentActiveSnapshot;
		prev !== newSnapshot && (null === prev ? pushAllNext(newSnapshot) : null === newSnapshot ? popAllPrevious(prev) : prev.depth === newSnapshot.depth ? popToNearestCommonAncestor(prev, newSnapshot) : prev.depth > newSnapshot.depth ? popPreviousToCommonLevel(prev, newSnapshot) : popNextToCommonLevel(prev, newSnapshot), currentActiveSnapshot = newSnapshot);
	}
	var classComponentUpdater = {
		enqueueSetState: function(inst, payload) {
			inst = inst._reactInternals;
			null !== inst.queue && inst.queue.push(payload);
		},
		enqueueReplaceState: function(inst, payload) {
			inst = inst._reactInternals;
			inst.replace = !0;
			inst.queue = [payload];
		},
		enqueueForceUpdate: function() {}
	};
	var emptyTreeContext = {
		id: 1,
		overflow: ""
	};
	function pushTreeContext(baseContext, totalChildren, index) {
		var baseIdWithLeadingBit = baseContext.id;
		baseContext = baseContext.overflow;
		var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
		baseIdWithLeadingBit &= ~(1 << baseLength);
		index += 1;
		var length = 32 - clz32(totalChildren) + baseLength;
		if (30 < length) {
			var numberOfOverflowBits = baseLength - baseLength % 5;
			length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
			baseIdWithLeadingBit >>= numberOfOverflowBits;
			baseLength -= numberOfOverflowBits;
			return {
				id: 1 << 32 - clz32(totalChildren) + baseLength | index << baseLength | baseIdWithLeadingBit,
				overflow: length + baseContext
			};
		}
		return {
			id: 1 << length | index << baseLength | baseIdWithLeadingBit,
			overflow: baseContext
		};
	}
	var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
	var log = Math.log;
	var LN2 = Math.LN2;
	function clz32Fallback(x) {
		x >>>= 0;
		return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
	}
	function noop() {}
	var SuspenseException = Error("Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`.");
	function trackUsedThenable(thenableState, thenable, index) {
		index = thenableState[index];
		void 0 === index ? thenableState.push(thenable) : index !== thenable && (thenable.then(noop, noop), thenable = index);
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default:
				"string" === typeof thenable.status ? thenable.then(noop, noop) : (thenableState = thenable, thenableState.status = "pending", thenableState.then(function(fulfilledValue) {
					if ("pending" === thenable.status) {
						var fulfilledThenable = thenable;
						fulfilledThenable.status = "fulfilled";
						fulfilledThenable.value = fulfilledValue;
					}
				}, function(error) {
					if ("pending" === thenable.status) {
						var rejectedThenable = thenable;
						rejectedThenable.status = "rejected";
						rejectedThenable.reason = error;
					}
				}));
				switch (thenable.status) {
					case "fulfilled": return thenable.value;
					case "rejected": throw thenable.reason;
				}
				suspendedThenable = thenable;
				throw SuspenseException;
		}
	}
	var suspendedThenable = null;
	function getSuspendedThenable() {
		if (null === suspendedThenable) throw Error("Expected a suspended thenable. This is a bug in React. Please file an issue.");
		var thenable = suspendedThenable;
		suspendedThenable = null;
		return thenable;
	}
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is;
	var currentlyRenderingComponent = null;
	var currentlyRenderingTask = null;
	var currentlyRenderingRequest = null;
	var currentlyRenderingKeyPath = null;
	var firstWorkInProgressHook = null;
	var workInProgressHook = null;
	var isReRender = !1;
	var didScheduleRenderPhaseUpdate = !1;
	var localIdCounter = 0;
	var actionStateCounter = 0;
	var actionStateMatchingIndex = -1;
	var thenableIndexCounter = 0;
	var thenableState = null;
	var renderPhaseUpdates = null;
	var numberOfReRenders = 0;
	function resolveCurrentlyRenderingComponent() {
		if (null === currentlyRenderingComponent) throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.");
		return currentlyRenderingComponent;
	}
	function createHook() {
		if (0 < numberOfReRenders) throw Error("Rendered more hooks than during the previous render");
		return {
			memoizedState: null,
			queue: null,
			next: null
		};
	}
	function createWorkInProgressHook() {
		null === workInProgressHook ? null === firstWorkInProgressHook ? (isReRender = !1, firstWorkInProgressHook = workInProgressHook = createHook()) : (isReRender = !0, workInProgressHook = firstWorkInProgressHook) : null === workInProgressHook.next ? (isReRender = !1, workInProgressHook = workInProgressHook.next = createHook()) : (isReRender = !0, workInProgressHook = workInProgressHook.next);
		return workInProgressHook;
	}
	function getThenableStateAfterSuspending() {
		var state = thenableState;
		thenableState = null;
		return state;
	}
	function resetHooksState() {
		currentlyRenderingKeyPath = currentlyRenderingRequest = currentlyRenderingTask = currentlyRenderingComponent = null;
		didScheduleRenderPhaseUpdate = !1;
		firstWorkInProgressHook = null;
		numberOfReRenders = 0;
		workInProgressHook = renderPhaseUpdates = null;
	}
	function basicStateReducer(state, action) {
		return "function" === typeof action ? action(state) : action;
	}
	function useReducer(reducer, initialArg, init) {
		currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
		workInProgressHook = createWorkInProgressHook();
		if (isReRender) {
			var queue = workInProgressHook.queue;
			initialArg = queue.dispatch;
			if (null !== renderPhaseUpdates && (init = renderPhaseUpdates.get(queue), void 0 !== init)) {
				renderPhaseUpdates.delete(queue);
				queue = workInProgressHook.memoizedState;
				do
					queue = reducer(queue, init.action), init = init.next;
				while (null !== init);
				workInProgressHook.memoizedState = queue;
				return [queue, initialArg];
			}
			return [workInProgressHook.memoizedState, initialArg];
		}
		reducer = reducer === basicStateReducer ? "function" === typeof initialArg ? initialArg() : initialArg : void 0 !== init ? init(initialArg) : initialArg;
		workInProgressHook.memoizedState = reducer;
		reducer = workInProgressHook.queue = {
			last: null,
			dispatch: null
		};
		reducer = reducer.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, reducer);
		return [workInProgressHook.memoizedState, reducer];
	}
	function useMemo(nextCreate, deps) {
		currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
		workInProgressHook = createWorkInProgressHook();
		deps = void 0 === deps ? null : deps;
		if (null !== workInProgressHook) {
			var prevState = workInProgressHook.memoizedState;
			if (null !== prevState && null !== deps) {
				var prevDeps = prevState[1];
				a: if (null === prevDeps) prevDeps = !1;
				else {
					for (var i = 0; i < prevDeps.length && i < deps.length; i++) if (!objectIs(deps[i], prevDeps[i])) {
						prevDeps = !1;
						break a;
					}
					prevDeps = !0;
				}
				if (prevDeps) return prevState[0];
			}
		}
		nextCreate = nextCreate();
		workInProgressHook.memoizedState = [nextCreate, deps];
		return nextCreate;
	}
	function dispatchAction(componentIdentity, queue, action) {
		if (25 <= numberOfReRenders) throw Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
		if (componentIdentity === currentlyRenderingComponent) if (didScheduleRenderPhaseUpdate = !0, componentIdentity = {
			action,
			next: null
		}, null === renderPhaseUpdates && (renderPhaseUpdates = /* @__PURE__ */ new Map()), action = renderPhaseUpdates.get(queue), void 0 === action) renderPhaseUpdates.set(queue, componentIdentity);
		else {
			for (queue = action; null !== queue.next;) queue = queue.next;
			queue.next = componentIdentity;
		}
	}
	function throwOnUseEffectEventCall() {
		throw Error("A function wrapped in useEffectEvent can't be called during rendering.");
	}
	function unsupportedStartTransition() {
		throw Error("startTransition cannot be called during server rendering.");
	}
	function unsupportedSetOptimisticState() {
		throw Error("Cannot update optimistic state while rendering.");
	}
	function useActionState(action, initialState, permalink) {
		resolveCurrentlyRenderingComponent();
		var actionStateHookIndex = actionStateCounter++, request = currentlyRenderingRequest;
		if ("function" === typeof action.$$FORM_ACTION) {
			var nextPostbackStateKey = null, componentKeyPath = currentlyRenderingKeyPath;
			request = request.formState;
			var isSignatureEqual = action.$$IS_SIGNATURE_EQUAL;
			if (null !== request && "function" === typeof isSignatureEqual) {
				var postbackKey = request[1];
				isSignatureEqual.call(action, request[2], request[3]) && (nextPostbackStateKey = void 0 !== permalink ? "p" + permalink : "k" + murmurhash3_32_gc(JSON.stringify([
					componentKeyPath,
					null,
					actionStateHookIndex
				]), 0), postbackKey === nextPostbackStateKey && (actionStateMatchingIndex = actionStateHookIndex, initialState = request[0]));
			}
			var boundAction = action.bind(null, initialState);
			action = function(payload) {
				boundAction(payload);
			};
			"function" === typeof boundAction.$$FORM_ACTION && (action.$$FORM_ACTION = function(prefix) {
				prefix = boundAction.$$FORM_ACTION(prefix);
				void 0 !== permalink && (permalink += "", prefix.action = permalink);
				var formData = prefix.data;
				formData && (null === nextPostbackStateKey && (nextPostbackStateKey = void 0 !== permalink ? "p" + permalink : "k" + murmurhash3_32_gc(JSON.stringify([
					componentKeyPath,
					null,
					actionStateHookIndex
				]), 0)), formData.append("$ACTION_KEY", nextPostbackStateKey));
				return prefix;
			});
			return [
				initialState,
				action,
				!1
			];
		}
		var boundAction$22 = action.bind(null, initialState);
		return [
			initialState,
			function(payload) {
				boundAction$22(payload);
			},
			!1
		];
	}
	function unwrapThenable(thenable) {
		var index = thenableIndexCounter;
		thenableIndexCounter += 1;
		null === thenableState && (thenableState = []);
		return trackUsedThenable(thenableState, thenable, index);
	}
	function unsupportedRefresh() {
		throw Error("Cache cannot be refreshed during server rendering.");
	}
	var HooksDispatcher = {
		readContext: function(context) {
			return context._currentValue;
		},
		use: function(usable) {
			if (null !== usable && "object" === typeof usable) {
				if ("function" === typeof usable.then) return unwrapThenable(usable);
				if (usable.$$typeof === REACT_CONTEXT_TYPE) return usable._currentValue;
			}
			throw Error("An unsupported type was passed to use(): " + String(usable));
		},
		useContext: function(context) {
			resolveCurrentlyRenderingComponent();
			return context._currentValue;
		},
		useMemo,
		useReducer,
		useRef: function(initialValue) {
			currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
			workInProgressHook = createWorkInProgressHook();
			var previousRef = workInProgressHook.memoizedState;
			return null === previousRef ? (initialValue = { current: initialValue }, workInProgressHook.memoizedState = initialValue) : previousRef;
		},
		useState: function(initialState) {
			return useReducer(basicStateReducer, initialState);
		},
		useInsertionEffect: noop,
		useLayoutEffect: noop,
		useCallback: function(callback, deps) {
			return useMemo(function() {
				return callback;
			}, deps);
		},
		useImperativeHandle: noop,
		useEffect: noop,
		useDebugValue: noop,
		useDeferredValue: function(value, initialValue) {
			resolveCurrentlyRenderingComponent();
			return void 0 !== initialValue ? initialValue : value;
		},
		useTransition: function() {
			resolveCurrentlyRenderingComponent();
			return [!1, unsupportedStartTransition];
		},
		useId: function() {
			var JSCompiler_inline_result = currentlyRenderingTask.treeContext;
			var overflow = JSCompiler_inline_result.overflow;
			JSCompiler_inline_result = JSCompiler_inline_result.id;
			JSCompiler_inline_result = (JSCompiler_inline_result & ~(1 << 32 - clz32(JSCompiler_inline_result) - 1)).toString(32) + overflow;
			var resumableState = currentResumableState;
			if (null === resumableState) throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component.");
			overflow = localIdCounter++;
			JSCompiler_inline_result = "_" + resumableState.idPrefix + "R_" + JSCompiler_inline_result;
			0 < overflow && (JSCompiler_inline_result += "H" + overflow.toString(32));
			return JSCompiler_inline_result + "_";
		},
		useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
			if (void 0 === getServerSnapshot) throw Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
			return getServerSnapshot();
		},
		useOptimistic: function(passthrough) {
			resolveCurrentlyRenderingComponent();
			return [passthrough, unsupportedSetOptimisticState];
		},
		useActionState,
		useFormState: useActionState,
		useHostTransitionStatus: function() {
			resolveCurrentlyRenderingComponent();
			return sharedNotPendingObject;
		},
		useMemoCache: function(size) {
			for (var data = Array(size), i = 0; i < size; i++) data[i] = REACT_MEMO_CACHE_SENTINEL;
			return data;
		},
		useCacheRefresh: function() {
			return unsupportedRefresh;
		},
		useEffectEvent: function() {
			return throwOnUseEffectEventCall;
		}
	};
	var currentResumableState = null;
	var DefaultAsyncDispatcher = {
		getCacheForType: function() {
			throw Error("Not implemented.");
		},
		cacheSignal: function() {
			throw Error("Not implemented.");
		}
	};
	function prepareStackTrace(error, structuredStackTrace) {
		error = (error.name || "Error") + ": " + (error.message || "");
		for (var i = 0; i < structuredStackTrace.length; i++) error += "\n    at " + structuredStackTrace[i].toString();
		return error;
	}
	var prefix;
	var suffix;
	function describeBuiltInComponentFrame(name) {
		if (void 0 === prefix) try {
			throw Error();
		} catch (x) {
			var match = x.stack.trim().match(/\n( *(at )?)/);
			prefix = match && match[1] || "";
			suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + prefix + name + suffix;
	}
	var reentry = !1;
	function describeNativeComponentFrame(fn, construct) {
		if (!fn || reentry) return "";
		reentry = !0;
		var previousPrepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = prepareStackTrace;
		try {
			var RunInRootFrame = { DetermineComponentFrameRoot: function() {
				try {
					if (construct) {
						var Fake = function() {
							throw Error();
						};
						Object.defineProperty(Fake.prototype, "props", { set: function() {
							throw Error();
						} });
						if ("object" === typeof Reflect && Reflect.construct) {
							try {
								Reflect.construct(Fake, []);
							} catch (x) {
								var control = x;
							}
							Reflect.construct(fn, [], Fake);
						} else {
							try {
								Fake.call();
							} catch (x$24) {
								control = x$24;
							}
							fn.call(Fake.prototype);
						}
					} else {
						try {
							throw Error();
						} catch (x$25) {
							control = x$25;
						}
						(Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {});
					}
				} catch (sample) {
					if (sample && control && "string" === typeof sample.stack) return [sample.stack, control.stack];
				}
				return [null, null];
			} };
			RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, "name");
			namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
			if (sampleStack && controlStack) {
				var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
				for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot");) RunInRootFrame++;
				for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes("DetermineComponentFrameRoot");) namePropDescriptor++;
				if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length) for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor];) namePropDescriptor--;
				for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--) if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
					if (1 !== RunInRootFrame || 1 !== namePropDescriptor) do
						if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
							var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
							fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
							return frame;
						}
					while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
					break;
				}
			}
		} finally {
			reentry = !1, Error.prepareStackTrace = previousPrepareStackTrace;
		}
		return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
	}
	function describeComponentStackByType(type) {
		if ("string" === typeof type) return describeBuiltInComponentFrame(type);
		if ("function" === typeof type) return type.prototype && type.prototype.isReactComponent ? describeNativeComponentFrame(type, !0) : describeNativeComponentFrame(type, !1);
		if ("object" === typeof type && null !== type) {
			switch (type.$$typeof) {
				case REACT_FORWARD_REF_TYPE: return describeNativeComponentFrame(type.render, !1);
				case REACT_MEMO_TYPE: return describeNativeComponentFrame(type.type, !1);
				case REACT_LAZY_TYPE:
					var lazyComponent = type, payload = lazyComponent._payload;
					lazyComponent = lazyComponent._init;
					try {
						type = lazyComponent(payload);
					} catch (x) {
						return describeBuiltInComponentFrame("Lazy");
					}
					return describeComponentStackByType(type);
			}
			if ("string" === typeof type.name) {
				a: {
					payload = type.name;
					lazyComponent = type.env;
					var location = type.debugLocation;
					if (null != location && (type = Error.prepareStackTrace, Error.prepareStackTrace = prepareStackTrace, location = location.stack, Error.prepareStackTrace = type, location.startsWith("Error: react-stack-top-frame\n") && (location = location.slice(29)), type = location.indexOf("\n"), -1 !== type && (location = location.slice(type + 1)), type = location.indexOf("react_stack_bottom_frame"), -1 !== type && (type = location.lastIndexOf("\n", type)), type = -1 !== type ? location = location.slice(0, type) : "", location = type.lastIndexOf("\n"), type = -1 === location ? type : type.slice(location + 1), -1 !== type.indexOf(payload))) {
						payload = "\n" + type;
						break a;
					}
					payload = describeBuiltInComponentFrame(payload + (lazyComponent ? " [" + lazyComponent + "]" : ""));
				}
				return payload;
			}
		}
		switch (type) {
			case REACT_SUSPENSE_LIST_TYPE: return describeBuiltInComponentFrame("SuspenseList");
			case REACT_SUSPENSE_TYPE: return describeBuiltInComponentFrame("Suspense");
		}
		return "";
	}
	function isEligibleForOutlining(request, boundary) {
		return (500 < boundary.byteSize || hasSuspenseyContent(boundary.contentState)) && null === boundary.contentPreamble;
	}
	function defaultErrorHandler(error) {
		if ("object" === typeof error && null !== error && "string" === typeof error.environmentName) {
			var JSCompiler_inline_result = error.environmentName;
			error = [error].slice(0);
			"string" === typeof error[0] ? error.splice(0, 1, "\x1B[0m\x1B[7m%c%s\x1B[0m%c " + error[0], "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px", " " + JSCompiler_inline_result + " ", "") : error.splice(0, 0, "\x1B[0m\x1B[7m%c%s\x1B[0m%c", "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px", " " + JSCompiler_inline_result + " ", "");
			error.unshift(console);
			JSCompiler_inline_result = bind.apply(console.error, error);
			JSCompiler_inline_result();
		} else console.error(error);
		return null;
	}
	function RequestInstance(resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone, formState) {
		var abortSet = /* @__PURE__ */ new Set();
		this.destination = null;
		this.flushScheduled = !1;
		this.resumableState = resumableState;
		this.renderState = renderState;
		this.rootFormatContext = rootFormatContext;
		this.progressiveChunkSize = void 0 === progressiveChunkSize ? 12800 : progressiveChunkSize;
		this.status = 10;
		this.fatalError = null;
		this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0;
		this.completedPreambleSegments = this.completedRootSegment = null;
		this.byteSize = 0;
		this.abortableTasks = abortSet;
		this.pingedTasks = [];
		this.clientRenderedBoundaries = [];
		this.completedBoundaries = [];
		this.partialBoundaries = [];
		this.trackedPostpones = null;
		this.onError = void 0 === onError ? defaultErrorHandler : onError;
		this.onPostpone = void 0 === onPostpone ? noop : onPostpone;
		this.onAllReady = void 0 === onAllReady ? noop : onAllReady;
		this.onShellReady = void 0 === onShellReady ? noop : onShellReady;
		this.onShellError = void 0 === onShellError ? noop : onShellError;
		this.onFatalError = void 0 === onFatalError ? noop : onFatalError;
		this.formState = void 0 === formState ? null : formState;
	}
	function createRequest(children, resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone, formState) {
		resumableState = new RequestInstance(resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone, formState);
		renderState = createPendingSegment(resumableState, 0, null, rootFormatContext, !1, !1);
		renderState.parentFlushed = !0;
		children = createRenderTask(resumableState, null, children, -1, null, renderState, null, null, resumableState.abortableTasks, null, rootFormatContext, null, emptyTreeContext, null, null);
		pushComponentStack(children);
		resumableState.pingedTasks.push(children);
		return resumableState;
	}
	function createPrerenderRequest(children, resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone) {
		children = createRequest(children, resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone, void 0);
		children.trackedPostpones = {
			workingMap: /* @__PURE__ */ new Map(),
			rootNodes: [],
			rootSlots: null
		};
		return children;
	}
	function resumeRequest(children, postponedState, renderState, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone) {
		renderState = new RequestInstance(postponedState.resumableState, renderState, postponedState.rootFormatContext, postponedState.progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone, null);
		renderState.nextSegmentId = postponedState.nextSegmentId;
		if ("number" === typeof postponedState.replaySlots) return onError = createPendingSegment(renderState, 0, null, postponedState.rootFormatContext, !1, !1), onError.parentFlushed = !0, children = createRenderTask(renderState, null, children, -1, null, onError, null, null, renderState.abortableTasks, null, postponedState.rootFormatContext, null, emptyTreeContext, null, null), pushComponentStack(children), renderState.pingedTasks.push(children), renderState;
		children = createReplayTask(renderState, null, {
			nodes: postponedState.replayNodes,
			slots: postponedState.replaySlots,
			pendingTasks: 0
		}, children, -1, null, null, renderState.abortableTasks, null, postponedState.rootFormatContext, null, emptyTreeContext, null, null);
		pushComponentStack(children);
		renderState.pingedTasks.push(children);
		return renderState;
	}
	function resumeAndPrerenderRequest(children, postponedState, renderState, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone) {
		children = resumeRequest(children, postponedState, renderState, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone);
		children.trackedPostpones = {
			workingMap: /* @__PURE__ */ new Map(),
			rootNodes: [],
			rootSlots: null
		};
		return children;
	}
	var currentRequest = null;
	function resolveRequest() {
		if (currentRequest) return currentRequest;
		if (supportsRequestStorage) {
			var store = requestStorage.getStore();
			if (store) return store;
		}
		return null;
	}
	function pingTask(request, task) {
		request.pingedTasks.push(task);
		1 === request.pingedTasks.length && (request.flushScheduled = null !== request.destination, null !== request.trackedPostpones || 10 === request.status ? scheduleMicrotask(function() {
			return performWork(request);
		}) : setTimeout(function() {
			return performWork(request);
		}, 0));
	}
	function createSuspenseBoundary(request, row, fallbackAbortableTasks, contentPreamble, fallbackPreamble) {
		fallbackAbortableTasks = {
			status: 0,
			rootSegmentID: -1,
			parentFlushed: !1,
			pendingTasks: 0,
			row,
			completedSegments: [],
			byteSize: 0,
			fallbackAbortableTasks,
			errorDigest: null,
			contentState: createHoistableState(),
			fallbackState: createHoistableState(),
			contentPreamble,
			fallbackPreamble,
			trackedContentKeyPath: null,
			trackedFallbackNode: null
		};
		null !== row && (row.pendingTasks++, contentPreamble = row.boundaries, null !== contentPreamble && (request.allPendingTasks++, fallbackAbortableTasks.pendingTasks++, contentPreamble.push(fallbackAbortableTasks)), request = row.inheritedHoistables, null !== request && hoistHoistables(fallbackAbortableTasks.contentState, request));
		return fallbackAbortableTasks;
	}
	function createRenderTask(request, thenableState, node, childIndex, blockedBoundary, blockedSegment, blockedPreamble, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
		request.allPendingTasks++;
		null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
		null !== row && row.pendingTasks++;
		var task = {
			replay: null,
			node,
			childIndex,
			ping: function() {
				return pingTask(request, task);
			},
			blockedBoundary,
			blockedSegment,
			blockedPreamble,
			hoistableState,
			abortSet,
			keyPath,
			formatContext,
			context,
			treeContext,
			row,
			componentStack,
			thenableState
		};
		abortSet.add(task);
		return task;
	}
	function createReplayTask(request, thenableState, replay, node, childIndex, blockedBoundary, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
		request.allPendingTasks++;
		null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
		null !== row && row.pendingTasks++;
		replay.pendingTasks++;
		var task = {
			replay,
			node,
			childIndex,
			ping: function() {
				return pingTask(request, task);
			},
			blockedBoundary,
			blockedSegment: null,
			blockedPreamble: null,
			hoistableState,
			abortSet,
			keyPath,
			formatContext,
			context,
			treeContext,
			row,
			componentStack,
			thenableState
		};
		abortSet.add(task);
		return task;
	}
	function createPendingSegment(request, index, boundary, parentFormatContext, lastPushedText, textEmbedded) {
		return {
			status: 0,
			parentFlushed: !1,
			id: -1,
			index,
			chunks: [],
			children: [],
			preambleChildren: [],
			parentFormatContext,
			boundary,
			lastPushedText,
			textEmbedded
		};
	}
	function pushComponentStack(task) {
		var node = task.node;
		if ("object" === typeof node && null !== node) switch (node.$$typeof) {
			case REACT_ELEMENT_TYPE: task.componentStack = {
				parent: task.componentStack,
				type: node.type
			};
		}
	}
	function replaceSuspenseComponentStackWithSuspenseFallbackStack(componentStack) {
		return null === componentStack ? null : {
			parent: componentStack.parent,
			type: "Suspense Fallback"
		};
	}
	function getThrownInfo(node$jscomp$0) {
		var errorInfo = {};
		node$jscomp$0 && Object.defineProperty(errorInfo, "componentStack", {
			configurable: !0,
			enumerable: !0,
			get: function() {
				try {
					var info = "", node = node$jscomp$0;
					do
						info += describeComponentStackByType(node.type), node = node.parent;
					while (node);
					var JSCompiler_inline_result = info;
				} catch (x) {
					JSCompiler_inline_result = "\nError generating stack: " + x.message + "\n" + x.stack;
				}
				Object.defineProperty(errorInfo, "componentStack", { value: JSCompiler_inline_result });
				return JSCompiler_inline_result;
			}
		});
		return errorInfo;
	}
	function logRecoverableError(request, error, errorInfo) {
		request = request.onError;
		error = request(error, errorInfo);
		if (null == error || "string" === typeof error) return error;
	}
	function fatalError(request, error) {
		var onShellError = request.onShellError, onFatalError = request.onFatalError;
		onShellError(error);
		onFatalError(error);
		null !== request.destination ? (request.status = 14, closeWithError(request.destination, error)) : (request.status = 13, request.fatalError = error);
	}
	function finishSuspenseListRow(request, row) {
		unblockSuspenseListRow(request, row.next, row.hoistables);
	}
	function unblockSuspenseListRow(request, unblockedRow, inheritedHoistables) {
		for (; null !== unblockedRow;) {
			null !== inheritedHoistables && (hoistHoistables(unblockedRow.hoistables, inheritedHoistables), unblockedRow.inheritedHoistables = inheritedHoistables);
			var unblockedBoundaries = unblockedRow.boundaries;
			if (null !== unblockedBoundaries) {
				unblockedRow.boundaries = null;
				for (var i = 0; i < unblockedBoundaries.length; i++) {
					var unblockedBoundary = unblockedBoundaries[i];
					null !== inheritedHoistables && hoistHoistables(unblockedBoundary.contentState, inheritedHoistables);
					finishedTask(request, unblockedBoundary, null, null);
				}
			}
			unblockedRow.pendingTasks--;
			if (0 < unblockedRow.pendingTasks) break;
			inheritedHoistables = unblockedRow.hoistables;
			unblockedRow = unblockedRow.next;
		}
	}
	function tryToResolveTogetherRow(request, togetherRow) {
		var boundaries = togetherRow.boundaries;
		if (null !== boundaries && togetherRow.pendingTasks === boundaries.length) {
			for (var allCompleteAndInlinable = !0, i = 0; i < boundaries.length; i++) {
				var rowBoundary = boundaries[i];
				if (1 !== rowBoundary.pendingTasks || rowBoundary.parentFlushed || isEligibleForOutlining(request, rowBoundary)) {
					allCompleteAndInlinable = !1;
					break;
				}
			}
			allCompleteAndInlinable && unblockSuspenseListRow(request, togetherRow, togetherRow.hoistables);
		}
	}
	function createSuspenseListRow(previousRow) {
		var newRow = {
			pendingTasks: 1,
			boundaries: null,
			hoistables: createHoistableState(),
			inheritedHoistables: null,
			together: !1,
			next: null
		};
		null !== previousRow && 0 < previousRow.pendingTasks && (newRow.pendingTasks++, newRow.boundaries = [], previousRow.next = newRow);
		return newRow;
	}
	function renderSuspenseListRows(request, task, keyPath, rows, revealOrder) {
		var prevKeyPath = task.keyPath, prevTreeContext = task.treeContext, prevRow = task.row;
		task.keyPath = keyPath;
		keyPath = rows.length;
		var previousSuspenseListRow = null;
		if (null !== task.replay) {
			var resumeSlots = task.replay.slots;
			if (null !== resumeSlots && "object" === typeof resumeSlots) for (var n = 0; n < keyPath; n++) {
				var i = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? n : keyPath - 1 - n, node = rows[i];
				task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow);
				task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
				var resumeSegmentID = resumeSlots[i];
				"number" === typeof resumeSegmentID ? (resumeNode(request, task, resumeSegmentID, node, i), delete resumeSlots[i]) : renderNode(request, task, node, i);
				0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
			}
			else for (resumeSlots = 0; resumeSlots < keyPath; resumeSlots++) n = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? resumeSlots : keyPath - 1 - resumeSlots, i = rows[n], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(prevTreeContext, keyPath, n), renderNode(request, task, i, n), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
		} else if ("backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder) for (revealOrder = 0; revealOrder < keyPath; revealOrder++) resumeSlots = rows[revealOrder], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(prevTreeContext, keyPath, revealOrder), renderNode(request, task, resumeSlots, revealOrder), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
		else {
			revealOrder = task.blockedSegment;
			resumeSlots = revealOrder.children.length;
			n = revealOrder.chunks.length;
			for (i = keyPath - 1; 0 <= i; i--) {
				node = rows[i];
				task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow);
				task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
				resumeSegmentID = createPendingSegment(request, n, null, task.formatContext, 0 === i ? revealOrder.lastPushedText : !0, !0);
				revealOrder.children.splice(resumeSlots, 0, resumeSegmentID);
				task.blockedSegment = resumeSegmentID;
				try {
					renderNode(request, task, node, i), resumeSegmentID.lastPushedText && resumeSegmentID.textEmbedded && resumeSegmentID.chunks.push(textSeparator), resumeSegmentID.status = 1, finishedSegment(request, task.blockedBoundary, resumeSegmentID), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
				} catch (thrownValue) {
					throw resumeSegmentID.status = 12 === request.status ? 3 : 4, thrownValue;
				}
			}
			task.blockedSegment = revealOrder;
			revealOrder.lastPushedText = !1;
		}
		null !== prevRow && null !== previousSuspenseListRow && 0 < previousSuspenseListRow.pendingTasks && (prevRow.pendingTasks++, previousSuspenseListRow.next = prevRow);
		task.treeContext = prevTreeContext;
		task.row = prevRow;
		task.keyPath = prevKeyPath;
	}
	function renderWithHooks(request, task, keyPath, Component, props, secondArg) {
		var prevThenableState = task.thenableState;
		task.thenableState = null;
		currentlyRenderingComponent = {};
		currentlyRenderingTask = task;
		currentlyRenderingRequest = request;
		currentlyRenderingKeyPath = keyPath;
		actionStateCounter = localIdCounter = 0;
		actionStateMatchingIndex = -1;
		thenableIndexCounter = 0;
		thenableState = prevThenableState;
		for (request = Component(props, secondArg); didScheduleRenderPhaseUpdate;) didScheduleRenderPhaseUpdate = !1, actionStateCounter = localIdCounter = 0, actionStateMatchingIndex = -1, thenableIndexCounter = 0, numberOfReRenders += 1, workInProgressHook = null, request = Component(props, secondArg);
		resetHooksState();
		return request;
	}
	function finishFunctionComponent(request, task, keyPath, children, hasId, actionStateCount, actionStateMatchingIndex) {
		var didEmitActionStateMarkers = !1;
		if (0 !== actionStateCount && null !== request.formState) {
			var segment = task.blockedSegment;
			if (null !== segment) {
				didEmitActionStateMarkers = !0;
				segment = segment.chunks;
				for (var i = 0; i < actionStateCount; i++) i === actionStateMatchingIndex ? segment.push(formStateMarkerIsMatching) : segment.push(formStateMarkerIsNotMatching);
			}
		}
		actionStateCount = task.keyPath;
		task.keyPath = keyPath;
		hasId ? (keyPath = task.treeContext, task.treeContext = pushTreeContext(keyPath, 1, 0), renderNode(request, task, children, -1), task.treeContext = keyPath) : didEmitActionStateMarkers ? renderNode(request, task, children, -1) : renderNodeDestructive(request, task, children, -1);
		task.keyPath = actionStateCount;
	}
	function renderElement(request, task, keyPath, type, props, ref) {
		if ("function" === typeof type) if (type.prototype && type.prototype.isReactComponent) {
			var newProps = props;
			if ("ref" in props) {
				newProps = {};
				for (var propName in props) "ref" !== propName && (newProps[propName] = props[propName]);
			}
			var defaultProps = type.defaultProps;
			if (defaultProps) {
				newProps === props && (newProps = assign({}, newProps, props));
				for (var propName$44 in defaultProps) void 0 === newProps[propName$44] && (newProps[propName$44] = defaultProps[propName$44]);
			}
			props = newProps;
			newProps = emptyContextObject;
			defaultProps = type.contextType;
			"object" === typeof defaultProps && null !== defaultProps && (newProps = defaultProps._currentValue);
			newProps = new type(props, newProps);
			var initialState = void 0 !== newProps.state ? newProps.state : null;
			newProps.updater = classComponentUpdater;
			newProps.props = props;
			newProps.state = initialState;
			defaultProps = {
				queue: [],
				replace: !1
			};
			newProps._reactInternals = defaultProps;
			ref = type.contextType;
			newProps.context = "object" === typeof ref && null !== ref ? ref._currentValue : emptyContextObject;
			ref = type.getDerivedStateFromProps;
			"function" === typeof ref && (ref = ref(props, initialState), initialState = null === ref || void 0 === ref ? initialState : assign({}, initialState, ref), newProps.state = initialState);
			if ("function" !== typeof type.getDerivedStateFromProps && "function" !== typeof newProps.getSnapshotBeforeUpdate && ("function" === typeof newProps.UNSAFE_componentWillMount || "function" === typeof newProps.componentWillMount)) if (type = newProps.state, "function" === typeof newProps.componentWillMount && newProps.componentWillMount(), "function" === typeof newProps.UNSAFE_componentWillMount && newProps.UNSAFE_componentWillMount(), type !== newProps.state && classComponentUpdater.enqueueReplaceState(newProps, newProps.state, null), null !== defaultProps.queue && 0 < defaultProps.queue.length) if (type = defaultProps.queue, ref = defaultProps.replace, defaultProps.queue = null, defaultProps.replace = !1, ref && 1 === type.length) newProps.state = type[0];
			else {
				defaultProps = ref ? type[0] : newProps.state;
				initialState = !0;
				for (ref = ref ? 1 : 0; ref < type.length; ref++) propName$44 = type[ref], propName$44 = "function" === typeof propName$44 ? propName$44.call(newProps, defaultProps, props, void 0) : propName$44, null != propName$44 && (initialState ? (initialState = !1, defaultProps = assign({}, defaultProps, propName$44)) : assign(defaultProps, propName$44));
				newProps.state = defaultProps;
			}
			else defaultProps.queue = null;
			type = newProps.render();
			if (12 === request.status) throw null;
			props = task.keyPath;
			task.keyPath = keyPath;
			renderNodeDestructive(request, task, type, -1);
			task.keyPath = props;
		} else {
			type = renderWithHooks(request, task, keyPath, type, props, void 0);
			if (12 === request.status) throw null;
			finishFunctionComponent(request, task, keyPath, type, 0 !== localIdCounter, actionStateCounter, actionStateMatchingIndex);
		}
		else if ("string" === typeof type) if (newProps = task.blockedSegment, null === newProps) newProps = props.children, defaultProps = task.formatContext, initialState = task.keyPath, task.formatContext = getChildFormatContext(defaultProps, type, props), task.keyPath = keyPath, renderNode(request, task, newProps, -1), task.formatContext = defaultProps, task.keyPath = initialState;
		else {
			initialState = pushStartInstance(newProps.chunks, type, props, request.resumableState, request.renderState, task.blockedPreamble, task.hoistableState, task.formatContext, newProps.lastPushedText);
			newProps.lastPushedText = !1;
			defaultProps = task.formatContext;
			ref = task.keyPath;
			task.keyPath = keyPath;
			if (3 === (task.formatContext = getChildFormatContext(defaultProps, type, props)).insertionMode) {
				keyPath = createPendingSegment(request, 0, null, task.formatContext, !1, !1);
				newProps.preambleChildren.push(keyPath);
				task.blockedSegment = keyPath;
				try {
					keyPath.status = 6, renderNode(request, task, initialState, -1), keyPath.lastPushedText && keyPath.textEmbedded && keyPath.chunks.push(textSeparator), keyPath.status = 1, finishedSegment(request, task.blockedBoundary, keyPath);
				} finally {
					task.blockedSegment = newProps;
				}
			} else renderNode(request, task, initialState, -1);
			task.formatContext = defaultProps;
			task.keyPath = ref;
			a: {
				task = newProps.chunks;
				request = request.resumableState;
				switch (type) {
					case "title":
					case "style":
					case "script":
					case "area":
					case "base":
					case "br":
					case "col":
					case "embed":
					case "hr":
					case "img":
					case "input":
					case "keygen":
					case "link":
					case "meta":
					case "param":
					case "source":
					case "track":
					case "wbr": break a;
					case "body":
						if (1 >= defaultProps.insertionMode) {
							request.hasBody = !0;
							break a;
						}
						break;
					case "html":
						if (0 === defaultProps.insertionMode) {
							request.hasHtml = !0;
							break a;
						}
						break;
					case "head": if (1 >= defaultProps.insertionMode) break a;
				}
				task.push(endChunkForTag(type));
			}
			newProps.lastPushedText = !1;
		}
		else {
			switch (type) {
				case REACT_LEGACY_HIDDEN_TYPE:
				case REACT_STRICT_MODE_TYPE:
				case REACT_PROFILER_TYPE:
				case REACT_FRAGMENT_TYPE:
					type = task.keyPath;
					task.keyPath = keyPath;
					renderNodeDestructive(request, task, props.children, -1);
					task.keyPath = type;
					return;
				case REACT_ACTIVITY_TYPE:
					type = task.blockedSegment;
					null === type ? "hidden" !== props.mode && (type = task.keyPath, task.keyPath = keyPath, renderNode(request, task, props.children, -1), task.keyPath = type) : "hidden" !== props.mode && (type.chunks.push(startActivityBoundary), type.lastPushedText = !1, newProps = task.keyPath, task.keyPath = keyPath, renderNode(request, task, props.children, -1), task.keyPath = newProps, type.chunks.push(endActivityBoundary), type.lastPushedText = !1);
					return;
				case REACT_SUSPENSE_LIST_TYPE:
					a: {
						type = props.children;
						props = props.revealOrder;
						if ("forwards" === props || "backwards" === props || "unstable_legacy-backwards" === props) {
							if (isArrayImpl(type)) {
								renderSuspenseListRows(request, task, keyPath, type, props);
								break a;
							}
							if (newProps = getIteratorFn(type)) {
								if (newProps = newProps.call(type)) {
									defaultProps = newProps.next();
									if (!defaultProps.done) {
										do
											defaultProps = newProps.next();
										while (!defaultProps.done);
										renderSuspenseListRows(request, task, keyPath, type, props);
									}
									break a;
								}
							}
						}
						"together" === props ? (props = task.keyPath, newProps = task.row, defaultProps = task.row = createSuspenseListRow(null), defaultProps.boundaries = [], defaultProps.together = !0, task.keyPath = keyPath, renderNodeDestructive(request, task, type, -1), 0 === --defaultProps.pendingTasks && finishSuspenseListRow(request, defaultProps), task.keyPath = props, task.row = newProps, null !== newProps && 0 < defaultProps.pendingTasks && (newProps.pendingTasks++, defaultProps.next = newProps)) : (props = task.keyPath, task.keyPath = keyPath, renderNodeDestructive(request, task, type, -1), task.keyPath = props);
					}
					return;
				case REACT_VIEW_TRANSITION_TYPE:
				case REACT_SCOPE_TYPE: throw Error("ReactDOMServer does not yet support scope components.");
				case REACT_SUSPENSE_TYPE:
					a: if (null !== task.replay) {
						type = task.keyPath;
						newProps = task.formatContext;
						defaultProps = task.row;
						task.keyPath = keyPath;
						task.formatContext = getSuspenseContentFormatContext(request.resumableState, newProps);
						task.row = null;
						keyPath = props.children;
						try {
							renderNode(request, task, keyPath, -1);
						} finally {
							task.keyPath = type, task.formatContext = newProps, task.row = defaultProps;
						}
					} else {
						type = task.keyPath;
						ref = task.formatContext;
						var prevRow = task.row;
						propName$44 = task.blockedBoundary;
						propName = task.blockedPreamble;
						var parentHoistableState = task.hoistableState, parentSegment = task.blockedSegment, fallback = props.fallback;
						props = props.children;
						var fallbackAbortSet = /* @__PURE__ */ new Set();
						var newBoundary = 2 > task.formatContext.insertionMode ? createSuspenseBoundary(request, task.row, fallbackAbortSet, createPreambleState(), createPreambleState()) : createSuspenseBoundary(request, task.row, fallbackAbortSet, null, null);
						null !== request.trackedPostpones && (newBoundary.trackedContentKeyPath = keyPath);
						var boundarySegment = createPendingSegment(request, parentSegment.chunks.length, newBoundary, task.formatContext, !1, !1);
						parentSegment.children.push(boundarySegment);
						parentSegment.lastPushedText = !1;
						var contentRootSegment = createPendingSegment(request, 0, null, task.formatContext, !1, !1);
						contentRootSegment.parentFlushed = !0;
						if (null !== request.trackedPostpones) {
							newProps = task.componentStack;
							defaultProps = [
								keyPath[0],
								"Suspense Fallback",
								keyPath[2]
							];
							initialState = [
								defaultProps[1],
								defaultProps[2],
								[],
								null
							];
							request.trackedPostpones.workingMap.set(defaultProps, initialState);
							newBoundary.trackedFallbackNode = initialState;
							task.blockedSegment = boundarySegment;
							task.blockedPreamble = newBoundary.fallbackPreamble;
							task.keyPath = defaultProps;
							task.formatContext = getSuspenseFallbackFormatContext(request.resumableState, ref);
							task.componentStack = replaceSuspenseComponentStackWithSuspenseFallbackStack(newProps);
							boundarySegment.status = 6;
							try {
								renderNode(request, task, fallback, -1), boundarySegment.lastPushedText && boundarySegment.textEmbedded && boundarySegment.chunks.push(textSeparator), boundarySegment.status = 1, finishedSegment(request, propName$44, boundarySegment);
							} catch (thrownValue) {
								throw boundarySegment.status = 12 === request.status ? 3 : 4, thrownValue;
							} finally {
								task.blockedSegment = parentSegment, task.blockedPreamble = propName, task.keyPath = type, task.formatContext = ref;
							}
							task = createRenderTask(request, null, props, -1, newBoundary, contentRootSegment, newBoundary.contentPreamble, newBoundary.contentState, task.abortSet, keyPath, getSuspenseContentFormatContext(request.resumableState, task.formatContext), task.context, task.treeContext, null, newProps);
							pushComponentStack(task);
							request.pingedTasks.push(task);
						} else {
							task.blockedBoundary = newBoundary;
							task.blockedPreamble = newBoundary.contentPreamble;
							task.hoistableState = newBoundary.contentState;
							task.blockedSegment = contentRootSegment;
							task.keyPath = keyPath;
							task.formatContext = getSuspenseContentFormatContext(request.resumableState, ref);
							task.row = null;
							contentRootSegment.status = 6;
							try {
								if (renderNode(request, task, props, -1), contentRootSegment.lastPushedText && contentRootSegment.textEmbedded && contentRootSegment.chunks.push(textSeparator), contentRootSegment.status = 1, finishedSegment(request, newBoundary, contentRootSegment), queueCompletedSegment(newBoundary, contentRootSegment), 0 === newBoundary.pendingTasks && 0 === newBoundary.status) {
									if (newBoundary.status = 1, !isEligibleForOutlining(request, newBoundary)) {
										null !== prevRow && 0 === --prevRow.pendingTasks && finishSuspenseListRow(request, prevRow);
										0 === request.pendingRootTasks && task.blockedPreamble && preparePreamble(request);
										break a;
									}
								} else null !== prevRow && prevRow.together && tryToResolveTogetherRow(request, prevRow);
							} catch (thrownValue$31) {
								newBoundary.status = 4, 12 === request.status ? (contentRootSegment.status = 3, newProps = request.fatalError) : (contentRootSegment.status = 4, newProps = thrownValue$31), defaultProps = getThrownInfo(task.componentStack), initialState = logRecoverableError(request, newProps, defaultProps), newBoundary.errorDigest = initialState, untrackBoundary(request, newBoundary);
							} finally {
								task.blockedBoundary = propName$44, task.blockedPreamble = propName, task.hoistableState = parentHoistableState, task.blockedSegment = parentSegment, task.keyPath = type, task.formatContext = ref, task.row = prevRow;
							}
							task = createRenderTask(request, null, fallback, -1, propName$44, boundarySegment, newBoundary.fallbackPreamble, newBoundary.fallbackState, fallbackAbortSet, [
								keyPath[0],
								"Suspense Fallback",
								keyPath[2]
							], getSuspenseFallbackFormatContext(request.resumableState, task.formatContext), task.context, task.treeContext, task.row, replaceSuspenseComponentStackWithSuspenseFallbackStack(task.componentStack));
							pushComponentStack(task);
							request.pingedTasks.push(task);
						}
					}
					return;
			}
			if ("object" === typeof type && null !== type) switch (type.$$typeof) {
				case REACT_FORWARD_REF_TYPE:
					if ("ref" in props) for (parentSegment in newProps = {}, props) "ref" !== parentSegment && (newProps[parentSegment] = props[parentSegment]);
					else newProps = props;
					type = renderWithHooks(request, task, keyPath, type.render, newProps, ref);
					finishFunctionComponent(request, task, keyPath, type, 0 !== localIdCounter, actionStateCounter, actionStateMatchingIndex);
					return;
				case REACT_MEMO_TYPE:
					renderElement(request, task, keyPath, type.type, props, ref);
					return;
				case REACT_CONTEXT_TYPE:
					defaultProps = props.children;
					newProps = task.keyPath;
					props = props.value;
					initialState = type._currentValue;
					type._currentValue = props;
					ref = currentActiveSnapshot;
					currentActiveSnapshot = type = {
						parent: ref,
						depth: null === ref ? 0 : ref.depth + 1,
						context: type,
						parentValue: initialState,
						value: props
					};
					task.context = type;
					task.keyPath = keyPath;
					renderNodeDestructive(request, task, defaultProps, -1);
					request = currentActiveSnapshot;
					if (null === request) throw Error("Tried to pop a Context at the root of the app. This is a bug in React.");
					request.context._currentValue = request.parentValue;
					request = currentActiveSnapshot = request.parent;
					task.context = request;
					task.keyPath = newProps;
					return;
				case REACT_CONSUMER_TYPE:
					props = props.children;
					type = props(type._context._currentValue);
					props = task.keyPath;
					task.keyPath = keyPath;
					renderNodeDestructive(request, task, type, -1);
					task.keyPath = props;
					return;
				case REACT_LAZY_TYPE:
					newProps = type._init;
					type = newProps(type._payload);
					if (12 === request.status) throw null;
					renderElement(request, task, keyPath, type, props, ref);
					return;
			}
			throw Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + ((null == type ? type : typeof type) + "."));
		}
	}
	function resumeNode(request, task, segmentId, node, childIndex) {
		var prevReplay = task.replay, blockedBoundary = task.blockedBoundary, resumedSegment = createPendingSegment(request, 0, null, task.formatContext, !1, !1);
		resumedSegment.id = segmentId;
		resumedSegment.parentFlushed = !0;
		try {
			task.replay = null, task.blockedSegment = resumedSegment, renderNode(request, task, node, childIndex), resumedSegment.status = 1, finishedSegment(request, blockedBoundary, resumedSegment), null === blockedBoundary ? request.completedRootSegment = resumedSegment : (queueCompletedSegment(blockedBoundary, resumedSegment), blockedBoundary.parentFlushed && request.partialBoundaries.push(blockedBoundary));
		} finally {
			task.replay = prevReplay, task.blockedSegment = null;
		}
	}
	function renderNodeDestructive(request, task, node, childIndex) {
		null !== task.replay && "number" === typeof task.replay.slots ? resumeNode(request, task, task.replay.slots, node, childIndex) : (task.node = node, task.childIndex = childIndex, node = task.componentStack, pushComponentStack(task), retryNode(request, task), task.componentStack = node);
	}
	function retryNode(request, task) {
		var node = task.node, childIndex = task.childIndex;
		if (null !== node) {
			if ("object" === typeof node) {
				switch (node.$$typeof) {
					case REACT_ELEMENT_TYPE:
						var type = node.type, key = node.key, props = node.props;
						node = props.ref;
						var ref = void 0 !== node ? node : null, name = getComponentNameFromType(type), keyOrIndex = null == key ? -1 === childIndex ? 0 : childIndex : key;
						key = [
							task.keyPath,
							name,
							keyOrIndex
						];
						if (null !== task.replay) a: {
							var replay = task.replay;
							childIndex = replay.nodes;
							for (node = 0; node < childIndex.length; node++) {
								var node$jscomp$0 = childIndex[node];
								if (keyOrIndex === node$jscomp$0[1]) {
									if (4 === node$jscomp$0.length) {
										if (null !== name && name !== node$jscomp$0[0]) throw Error("Expected the resume to render <" + node$jscomp$0[0] + "> in this slot but instead it rendered <" + name + ">. The tree doesn't match so React will fallback to client rendering.");
										var childNodes = node$jscomp$0[2];
										name = node$jscomp$0[3];
										keyOrIndex = task.node;
										task.replay = {
											nodes: childNodes,
											slots: name,
											pendingTasks: 1
										};
										try {
											renderElement(request, task, key, type, props, ref);
											if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length) throw Error("Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.");
											task.replay.pendingTasks--;
										} catch (x) {
											if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then)) throw task.node === keyOrIndex ? task.replay = replay : childIndex.splice(node, 1), x;
											task.replay.pendingTasks--;
											props = getThrownInfo(task.componentStack);
											key = request;
											request = task.blockedBoundary;
											type = x;
											props = logRecoverableError(key, type, props);
											abortRemainingReplayNodes(key, request, childNodes, name, type, props);
										}
										task.replay = replay;
									} else {
										if (type !== REACT_SUSPENSE_TYPE) throw Error("Expected the resume to render <Suspense> in this slot but instead it rendered <" + (getComponentNameFromType(type) || "Unknown") + ">. The tree doesn't match so React will fallback to client rendering.");
										b: {
											replay = void 0;
											type = node$jscomp$0[5];
											ref = node$jscomp$0[2];
											name = node$jscomp$0[3];
											keyOrIndex = null === node$jscomp$0[4] ? [] : node$jscomp$0[4][2];
											node$jscomp$0 = null === node$jscomp$0[4] ? null : node$jscomp$0[4][3];
											var prevKeyPath = task.keyPath, prevContext = task.formatContext, prevRow = task.row, previousReplaySet = task.replay, parentBoundary = task.blockedBoundary, parentHoistableState = task.hoistableState, content = props.children, fallback = props.fallback, fallbackAbortSet = /* @__PURE__ */ new Set();
											props = 2 > task.formatContext.insertionMode ? createSuspenseBoundary(request, task.row, fallbackAbortSet, createPreambleState(), createPreambleState()) : createSuspenseBoundary(request, task.row, fallbackAbortSet, null, null);
											props.parentFlushed = !0;
											props.rootSegmentID = type;
											task.blockedBoundary = props;
											task.hoistableState = props.contentState;
											task.keyPath = key;
											task.formatContext = getSuspenseContentFormatContext(request.resumableState, prevContext);
											task.row = null;
											task.replay = {
												nodes: ref,
												slots: name,
												pendingTasks: 1
											};
											try {
												renderNode(request, task, content, -1);
												if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length) throw Error("Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.");
												task.replay.pendingTasks--;
												if (0 === props.pendingTasks && 0 === props.status) {
													props.status = 1;
													request.completedBoundaries.push(props);
													break b;
												}
											} catch (error) {
												props.status = 4, childNodes = getThrownInfo(task.componentStack), replay = logRecoverableError(request, error, childNodes), props.errorDigest = replay, task.replay.pendingTasks--, request.clientRenderedBoundaries.push(props);
											} finally {
												task.blockedBoundary = parentBoundary, task.hoistableState = parentHoistableState, task.replay = previousReplaySet, task.keyPath = prevKeyPath, task.formatContext = prevContext, task.row = prevRow;
											}
											childNodes = createReplayTask(request, null, {
												nodes: keyOrIndex,
												slots: node$jscomp$0,
												pendingTasks: 0
											}, fallback, -1, parentBoundary, props.fallbackState, fallbackAbortSet, [
												key[0],
												"Suspense Fallback",
												key[2]
											], getSuspenseFallbackFormatContext(request.resumableState, task.formatContext), task.context, task.treeContext, task.row, replaceSuspenseComponentStackWithSuspenseFallbackStack(task.componentStack));
											pushComponentStack(childNodes);
											request.pingedTasks.push(childNodes);
										}
									}
									childIndex.splice(node, 1);
									break a;
								}
							}
						}
						else renderElement(request, task, key, type, props, ref);
						return;
					case REACT_PORTAL_TYPE: throw Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.");
					case REACT_LAZY_TYPE:
						childNodes = node._init;
						node = childNodes(node._payload);
						if (12 === request.status) throw null;
						renderNodeDestructive(request, task, node, childIndex);
						return;
				}
				if (isArrayImpl(node)) {
					renderChildrenArray(request, task, node, childIndex);
					return;
				}
				if (childNodes = getIteratorFn(node)) {
					if (childNodes = childNodes.call(node)) {
						node = childNodes.next();
						if (!node.done) {
							props = [];
							do
								props.push(node.value), node = childNodes.next();
							while (!node.done);
							renderChildrenArray(request, task, props, childIndex);
						}
						return;
					}
				}
				if ("function" === typeof node.then) return task.thenableState = null, renderNodeDestructive(request, task, unwrapThenable(node), childIndex);
				if (node.$$typeof === REACT_CONTEXT_TYPE) return renderNodeDestructive(request, task, node._currentValue, childIndex);
				childIndex = Object.prototype.toString.call(node);
				throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === childIndex ? "object with keys {" + Object.keys(node).join(", ") + "}" : childIndex) + "). If you meant to render a collection of children, use an array instead.");
			}
			if ("string" === typeof node) childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(childIndex.chunks, node, request.renderState, childIndex.lastPushedText));
			else if ("number" === typeof node || "bigint" === typeof node) childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(childIndex.chunks, "" + node, request.renderState, childIndex.lastPushedText));
		}
	}
	function renderChildrenArray(request, task, children, childIndex) {
		var prevKeyPath = task.keyPath;
		if (-1 !== childIndex && (task.keyPath = [
			task.keyPath,
			"Fragment",
			childIndex
		], null !== task.replay)) {
			for (var replay = task.replay, replayNodes = replay.nodes, j = 0; j < replayNodes.length; j++) {
				var node = replayNodes[j];
				if (node[1] === childIndex) {
					childIndex = node[2];
					node = node[3];
					task.replay = {
						nodes: childIndex,
						slots: node,
						pendingTasks: 1
					};
					try {
						renderChildrenArray(request, task, children, -1);
						if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length) throw Error("Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.");
						task.replay.pendingTasks--;
					} catch (x) {
						if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then)) throw x;
						task.replay.pendingTasks--;
						children = getThrownInfo(task.componentStack);
						var boundary = task.blockedBoundary, error = x;
						children = logRecoverableError(request, error, children);
						abortRemainingReplayNodes(request, boundary, childIndex, node, error, children);
					}
					task.replay = replay;
					replayNodes.splice(j, 1);
					break;
				}
			}
			task.keyPath = prevKeyPath;
			return;
		}
		replay = task.treeContext;
		replayNodes = children.length;
		if (null !== task.replay && (j = task.replay.slots, null !== j && "object" === typeof j)) {
			for (childIndex = 0; childIndex < replayNodes; childIndex++) node = children[childIndex], task.treeContext = pushTreeContext(replay, replayNodes, childIndex), boundary = j[childIndex], "number" === typeof boundary ? (resumeNode(request, task, boundary, node, childIndex), delete j[childIndex]) : renderNode(request, task, node, childIndex);
			task.treeContext = replay;
			task.keyPath = prevKeyPath;
			return;
		}
		for (j = 0; j < replayNodes; j++) childIndex = children[j], task.treeContext = pushTreeContext(replay, replayNodes, j), renderNode(request, task, childIndex, j);
		task.treeContext = replay;
		task.keyPath = prevKeyPath;
	}
	function trackPostponedBoundary(request, trackedPostpones, boundary) {
		boundary.status = 5;
		boundary.rootSegmentID = request.nextSegmentId++;
		request = boundary.trackedContentKeyPath;
		if (null === request) throw Error("It should not be possible to postpone at the root. This is a bug in React.");
		var fallbackReplayNode = boundary.trackedFallbackNode, children = [], boundaryNode = trackedPostpones.workingMap.get(request);
		if (void 0 === boundaryNode) return boundary = [
			request[1],
			request[2],
			children,
			null,
			fallbackReplayNode,
			boundary.rootSegmentID
		], trackedPostpones.workingMap.set(request, boundary), addToReplayParent(boundary, request[0], trackedPostpones), boundary;
		boundaryNode[4] = fallbackReplayNode;
		boundaryNode[5] = boundary.rootSegmentID;
		return boundaryNode;
	}
	function trackPostpone(request, trackedPostpones, task, segment) {
		segment.status = 5;
		var keyPath = task.keyPath, boundary = task.blockedBoundary;
		if (null === boundary) segment.id = request.nextSegmentId++, trackedPostpones.rootSlots = segment.id, null !== request.completedRootSegment && (request.completedRootSegment.status = 5);
		else {
			if (null !== boundary && 0 === boundary.status) {
				var boundaryNode = trackPostponedBoundary(request, trackedPostpones, boundary);
				if (boundary.trackedContentKeyPath === keyPath && -1 === task.childIndex) {
					-1 === segment.id && (segment.id = segment.parentFlushed ? boundary.rootSegmentID : request.nextSegmentId++);
					boundaryNode[3] = segment.id;
					return;
				}
			}
			-1 === segment.id && (segment.id = segment.parentFlushed && null !== boundary ? boundary.rootSegmentID : request.nextSegmentId++);
			if (-1 === task.childIndex) null === keyPath ? trackedPostpones.rootSlots = segment.id : (task = trackedPostpones.workingMap.get(keyPath), void 0 === task ? (task = [
				keyPath[1],
				keyPath[2],
				[],
				segment.id
			], addToReplayParent(task, keyPath[0], trackedPostpones)) : task[3] = segment.id);
			else {
				if (null === keyPath) {
					if (request = trackedPostpones.rootSlots, null === request) request = trackedPostpones.rootSlots = {};
					else if ("number" === typeof request) throw Error("It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React.");
				} else if (boundary = trackedPostpones.workingMap, boundaryNode = boundary.get(keyPath), void 0 === boundaryNode) request = {}, boundaryNode = [
					keyPath[1],
					keyPath[2],
					[],
					request
				], boundary.set(keyPath, boundaryNode), addToReplayParent(boundaryNode, keyPath[0], trackedPostpones);
				else if (request = boundaryNode[3], null === request) request = boundaryNode[3] = {};
				else if ("number" === typeof request) throw Error("It should not be possible to postpone both at the root of an element as well as a slot below. This is a bug in React.");
				request[task.childIndex] = segment.id;
			}
		}
	}
	function untrackBoundary(request, boundary) {
		request = request.trackedPostpones;
		null !== request && (boundary = boundary.trackedContentKeyPath, null !== boundary && (boundary = request.workingMap.get(boundary), void 0 !== boundary && (boundary.length = 4, boundary[2] = [], boundary[3] = null)));
	}
	function spawnNewSuspendedReplayTask(request, task, thenableState) {
		return createReplayTask(request, thenableState, task.replay, task.node, task.childIndex, task.blockedBoundary, task.hoistableState, task.abortSet, task.keyPath, task.formatContext, task.context, task.treeContext, task.row, task.componentStack);
	}
	function spawnNewSuspendedRenderTask(request, task, thenableState) {
		var segment = task.blockedSegment, newSegment = createPendingSegment(request, segment.chunks.length, null, task.formatContext, segment.lastPushedText, !0);
		segment.children.push(newSegment);
		segment.lastPushedText = !1;
		return createRenderTask(request, thenableState, task.node, task.childIndex, task.blockedBoundary, newSegment, task.blockedPreamble, task.hoistableState, task.abortSet, task.keyPath, task.formatContext, task.context, task.treeContext, task.row, task.componentStack);
	}
	function renderNode(request, task, node, childIndex) {
		var previousFormatContext = task.formatContext, previousContext = task.context, previousKeyPath = task.keyPath, previousTreeContext = task.treeContext, previousComponentStack = task.componentStack, segment = task.blockedSegment;
		if (null === segment) {
			segment = task.replay;
			try {
				return renderNodeDestructive(request, task, node, childIndex);
			} catch (thrownValue) {
				if (resetHooksState(), node = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue, 12 !== request.status && "object" === typeof node && null !== node) {
					if ("function" === typeof node.then) {
						childIndex = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
						request = spawnNewSuspendedReplayTask(request, task, childIndex).ping;
						node.then(request, request);
						task.formatContext = previousFormatContext;
						task.context = previousContext;
						task.keyPath = previousKeyPath;
						task.treeContext = previousTreeContext;
						task.componentStack = previousComponentStack;
						task.replay = segment;
						switchContext(previousContext);
						return;
					}
					if ("Maximum call stack size exceeded" === node.message) {
						node = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
						node = spawnNewSuspendedReplayTask(request, task, node);
						request.pingedTasks.push(node);
						task.formatContext = previousFormatContext;
						task.context = previousContext;
						task.keyPath = previousKeyPath;
						task.treeContext = previousTreeContext;
						task.componentStack = previousComponentStack;
						task.replay = segment;
						switchContext(previousContext);
						return;
					}
				}
			}
		} else {
			var childrenLength = segment.children.length, chunkLength = segment.chunks.length;
			try {
				return renderNodeDestructive(request, task, node, childIndex);
			} catch (thrownValue$63) {
				if (resetHooksState(), segment.children.length = childrenLength, segment.chunks.length = chunkLength, node = thrownValue$63 === SuspenseException ? getSuspendedThenable() : thrownValue$63, 12 !== request.status && "object" === typeof node && null !== node) {
					if ("function" === typeof node.then) {
						segment = node;
						node = thrownValue$63 === SuspenseException ? getThenableStateAfterSuspending() : null;
						request = spawnNewSuspendedRenderTask(request, task, node).ping;
						segment.then(request, request);
						task.formatContext = previousFormatContext;
						task.context = previousContext;
						task.keyPath = previousKeyPath;
						task.treeContext = previousTreeContext;
						task.componentStack = previousComponentStack;
						switchContext(previousContext);
						return;
					}
					if ("Maximum call stack size exceeded" === node.message) {
						segment = thrownValue$63 === SuspenseException ? getThenableStateAfterSuspending() : null;
						segment = spawnNewSuspendedRenderTask(request, task, segment);
						request.pingedTasks.push(segment);
						task.formatContext = previousFormatContext;
						task.context = previousContext;
						task.keyPath = previousKeyPath;
						task.treeContext = previousTreeContext;
						task.componentStack = previousComponentStack;
						switchContext(previousContext);
						return;
					}
				}
			}
		}
		task.formatContext = previousFormatContext;
		task.context = previousContext;
		task.keyPath = previousKeyPath;
		task.treeContext = previousTreeContext;
		switchContext(previousContext);
		throw node;
	}
	function abortTaskSoft(task) {
		var boundary = task.blockedBoundary, segment = task.blockedSegment;
		null !== segment && (segment.status = 3, finishedTask(this, boundary, task.row, segment));
	}
	function abortRemainingReplayNodes(request$jscomp$0, boundary, nodes, slots, error, errorDigest$jscomp$0) {
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (4 === node.length) abortRemainingReplayNodes(request$jscomp$0, boundary, node[2], node[3], error, errorDigest$jscomp$0);
			else {
				node = node[5];
				var request = request$jscomp$0, errorDigest = errorDigest$jscomp$0, resumedBoundary = createSuspenseBoundary(request, null, /* @__PURE__ */ new Set(), null, null);
				resumedBoundary.parentFlushed = !0;
				resumedBoundary.rootSegmentID = node;
				resumedBoundary.status = 4;
				resumedBoundary.errorDigest = errorDigest;
				resumedBoundary.parentFlushed && request.clientRenderedBoundaries.push(resumedBoundary);
			}
		}
		nodes.length = 0;
		if (null !== slots) {
			if (null === boundary) throw Error("We should not have any resumable nodes in the shell. This is a bug in React.");
			4 !== boundary.status && (boundary.status = 4, boundary.errorDigest = errorDigest$jscomp$0, boundary.parentFlushed && request$jscomp$0.clientRenderedBoundaries.push(boundary));
			if ("object" === typeof slots) for (var index in slots) delete slots[index];
		}
	}
	function abortTask(task, request, error) {
		var boundary = task.blockedBoundary, segment = task.blockedSegment;
		if (null !== segment) {
			if (6 === segment.status) return;
			segment.status = 3;
		}
		var errorInfo = getThrownInfo(task.componentStack);
		if (null === boundary) {
			if (13 !== request.status && 14 !== request.status) {
				boundary = task.replay;
				if (null === boundary) {
					null !== request.trackedPostpones && null !== segment ? (boundary = request.trackedPostpones, logRecoverableError(request, error, errorInfo), trackPostpone(request, boundary, task, segment), finishedTask(request, null, task.row, segment)) : (logRecoverableError(request, error, errorInfo), fatalError(request, error));
					return;
				}
				boundary.pendingTasks--;
				0 === boundary.pendingTasks && 0 < boundary.nodes.length && (segment = logRecoverableError(request, error, errorInfo), abortRemainingReplayNodes(request, null, boundary.nodes, boundary.slots, error, segment));
				request.pendingRootTasks--;
				0 === request.pendingRootTasks && completeShell(request);
			}
		} else {
			var trackedPostpones$64 = request.trackedPostpones;
			if (4 !== boundary.status) {
				if (null !== trackedPostpones$64 && null !== segment) return logRecoverableError(request, error, errorInfo), trackPostpone(request, trackedPostpones$64, task, segment), boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
					return abortTask(fallbackTask, request, error);
				}), boundary.fallbackAbortableTasks.clear(), finishedTask(request, boundary, task.row, segment);
				boundary.status = 4;
				segment = logRecoverableError(request, error, errorInfo);
				boundary.status = 4;
				boundary.errorDigest = segment;
				untrackBoundary(request, boundary);
				boundary.parentFlushed && request.clientRenderedBoundaries.push(boundary);
			}
			boundary.pendingTasks--;
			segment = boundary.row;
			null !== segment && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
			boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
				return abortTask(fallbackTask, request, error);
			});
			boundary.fallbackAbortableTasks.clear();
		}
		task = task.row;
		null !== task && 0 === --task.pendingTasks && finishSuspenseListRow(request, task);
		request.allPendingTasks--;
		0 === request.allPendingTasks && completeAll(request);
	}
	function safelyEmitEarlyPreloads(request, shellComplete) {
		try {
			var renderState = request.renderState, onHeaders = renderState.onHeaders;
			if (onHeaders) {
				var headers = renderState.headers;
				if (headers) {
					renderState.headers = null;
					var linkHeader = headers.preconnects;
					headers.fontPreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.fontPreloads);
					headers.highImagePreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.highImagePreloads);
					if (!shellComplete) {
						var queueIter = renderState.styles.values(), queueStep = queueIter.next();
						b: for (; 0 < headers.remainingCapacity && !queueStep.done; queueStep = queueIter.next()) for (var sheetIter = queueStep.value.sheets.values(), sheetStep = sheetIter.next(); 0 < headers.remainingCapacity && !sheetStep.done; sheetStep = sheetIter.next()) {
							var sheet = sheetStep.value, props = sheet.props, key = props.href, props$jscomp$0 = sheet.props, header = getPreloadAsHeader(props$jscomp$0.href, "style", {
								crossOrigin: props$jscomp$0.crossOrigin,
								integrity: props$jscomp$0.integrity,
								nonce: props$jscomp$0.nonce,
								type: props$jscomp$0.type,
								fetchPriority: props$jscomp$0.fetchPriority,
								referrerPolicy: props$jscomp$0.referrerPolicy,
								media: props$jscomp$0.media
							});
							if (0 <= (headers.remainingCapacity -= header.length + 2)) renderState.resets.style[key] = PRELOAD_NO_CREDS, linkHeader && (linkHeader += ", "), linkHeader += header, renderState.resets.style[key] = "string" === typeof props.crossOrigin || "string" === typeof props.integrity ? [props.crossOrigin, props.integrity] : PRELOAD_NO_CREDS;
							else break b;
						}
					}
					linkHeader ? onHeaders({ Link: linkHeader }) : onHeaders({});
				}
			}
		} catch (error) {
			logRecoverableError(request, error, {});
		}
	}
	function completeShell(request) {
		null === request.trackedPostpones && safelyEmitEarlyPreloads(request, !0);
		null === request.trackedPostpones && preparePreamble(request);
		request.onShellError = noop;
		request = request.onShellReady;
		request();
	}
	function completeAll(request) {
		safelyEmitEarlyPreloads(request, null === request.trackedPostpones ? !0 : null === request.completedRootSegment || 5 !== request.completedRootSegment.status);
		preparePreamble(request);
		request = request.onAllReady;
		request();
	}
	function queueCompletedSegment(boundary, segment) {
		if (0 === segment.chunks.length && 1 === segment.children.length && null === segment.children[0].boundary && -1 === segment.children[0].id) {
			var childSegment = segment.children[0];
			childSegment.id = segment.id;
			childSegment.parentFlushed = !0;
			1 !== childSegment.status && 3 !== childSegment.status && 4 !== childSegment.status || queueCompletedSegment(boundary, childSegment);
		} else boundary.completedSegments.push(segment);
	}
	function finishedSegment(request, boundary, segment) {
		if (null !== byteLengthOfChunk) {
			segment = segment.chunks;
			for (var segmentByteSize = 0, i = 0; i < segment.length; i++) segmentByteSize += segment[i].byteLength;
			null === boundary ? request.byteSize += segmentByteSize : boundary.byteSize += segmentByteSize;
		}
	}
	function finishedTask(request, boundary, row, segment) {
		null !== row && (0 === --row.pendingTasks ? finishSuspenseListRow(request, row) : row.together && tryToResolveTogetherRow(request, row));
		request.allPendingTasks--;
		if (null === boundary) {
			if (null !== segment && segment.parentFlushed) {
				if (null !== request.completedRootSegment) throw Error("There can only be one root segment. This is a bug in React.");
				request.completedRootSegment = segment;
			}
			request.pendingRootTasks--;
			0 === request.pendingRootTasks && completeShell(request);
		} else if (boundary.pendingTasks--, 4 !== boundary.status) if (0 === boundary.pendingTasks) {
			if (0 === boundary.status && (boundary.status = 1), null !== segment && segment.parentFlushed && (1 === segment.status || 3 === segment.status) && queueCompletedSegment(boundary, segment), boundary.parentFlushed && request.completedBoundaries.push(boundary), 1 === boundary.status) row = boundary.row, null !== row && hoistHoistables(row.hoistables, boundary.contentState), isEligibleForOutlining(request, boundary) || (boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request), boundary.fallbackAbortableTasks.clear(), null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row)), 0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary.contentPreamble && preparePreamble(request);
			else if (5 === boundary.status && (boundary = boundary.row, null !== boundary)) {
				if (null !== request.trackedPostpones) {
					row = request.trackedPostpones;
					var postponedRow = boundary.next;
					if (null !== postponedRow && (segment = postponedRow.boundaries, null !== segment)) for (postponedRow.boundaries = null, postponedRow = 0; postponedRow < segment.length; postponedRow++) {
						var postponedBoundary = segment[postponedRow];
						trackPostponedBoundary(request, row, postponedBoundary);
						finishedTask(request, postponedBoundary, null, null);
					}
				}
				0 === --boundary.pendingTasks && finishSuspenseListRow(request, boundary);
			}
		} else null === segment || !segment.parentFlushed || 1 !== segment.status && 3 !== segment.status || (queueCompletedSegment(boundary, segment), 1 === boundary.completedSegments.length && boundary.parentFlushed && request.partialBoundaries.push(boundary)), boundary = boundary.row, null !== boundary && boundary.together && tryToResolveTogetherRow(request, boundary);
		0 === request.allPendingTasks && completeAll(request);
	}
	function performWork(request$jscomp$2) {
		if (14 !== request$jscomp$2.status && 13 !== request$jscomp$2.status) {
			var prevContext = currentActiveSnapshot, prevDispatcher = ReactSharedInternals.H;
			ReactSharedInternals.H = HooksDispatcher;
			var prevAsyncDispatcher = ReactSharedInternals.A;
			ReactSharedInternals.A = DefaultAsyncDispatcher;
			var prevRequest = currentRequest;
			currentRequest = request$jscomp$2;
			var prevResumableState = currentResumableState;
			currentResumableState = request$jscomp$2.resumableState;
			try {
				var pingedTasks = request$jscomp$2.pingedTasks, i;
				for (i = 0; i < pingedTasks.length; i++) {
					var task = pingedTasks[i], request = request$jscomp$2, segment = task.blockedSegment;
					if (null === segment) {
						var request$jscomp$0 = request;
						if (0 !== task.replay.pendingTasks) {
							switchContext(task.context);
							try {
								"number" === typeof task.replay.slots ? resumeNode(request$jscomp$0, task, task.replay.slots, task.node, task.childIndex) : retryNode(request$jscomp$0, task);
								if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length) throw Error("Couldn't find all resumable slots by key/index during replaying. The tree doesn't match so React will fallback to client rendering.");
								task.replay.pendingTasks--;
								task.abortSet.delete(task);
								finishedTask(request$jscomp$0, task.blockedBoundary, task.row, null);
							} catch (thrownValue) {
								resetHooksState();
								var x = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
								if ("object" === typeof x && null !== x && "function" === typeof x.then) {
									var ping = task.ping;
									x.then(ping, ping);
									task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
								} else {
									task.replay.pendingTasks--;
									task.abortSet.delete(task);
									var errorInfo = getThrownInfo(task.componentStack);
									request = void 0;
									var request$jscomp$1 = request$jscomp$0, boundary = task.blockedBoundary, error$jscomp$0 = 12 === request$jscomp$0.status ? request$jscomp$0.fatalError : x, replayNodes = task.replay.nodes, resumeSlots = task.replay.slots;
									request = logRecoverableError(request$jscomp$1, error$jscomp$0, errorInfo);
									abortRemainingReplayNodes(request$jscomp$1, boundary, replayNodes, resumeSlots, error$jscomp$0, request);
									request$jscomp$0.pendingRootTasks--;
									0 === request$jscomp$0.pendingRootTasks && completeShell(request$jscomp$0);
									request$jscomp$0.allPendingTasks--;
									0 === request$jscomp$0.allPendingTasks && completeAll(request$jscomp$0);
								}
							}
						}
					} else if (request$jscomp$0 = void 0, request$jscomp$1 = segment, 0 === request$jscomp$1.status) {
						request$jscomp$1.status = 6;
						switchContext(task.context);
						var childrenLength = request$jscomp$1.children.length, chunkLength = request$jscomp$1.chunks.length;
						try {
							retryNode(request, task), request$jscomp$1.lastPushedText && request$jscomp$1.textEmbedded && request$jscomp$1.chunks.push(textSeparator), task.abortSet.delete(task), request$jscomp$1.status = 1, finishedSegment(request, task.blockedBoundary, request$jscomp$1), finishedTask(request, task.blockedBoundary, task.row, request$jscomp$1);
						} catch (thrownValue) {
							resetHooksState();
							request$jscomp$1.children.length = childrenLength;
							request$jscomp$1.chunks.length = chunkLength;
							var x$jscomp$0 = thrownValue === SuspenseException ? getSuspendedThenable() : 12 === request.status ? request.fatalError : thrownValue;
							if (12 === request.status && null !== request.trackedPostpones) {
								var trackedPostpones = request.trackedPostpones, thrownInfo = getThrownInfo(task.componentStack);
								task.abortSet.delete(task);
								logRecoverableError(request, x$jscomp$0, thrownInfo);
								trackPostpone(request, trackedPostpones, task, request$jscomp$1);
								finishedTask(request, task.blockedBoundary, task.row, request$jscomp$1);
							} else if ("object" === typeof x$jscomp$0 && null !== x$jscomp$0 && "function" === typeof x$jscomp$0.then) {
								request$jscomp$1.status = 0;
								task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
								var ping$jscomp$0 = task.ping;
								x$jscomp$0.then(ping$jscomp$0, ping$jscomp$0);
							} else {
								var errorInfo$jscomp$0 = getThrownInfo(task.componentStack);
								task.abortSet.delete(task);
								request$jscomp$1.status = 4;
								var boundary$jscomp$0 = task.blockedBoundary, row = task.row;
								null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
								request.allPendingTasks--;
								request$jscomp$0 = logRecoverableError(request, x$jscomp$0, errorInfo$jscomp$0);
								if (null === boundary$jscomp$0) fatalError(request, x$jscomp$0);
								else if (boundary$jscomp$0.pendingTasks--, 4 !== boundary$jscomp$0.status) {
									boundary$jscomp$0.status = 4;
									boundary$jscomp$0.errorDigest = request$jscomp$0;
									untrackBoundary(request, boundary$jscomp$0);
									var boundaryRow = boundary$jscomp$0.row;
									null !== boundaryRow && 0 === --boundaryRow.pendingTasks && finishSuspenseListRow(request, boundaryRow);
									boundary$jscomp$0.parentFlushed && request.clientRenderedBoundaries.push(boundary$jscomp$0);
									0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary$jscomp$0.contentPreamble && preparePreamble(request);
								}
								0 === request.allPendingTasks && completeAll(request);
							}
						}
					}
				}
				pingedTasks.splice(0, i);
				null !== request$jscomp$2.destination && flushCompletedQueues(request$jscomp$2, request$jscomp$2.destination);
			} catch (error) {
				logRecoverableError(request$jscomp$2, error, {}), fatalError(request$jscomp$2, error);
			} finally {
				currentResumableState = prevResumableState, ReactSharedInternals.H = prevDispatcher, ReactSharedInternals.A = prevAsyncDispatcher, prevDispatcher === HooksDispatcher && switchContext(prevContext), currentRequest = prevRequest;
			}
		}
	}
	function preparePreambleFromSubtree(request, segment, collectedPreambleSegments) {
		segment.preambleChildren.length && collectedPreambleSegments.push(segment.preambleChildren);
		for (var pendingPreambles = !1, i = 0; i < segment.children.length; i++) pendingPreambles = preparePreambleFromSegment(request, segment.children[i], collectedPreambleSegments) || pendingPreambles;
		return pendingPreambles;
	}
	function preparePreambleFromSegment(request, segment, collectedPreambleSegments) {
		var boundary = segment.boundary;
		if (null === boundary) return preparePreambleFromSubtree(request, segment, collectedPreambleSegments);
		var preamble = boundary.contentPreamble, fallbackPreamble = boundary.fallbackPreamble;
		if (null === preamble || null === fallbackPreamble) return !1;
		switch (boundary.status) {
			case 1:
				hoistPreambleState(request.renderState, preamble);
				request.byteSize += boundary.byteSize;
				segment = boundary.completedSegments[0];
				if (!segment) throw Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
				return preparePreambleFromSubtree(request, segment, collectedPreambleSegments);
			case 5: if (null !== request.trackedPostpones) return !0;
			case 4: if (1 === segment.status) return hoistPreambleState(request.renderState, fallbackPreamble), preparePreambleFromSubtree(request, segment, collectedPreambleSegments);
			default: return !0;
		}
	}
	function preparePreamble(request) {
		if (request.completedRootSegment && null === request.completedPreambleSegments) {
			var collectedPreambleSegments = [], originalRequestByteSize = request.byteSize, hasPendingPreambles = preparePreambleFromSegment(request, request.completedRootSegment, collectedPreambleSegments), preamble = request.renderState.preamble;
			!1 === hasPendingPreambles || preamble.headChunks && preamble.bodyChunks ? request.completedPreambleSegments = collectedPreambleSegments : request.byteSize = originalRequestByteSize;
		}
	}
	function flushSubtree(request, destination, segment, hoistableState) {
		segment.parentFlushed = !0;
		switch (segment.status) {
			case 0: segment.id = request.nextSegmentId++;
			case 5: return hoistableState = segment.id, segment.lastPushedText = !1, segment.textEmbedded = !1, request = request.renderState, writeChunk(destination, placeholder1), writeChunk(destination, request.placeholderPrefix), request = stringToChunk(hoistableState.toString(16)), writeChunk(destination, request), writeChunkAndReturn(destination, placeholder2);
			case 1:
				segment.status = 2;
				var r = !0, chunks = segment.chunks, chunkIdx = 0;
				segment = segment.children;
				for (var childIdx = 0; childIdx < segment.length; childIdx++) {
					for (r = segment[childIdx]; chunkIdx < r.index; chunkIdx++) writeChunk(destination, chunks[chunkIdx]);
					r = flushSegment(request, destination, r, hoistableState);
				}
				for (; chunkIdx < chunks.length - 1; chunkIdx++) writeChunk(destination, chunks[chunkIdx]);
				chunkIdx < chunks.length && (r = writeChunkAndReturn(destination, chunks[chunkIdx]));
				return r;
			case 3: return !0;
			default: throw Error("Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.");
		}
	}
	var flushedByteSize = 0;
	function flushSegment(request, destination, segment, hoistableState) {
		var boundary = segment.boundary;
		if (null === boundary) return flushSubtree(request, destination, segment, hoistableState);
		boundary.parentFlushed = !0;
		if (4 === boundary.status) {
			var row = boundary.row;
			null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
			boundary = boundary.errorDigest;
			writeChunkAndReturn(destination, startClientRenderedSuspenseBoundary);
			writeChunk(destination, clientRenderedSuspenseBoundaryError1);
			boundary && (writeChunk(destination, clientRenderedSuspenseBoundaryError1A), writeChunk(destination, stringToChunk(escapeTextForBrowser(boundary))), writeChunk(destination, clientRenderedSuspenseBoundaryErrorAttrInterstitial));
			writeChunkAndReturn(destination, clientRenderedSuspenseBoundaryError2);
			flushSubtree(request, destination, segment, hoistableState);
		} else if (1 !== boundary.status) 0 === boundary.status && (boundary.rootSegmentID = request.nextSegmentId++), 0 < boundary.completedSegments.length && request.partialBoundaries.push(boundary), writeStartPendingSuspenseBoundary(destination, request.renderState, boundary.rootSegmentID), hoistableState && hoistHoistables(hoistableState, boundary.fallbackState), flushSubtree(request, destination, segment, hoistableState);
		else if (!flushingPartialBoundaries && isEligibleForOutlining(request, boundary) && (flushedByteSize + boundary.byteSize > request.progressiveChunkSize || hasSuspenseyContent(boundary.contentState))) boundary.rootSegmentID = request.nextSegmentId++, request.completedBoundaries.push(boundary), writeStartPendingSuspenseBoundary(destination, request.renderState, boundary.rootSegmentID), flushSubtree(request, destination, segment, hoistableState);
		else {
			flushedByteSize += boundary.byteSize;
			hoistableState && hoistHoistables(hoistableState, boundary.contentState);
			segment = boundary.row;
			null !== segment && isEligibleForOutlining(request, boundary) && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
			writeChunkAndReturn(destination, startCompletedSuspenseBoundary);
			segment = boundary.completedSegments;
			if (1 !== segment.length) throw Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
			flushSegment(request, destination, segment[0], hoistableState);
		}
		return writeChunkAndReturn(destination, endSuspenseBoundary);
	}
	function flushSegmentContainer(request, destination, segment, hoistableState) {
		writeStartSegment(destination, request.renderState, segment.parentFormatContext, segment.id);
		flushSegment(request, destination, segment, hoistableState);
		return writeEndSegment(destination, segment.parentFormatContext);
	}
	function flushCompletedBoundary(request, destination, boundary) {
		flushedByteSize = boundary.byteSize;
		for (var completedSegments = boundary.completedSegments, i = 0; i < completedSegments.length; i++) flushPartiallyCompletedSegment(request, destination, boundary, completedSegments[i]);
		completedSegments.length = 0;
		completedSegments = boundary.row;
		null !== completedSegments && isEligibleForOutlining(request, boundary) && 0 === --completedSegments.pendingTasks && finishSuspenseListRow(request, completedSegments);
		writeHoistablesForBoundary(destination, boundary.contentState, request.renderState);
		completedSegments = request.resumableState;
		request = request.renderState;
		i = boundary.rootSegmentID;
		boundary = boundary.contentState;
		var requiresStyleInsertion = request.stylesToHoist;
		request.stylesToHoist = !1;
		writeChunk(destination, request.startInlineScript);
		writeChunk(destination, endOfStartTag);
		requiresStyleInsertion ? (0 === (completedSegments.instructions & 4) && (completedSegments.instructions |= 4, writeChunk(destination, clientRenderScriptFunctionOnly)), 0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, writeChunk(destination, completeBoundaryScriptFunctionOnly)), 0 === (completedSegments.instructions & 8) ? (completedSegments.instructions |= 8, writeChunk(destination, completeBoundaryWithStylesScript1FullPartial)) : writeChunk(destination, completeBoundaryWithStylesScript1Partial)) : (0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, writeChunk(destination, completeBoundaryScriptFunctionOnly)), writeChunk(destination, completeBoundaryScript1Partial));
		completedSegments = stringToChunk(i.toString(16));
		writeChunk(destination, request.boundaryPrefix);
		writeChunk(destination, completedSegments);
		writeChunk(destination, completeBoundaryScript2);
		writeChunk(destination, request.segmentPrefix);
		writeChunk(destination, completedSegments);
		requiresStyleInsertion ? (writeChunk(destination, completeBoundaryScript3a), writeStyleResourceDependenciesInJS(destination, boundary)) : writeChunk(destination, completeBoundaryScript3b);
		boundary = writeChunkAndReturn(destination, completeBoundaryScriptEnd);
		return writeBootstrap(destination, request) && boundary;
	}
	function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
		if (2 === segment.status) return !0;
		var hoistableState = boundary.contentState, segmentID = segment.id;
		if (-1 === segmentID) {
			if (-1 === (segment.id = boundary.rootSegmentID)) throw Error("A root segment ID must have been assigned by now. This is a bug in React.");
			return flushSegmentContainer(request, destination, segment, hoistableState);
		}
		if (segmentID === boundary.rootSegmentID) return flushSegmentContainer(request, destination, segment, hoistableState);
		flushSegmentContainer(request, destination, segment, hoistableState);
		boundary = request.resumableState;
		request = request.renderState;
		writeChunk(destination, request.startInlineScript);
		writeChunk(destination, endOfStartTag);
		0 === (boundary.instructions & 1) ? (boundary.instructions |= 1, writeChunk(destination, completeSegmentScript1Full)) : writeChunk(destination, completeSegmentScript1Partial);
		writeChunk(destination, request.segmentPrefix);
		segmentID = stringToChunk(segmentID.toString(16));
		writeChunk(destination, segmentID);
		writeChunk(destination, completeSegmentScript2);
		writeChunk(destination, request.placeholderPrefix);
		writeChunk(destination, segmentID);
		destination = writeChunkAndReturn(destination, completeSegmentScriptEnd);
		return destination;
	}
	var flushingPartialBoundaries = !1;
	function flushCompletedQueues(request, destination) {
		currentView = /* @__PURE__ */ new Uint8Array(2048);
		writtenBytes = 0;
		try {
			if (!(0 < request.pendingRootTasks)) {
				var i, completedRootSegment = request.completedRootSegment;
				if (null !== completedRootSegment) {
					if (5 === completedRootSegment.status) return;
					var completedPreambleSegments = request.completedPreambleSegments;
					if (null === completedPreambleSegments) return;
					flushedByteSize = request.byteSize;
					var resumableState = request.resumableState, renderState = request.renderState, preamble = renderState.preamble, htmlChunks = preamble.htmlChunks, headChunks = preamble.headChunks, i$jscomp$0;
					if (htmlChunks) {
						for (i$jscomp$0 = 0; i$jscomp$0 < htmlChunks.length; i$jscomp$0++) writeChunk(destination, htmlChunks[i$jscomp$0]);
						if (headChunks) for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++) writeChunk(destination, headChunks[i$jscomp$0]);
						else writeChunk(destination, startChunkForTag("head")), writeChunk(destination, endOfStartTag);
					} else if (headChunks) for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++) writeChunk(destination, headChunks[i$jscomp$0]);
					var charsetChunks = renderState.charsetChunks;
					for (i$jscomp$0 = 0; i$jscomp$0 < charsetChunks.length; i$jscomp$0++) writeChunk(destination, charsetChunks[i$jscomp$0]);
					charsetChunks.length = 0;
					renderState.preconnects.forEach(flushResource, destination);
					renderState.preconnects.clear();
					var viewportChunks = renderState.viewportChunks;
					for (i$jscomp$0 = 0; i$jscomp$0 < viewportChunks.length; i$jscomp$0++) writeChunk(destination, viewportChunks[i$jscomp$0]);
					viewportChunks.length = 0;
					renderState.fontPreloads.forEach(flushResource, destination);
					renderState.fontPreloads.clear();
					renderState.highImagePreloads.forEach(flushResource, destination);
					renderState.highImagePreloads.clear();
					currentlyFlushingRenderState = renderState;
					renderState.styles.forEach(flushStylesInPreamble, destination);
					currentlyFlushingRenderState = null;
					var importMapChunks = renderState.importMapChunks;
					for (i$jscomp$0 = 0; i$jscomp$0 < importMapChunks.length; i$jscomp$0++) writeChunk(destination, importMapChunks[i$jscomp$0]);
					importMapChunks.length = 0;
					renderState.bootstrapScripts.forEach(flushResource, destination);
					renderState.scripts.forEach(flushResource, destination);
					renderState.scripts.clear();
					renderState.bulkPreloads.forEach(flushResource, destination);
					renderState.bulkPreloads.clear();
					htmlChunks || headChunks || (resumableState.instructions |= 32);
					var hoistableChunks = renderState.hoistableChunks;
					for (i$jscomp$0 = 0; i$jscomp$0 < hoistableChunks.length; i$jscomp$0++) writeChunk(destination, hoistableChunks[i$jscomp$0]);
					for (resumableState = hoistableChunks.length = 0; resumableState < completedPreambleSegments.length; resumableState++) {
						var segments = completedPreambleSegments[resumableState];
						for (renderState = 0; renderState < segments.length; renderState++) flushSegment(request, destination, segments[renderState], null);
					}
					var preamble$jscomp$0 = request.renderState.preamble, headChunks$jscomp$0 = preamble$jscomp$0.headChunks;
					(preamble$jscomp$0.htmlChunks || headChunks$jscomp$0) && writeChunk(destination, endChunkForTag("head"));
					var bodyChunks = preamble$jscomp$0.bodyChunks;
					if (bodyChunks) for (completedPreambleSegments = 0; completedPreambleSegments < bodyChunks.length; completedPreambleSegments++) writeChunk(destination, bodyChunks[completedPreambleSegments]);
					flushSegment(request, destination, completedRootSegment, null);
					request.completedRootSegment = null;
					var renderState$jscomp$0 = request.renderState;
					if (0 !== request.allPendingTasks || 0 !== request.clientRenderedBoundaries.length || 0 !== request.completedBoundaries.length || null !== request.trackedPostpones && (0 !== request.trackedPostpones.rootNodes.length || null !== request.trackedPostpones.rootSlots)) {
						var resumableState$jscomp$0 = request.resumableState;
						if (0 === (resumableState$jscomp$0.instructions & 64)) {
							resumableState$jscomp$0.instructions |= 64;
							writeChunk(destination, renderState$jscomp$0.startInlineScript);
							if (0 === (resumableState$jscomp$0.instructions & 32)) {
								resumableState$jscomp$0.instructions |= 32;
								var shellId = "_" + resumableState$jscomp$0.idPrefix + "R_";
								writeChunk(destination, completedShellIdAttributeStart);
								writeChunk(destination, stringToChunk(escapeTextForBrowser(shellId)));
								writeChunk(destination, attributeEnd);
							}
							writeChunk(destination, endOfStartTag);
							writeChunk(destination, shellTimeRuntimeScript);
							writeChunkAndReturn(destination, endInlineScript);
						}
					}
					writeBootstrap(destination, renderState$jscomp$0);
				}
				var renderState$jscomp$1 = request.renderState;
				completedRootSegment = 0;
				var viewportChunks$jscomp$0 = renderState$jscomp$1.viewportChunks;
				for (completedRootSegment = 0; completedRootSegment < viewportChunks$jscomp$0.length; completedRootSegment++) writeChunk(destination, viewportChunks$jscomp$0[completedRootSegment]);
				viewportChunks$jscomp$0.length = 0;
				renderState$jscomp$1.preconnects.forEach(flushResource, destination);
				renderState$jscomp$1.preconnects.clear();
				renderState$jscomp$1.fontPreloads.forEach(flushResource, destination);
				renderState$jscomp$1.fontPreloads.clear();
				renderState$jscomp$1.highImagePreloads.forEach(flushResource, destination);
				renderState$jscomp$1.highImagePreloads.clear();
				renderState$jscomp$1.styles.forEach(preloadLateStyles, destination);
				renderState$jscomp$1.scripts.forEach(flushResource, destination);
				renderState$jscomp$1.scripts.clear();
				renderState$jscomp$1.bulkPreloads.forEach(flushResource, destination);
				renderState$jscomp$1.bulkPreloads.clear();
				var hoistableChunks$jscomp$0 = renderState$jscomp$1.hoistableChunks;
				for (completedRootSegment = 0; completedRootSegment < hoistableChunks$jscomp$0.length; completedRootSegment++) writeChunk(destination, hoistableChunks$jscomp$0[completedRootSegment]);
				hoistableChunks$jscomp$0.length = 0;
				var clientRenderedBoundaries = request.clientRenderedBoundaries;
				for (i = 0; i < clientRenderedBoundaries.length; i++) {
					var boundary = clientRenderedBoundaries[i];
					renderState$jscomp$1 = destination;
					var resumableState$jscomp$1 = request.resumableState, renderState$jscomp$2 = request.renderState, id = boundary.rootSegmentID, errorDigest = boundary.errorDigest;
					writeChunk(renderState$jscomp$1, renderState$jscomp$2.startInlineScript);
					writeChunk(renderState$jscomp$1, endOfStartTag);
					0 === (resumableState$jscomp$1.instructions & 4) ? (resumableState$jscomp$1.instructions |= 4, writeChunk(renderState$jscomp$1, clientRenderScript1Full)) : writeChunk(renderState$jscomp$1, clientRenderScript1Partial);
					writeChunk(renderState$jscomp$1, renderState$jscomp$2.boundaryPrefix);
					writeChunk(renderState$jscomp$1, stringToChunk(id.toString(16)));
					writeChunk(renderState$jscomp$1, clientRenderScript1A);
					errorDigest && (writeChunk(renderState$jscomp$1, clientRenderErrorScriptArgInterstitial), writeChunk(renderState$jscomp$1, stringToChunk(escapeJSStringsForInstructionScripts(errorDigest || ""))));
					var JSCompiler_inline_result = writeChunkAndReturn(renderState$jscomp$1, clientRenderScriptEnd);
					if (!JSCompiler_inline_result) {
						request.destination = null;
						i++;
						clientRenderedBoundaries.splice(0, i);
						return;
					}
				}
				clientRenderedBoundaries.splice(0, i);
				var completedBoundaries = request.completedBoundaries;
				for (i = 0; i < completedBoundaries.length; i++) if (!flushCompletedBoundary(request, destination, completedBoundaries[i])) {
					request.destination = null;
					i++;
					completedBoundaries.splice(0, i);
					return;
				}
				completedBoundaries.splice(0, i);
				completeWriting(destination);
				currentView = /* @__PURE__ */ new Uint8Array(2048);
				writtenBytes = 0;
				flushingPartialBoundaries = !0;
				var partialBoundaries = request.partialBoundaries;
				for (i = 0; i < partialBoundaries.length; i++) {
					var boundary$70 = partialBoundaries[i];
					a: {
						clientRenderedBoundaries = request;
						boundary = destination;
						flushedByteSize = boundary$70.byteSize;
						var completedSegments = boundary$70.completedSegments;
						for (JSCompiler_inline_result = 0; JSCompiler_inline_result < completedSegments.length; JSCompiler_inline_result++) if (!flushPartiallyCompletedSegment(clientRenderedBoundaries, boundary, boundary$70, completedSegments[JSCompiler_inline_result])) {
							JSCompiler_inline_result++;
							completedSegments.splice(0, JSCompiler_inline_result);
							var JSCompiler_inline_result$jscomp$0 = !1;
							break a;
						}
						completedSegments.splice(0, JSCompiler_inline_result);
						var row = boundary$70.row;
						null !== row && row.together && 1 === boundary$70.pendingTasks && (1 === row.pendingTasks ? unblockSuspenseListRow(clientRenderedBoundaries, row, row.hoistables) : row.pendingTasks--);
						JSCompiler_inline_result$jscomp$0 = writeHoistablesForBoundary(boundary, boundary$70.contentState, clientRenderedBoundaries.renderState);
					}
					if (!JSCompiler_inline_result$jscomp$0) {
						request.destination = null;
						i++;
						partialBoundaries.splice(0, i);
						return;
					}
				}
				partialBoundaries.splice(0, i);
				flushingPartialBoundaries = !1;
				var largeBoundaries = request.completedBoundaries;
				for (i = 0; i < largeBoundaries.length; i++) if (!flushCompletedBoundary(request, destination, largeBoundaries[i])) {
					request.destination = null;
					i++;
					largeBoundaries.splice(0, i);
					return;
				}
				largeBoundaries.splice(0, i);
			}
		} finally {
			flushingPartialBoundaries = !1, 0 === request.allPendingTasks && 0 === request.clientRenderedBoundaries.length && 0 === request.completedBoundaries.length ? (request.flushScheduled = !1, i = request.resumableState, i.hasBody && writeChunk(destination, endChunkForTag("body")), i.hasHtml && writeChunk(destination, endChunkForTag("html")), completeWriting(destination), request.status = 14, destination.close(), request.destination = null) : completeWriting(destination);
		}
	}
	function startWork(request) {
		request.flushScheduled = null !== request.destination;
		supportsRequestStorage ? scheduleMicrotask(function() {
			return requestStorage.run(request, performWork, request);
		}) : scheduleMicrotask(function() {
			return performWork(request);
		});
		setTimeout(function() {
			10 === request.status && (request.status = 11);
			null === request.trackedPostpones && (supportsRequestStorage ? requestStorage.run(request, enqueueEarlyPreloadsAfterInitialWork, request) : enqueueEarlyPreloadsAfterInitialWork(request));
		}, 0);
	}
	function enqueueEarlyPreloadsAfterInitialWork(request) {
		safelyEmitEarlyPreloads(request, 0 === request.pendingRootTasks);
	}
	function enqueueFlush(request) {
		!1 === request.flushScheduled && 0 === request.pingedTasks.length && null !== request.destination && (request.flushScheduled = !0, setTimeout(function() {
			var destination = request.destination;
			destination ? flushCompletedQueues(request, destination) : request.flushScheduled = !1;
		}, 0));
	}
	function startFlowing(request, destination) {
		if (13 === request.status) request.status = 14, closeWithError(destination, request.fatalError);
		else if (14 !== request.status && null === request.destination) {
			request.destination = destination;
			try {
				flushCompletedQueues(request, destination);
			} catch (error) {
				logRecoverableError(request, error, {}), fatalError(request, error);
			}
		}
	}
	function abort(request, reason) {
		if (11 === request.status || 10 === request.status) request.status = 12;
		try {
			var abortableTasks = request.abortableTasks;
			if (0 < abortableTasks.size) {
				var error = void 0 === reason ? Error("The render was aborted by the server without a reason.") : "object" === typeof reason && null !== reason && "function" === typeof reason.then ? Error("The render was aborted by the server with a promise.") : reason;
				request.fatalError = error;
				abortableTasks.forEach(function(task) {
					return abortTask(task, request, error);
				});
				abortableTasks.clear();
			}
			null !== request.destination && flushCompletedQueues(request, request.destination);
		} catch (error$72) {
			logRecoverableError(request, error$72, {}), fatalError(request, error$72);
		}
	}
	function addToReplayParent(node, parentKeyPath, trackedPostpones) {
		if (null === parentKeyPath) trackedPostpones.rootNodes.push(node);
		else {
			var workingMap = trackedPostpones.workingMap, parentNode = workingMap.get(parentKeyPath);
			void 0 === parentNode && (parentNode = [
				parentKeyPath[1],
				parentKeyPath[2],
				[],
				null
			], workingMap.set(parentKeyPath, parentNode), addToReplayParent(parentNode, parentKeyPath[0], trackedPostpones));
			parentNode[2].push(node);
		}
	}
	function getPostponedState(request) {
		var trackedPostpones = request.trackedPostpones;
		if (null === trackedPostpones || 0 === trackedPostpones.rootNodes.length && null === trackedPostpones.rootSlots) return request.trackedPostpones = null;
		if (null === request.completedRootSegment || 5 !== request.completedRootSegment.status && null !== request.completedPreambleSegments) {
			var nextSegmentId = request.nextSegmentId;
			var replaySlots = trackedPostpones.rootSlots;
			var resumableState = request.resumableState;
			resumableState.bootstrapScriptContent = void 0;
			resumableState.bootstrapScripts = void 0;
			resumableState.bootstrapModules = void 0;
		} else {
			nextSegmentId = 0;
			replaySlots = -1;
			resumableState = request.resumableState;
			var renderState = request.renderState;
			resumableState.nextFormID = 0;
			resumableState.hasBody = !1;
			resumableState.hasHtml = !1;
			resumableState.unknownResources = { font: renderState.resets.font };
			resumableState.dnsResources = renderState.resets.dns;
			resumableState.connectResources = renderState.resets.connect;
			resumableState.imageResources = renderState.resets.image;
			resumableState.styleResources = renderState.resets.style;
			resumableState.scriptResources = {};
			resumableState.moduleUnknownResources = {};
			resumableState.moduleScriptResources = {};
			resumableState.instructions = 0;
		}
		return {
			nextSegmentId,
			rootFormatContext: request.rootFormatContext,
			progressiveChunkSize: request.progressiveChunkSize,
			resumableState: request.resumableState,
			replayNodes: trackedPostpones.rootNodes,
			replaySlots
		};
	}
	function ensureCorrectIsomorphicReactVersion() {
		var isomorphicReactPackageVersion = React.version;
		if ("19.2.8" !== isomorphicReactPackageVersion) throw Error("Incompatible React versions: The \"react\" and \"react-dom\" packages must have the exact same version. Instead got:\n  - react:      " + (isomorphicReactPackageVersion + "\n  - react-dom:  19.2.8\nLearn more: https://react.dev/warnings/version-mismatch"));
	}
	ensureCorrectIsomorphicReactVersion();
	ensureCorrectIsomorphicReactVersion();
	exports.prerender = function(children, options) {
		return new Promise(function(resolve, reject) {
			var onHeaders = options ? options.onHeaders : void 0, onHeadersImpl;
			onHeaders && (onHeadersImpl = function(headersDescriptor) {
				onHeaders(new Headers(headersDescriptor));
			});
			var resources = createResumableState(options ? options.identifierPrefix : void 0, options ? options.unstable_externalRuntimeSrc : void 0, options ? options.bootstrapScriptContent : void 0, options ? options.bootstrapScripts : void 0, options ? options.bootstrapModules : void 0), request = createPrerenderRequest(children, resources, createRenderState(resources, void 0, options ? options.unstable_externalRuntimeSrc : void 0, options ? options.importMap : void 0, onHeadersImpl, options ? options.maxHeadersLength : void 0), createRootFormatContext(options ? options.namespaceURI : void 0), options ? options.progressiveChunkSize : void 0, options ? options.onError : void 0, function() {
				var stream = new ReadableStream({
					type: "bytes",
					pull: function(controller) {
						startFlowing(request, controller);
					},
					cancel: function(reason) {
						request.destination = null;
						abort(request, reason);
					}
				}, { highWaterMark: 0 });
				stream = {
					postponed: getPostponedState(request),
					prelude: stream
				};
				resolve(stream);
			}, void 0, void 0, reject, options ? options.onPostpone : void 0);
			if (options && options.signal) {
				var signal = options.signal;
				if (signal.aborted) abort(request, signal.reason);
				else {
					var listener = function() {
						abort(request, signal.reason);
						signal.removeEventListener("abort", listener);
					};
					signal.addEventListener("abort", listener);
				}
			}
			startWork(request);
		});
	};
	exports.renderToReadableStream = function(children, options) {
		return new Promise(function(resolve, reject) {
			var onFatalError, onAllReady, allReady = new Promise(function(res, rej) {
				onAllReady = res;
				onFatalError = rej;
			}), onHeaders = options ? options.onHeaders : void 0, onHeadersImpl;
			onHeaders && (onHeadersImpl = function(headersDescriptor) {
				onHeaders(new Headers(headersDescriptor));
			});
			var resumableState = createResumableState(options ? options.identifierPrefix : void 0, options ? options.unstable_externalRuntimeSrc : void 0, options ? options.bootstrapScriptContent : void 0, options ? options.bootstrapScripts : void 0, options ? options.bootstrapModules : void 0), request = createRequest(children, resumableState, createRenderState(resumableState, options ? options.nonce : void 0, options ? options.unstable_externalRuntimeSrc : void 0, options ? options.importMap : void 0, onHeadersImpl, options ? options.maxHeadersLength : void 0), createRootFormatContext(options ? options.namespaceURI : void 0), options ? options.progressiveChunkSize : void 0, options ? options.onError : void 0, onAllReady, function() {
				var stream = new ReadableStream({
					type: "bytes",
					pull: function(controller) {
						startFlowing(request, controller);
					},
					cancel: function(reason) {
						request.destination = null;
						abort(request, reason);
					}
				}, { highWaterMark: 0 });
				stream.allReady = allReady;
				resolve(stream);
			}, function(error) {
				allReady.catch(function() {});
				reject(error);
			}, onFatalError, options ? options.onPostpone : void 0, options ? options.formState : void 0);
			if (options && options.signal) {
				var signal = options.signal;
				if (signal.aborted) abort(request, signal.reason);
				else {
					var listener = function() {
						abort(request, signal.reason);
						signal.removeEventListener("abort", listener);
					};
					signal.addEventListener("abort", listener);
				}
			}
			startWork(request);
		});
	};
	exports.resume = function(children, postponedState, options) {
		return new Promise(function(resolve, reject) {
			var onFatalError, onAllReady, allReady = new Promise(function(res, rej) {
				onAllReady = res;
				onFatalError = rej;
			}), request = resumeRequest(children, postponedState, createRenderState(postponedState.resumableState, options ? options.nonce : void 0, void 0, void 0, void 0, void 0), options ? options.onError : void 0, onAllReady, function() {
				var stream = new ReadableStream({
					type: "bytes",
					pull: function(controller) {
						startFlowing(request, controller);
					},
					cancel: function(reason) {
						request.destination = null;
						abort(request, reason);
					}
				}, { highWaterMark: 0 });
				stream.allReady = allReady;
				resolve(stream);
			}, function(error) {
				allReady.catch(function() {});
				reject(error);
			}, onFatalError, options ? options.onPostpone : void 0);
			if (options && options.signal) {
				var signal = options.signal;
				if (signal.aborted) abort(request, signal.reason);
				else {
					var listener = function() {
						abort(request, signal.reason);
						signal.removeEventListener("abort", listener);
					};
					signal.addEventListener("abort", listener);
				}
			}
			startWork(request);
		});
	};
	exports.resumeAndPrerender = function(children, postponedState, options) {
		return new Promise(function(resolve, reject) {
			var request = resumeAndPrerenderRequest(children, postponedState, createRenderState(postponedState.resumableState, void 0, void 0, void 0, void 0, void 0), options ? options.onError : void 0, function() {
				var stream = new ReadableStream({
					type: "bytes",
					pull: function(controller) {
						startFlowing(request, controller);
					},
					cancel: function(reason) {
						request.destination = null;
						abort(request, reason);
					}
				}, { highWaterMark: 0 });
				stream = {
					postponed: getPostponedState(request),
					prelude: stream
				};
				resolve(stream);
			}, void 0, void 0, reject, options ? options.onPostpone : void 0);
			if (options && options.signal) {
				var signal = options.signal;
				if (signal.aborted) abort(request, signal.reason);
				else {
					var listener = function() {
						abort(request, signal.reason);
						signal.removeEventListener("abort", listener);
					};
					signal.addEventListener("abort", listener);
				}
			}
			startWork(request);
		});
	};
	exports.version = "19.2.8";
}));
//#endregion
//#region node_modules/.pnpm/react-dom@19.2.8_react@19.2.8/node_modules/react-dom/cjs/react-dom-server-legacy.browser.production.js
/**
* @license React
* react-dom-server-legacy.browser.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_dom_server_legacy_browser_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	var ReactDOM = require_react_dom();
	function formatProdErrorMessage(code) {
		var url = "https://react.dev/errors/" + code;
		if (1 < arguments.length) {
			url += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var i = 2; i < arguments.length; i++) url += "&args[]=" + encodeURIComponent(arguments[i]);
		}
		return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
	var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
	var REACT_CONTEXT_TYPE = Symbol.for("react.context");
	var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
	var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
	var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
	var REACT_MEMO_TYPE = Symbol.for("react.memo");
	var REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var REACT_SCOPE_TYPE = Symbol.for("react.scope");
	var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
	var REACT_LEGACY_HIDDEN_TYPE = Symbol.for("react.legacy_hidden");
	var REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel");
	var REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition");
	var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var isArrayImpl = Array.isArray;
	function murmurhash3_32_gc(key, seed) {
		var remainder = key.length & 3;
		var bytes = key.length - remainder;
		var h1 = seed;
		for (seed = 0; seed < bytes;) {
			var k1 = key.charCodeAt(seed) & 255 | (key.charCodeAt(++seed) & 255) << 8 | (key.charCodeAt(++seed) & 255) << 16 | (key.charCodeAt(++seed) & 255) << 24;
			++seed;
			k1 = 3432918353 * (k1 & 65535) + ((3432918353 * (k1 >>> 16) & 65535) << 16) & 4294967295;
			k1 = k1 << 15 | k1 >>> 17;
			k1 = 461845907 * (k1 & 65535) + ((461845907 * (k1 >>> 16) & 65535) << 16) & 4294967295;
			h1 ^= k1;
			h1 = h1 << 13 | h1 >>> 19;
			h1 = 5 * (h1 & 65535) + ((5 * (h1 >>> 16) & 65535) << 16) & 4294967295;
			h1 = (h1 & 65535) + 27492 + (((h1 >>> 16) + 58964 & 65535) << 16);
		}
		k1 = 0;
		switch (remainder) {
			case 3: k1 ^= (key.charCodeAt(seed + 2) & 255) << 16;
			case 2: k1 ^= (key.charCodeAt(seed + 1) & 255) << 8;
			case 1: k1 ^= key.charCodeAt(seed) & 255, k1 = 3432918353 * (k1 & 65535) + ((3432918353 * (k1 >>> 16) & 65535) << 16) & 4294967295, k1 = k1 << 15 | k1 >>> 17, h1 ^= 461845907 * (k1 & 65535) + ((461845907 * (k1 >>> 16) & 65535) << 16) & 4294967295;
		}
		h1 ^= key.length;
		h1 ^= h1 >>> 16;
		h1 = 2246822507 * (h1 & 65535) + ((2246822507 * (h1 >>> 16) & 65535) << 16) & 4294967295;
		h1 ^= h1 >>> 13;
		h1 = 3266489909 * (h1 & 65535) + ((3266489909 * (h1 >>> 16) & 65535) << 16) & 4294967295;
		return (h1 ^ h1 >>> 16) >>> 0;
	}
	var assign = Object.assign;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var VALID_ATTRIBUTE_NAME_REGEX = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
	var illegalAttributeNameCache = {};
	var validatedAttributeNameCache = {};
	function isAttributeNameSafe(attributeName) {
		if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) return !0;
		if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return !1;
		if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) return validatedAttributeNameCache[attributeName] = !0;
		illegalAttributeNameCache[attributeName] = !0;
		return !1;
	}
	var unitlessNumbers = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	var aliases = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]);
	var matchHtmlRegExp = /["'&<>]/;
	function escapeTextForBrowser(text) {
		if ("boolean" === typeof text || "number" === typeof text || "bigint" === typeof text) return "" + text;
		text = "" + text;
		var match = matchHtmlRegExp.exec(text);
		if (match) {
			var html = "", index, lastIndex = 0;
			for (index = match.index; index < text.length; index++) {
				switch (text.charCodeAt(index)) {
					case 34:
						match = "&quot;";
						break;
					case 38:
						match = "&amp;";
						break;
					case 39:
						match = "&#x27;";
						break;
					case 60:
						match = "&lt;";
						break;
					case 62:
						match = "&gt;";
						break;
					default: continue;
				}
				lastIndex !== index && (html += text.slice(lastIndex, index));
				lastIndex = index + 1;
				html += match;
			}
			text = lastIndex !== index ? html + text.slice(lastIndex, index) : html;
		}
		return text;
	}
	var uppercasePattern = /([A-Z])/g;
	var msPattern = /^ms-/;
	var isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function sanitizeURL(url) {
		return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
	}
	var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	var ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	var sharedNotPendingObject = {
		pending: !1,
		data: null,
		method: null,
		action: null
	};
	var previousDispatcher = ReactDOMSharedInternals.d;
	ReactDOMSharedInternals.d = {
		f: previousDispatcher.f,
		r: previousDispatcher.r,
		D: prefetchDNS,
		C: preconnect,
		L: preload,
		m: preloadModule,
		X: preinitScript,
		S: preinitStyle,
		M: preinitModuleScript
	};
	var PRELOAD_NO_CREDS = [];
	var currentlyFlushingRenderState = null;
	var scriptRegex = /(<\/|<)(s)(cript)/gi;
	function scriptReplacer(match, prefix, s, suffix) {
		return "" + prefix + ("s" === s ? "\\u0073" : "\\u0053") + suffix;
	}
	function createResumableState(identifierPrefix, externalRuntimeConfig, bootstrapScriptContent, bootstrapScripts, bootstrapModules) {
		return {
			idPrefix: void 0 === identifierPrefix ? "" : identifierPrefix,
			nextFormID: 0,
			streamingFormat: 0,
			bootstrapScriptContent,
			bootstrapScripts,
			bootstrapModules,
			instructions: 0,
			hasBody: !1,
			hasHtml: !1,
			unknownResources: {},
			dnsResources: {},
			connectResources: {
				default: {},
				anonymous: {},
				credentials: {}
			},
			imageResources: {},
			styleResources: {},
			scriptResources: {},
			moduleUnknownResources: {},
			moduleScriptResources: {}
		};
	}
	function createFormatContext(insertionMode, selectedValue, tagScope, viewTransition) {
		return {
			insertionMode,
			selectedValue,
			tagScope,
			viewTransition
		};
	}
	function getChildFormatContext(parentContext, type, props) {
		var subtreeScope = parentContext.tagScope & -25;
		switch (type) {
			case "noscript": return createFormatContext(2, null, subtreeScope | 1, null);
			case "select": return createFormatContext(2, null != props.value ? props.value : props.defaultValue, subtreeScope, null);
			case "svg": return createFormatContext(4, null, subtreeScope, null);
			case "picture": return createFormatContext(2, null, subtreeScope | 2, null);
			case "math": return createFormatContext(5, null, subtreeScope, null);
			case "foreignObject": return createFormatContext(2, null, subtreeScope, null);
			case "table": return createFormatContext(6, null, subtreeScope, null);
			case "thead":
			case "tbody":
			case "tfoot": return createFormatContext(7, null, subtreeScope, null);
			case "colgroup": return createFormatContext(9, null, subtreeScope, null);
			case "tr": return createFormatContext(8, null, subtreeScope, null);
			case "head":
				if (2 > parentContext.insertionMode) return createFormatContext(3, null, subtreeScope, null);
				break;
			case "html": if (0 === parentContext.insertionMode) return createFormatContext(1, null, subtreeScope, null);
		}
		return 6 <= parentContext.insertionMode || 2 > parentContext.insertionMode ? createFormatContext(2, null, subtreeScope, null) : parentContext.tagScope !== subtreeScope ? createFormatContext(parentContext.insertionMode, parentContext.selectedValue, subtreeScope, null) : parentContext;
	}
	function getSuspenseViewTransition(parentViewTransition) {
		return null === parentViewTransition ? null : {
			update: parentViewTransition.update,
			enter: "none",
			exit: "none",
			share: parentViewTransition.update,
			name: parentViewTransition.autoName,
			autoName: parentViewTransition.autoName,
			nameIdx: 0
		};
	}
	function getSuspenseFallbackFormatContext(resumableState, parentContext) {
		parentContext.tagScope & 32 && (resumableState.instructions |= 128);
		return createFormatContext(parentContext.insertionMode, parentContext.selectedValue, parentContext.tagScope | 12, getSuspenseViewTransition(parentContext.viewTransition));
	}
	function getSuspenseContentFormatContext(resumableState, parentContext) {
		resumableState = getSuspenseViewTransition(parentContext.viewTransition);
		var subtreeScope = parentContext.tagScope | 16;
		null !== resumableState && "none" !== resumableState.share && (subtreeScope |= 64);
		return createFormatContext(parentContext.insertionMode, parentContext.selectedValue, subtreeScope, resumableState);
	}
	var styleNameCache = /* @__PURE__ */ new Map();
	function pushStyleAttribute(target, style) {
		if ("object" !== typeof style) throw Error(formatProdErrorMessage(62));
		var isFirst = !0, styleName;
		for (styleName in style) if (hasOwnProperty.call(style, styleName)) {
			var styleValue = style[styleName];
			if (null != styleValue && "boolean" !== typeof styleValue && "" !== styleValue) {
				if (0 === styleName.indexOf("--")) {
					var nameChunk = escapeTextForBrowser(styleName);
					styleValue = escapeTextForBrowser(("" + styleValue).trim());
				} else nameChunk = styleNameCache.get(styleName), void 0 === nameChunk && (nameChunk = escapeTextForBrowser(styleName.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern, "-ms-")), styleNameCache.set(styleName, nameChunk)), styleValue = "number" === typeof styleValue ? 0 === styleValue || unitlessNumbers.has(styleName) ? "" + styleValue : styleValue + "px" : escapeTextForBrowser(("" + styleValue).trim());
				isFirst ? (isFirst = !1, target.push(" style=\"", nameChunk, ":", styleValue)) : target.push(";", nameChunk, ":", styleValue);
			}
		}
		isFirst || target.push("\"");
	}
	function pushBooleanAttribute(target, name, value) {
		value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, "=\"\"");
	}
	function pushStringAttribute(target, name, value) {
		"function" !== typeof value && "symbol" !== typeof value && "boolean" !== typeof value && target.push(" ", name, "=\"", escapeTextForBrowser(value), "\"");
	}
	var actionJavaScriptURL = escapeTextForBrowser("javascript:throw new Error('React form unexpectedly submitted.')");
	function pushAdditionalFormField(value, key) {
		this.push("<input type=\"hidden\"");
		validateAdditionalFormField(value);
		pushStringAttribute(this, "name", key);
		pushStringAttribute(this, "value", value);
		this.push("/>");
	}
	function validateAdditionalFormField(value) {
		if ("string" !== typeof value) throw Error(formatProdErrorMessage(480));
	}
	function getCustomFormFields(resumableState, formAction) {
		if ("function" === typeof formAction.$$FORM_ACTION) {
			var id = resumableState.nextFormID++;
			resumableState = resumableState.idPrefix + id;
			try {
				var customFields = formAction.$$FORM_ACTION(resumableState);
				if (customFields) customFields.data?.forEach(validateAdditionalFormField);
				return customFields;
			} catch (x) {
				if ("object" === typeof x && null !== x && "function" === typeof x.then) throw x;
			}
		}
		return null;
	}
	function pushFormActionAttribute(target, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name) {
		var formData = null;
		if ("function" === typeof formAction) {
			var customFields = getCustomFormFields(resumableState, formAction);
			null !== customFields ? (name = customFields.name, formAction = customFields.action || "", formEncType = customFields.encType, formMethod = customFields.method, formTarget = customFields.target, formData = customFields.data) : (target.push(" ", "formAction", "=\"", actionJavaScriptURL, "\""), formTarget = formMethod = formEncType = formAction = name = null, injectFormReplayingRuntime(resumableState, renderState));
		}
		null != name && pushAttribute(target, "name", name);
		null != formAction && pushAttribute(target, "formAction", formAction);
		null != formEncType && pushAttribute(target, "formEncType", formEncType);
		null != formMethod && pushAttribute(target, "formMethod", formMethod);
		null != formTarget && pushAttribute(target, "formTarget", formTarget);
		return formData;
	}
	function pushAttribute(target, name, value) {
		switch (name) {
			case "className":
				pushStringAttribute(target, "class", value);
				break;
			case "tabIndex":
				pushStringAttribute(target, "tabindex", value);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				pushStringAttribute(target, name, value);
				break;
			case "style":
				pushStyleAttribute(target, value);
				break;
			case "src":
			case "href": if ("" === value) break;
			case "action":
			case "formAction":
				if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) break;
				value = sanitizeURL("" + value);
				target.push(" ", name, "=\"", escapeTextForBrowser(value), "\"");
				break;
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "ref": break;
			case "autoFocus":
			case "multiple":
			case "muted":
				pushBooleanAttribute(target, name.toLowerCase(), value);
				break;
			case "xlinkHref":
				if ("function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) break;
				value = sanitizeURL("" + value);
				target.push(" ", "xlink:href", "=\"", escapeTextForBrowser(value), "\"");
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				"function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, "=\"", escapeTextForBrowser(value), "\"");
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, "=\"\"");
				break;
			case "capture":
			case "download":
				!0 === value ? target.push(" ", name, "=\"\"") : !1 !== value && "function" !== typeof value && "symbol" !== typeof value && target.push(" ", name, "=\"", escapeTextForBrowser(value), "\"");
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				"function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value && target.push(" ", name, "=\"", escapeTextForBrowser(value), "\"");
				break;
			case "rowSpan":
			case "start":
				"function" === typeof value || "symbol" === typeof value || isNaN(value) || target.push(" ", name, "=\"", escapeTextForBrowser(value), "\"");
				break;
			case "xlinkActuate":
				pushStringAttribute(target, "xlink:actuate", value);
				break;
			case "xlinkArcrole":
				pushStringAttribute(target, "xlink:arcrole", value);
				break;
			case "xlinkRole":
				pushStringAttribute(target, "xlink:role", value);
				break;
			case "xlinkShow":
				pushStringAttribute(target, "xlink:show", value);
				break;
			case "xlinkTitle":
				pushStringAttribute(target, "xlink:title", value);
				break;
			case "xlinkType":
				pushStringAttribute(target, "xlink:type", value);
				break;
			case "xmlBase":
				pushStringAttribute(target, "xml:base", value);
				break;
			case "xmlLang":
				pushStringAttribute(target, "xml:lang", value);
				break;
			case "xmlSpace":
				pushStringAttribute(target, "xml:space", value);
				break;
			default: if (!(2 < name.length) || "o" !== name[0] && "O" !== name[0] || "n" !== name[1] && "N" !== name[1]) {
				if (name = aliases.get(name) || name, isAttributeNameSafe(name)) {
					switch (typeof value) {
						case "function":
						case "symbol": return;
						case "boolean":
							var prefix$8 = name.toLowerCase().slice(0, 5);
							if ("data-" !== prefix$8 && "aria-" !== prefix$8) return;
					}
					target.push(" ", name, "=\"", escapeTextForBrowser(value), "\"");
				}
			}
		}
	}
	function pushInnerHTML(target, innerHTML, children) {
		if (null != innerHTML) {
			if (null != children) throw Error(formatProdErrorMessage(60));
			if ("object" !== typeof innerHTML || !("__html" in innerHTML)) throw Error(formatProdErrorMessage(61));
			innerHTML = innerHTML.__html;
			null !== innerHTML && void 0 !== innerHTML && target.push("" + innerHTML);
		}
	}
	function flattenOptionChildren(children) {
		var content = "";
		React.Children.forEach(children, function(child) {
			null != child && (content += child);
		});
		return content;
	}
	function injectFormReplayingRuntime(resumableState, renderState) {
		if (0 === (resumableState.instructions & 16)) {
			resumableState.instructions |= 16;
			var preamble = renderState.preamble, bootstrapChunks = renderState.bootstrapChunks;
			(preamble.htmlChunks || preamble.headChunks) && 0 === bootstrapChunks.length ? (bootstrapChunks.push(renderState.startInlineScript), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(">", "addEventListener(\"submit\",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute(\"formAction\");null!=f&&(e=f,b=null)}\"javascript:throw new Error('React form unexpectedly submitted.')\"===e&&(a.preventDefault(),b?(a=document.createElement(\"input\"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});", "<\/script>")) : bootstrapChunks.unshift(renderState.startInlineScript, ">", "addEventListener(\"submit\",function(a){if(!a.defaultPrevented){var c=a.target,d=a.submitter,e=c.action,b=d;if(d){var f=d.getAttribute(\"formAction\");null!=f&&(e=f,b=null)}\"javascript:throw new Error('React form unexpectedly submitted.')\"===e&&(a.preventDefault(),b?(a=document.createElement(\"input\"),a.name=b.name,a.value=b.value,b.parentNode.insertBefore(a,b),b=new FormData(c),a.parentNode.removeChild(a)):b=new FormData(c),a=c.ownerDocument||c,(a.$$reactFormReplay=a.$$reactFormReplay||[]).push(c,d,b))}});", "<\/script>");
		}
	}
	function pushLinkImpl(target, props) {
		target.push(startChunkForTag("link"));
		for (var propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
				case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(399, "link"));
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push("/>");
		return null;
	}
	var styleRegex = /(<\/|<)(s)(tyle)/gi;
	function styleReplacer(match, prefix, s, suffix) {
		return "" + prefix + ("s" === s ? "\\73 " : "\\53 ") + suffix;
	}
	function pushSelfClosing(target, props, tag) {
		target.push(startChunkForTag(tag));
		for (var propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
				case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(399, tag));
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push("/>");
		return null;
	}
	function pushTitleImpl(target, props) {
		target.push(startChunkForTag("title"));
		var children = null, innerHTML = null, propKey;
		for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
					children = propValue;
					break;
				case "dangerouslySetInnerHTML":
					innerHTML = propValue;
					break;
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push(">");
		props = Array.isArray(children) ? 2 > children.length ? children[0] : null : children;
		"function" !== typeof props && "symbol" !== typeof props && null !== props && void 0 !== props && target.push(escapeTextForBrowser("" + props));
		pushInnerHTML(target, innerHTML, children);
		target.push(endChunkForTag("title"));
		return null;
	}
	function pushScriptImpl(target, props) {
		target.push(startChunkForTag("script"));
		var children = null, innerHTML = null, propKey;
		for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
					children = propValue;
					break;
				case "dangerouslySetInnerHTML":
					innerHTML = propValue;
					break;
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push(">");
		pushInnerHTML(target, innerHTML, children);
		"string" === typeof children && target.push(("" + children).replace(scriptRegex, scriptReplacer));
		target.push(endChunkForTag("script"));
		return null;
	}
	function pushStartSingletonElement(target, props, tag) {
		target.push(startChunkForTag(tag));
		var innerHTML = tag = null, propKey;
		for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
					tag = propValue;
					break;
				case "dangerouslySetInnerHTML":
					innerHTML = propValue;
					break;
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push(">");
		pushInnerHTML(target, innerHTML, tag);
		return tag;
	}
	function pushStartGenericElement(target, props, tag) {
		target.push(startChunkForTag(tag));
		var innerHTML = tag = null, propKey;
		for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
			var propValue = props[propKey];
			if (null != propValue) switch (propKey) {
				case "children":
					tag = propValue;
					break;
				case "dangerouslySetInnerHTML":
					innerHTML = propValue;
					break;
				default: pushAttribute(target, propKey, propValue);
			}
		}
		target.push(">");
		pushInnerHTML(target, innerHTML, tag);
		return "string" === typeof tag ? (target.push(escapeTextForBrowser(tag)), null) : tag;
	}
	var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
	var validatedTagCache = /* @__PURE__ */ new Map();
	function startChunkForTag(tag) {
		var tagStartChunk = validatedTagCache.get(tag);
		if (void 0 === tagStartChunk) {
			if (!VALID_TAG_REGEX.test(tag)) throw Error(formatProdErrorMessage(65, tag));
			tagStartChunk = "<" + tag;
			validatedTagCache.set(tag, tagStartChunk);
		}
		return tagStartChunk;
	}
	function pushStartInstance(target$jscomp$0, type, props, resumableState, renderState, preambleState, hoistableState, formatContext, textEmbedded) {
		switch (type) {
			case "div":
			case "span":
			case "svg":
			case "path": break;
			case "a":
				target$jscomp$0.push(startChunkForTag("a"));
				var children = null, innerHTML = null, propKey;
				for (propKey in props) if (hasOwnProperty.call(props, propKey)) {
					var propValue = props[propKey];
					if (null != propValue) switch (propKey) {
						case "children":
							children = propValue;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML = propValue;
							break;
						case "href":
							"" === propValue ? pushStringAttribute(target$jscomp$0, "href", "") : pushAttribute(target$jscomp$0, propKey, propValue);
							break;
						default: pushAttribute(target$jscomp$0, propKey, propValue);
					}
				}
				target$jscomp$0.push(">");
				pushInnerHTML(target$jscomp$0, innerHTML, children);
				if ("string" === typeof children) {
					target$jscomp$0.push(escapeTextForBrowser(children));
					var JSCompiler_inline_result = null;
				} else JSCompiler_inline_result = children;
				return JSCompiler_inline_result;
			case "g":
			case "p":
			case "li": break;
			case "select":
				target$jscomp$0.push(startChunkForTag("select"));
				var children$jscomp$0 = null, innerHTML$jscomp$0 = null, propKey$jscomp$0;
				for (propKey$jscomp$0 in props) if (hasOwnProperty.call(props, propKey$jscomp$0)) {
					var propValue$jscomp$0 = props[propKey$jscomp$0];
					if (null != propValue$jscomp$0) switch (propKey$jscomp$0) {
						case "children":
							children$jscomp$0 = propValue$jscomp$0;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$0 = propValue$jscomp$0;
							break;
						case "defaultValue":
						case "value": break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$0, propValue$jscomp$0);
					}
				}
				target$jscomp$0.push(">");
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$0, children$jscomp$0);
				return children$jscomp$0;
			case "option":
				var selectedValue = formatContext.selectedValue;
				target$jscomp$0.push(startChunkForTag("option"));
				var children$jscomp$1 = null, value = null, selected = null, innerHTML$jscomp$1 = null, propKey$jscomp$1;
				for (propKey$jscomp$1 in props) if (hasOwnProperty.call(props, propKey$jscomp$1)) {
					var propValue$jscomp$1 = props[propKey$jscomp$1];
					if (null != propValue$jscomp$1) switch (propKey$jscomp$1) {
						case "children":
							children$jscomp$1 = propValue$jscomp$1;
							break;
						case "selected":
							selected = propValue$jscomp$1;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$1 = propValue$jscomp$1;
							break;
						case "value": value = propValue$jscomp$1;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$1, propValue$jscomp$1);
					}
				}
				if (null != selectedValue) {
					var stringValue = null !== value ? "" + value : flattenOptionChildren(children$jscomp$1);
					if (isArrayImpl(selectedValue)) {
						for (var i = 0; i < selectedValue.length; i++) if ("" + selectedValue[i] === stringValue) {
							target$jscomp$0.push(" selected=\"\"");
							break;
						}
					} else "" + selectedValue === stringValue && target$jscomp$0.push(" selected=\"\"");
				} else selected && target$jscomp$0.push(" selected=\"\"");
				target$jscomp$0.push(">");
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$1, children$jscomp$1);
				return children$jscomp$1;
			case "textarea":
				target$jscomp$0.push(startChunkForTag("textarea"));
				var value$jscomp$0 = null, defaultValue = null, children$jscomp$2 = null, propKey$jscomp$2;
				for (propKey$jscomp$2 in props) if (hasOwnProperty.call(props, propKey$jscomp$2)) {
					var propValue$jscomp$2 = props[propKey$jscomp$2];
					if (null != propValue$jscomp$2) switch (propKey$jscomp$2) {
						case "children":
							children$jscomp$2 = propValue$jscomp$2;
							break;
						case "value":
							value$jscomp$0 = propValue$jscomp$2;
							break;
						case "defaultValue":
							defaultValue = propValue$jscomp$2;
							break;
						case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(91));
						default: pushAttribute(target$jscomp$0, propKey$jscomp$2, propValue$jscomp$2);
					}
				}
				null === value$jscomp$0 && null !== defaultValue && (value$jscomp$0 = defaultValue);
				target$jscomp$0.push(">");
				if (null != children$jscomp$2) {
					if (null != value$jscomp$0) throw Error(formatProdErrorMessage(92));
					if (isArrayImpl(children$jscomp$2)) {
						if (1 < children$jscomp$2.length) throw Error(formatProdErrorMessage(93));
						value$jscomp$0 = "" + children$jscomp$2[0];
					}
					value$jscomp$0 = "" + children$jscomp$2;
				}
				"string" === typeof value$jscomp$0 && "\n" === value$jscomp$0[0] && target$jscomp$0.push("\n");
				null !== value$jscomp$0 && target$jscomp$0.push(escapeTextForBrowser("" + value$jscomp$0));
				return null;
			case "input":
				target$jscomp$0.push(startChunkForTag("input"));
				var name = null, formAction = null, formEncType = null, formMethod = null, formTarget = null, value$jscomp$1 = null, defaultValue$jscomp$0 = null, checked = null, defaultChecked = null, propKey$jscomp$3;
				for (propKey$jscomp$3 in props) if (hasOwnProperty.call(props, propKey$jscomp$3)) {
					var propValue$jscomp$3 = props[propKey$jscomp$3];
					if (null != propValue$jscomp$3) switch (propKey$jscomp$3) {
						case "children":
						case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(399, "input"));
						case "name":
							name = propValue$jscomp$3;
							break;
						case "formAction":
							formAction = propValue$jscomp$3;
							break;
						case "formEncType":
							formEncType = propValue$jscomp$3;
							break;
						case "formMethod":
							formMethod = propValue$jscomp$3;
							break;
						case "formTarget":
							formTarget = propValue$jscomp$3;
							break;
						case "defaultChecked":
							defaultChecked = propValue$jscomp$3;
							break;
						case "defaultValue":
							defaultValue$jscomp$0 = propValue$jscomp$3;
							break;
						case "checked":
							checked = propValue$jscomp$3;
							break;
						case "value":
							value$jscomp$1 = propValue$jscomp$3;
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$3, propValue$jscomp$3);
					}
				}
				var formData = pushFormActionAttribute(target$jscomp$0, resumableState, renderState, formAction, formEncType, formMethod, formTarget, name);
				null !== checked ? pushBooleanAttribute(target$jscomp$0, "checked", checked) : null !== defaultChecked && pushBooleanAttribute(target$jscomp$0, "checked", defaultChecked);
				null !== value$jscomp$1 ? pushAttribute(target$jscomp$0, "value", value$jscomp$1) : null !== defaultValue$jscomp$0 && pushAttribute(target$jscomp$0, "value", defaultValue$jscomp$0);
				target$jscomp$0.push("/>");
				formData?.forEach(pushAdditionalFormField, target$jscomp$0);
				return null;
			case "button":
				target$jscomp$0.push(startChunkForTag("button"));
				var children$jscomp$3 = null, innerHTML$jscomp$2 = null, name$jscomp$0 = null, formAction$jscomp$0 = null, formEncType$jscomp$0 = null, formMethod$jscomp$0 = null, formTarget$jscomp$0 = null, propKey$jscomp$4;
				for (propKey$jscomp$4 in props) if (hasOwnProperty.call(props, propKey$jscomp$4)) {
					var propValue$jscomp$4 = props[propKey$jscomp$4];
					if (null != propValue$jscomp$4) switch (propKey$jscomp$4) {
						case "children":
							children$jscomp$3 = propValue$jscomp$4;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$2 = propValue$jscomp$4;
							break;
						case "name":
							name$jscomp$0 = propValue$jscomp$4;
							break;
						case "formAction":
							formAction$jscomp$0 = propValue$jscomp$4;
							break;
						case "formEncType":
							formEncType$jscomp$0 = propValue$jscomp$4;
							break;
						case "formMethod":
							formMethod$jscomp$0 = propValue$jscomp$4;
							break;
						case "formTarget":
							formTarget$jscomp$0 = propValue$jscomp$4;
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$4, propValue$jscomp$4);
					}
				}
				var formData$jscomp$0 = pushFormActionAttribute(target$jscomp$0, resumableState, renderState, formAction$jscomp$0, formEncType$jscomp$0, formMethod$jscomp$0, formTarget$jscomp$0, name$jscomp$0);
				target$jscomp$0.push(">");
				formData$jscomp$0?.forEach(pushAdditionalFormField, target$jscomp$0);
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$2, children$jscomp$3);
				if ("string" === typeof children$jscomp$3) {
					target$jscomp$0.push(escapeTextForBrowser(children$jscomp$3));
					var JSCompiler_inline_result$jscomp$0 = null;
				} else JSCompiler_inline_result$jscomp$0 = children$jscomp$3;
				return JSCompiler_inline_result$jscomp$0;
			case "form":
				target$jscomp$0.push(startChunkForTag("form"));
				var children$jscomp$4 = null, innerHTML$jscomp$3 = null, formAction$jscomp$1 = null, formEncType$jscomp$1 = null, formMethod$jscomp$1 = null, formTarget$jscomp$1 = null, propKey$jscomp$5;
				for (propKey$jscomp$5 in props) if (hasOwnProperty.call(props, propKey$jscomp$5)) {
					var propValue$jscomp$5 = props[propKey$jscomp$5];
					if (null != propValue$jscomp$5) switch (propKey$jscomp$5) {
						case "children":
							children$jscomp$4 = propValue$jscomp$5;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$3 = propValue$jscomp$5;
							break;
						case "action":
							formAction$jscomp$1 = propValue$jscomp$5;
							break;
						case "encType":
							formEncType$jscomp$1 = propValue$jscomp$5;
							break;
						case "method":
							formMethod$jscomp$1 = propValue$jscomp$5;
							break;
						case "target":
							formTarget$jscomp$1 = propValue$jscomp$5;
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$5, propValue$jscomp$5);
					}
				}
				var formData$jscomp$1 = null, formActionName = null;
				if ("function" === typeof formAction$jscomp$1) {
					var customFields = getCustomFormFields(resumableState, formAction$jscomp$1);
					null !== customFields ? (formAction$jscomp$1 = customFields.action || "", formEncType$jscomp$1 = customFields.encType, formMethod$jscomp$1 = customFields.method, formTarget$jscomp$1 = customFields.target, formData$jscomp$1 = customFields.data, formActionName = customFields.name) : (target$jscomp$0.push(" ", "action", "=\"", actionJavaScriptURL, "\""), formTarget$jscomp$1 = formMethod$jscomp$1 = formEncType$jscomp$1 = formAction$jscomp$1 = null, injectFormReplayingRuntime(resumableState, renderState));
				}
				null != formAction$jscomp$1 && pushAttribute(target$jscomp$0, "action", formAction$jscomp$1);
				null != formEncType$jscomp$1 && pushAttribute(target$jscomp$0, "encType", formEncType$jscomp$1);
				null != formMethod$jscomp$1 && pushAttribute(target$jscomp$0, "method", formMethod$jscomp$1);
				null != formTarget$jscomp$1 && pushAttribute(target$jscomp$0, "target", formTarget$jscomp$1);
				target$jscomp$0.push(">");
				null !== formActionName && (target$jscomp$0.push("<input type=\"hidden\""), pushStringAttribute(target$jscomp$0, "name", formActionName), target$jscomp$0.push("/>"), formData$jscomp$1?.forEach(pushAdditionalFormField, target$jscomp$0));
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$3, children$jscomp$4);
				if ("string" === typeof children$jscomp$4) {
					target$jscomp$0.push(escapeTextForBrowser(children$jscomp$4));
					var JSCompiler_inline_result$jscomp$1 = null;
				} else JSCompiler_inline_result$jscomp$1 = children$jscomp$4;
				return JSCompiler_inline_result$jscomp$1;
			case "menuitem":
				target$jscomp$0.push(startChunkForTag("menuitem"));
				for (var propKey$jscomp$6 in props) if (hasOwnProperty.call(props, propKey$jscomp$6)) {
					var propValue$jscomp$6 = props[propKey$jscomp$6];
					if (null != propValue$jscomp$6) switch (propKey$jscomp$6) {
						case "children":
						case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(400));
						default: pushAttribute(target$jscomp$0, propKey$jscomp$6, propValue$jscomp$6);
					}
				}
				target$jscomp$0.push(">");
				return null;
			case "object":
				target$jscomp$0.push(startChunkForTag("object"));
				var children$jscomp$5 = null, innerHTML$jscomp$4 = null, propKey$jscomp$7;
				for (propKey$jscomp$7 in props) if (hasOwnProperty.call(props, propKey$jscomp$7)) {
					var propValue$jscomp$7 = props[propKey$jscomp$7];
					if (null != propValue$jscomp$7) switch (propKey$jscomp$7) {
						case "children":
							children$jscomp$5 = propValue$jscomp$7;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$4 = propValue$jscomp$7;
							break;
						case "data":
							var sanitizedValue = sanitizeURL("" + propValue$jscomp$7);
							if ("" === sanitizedValue) break;
							target$jscomp$0.push(" ", "data", "=\"", escapeTextForBrowser(sanitizedValue), "\"");
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$7, propValue$jscomp$7);
					}
				}
				target$jscomp$0.push(">");
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$4, children$jscomp$5);
				if ("string" === typeof children$jscomp$5) {
					target$jscomp$0.push(escapeTextForBrowser(children$jscomp$5));
					var JSCompiler_inline_result$jscomp$2 = null;
				} else JSCompiler_inline_result$jscomp$2 = children$jscomp$5;
				return JSCompiler_inline_result$jscomp$2;
			case "title":
				var noscriptTagInScope = formatContext.tagScope & 1, isFallback = formatContext.tagScope & 4;
				if (4 === formatContext.insertionMode || noscriptTagInScope || null != props.itemProp) var JSCompiler_inline_result$jscomp$3 = pushTitleImpl(target$jscomp$0, props);
				else isFallback ? JSCompiler_inline_result$jscomp$3 = null : (pushTitleImpl(renderState.hoistableChunks, props), JSCompiler_inline_result$jscomp$3 = void 0);
				return JSCompiler_inline_result$jscomp$3;
			case "link":
				var noscriptTagInScope$jscomp$0 = formatContext.tagScope & 1, isFallback$jscomp$0 = formatContext.tagScope & 4, rel = props.rel, href = props.href, precedence = props.precedence;
				if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$0 || null != props.itemProp || "string" !== typeof rel || "string" !== typeof href || "" === href) {
					pushLinkImpl(target$jscomp$0, props);
					var JSCompiler_inline_result$jscomp$4 = null;
				} else if ("stylesheet" === props.rel) if ("string" !== typeof precedence || null != props.disabled || props.onLoad || props.onError) JSCompiler_inline_result$jscomp$4 = pushLinkImpl(target$jscomp$0, props);
				else {
					var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
					if (null !== resourceState) {
						resumableState.styleResources[href] = null;
						styleQueue || (styleQueue = {
							precedence: escapeTextForBrowser(precedence),
							rules: [],
							hrefs: [],
							sheets: /* @__PURE__ */ new Map()
						}, renderState.styles.set(precedence, styleQueue));
						var resource = {
							state: 0,
							props: assign({}, props, {
								"data-precedence": props.precedence,
								precedence: null
							})
						};
						if (resourceState) {
							2 === resourceState.length && adoptPreloadCredentials(resource.props, resourceState);
							var preloadResource = renderState.preloads.stylesheets.get(href);
							preloadResource && 0 < preloadResource.length ? preloadResource.length = 0 : resource.state = 1;
						}
						styleQueue.sheets.set(href, resource);
						hoistableState && hoistableState.stylesheets.add(resource);
					} else if (styleQueue) {
						var resource$9 = styleQueue.sheets.get(href);
						resource$9 && hoistableState && hoistableState.stylesheets.add(resource$9);
					}
					textEmbedded && target$jscomp$0.push("<!-- -->");
					JSCompiler_inline_result$jscomp$4 = null;
				}
				else props.onLoad || props.onError ? JSCompiler_inline_result$jscomp$4 = pushLinkImpl(target$jscomp$0, props) : (textEmbedded && target$jscomp$0.push("<!-- -->"), JSCompiler_inline_result$jscomp$4 = isFallback$jscomp$0 ? null : pushLinkImpl(renderState.hoistableChunks, props));
				return JSCompiler_inline_result$jscomp$4;
			case "script":
				var noscriptTagInScope$jscomp$1 = formatContext.tagScope & 1, asyncProp = props.async;
				if ("string" !== typeof props.src || !props.src || !asyncProp || "function" === typeof asyncProp || "symbol" === typeof asyncProp || props.onLoad || props.onError || 4 === formatContext.insertionMode || noscriptTagInScope$jscomp$1 || null != props.itemProp) var JSCompiler_inline_result$jscomp$5 = pushScriptImpl(target$jscomp$0, props);
				else {
					var key = props.src;
					if ("module" === props.type) {
						var resources = resumableState.moduleScriptResources;
						var preloads = renderState.preloads.moduleScripts;
					} else resources = resumableState.scriptResources, preloads = renderState.preloads.scripts;
					var resourceState$jscomp$0 = resources.hasOwnProperty(key) ? resources[key] : void 0;
					if (null !== resourceState$jscomp$0) {
						resources[key] = null;
						var scriptProps = props;
						if (resourceState$jscomp$0) {
							2 === resourceState$jscomp$0.length && (scriptProps = assign({}, props), adoptPreloadCredentials(scriptProps, resourceState$jscomp$0));
							var preloadResource$jscomp$0 = preloads.get(key);
							preloadResource$jscomp$0 && (preloadResource$jscomp$0.length = 0);
						}
						var resource$jscomp$0 = [];
						renderState.scripts.add(resource$jscomp$0);
						pushScriptImpl(resource$jscomp$0, scriptProps);
					}
					textEmbedded && target$jscomp$0.push("<!-- -->");
					JSCompiler_inline_result$jscomp$5 = null;
				}
				return JSCompiler_inline_result$jscomp$5;
			case "style":
				var noscriptTagInScope$jscomp$2 = formatContext.tagScope & 1, precedence$jscomp$0 = props.precedence, href$jscomp$0 = props.href, nonce = props.nonce;
				if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$2 || null != props.itemProp || "string" !== typeof precedence$jscomp$0 || "string" !== typeof href$jscomp$0 || "" === href$jscomp$0) {
					target$jscomp$0.push(startChunkForTag("style"));
					var children$jscomp$6 = null, innerHTML$jscomp$5 = null, propKey$jscomp$8;
					for (propKey$jscomp$8 in props) if (hasOwnProperty.call(props, propKey$jscomp$8)) {
						var propValue$jscomp$8 = props[propKey$jscomp$8];
						if (null != propValue$jscomp$8) switch (propKey$jscomp$8) {
							case "children":
								children$jscomp$6 = propValue$jscomp$8;
								break;
							case "dangerouslySetInnerHTML":
								innerHTML$jscomp$5 = propValue$jscomp$8;
								break;
							default: pushAttribute(target$jscomp$0, propKey$jscomp$8, propValue$jscomp$8);
						}
					}
					target$jscomp$0.push(">");
					var child = Array.isArray(children$jscomp$6) ? 2 > children$jscomp$6.length ? children$jscomp$6[0] : null : children$jscomp$6;
					"function" !== typeof child && "symbol" !== typeof child && null !== child && void 0 !== child && target$jscomp$0.push(("" + child).replace(styleRegex, styleReplacer));
					pushInnerHTML(target$jscomp$0, innerHTML$jscomp$5, children$jscomp$6);
					target$jscomp$0.push(endChunkForTag("style"));
					var JSCompiler_inline_result$jscomp$6 = null;
				} else {
					var styleQueue$jscomp$0 = renderState.styles.get(precedence$jscomp$0);
					if (null !== (resumableState.styleResources.hasOwnProperty(href$jscomp$0) ? resumableState.styleResources[href$jscomp$0] : void 0)) {
						resumableState.styleResources[href$jscomp$0] = null;
						styleQueue$jscomp$0 || (styleQueue$jscomp$0 = {
							precedence: escapeTextForBrowser(precedence$jscomp$0),
							rules: [],
							hrefs: [],
							sheets: /* @__PURE__ */ new Map()
						}, renderState.styles.set(precedence$jscomp$0, styleQueue$jscomp$0));
						var nonceStyle = renderState.nonce.style;
						if (!nonceStyle || nonceStyle === nonce) {
							styleQueue$jscomp$0.hrefs.push(escapeTextForBrowser(href$jscomp$0));
							var target = styleQueue$jscomp$0.rules, children$jscomp$7 = null, innerHTML$jscomp$6 = null, propKey$jscomp$9;
							for (propKey$jscomp$9 in props) if (hasOwnProperty.call(props, propKey$jscomp$9)) {
								var propValue$jscomp$9 = props[propKey$jscomp$9];
								if (null != propValue$jscomp$9) switch (propKey$jscomp$9) {
									case "children":
										children$jscomp$7 = propValue$jscomp$9;
										break;
									case "dangerouslySetInnerHTML": innerHTML$jscomp$6 = propValue$jscomp$9;
								}
							}
							var child$jscomp$0 = Array.isArray(children$jscomp$7) ? 2 > children$jscomp$7.length ? children$jscomp$7[0] : null : children$jscomp$7;
							"function" !== typeof child$jscomp$0 && "symbol" !== typeof child$jscomp$0 && null !== child$jscomp$0 && void 0 !== child$jscomp$0 && target.push(("" + child$jscomp$0).replace(styleRegex, styleReplacer));
							pushInnerHTML(target, innerHTML$jscomp$6, children$jscomp$7);
						}
					}
					styleQueue$jscomp$0 && hoistableState && hoistableState.styles.add(styleQueue$jscomp$0);
					textEmbedded && target$jscomp$0.push("<!-- -->");
					JSCompiler_inline_result$jscomp$6 = void 0;
				}
				return JSCompiler_inline_result$jscomp$6;
			case "meta":
				var noscriptTagInScope$jscomp$3 = formatContext.tagScope & 1, isFallback$jscomp$1 = formatContext.tagScope & 4;
				if (4 === formatContext.insertionMode || noscriptTagInScope$jscomp$3 || null != props.itemProp) var JSCompiler_inline_result$jscomp$7 = pushSelfClosing(target$jscomp$0, props, "meta");
				else textEmbedded && target$jscomp$0.push("<!-- -->"), JSCompiler_inline_result$jscomp$7 = isFallback$jscomp$1 ? null : "string" === typeof props.charSet ? pushSelfClosing(renderState.charsetChunks, props, "meta") : "viewport" === props.name ? pushSelfClosing(renderState.viewportChunks, props, "meta") : pushSelfClosing(renderState.hoistableChunks, props, "meta");
				return JSCompiler_inline_result$jscomp$7;
			case "listing":
			case "pre":
				target$jscomp$0.push(startChunkForTag(type));
				var children$jscomp$8 = null, innerHTML$jscomp$7 = null, propKey$jscomp$10;
				for (propKey$jscomp$10 in props) if (hasOwnProperty.call(props, propKey$jscomp$10)) {
					var propValue$jscomp$10 = props[propKey$jscomp$10];
					if (null != propValue$jscomp$10) switch (propKey$jscomp$10) {
						case "children":
							children$jscomp$8 = propValue$jscomp$10;
							break;
						case "dangerouslySetInnerHTML":
							innerHTML$jscomp$7 = propValue$jscomp$10;
							break;
						default: pushAttribute(target$jscomp$0, propKey$jscomp$10, propValue$jscomp$10);
					}
				}
				target$jscomp$0.push(">");
				if (null != innerHTML$jscomp$7) {
					if (null != children$jscomp$8) throw Error(formatProdErrorMessage(60));
					if ("object" !== typeof innerHTML$jscomp$7 || !("__html" in innerHTML$jscomp$7)) throw Error(formatProdErrorMessage(61));
					var html = innerHTML$jscomp$7.__html;
					null !== html && void 0 !== html && ("string" === typeof html && 0 < html.length && "\n" === html[0] ? target$jscomp$0.push("\n", html) : target$jscomp$0.push("" + html));
				}
				"string" === typeof children$jscomp$8 && "\n" === children$jscomp$8[0] && target$jscomp$0.push("\n");
				return children$jscomp$8;
			case "img":
				var pictureOrNoScriptTagInScope = formatContext.tagScope & 3, src = props.src, srcSet = props.srcSet;
				if (!("lazy" === props.loading || !src && !srcSet || "string" !== typeof src && null != src || "string" !== typeof srcSet && null != srcSet || "low" === props.fetchPriority || pictureOrNoScriptTagInScope) && ("string" !== typeof src || ":" !== src[4] || "d" !== src[0] && "D" !== src[0] || "a" !== src[1] && "A" !== src[1] || "t" !== src[2] && "T" !== src[2] || "a" !== src[3] && "A" !== src[3]) && ("string" !== typeof srcSet || ":" !== srcSet[4] || "d" !== srcSet[0] && "D" !== srcSet[0] || "a" !== srcSet[1] && "A" !== srcSet[1] || "t" !== srcSet[2] && "T" !== srcSet[2] || "a" !== srcSet[3] && "A" !== srcSet[3])) {
					null !== hoistableState && formatContext.tagScope & 64 && (hoistableState.suspenseyImages = !0);
					var sizes = "string" === typeof props.sizes ? props.sizes : void 0, key$jscomp$0 = srcSet ? srcSet + "\n" + (sizes || "") : src, promotablePreloads = renderState.preloads.images, resource$jscomp$1 = promotablePreloads.get(key$jscomp$0);
					if (resource$jscomp$1) {
						if ("high" === props.fetchPriority || 10 > renderState.highImagePreloads.size) promotablePreloads.delete(key$jscomp$0), renderState.highImagePreloads.add(resource$jscomp$1);
					} else if (!resumableState.imageResources.hasOwnProperty(key$jscomp$0)) {
						resumableState.imageResources[key$jscomp$0] = PRELOAD_NO_CREDS;
						var input = props.crossOrigin;
						var JSCompiler_inline_result$jscomp$8 = "string" === typeof input ? "use-credentials" === input ? input : "" : void 0;
						var headers = renderState.headers, header;
						headers && 0 < headers.remainingCapacity && "string" !== typeof props.srcSet && ("high" === props.fetchPriority || 500 > headers.highImagePreloads.length) && (header = getPreloadAsHeader(src, "image", {
							imageSrcSet: props.srcSet,
							imageSizes: props.sizes,
							crossOrigin: JSCompiler_inline_result$jscomp$8,
							integrity: props.integrity,
							nonce: props.nonce,
							type: props.type,
							fetchPriority: props.fetchPriority,
							referrerPolicy: props.refererPolicy
						}), 0 <= (headers.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key$jscomp$0] = PRELOAD_NO_CREDS, headers.highImagePreloads && (headers.highImagePreloads += ", "), headers.highImagePreloads += header) : (resource$jscomp$1 = [], pushLinkImpl(resource$jscomp$1, {
							rel: "preload",
							as: "image",
							href: srcSet ? void 0 : src,
							imageSrcSet: srcSet,
							imageSizes: sizes,
							crossOrigin: JSCompiler_inline_result$jscomp$8,
							integrity: props.integrity,
							type: props.type,
							fetchPriority: props.fetchPriority,
							referrerPolicy: props.referrerPolicy
						}), "high" === props.fetchPriority || 10 > renderState.highImagePreloads.size ? renderState.highImagePreloads.add(resource$jscomp$1) : (renderState.bulkPreloads.add(resource$jscomp$1), promotablePreloads.set(key$jscomp$0, resource$jscomp$1)));
					}
				}
				return pushSelfClosing(target$jscomp$0, props, "img");
			case "base":
			case "area":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "param":
			case "source":
			case "track":
			case "wbr": return pushSelfClosing(target$jscomp$0, props, type);
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": break;
			case "head":
				if (2 > formatContext.insertionMode) {
					var preamble = preambleState || renderState.preamble;
					if (preamble.headChunks) throw Error(formatProdErrorMessage(545, "`<head>`"));
					null !== preambleState && target$jscomp$0.push("<!--head-->");
					preamble.headChunks = [];
					var JSCompiler_inline_result$jscomp$9 = pushStartSingletonElement(preamble.headChunks, props, "head");
				} else JSCompiler_inline_result$jscomp$9 = pushStartGenericElement(target$jscomp$0, props, "head");
				return JSCompiler_inline_result$jscomp$9;
			case "body":
				if (2 > formatContext.insertionMode) {
					var preamble$jscomp$0 = preambleState || renderState.preamble;
					if (preamble$jscomp$0.bodyChunks) throw Error(formatProdErrorMessage(545, "`<body>`"));
					null !== preambleState && target$jscomp$0.push("<!--body-->");
					preamble$jscomp$0.bodyChunks = [];
					var JSCompiler_inline_result$jscomp$10 = pushStartSingletonElement(preamble$jscomp$0.bodyChunks, props, "body");
				} else JSCompiler_inline_result$jscomp$10 = pushStartGenericElement(target$jscomp$0, props, "body");
				return JSCompiler_inline_result$jscomp$10;
			case "html":
				if (0 === formatContext.insertionMode) {
					var preamble$jscomp$1 = preambleState || renderState.preamble;
					if (preamble$jscomp$1.htmlChunks) throw Error(formatProdErrorMessage(545, "`<html>`"));
					null !== preambleState && target$jscomp$0.push("<!--html-->");
					preamble$jscomp$1.htmlChunks = [""];
					var JSCompiler_inline_result$jscomp$11 = pushStartSingletonElement(preamble$jscomp$1.htmlChunks, props, "html");
				} else JSCompiler_inline_result$jscomp$11 = pushStartGenericElement(target$jscomp$0, props, "html");
				return JSCompiler_inline_result$jscomp$11;
			default: if (-1 !== type.indexOf("-")) {
				target$jscomp$0.push(startChunkForTag(type));
				var children$jscomp$9 = null, innerHTML$jscomp$8 = null, propKey$jscomp$11;
				for (propKey$jscomp$11 in props) if (hasOwnProperty.call(props, propKey$jscomp$11)) {
					var propValue$jscomp$11 = props[propKey$jscomp$11];
					if (null != propValue$jscomp$11) {
						var attributeName = propKey$jscomp$11;
						switch (propKey$jscomp$11) {
							case "children":
								children$jscomp$9 = propValue$jscomp$11;
								break;
							case "dangerouslySetInnerHTML":
								innerHTML$jscomp$8 = propValue$jscomp$11;
								break;
							case "style":
								pushStyleAttribute(target$jscomp$0, propValue$jscomp$11);
								break;
							case "suppressContentEditableWarning":
							case "suppressHydrationWarning":
							case "ref": break;
							case "className": attributeName = "class";
							default: if (isAttributeNameSafe(propKey$jscomp$11) && "function" !== typeof propValue$jscomp$11 && "symbol" !== typeof propValue$jscomp$11 && !1 !== propValue$jscomp$11) {
								if (!0 === propValue$jscomp$11) propValue$jscomp$11 = "";
								else if ("object" === typeof propValue$jscomp$11) continue;
								target$jscomp$0.push(" ", attributeName, "=\"", escapeTextForBrowser(propValue$jscomp$11), "\"");
							}
						}
					}
				}
				target$jscomp$0.push(">");
				pushInnerHTML(target$jscomp$0, innerHTML$jscomp$8, children$jscomp$9);
				return children$jscomp$9;
			}
		}
		return pushStartGenericElement(target$jscomp$0, props, type);
	}
	var endTagCache = /* @__PURE__ */ new Map();
	function endChunkForTag(tag) {
		var chunk = endTagCache.get(tag);
		void 0 === chunk && (chunk = "</" + tag + ">", endTagCache.set(tag, chunk));
		return chunk;
	}
	function hoistPreambleState(renderState, preambleState) {
		renderState = renderState.preamble;
		null === renderState.htmlChunks && preambleState.htmlChunks && (renderState.htmlChunks = preambleState.htmlChunks);
		null === renderState.headChunks && preambleState.headChunks && (renderState.headChunks = preambleState.headChunks);
		null === renderState.bodyChunks && preambleState.bodyChunks && (renderState.bodyChunks = preambleState.bodyChunks);
	}
	function writeBootstrap(destination, renderState) {
		renderState = renderState.bootstrapChunks;
		for (var i = 0; i < renderState.length - 1; i++) destination.push(renderState[i]);
		return i < renderState.length ? (i = renderState[i], renderState.length = 0, destination.push(i)) : !0;
	}
	function writeStartPendingSuspenseBoundary(destination, renderState, id) {
		destination.push("<!--$?--><template id=\"");
		if (null === id) throw Error(formatProdErrorMessage(395));
		destination.push(renderState.boundaryPrefix);
		renderState = id.toString(16);
		destination.push(renderState);
		return destination.push("\"></template>");
	}
	function writeStartSegment(destination, renderState, formatContext, id) {
		switch (formatContext.insertionMode) {
			case 0:
			case 1:
			case 3:
			case 2: return destination.push("<div hidden id=\""), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push("\">");
			case 4: return destination.push("<svg aria-hidden=\"true\" style=\"display:none\" id=\""), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push("\">");
			case 5: return destination.push("<math aria-hidden=\"true\" style=\"display:none\" id=\""), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push("\">");
			case 6: return destination.push("<table hidden id=\""), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push("\">");
			case 7: return destination.push("<table hidden><tbody id=\""), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push("\">");
			case 8: return destination.push("<table hidden><tr id=\""), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push("\">");
			case 9: return destination.push("<table hidden><colgroup id=\""), destination.push(renderState.segmentPrefix), renderState = id.toString(16), destination.push(renderState), destination.push("\">");
			default: throw Error(formatProdErrorMessage(397));
		}
	}
	function writeEndSegment(destination, formatContext) {
		switch (formatContext.insertionMode) {
			case 0:
			case 1:
			case 3:
			case 2: return destination.push("</div>");
			case 4: return destination.push("</svg>");
			case 5: return destination.push("</math>");
			case 6: return destination.push("</table>");
			case 7: return destination.push("</tbody></table>");
			case 8: return destination.push("</tr></table>");
			case 9: return destination.push("</colgroup></table>");
			default: throw Error(formatProdErrorMessage(397));
		}
	}
	var regexForJSStringsInInstructionScripts = /[<\u2028\u2029]/g;
	function escapeJSStringsForInstructionScripts(input) {
		return JSON.stringify(input).replace(regexForJSStringsInInstructionScripts, function(match) {
			switch (match) {
				case "<": return "\\u003c";
				case "\u2028": return "\\u2028";
				case "\u2029": return "\\u2029";
				default: throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
			}
		});
	}
	var regexForJSStringsInScripts = /[&><\u2028\u2029]/g;
	function escapeJSObjectForInstructionScripts(input) {
		return JSON.stringify(input).replace(regexForJSStringsInScripts, function(match) {
			switch (match) {
				case "&": return "\\u0026";
				case ">": return "\\u003e";
				case "<": return "\\u003c";
				case "\u2028": return "\\u2028";
				case "\u2029": return "\\u2029";
				default: throw Error("escapeJSObjectForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
			}
		});
	}
	var currentlyRenderingBoundaryHasStylesToHoist = !1;
	var destinationHasCapacity = !0;
	function flushStyleTagsLateForBoundary(styleQueue) {
		var rules = styleQueue.rules, hrefs = styleQueue.hrefs, i = 0;
		if (hrefs.length) {
			this.push(currentlyFlushingRenderState.startInlineStyle);
			this.push(" media=\"not all\" data-precedence=\"");
			this.push(styleQueue.precedence);
			for (this.push("\" data-href=\""); i < hrefs.length - 1; i++) this.push(hrefs[i]), this.push(" ");
			this.push(hrefs[i]);
			this.push("\">");
			for (i = 0; i < rules.length; i++) this.push(rules[i]);
			destinationHasCapacity = this.push("</style>");
			currentlyRenderingBoundaryHasStylesToHoist = !0;
			rules.length = 0;
			hrefs.length = 0;
		}
	}
	function hasStylesToHoist(stylesheet) {
		return 2 !== stylesheet.state ? currentlyRenderingBoundaryHasStylesToHoist = !0 : !1;
	}
	function writeHoistablesForBoundary(destination, hoistableState, renderState) {
		currentlyRenderingBoundaryHasStylesToHoist = !1;
		destinationHasCapacity = !0;
		currentlyFlushingRenderState = renderState;
		hoistableState.styles.forEach(flushStyleTagsLateForBoundary, destination);
		currentlyFlushingRenderState = null;
		hoistableState.stylesheets.forEach(hasStylesToHoist);
		currentlyRenderingBoundaryHasStylesToHoist && (renderState.stylesToHoist = !0);
		return destinationHasCapacity;
	}
	function flushResource(resource) {
		for (var i = 0; i < resource.length; i++) this.push(resource[i]);
		resource.length = 0;
	}
	var stylesheetFlushingQueue = [];
	function flushStyleInPreamble(stylesheet) {
		pushLinkImpl(stylesheetFlushingQueue, stylesheet.props);
		for (var i = 0; i < stylesheetFlushingQueue.length; i++) this.push(stylesheetFlushingQueue[i]);
		stylesheetFlushingQueue.length = 0;
		stylesheet.state = 2;
	}
	function flushStylesInPreamble(styleQueue) {
		var hasStylesheets = 0 < styleQueue.sheets.size;
		styleQueue.sheets.forEach(flushStyleInPreamble, this);
		styleQueue.sheets.clear();
		var rules = styleQueue.rules, hrefs = styleQueue.hrefs;
		if (!hasStylesheets || hrefs.length) {
			this.push(currentlyFlushingRenderState.startInlineStyle);
			this.push(" data-precedence=\"");
			this.push(styleQueue.precedence);
			styleQueue = 0;
			if (hrefs.length) {
				for (this.push("\" data-href=\""); styleQueue < hrefs.length - 1; styleQueue++) this.push(hrefs[styleQueue]), this.push(" ");
				this.push(hrefs[styleQueue]);
			}
			this.push("\">");
			for (styleQueue = 0; styleQueue < rules.length; styleQueue++) this.push(rules[styleQueue]);
			this.push("</style>");
			rules.length = 0;
			hrefs.length = 0;
		}
	}
	function preloadLateStyle(stylesheet) {
		if (0 === stylesheet.state) {
			stylesheet.state = 1;
			var props = stylesheet.props;
			pushLinkImpl(stylesheetFlushingQueue, {
				rel: "preload",
				as: "style",
				href: stylesheet.props.href,
				crossOrigin: props.crossOrigin,
				fetchPriority: props.fetchPriority,
				integrity: props.integrity,
				media: props.media,
				hrefLang: props.hrefLang,
				referrerPolicy: props.referrerPolicy
			});
			for (stylesheet = 0; stylesheet < stylesheetFlushingQueue.length; stylesheet++) this.push(stylesheetFlushingQueue[stylesheet]);
			stylesheetFlushingQueue.length = 0;
		}
	}
	function preloadLateStyles(styleQueue) {
		styleQueue.sheets.forEach(preloadLateStyle, this);
		styleQueue.sheets.clear();
	}
	function pushCompletedShellIdAttribute(target, resumableState) {
		0 === (resumableState.instructions & 32) && (resumableState.instructions |= 32, target.push(" id=\"", escapeTextForBrowser("_" + resumableState.idPrefix + "R_"), "\""));
	}
	function writeStyleResourceDependenciesInJS(destination, hoistableState) {
		destination.push("[");
		var nextArrayOpenBrackChunk = "[";
		hoistableState.stylesheets.forEach(function(resource) {
			if (2 !== resource.state) if (3 === resource.state) destination.push(nextArrayOpenBrackChunk), resource = escapeJSObjectForInstructionScripts("" + resource.props.href), destination.push(resource), destination.push("]"), nextArrayOpenBrackChunk = ",[";
			else {
				destination.push(nextArrayOpenBrackChunk);
				var precedence = resource.props["data-precedence"], props = resource.props, coercedHref = sanitizeURL("" + resource.props.href);
				coercedHref = escapeJSObjectForInstructionScripts(coercedHref);
				destination.push(coercedHref);
				precedence = "" + precedence;
				destination.push(",");
				precedence = escapeJSObjectForInstructionScripts(precedence);
				destination.push(precedence);
				for (var propKey in props) if (hasOwnProperty.call(props, propKey) && (precedence = props[propKey], null != precedence)) switch (propKey) {
					case "href":
					case "rel":
					case "precedence":
					case "data-precedence": break;
					case "children":
					case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(399, "link"));
					default: writeStyleResourceAttributeInJS(destination, propKey, precedence);
				}
				destination.push("]");
				nextArrayOpenBrackChunk = ",[";
				resource.state = 3;
			}
		});
		destination.push("]");
	}
	function writeStyleResourceAttributeInJS(destination, name, value) {
		var attributeName = name.toLowerCase();
		switch (typeof value) {
			case "function":
			case "symbol": return;
		}
		switch (name) {
			case "innerHTML":
			case "dangerouslySetInnerHTML":
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "style":
			case "ref": return;
			case "className":
				attributeName = "class";
				name = "" + value;
				break;
			case "hidden":
				if (!1 === value) return;
				name = "";
				break;
			case "src":
			case "href":
				value = sanitizeURL(value);
				name = "" + value;
				break;
			default:
				if (2 < name.length && ("o" === name[0] || "O" === name[0]) && ("n" === name[1] || "N" === name[1]) || !isAttributeNameSafe(name)) return;
				name = "" + value;
		}
		destination.push(",");
		attributeName = escapeJSObjectForInstructionScripts(attributeName);
		destination.push(attributeName);
		destination.push(",");
		attributeName = escapeJSObjectForInstructionScripts(name);
		destination.push(attributeName);
	}
	function createHoistableState() {
		return {
			styles: /* @__PURE__ */ new Set(),
			stylesheets: /* @__PURE__ */ new Set(),
			suspenseyImages: !1
		};
	}
	function prefetchDNS(href) {
		var request = currentRequest ? currentRequest : null;
		if (request) {
			var resumableState = request.resumableState, renderState = request.renderState;
			if ("string" === typeof href && href) {
				if (!resumableState.dnsResources.hasOwnProperty(href)) {
					resumableState.dnsResources[href] = null;
					resumableState = renderState.headers;
					var header, JSCompiler_temp;
					if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity) JSCompiler_temp = (header = "<" + ("" + href).replace(regexForHrefInLinkHeaderURLContext, escapeHrefForLinkHeaderURLContextReplacer) + ">; rel=dns-prefetch", 0 <= (resumableState.remainingCapacity -= header.length + 2));
					JSCompiler_temp ? (renderState.resets.dns[href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (header = [], pushLinkImpl(header, {
						href,
						rel: "dns-prefetch"
					}), renderState.preconnects.add(header));
				}
				enqueueFlush(request);
			}
		} else previousDispatcher.D(href);
	}
	function preconnect(href, crossOrigin) {
		var request = currentRequest ? currentRequest : null;
		if (request) {
			var resumableState = request.resumableState, renderState = request.renderState;
			if ("string" === typeof href && href) {
				var bucket = "use-credentials" === crossOrigin ? "credentials" : "string" === typeof crossOrigin ? "anonymous" : "default";
				if (!resumableState.connectResources[bucket].hasOwnProperty(href)) {
					resumableState.connectResources[bucket][href] = null;
					resumableState = renderState.headers;
					var header, JSCompiler_temp;
					if (JSCompiler_temp = resumableState && 0 < resumableState.remainingCapacity) {
						JSCompiler_temp = "<" + ("" + href).replace(regexForHrefInLinkHeaderURLContext, escapeHrefForLinkHeaderURLContextReplacer) + ">; rel=preconnect";
						if ("string" === typeof crossOrigin) {
							var escapedCrossOrigin = ("" + crossOrigin).replace(regexForLinkHeaderQuotedParamValueContext, escapeStringForLinkHeaderQuotedParamValueContextReplacer);
							JSCompiler_temp += "; crossorigin=\"" + escapedCrossOrigin + "\"";
						}
						JSCompiler_temp = (header = JSCompiler_temp, 0 <= (resumableState.remainingCapacity -= header.length + 2));
					}
					JSCompiler_temp ? (renderState.resets.connect[bucket][href] = null, resumableState.preconnects && (resumableState.preconnects += ", "), resumableState.preconnects += header) : (bucket = [], pushLinkImpl(bucket, {
						rel: "preconnect",
						href,
						crossOrigin
					}), renderState.preconnects.add(bucket));
				}
				enqueueFlush(request);
			}
		} else previousDispatcher.C(href, crossOrigin);
	}
	function preload(href, as, options) {
		var request = currentRequest ? currentRequest : null;
		if (request) {
			var resumableState = request.resumableState, renderState = request.renderState;
			if (as && href) {
				switch (as) {
					case "image":
						if (options) {
							var imageSrcSet = options.imageSrcSet;
							var imageSizes = options.imageSizes;
							var fetchPriority = options.fetchPriority;
						}
						var key = imageSrcSet ? imageSrcSet + "\n" + (imageSizes || "") : href;
						if (resumableState.imageResources.hasOwnProperty(key)) return;
						resumableState.imageResources[key] = PRELOAD_NO_CREDS;
						resumableState = renderState.headers;
						var header;
						resumableState && 0 < resumableState.remainingCapacity && "string" !== typeof imageSrcSet && "high" === fetchPriority && (header = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= header.length + 2)) ? (renderState.resets.image[key] = PRELOAD_NO_CREDS, resumableState.highImagePreloads && (resumableState.highImagePreloads += ", "), resumableState.highImagePreloads += header) : (resumableState = [], pushLinkImpl(resumableState, assign({
							rel: "preload",
							href: imageSrcSet ? void 0 : href,
							as
						}, options)), "high" === fetchPriority ? renderState.highImagePreloads.add(resumableState) : (renderState.bulkPreloads.add(resumableState), renderState.preloads.images.set(key, resumableState)));
						break;
					case "style":
						if (resumableState.styleResources.hasOwnProperty(href)) return;
						imageSrcSet = [];
						pushLinkImpl(imageSrcSet, assign({
							rel: "preload",
							href,
							as
						}, options));
						resumableState.styleResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
						renderState.preloads.stylesheets.set(href, imageSrcSet);
						renderState.bulkPreloads.add(imageSrcSet);
						break;
					case "script":
						if (resumableState.scriptResources.hasOwnProperty(href)) return;
						imageSrcSet = [];
						renderState.preloads.scripts.set(href, imageSrcSet);
						renderState.bulkPreloads.add(imageSrcSet);
						pushLinkImpl(imageSrcSet, assign({
							rel: "preload",
							href,
							as
						}, options));
						resumableState.scriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
						break;
					default:
						if (resumableState.unknownResources.hasOwnProperty(as)) {
							if (imageSrcSet = resumableState.unknownResources[as], imageSrcSet.hasOwnProperty(href)) return;
						} else imageSrcSet = {}, resumableState.unknownResources[as] = imageSrcSet;
						imageSrcSet[href] = PRELOAD_NO_CREDS;
						if ((resumableState = renderState.headers) && 0 < resumableState.remainingCapacity && "font" === as && (key = getPreloadAsHeader(href, as, options), 0 <= (resumableState.remainingCapacity -= key.length + 2))) renderState.resets.font[href] = PRELOAD_NO_CREDS, resumableState.fontPreloads && (resumableState.fontPreloads += ", "), resumableState.fontPreloads += key;
						else switch (resumableState = [], href = assign({
							rel: "preload",
							href,
							as
						}, options), pushLinkImpl(resumableState, href), as) {
							case "font":
								renderState.fontPreloads.add(resumableState);
								break;
							default: renderState.bulkPreloads.add(resumableState);
						}
				}
				enqueueFlush(request);
			}
		} else previousDispatcher.L(href, as, options);
	}
	function preloadModule(href, options) {
		var request = currentRequest ? currentRequest : null;
		if (request) {
			var resumableState = request.resumableState, renderState = request.renderState;
			if (href) {
				var as = options && "string" === typeof options.as ? options.as : "script";
				switch (as) {
					case "script":
						if (resumableState.moduleScriptResources.hasOwnProperty(href)) return;
						as = [];
						resumableState.moduleScriptResources[href] = !options || "string" !== typeof options.crossOrigin && "string" !== typeof options.integrity ? PRELOAD_NO_CREDS : [options.crossOrigin, options.integrity];
						renderState.preloads.moduleScripts.set(href, as);
						break;
					default:
						if (resumableState.moduleUnknownResources.hasOwnProperty(as)) {
							var resources = resumableState.unknownResources[as];
							if (resources.hasOwnProperty(href)) return;
						} else resources = {}, resumableState.moduleUnknownResources[as] = resources;
						as = [];
						resources[href] = PRELOAD_NO_CREDS;
				}
				pushLinkImpl(as, assign({
					rel: "modulepreload",
					href
				}, options));
				renderState.bulkPreloads.add(as);
				enqueueFlush(request);
			}
		} else previousDispatcher.m(href, options);
	}
	function preinitStyle(href, precedence, options) {
		var request = currentRequest ? currentRequest : null;
		if (request) {
			var resumableState = request.resumableState, renderState = request.renderState;
			if (href) {
				precedence = precedence || "default";
				var styleQueue = renderState.styles.get(precedence), resourceState = resumableState.styleResources.hasOwnProperty(href) ? resumableState.styleResources[href] : void 0;
				null !== resourceState && (resumableState.styleResources[href] = null, styleQueue || (styleQueue = {
					precedence: escapeTextForBrowser(precedence),
					rules: [],
					hrefs: [],
					sheets: /* @__PURE__ */ new Map()
				}, renderState.styles.set(precedence, styleQueue)), precedence = {
					state: 0,
					props: assign({
						rel: "stylesheet",
						href,
						"data-precedence": precedence
					}, options)
				}, resourceState && (2 === resourceState.length && adoptPreloadCredentials(precedence.props, resourceState), (renderState = renderState.preloads.stylesheets.get(href)) && 0 < renderState.length ? renderState.length = 0 : precedence.state = 1), styleQueue.sheets.set(href, precedence), enqueueFlush(request));
			}
		} else previousDispatcher.S(href, precedence, options);
	}
	function preinitScript(src, options) {
		var request = currentRequest ? currentRequest : null;
		if (request) {
			var resumableState = request.resumableState, renderState = request.renderState;
			if (src) {
				var resourceState = resumableState.scriptResources.hasOwnProperty(src) ? resumableState.scriptResources[src] : void 0;
				null !== resourceState && (resumableState.scriptResources[src] = null, options = assign({
					src,
					async: !0
				}, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.scripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
			}
		} else previousDispatcher.X(src, options);
	}
	function preinitModuleScript(src, options) {
		var request = currentRequest ? currentRequest : null;
		if (request) {
			var resumableState = request.resumableState, renderState = request.renderState;
			if (src) {
				var resourceState = resumableState.moduleScriptResources.hasOwnProperty(src) ? resumableState.moduleScriptResources[src] : void 0;
				null !== resourceState && (resumableState.moduleScriptResources[src] = null, options = assign({
					src,
					type: "module",
					async: !0
				}, options), resourceState && (2 === resourceState.length && adoptPreloadCredentials(options, resourceState), src = renderState.preloads.moduleScripts.get(src)) && (src.length = 0), src = [], renderState.scripts.add(src), pushScriptImpl(src, options), enqueueFlush(request));
			}
		} else previousDispatcher.M(src, options);
	}
	function adoptPreloadCredentials(target, preloadState) {
		target.crossOrigin ??= preloadState[0];
		target.integrity ??= preloadState[1];
	}
	function getPreloadAsHeader(href, as, params) {
		href = ("" + href).replace(regexForHrefInLinkHeaderURLContext, escapeHrefForLinkHeaderURLContextReplacer);
		as = ("" + as).replace(regexForLinkHeaderQuotedParamValueContext, escapeStringForLinkHeaderQuotedParamValueContextReplacer);
		as = "<" + href + ">; rel=preload; as=\"" + as + "\"";
		for (var paramName in params) hasOwnProperty.call(params, paramName) && (href = params[paramName], "string" === typeof href && (as += "; " + paramName.toLowerCase() + "=\"" + ("" + href).replace(regexForLinkHeaderQuotedParamValueContext, escapeStringForLinkHeaderQuotedParamValueContextReplacer) + "\""));
		return as;
	}
	var regexForHrefInLinkHeaderURLContext = /[<>\r\n]/g;
	function escapeHrefForLinkHeaderURLContextReplacer(match) {
		switch (match) {
			case "<": return "%3C";
			case ">": return "%3E";
			case "\n": return "%0A";
			case "\r": return "%0D";
			default: throw Error("escapeLinkHrefForHeaderContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
		}
	}
	var regexForLinkHeaderQuotedParamValueContext = /["';,\r\n]/g;
	function escapeStringForLinkHeaderQuotedParamValueContextReplacer(match) {
		switch (match) {
			case "\"": return "%22";
			case "'": return "%27";
			case ";": return "%3B";
			case ",": return "%2C";
			case "\n": return "%0A";
			case "\r": return "%0D";
			default: throw Error("escapeStringForLinkHeaderQuotedParamValueContextReplacer encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
		}
	}
	function hoistStyleQueueDependency(styleQueue) {
		this.styles.add(styleQueue);
	}
	function hoistStylesheetDependency(stylesheet) {
		this.stylesheets.add(stylesheet);
	}
	function hoistHoistables(parentState, childState) {
		childState.styles.forEach(hoistStyleQueueDependency, parentState);
		childState.stylesheets.forEach(hoistStylesheetDependency, parentState);
		childState.suspenseyImages && (parentState.suspenseyImages = !0);
	}
	function createRenderState(resumableState, generateStaticMarkup) {
		var idPrefix = resumableState.idPrefix, bootstrapChunks = [], bootstrapScriptContent = resumableState.bootstrapScriptContent, bootstrapScripts = resumableState.bootstrapScripts, bootstrapModules = resumableState.bootstrapModules;
		void 0 !== bootstrapScriptContent && (bootstrapChunks.push("<script"), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(">", ("" + bootstrapScriptContent).replace(scriptRegex, scriptReplacer), "<\/script>"));
		bootstrapScriptContent = idPrefix + "P:";
		var JSCompiler_object_inline_segmentPrefix_1673 = idPrefix + "S:";
		idPrefix += "B:";
		var JSCompiler_object_inline_preconnects_1687 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_fontPreloads_1688 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_highImagePreloads_1689 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_styles_1690 = /* @__PURE__ */ new Map(), JSCompiler_object_inline_bootstrapScripts_1691 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_scripts_1692 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_bulkPreloads_1693 = /* @__PURE__ */ new Set(), JSCompiler_object_inline_preloads_1694 = {
			images: /* @__PURE__ */ new Map(),
			stylesheets: /* @__PURE__ */ new Map(),
			scripts: /* @__PURE__ */ new Map(),
			moduleScripts: /* @__PURE__ */ new Map()
		};
		if (void 0 !== bootstrapScripts) for (var i = 0; i < bootstrapScripts.length; i++) {
			var scriptConfig = bootstrapScripts[i], src, crossOrigin = void 0, integrity = void 0, props = {
				rel: "preload",
				as: "script",
				fetchPriority: "low",
				nonce: void 0
			};
			"string" === typeof scriptConfig ? props.href = src = scriptConfig : (props.href = src = scriptConfig.src, props.integrity = integrity = "string" === typeof scriptConfig.integrity ? scriptConfig.integrity : void 0, props.crossOrigin = crossOrigin = "string" === typeof scriptConfig || null == scriptConfig.crossOrigin ? void 0 : "use-credentials" === scriptConfig.crossOrigin ? "use-credentials" : "");
			scriptConfig = resumableState;
			var href = src;
			scriptConfig.scriptResources[href] = null;
			scriptConfig.moduleScriptResources[href] = null;
			scriptConfig = [];
			pushLinkImpl(scriptConfig, props);
			JSCompiler_object_inline_bootstrapScripts_1691.add(scriptConfig);
			bootstrapChunks.push("<script src=\"", escapeTextForBrowser(src), "\"");
			"string" === typeof integrity && bootstrapChunks.push(" integrity=\"", escapeTextForBrowser(integrity), "\"");
			"string" === typeof crossOrigin && bootstrapChunks.push(" crossorigin=\"", escapeTextForBrowser(crossOrigin), "\"");
			pushCompletedShellIdAttribute(bootstrapChunks, resumableState);
			bootstrapChunks.push(" async=\"\"><\/script>");
		}
		if (void 0 !== bootstrapModules) for (bootstrapScripts = 0; bootstrapScripts < bootstrapModules.length; bootstrapScripts++) props = bootstrapModules[bootstrapScripts], crossOrigin = src = void 0, integrity = {
			rel: "modulepreload",
			fetchPriority: "low",
			nonce: void 0
		}, "string" === typeof props ? integrity.href = i = props : (integrity.href = i = props.src, integrity.integrity = crossOrigin = "string" === typeof props.integrity ? props.integrity : void 0, integrity.crossOrigin = src = "string" === typeof props || null == props.crossOrigin ? void 0 : "use-credentials" === props.crossOrigin ? "use-credentials" : ""), props = resumableState, scriptConfig = i, props.scriptResources[scriptConfig] = null, props.moduleScriptResources[scriptConfig] = null, props = [], pushLinkImpl(props, integrity), JSCompiler_object_inline_bootstrapScripts_1691.add(props), bootstrapChunks.push("<script type=\"module\" src=\"", escapeTextForBrowser(i), "\""), "string" === typeof crossOrigin && bootstrapChunks.push(" integrity=\"", escapeTextForBrowser(crossOrigin), "\""), "string" === typeof src && bootstrapChunks.push(" crossorigin=\"", escapeTextForBrowser(src), "\""), pushCompletedShellIdAttribute(bootstrapChunks, resumableState), bootstrapChunks.push(" async=\"\"><\/script>");
		return {
			placeholderPrefix: bootstrapScriptContent,
			segmentPrefix: JSCompiler_object_inline_segmentPrefix_1673,
			boundaryPrefix: idPrefix,
			startInlineScript: "<script",
			startInlineStyle: "<style",
			preamble: {
				htmlChunks: null,
				headChunks: null,
				bodyChunks: null
			},
			externalRuntimeScript: null,
			bootstrapChunks,
			importMapChunks: [],
			onHeaders: void 0,
			headers: null,
			resets: {
				font: {},
				dns: {},
				connect: {
					default: {},
					anonymous: {},
					credentials: {}
				},
				image: {},
				style: {}
			},
			charsetChunks: [],
			viewportChunks: [],
			hoistableChunks: [],
			preconnects: JSCompiler_object_inline_preconnects_1687,
			fontPreloads: JSCompiler_object_inline_fontPreloads_1688,
			highImagePreloads: JSCompiler_object_inline_highImagePreloads_1689,
			styles: JSCompiler_object_inline_styles_1690,
			bootstrapScripts: JSCompiler_object_inline_bootstrapScripts_1691,
			scripts: JSCompiler_object_inline_scripts_1692,
			bulkPreloads: JSCompiler_object_inline_bulkPreloads_1693,
			preloads: JSCompiler_object_inline_preloads_1694,
			nonce: {
				script: void 0,
				style: void 0
			},
			stylesToHoist: !1,
			generateStaticMarkup
		};
	}
	function pushTextInstance(target, text, renderState, textEmbedded) {
		if (renderState.generateStaticMarkup) return target.push(escapeTextForBrowser(text)), !1;
		"" === text ? target = textEmbedded : (textEmbedded && target.push("<!-- -->"), target.push(escapeTextForBrowser(text)), target = !0);
		return target;
	}
	function pushSegmentFinale(target, renderState, lastPushedText, textEmbedded) {
		renderState.generateStaticMarkup || lastPushedText && textEmbedded && target.push("<!-- -->");
	}
	var bind = Function.prototype.bind;
	var REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
	function getComponentNameFromType(type) {
		if (null == type) return null;
		if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
		if ("string" === typeof type) return type;
		switch (type) {
			case REACT_FRAGMENT_TYPE: return "Fragment";
			case REACT_PROFILER_TYPE: return "Profiler";
			case REACT_STRICT_MODE_TYPE: return "StrictMode";
			case REACT_SUSPENSE_TYPE: return "Suspense";
			case REACT_SUSPENSE_LIST_TYPE: return "SuspenseList";
			case REACT_ACTIVITY_TYPE: return "Activity";
		}
		if ("object" === typeof type) switch (type.$$typeof) {
			case REACT_PORTAL_TYPE: return "Portal";
			case REACT_CONTEXT_TYPE: return type.displayName || "Context";
			case REACT_CONSUMER_TYPE: return (type._context.displayName || "Context") + ".Consumer";
			case REACT_FORWARD_REF_TYPE:
				var innerType = type.render;
				type = type.displayName;
				type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
				return type;
			case REACT_MEMO_TYPE: return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
			case REACT_LAZY_TYPE:
				innerType = type._payload;
				type = type._init;
				try {
					return getComponentNameFromType(type(innerType));
				} catch (x) {}
		}
		return null;
	}
	var emptyContextObject = {};
	var currentActiveSnapshot = null;
	function popToNearestCommonAncestor(prev, next) {
		if (prev !== next) {
			prev.context._currentValue2 = prev.parentValue;
			prev = prev.parent;
			var parentNext = next.parent;
			if (null === prev) {
				if (null !== parentNext) throw Error(formatProdErrorMessage(401));
			} else {
				if (null === parentNext) throw Error(formatProdErrorMessage(401));
				popToNearestCommonAncestor(prev, parentNext);
			}
			next.context._currentValue2 = next.value;
		}
	}
	function popAllPrevious(prev) {
		prev.context._currentValue2 = prev.parentValue;
		prev = prev.parent;
		null !== prev && popAllPrevious(prev);
	}
	function pushAllNext(next) {
		var parentNext = next.parent;
		null !== parentNext && pushAllNext(parentNext);
		next.context._currentValue2 = next.value;
	}
	function popPreviousToCommonLevel(prev, next) {
		prev.context._currentValue2 = prev.parentValue;
		prev = prev.parent;
		if (null === prev) throw Error(formatProdErrorMessage(402));
		prev.depth === next.depth ? popToNearestCommonAncestor(prev, next) : popPreviousToCommonLevel(prev, next);
	}
	function popNextToCommonLevel(prev, next) {
		var parentNext = next.parent;
		if (null === parentNext) throw Error(formatProdErrorMessage(402));
		prev.depth === parentNext.depth ? popToNearestCommonAncestor(prev, parentNext) : popNextToCommonLevel(prev, parentNext);
		next.context._currentValue2 = next.value;
	}
	function switchContext(newSnapshot) {
		var prev = currentActiveSnapshot;
		prev !== newSnapshot && (null === prev ? pushAllNext(newSnapshot) : null === newSnapshot ? popAllPrevious(prev) : prev.depth === newSnapshot.depth ? popToNearestCommonAncestor(prev, newSnapshot) : prev.depth > newSnapshot.depth ? popPreviousToCommonLevel(prev, newSnapshot) : popNextToCommonLevel(prev, newSnapshot), currentActiveSnapshot = newSnapshot);
	}
	var classComponentUpdater = {
		enqueueSetState: function(inst, payload) {
			inst = inst._reactInternals;
			null !== inst.queue && inst.queue.push(payload);
		},
		enqueueReplaceState: function(inst, payload) {
			inst = inst._reactInternals;
			inst.replace = !0;
			inst.queue = [payload];
		},
		enqueueForceUpdate: function() {}
	};
	var emptyTreeContext = {
		id: 1,
		overflow: ""
	};
	function pushTreeContext(baseContext, totalChildren, index) {
		var baseIdWithLeadingBit = baseContext.id;
		baseContext = baseContext.overflow;
		var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
		baseIdWithLeadingBit &= ~(1 << baseLength);
		index += 1;
		var length = 32 - clz32(totalChildren) + baseLength;
		if (30 < length) {
			var numberOfOverflowBits = baseLength - baseLength % 5;
			length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
			baseIdWithLeadingBit >>= numberOfOverflowBits;
			baseLength -= numberOfOverflowBits;
			return {
				id: 1 << 32 - clz32(totalChildren) + baseLength | index << baseLength | baseIdWithLeadingBit,
				overflow: length + baseContext
			};
		}
		return {
			id: 1 << length | index << baseLength | baseIdWithLeadingBit,
			overflow: baseContext
		};
	}
	var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback;
	var log = Math.log;
	var LN2 = Math.LN2;
	function clz32Fallback(x) {
		x >>>= 0;
		return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
	}
	function noop() {}
	var SuspenseException = Error(formatProdErrorMessage(460));
	function trackUsedThenable(thenableState, thenable, index) {
		index = thenableState[index];
		void 0 === index ? thenableState.push(thenable) : index !== thenable && (thenable.then(noop, noop), thenable = index);
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default:
				"string" === typeof thenable.status ? thenable.then(noop, noop) : (thenableState = thenable, thenableState.status = "pending", thenableState.then(function(fulfilledValue) {
					if ("pending" === thenable.status) {
						var fulfilledThenable = thenable;
						fulfilledThenable.status = "fulfilled";
						fulfilledThenable.value = fulfilledValue;
					}
				}, function(error) {
					if ("pending" === thenable.status) {
						var rejectedThenable = thenable;
						rejectedThenable.status = "rejected";
						rejectedThenable.reason = error;
					}
				}));
				switch (thenable.status) {
					case "fulfilled": return thenable.value;
					case "rejected": throw thenable.reason;
				}
				suspendedThenable = thenable;
				throw SuspenseException;
		}
	}
	var suspendedThenable = null;
	function getSuspendedThenable() {
		if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
		var thenable = suspendedThenable;
		suspendedThenable = null;
		return thenable;
	}
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is;
	var currentlyRenderingComponent = null;
	var currentlyRenderingTask = null;
	var currentlyRenderingRequest = null;
	var currentlyRenderingKeyPath = null;
	var firstWorkInProgressHook = null;
	var workInProgressHook = null;
	var isReRender = !1;
	var didScheduleRenderPhaseUpdate = !1;
	var localIdCounter = 0;
	var actionStateCounter = 0;
	var actionStateMatchingIndex = -1;
	var thenableIndexCounter = 0;
	var thenableState = null;
	var renderPhaseUpdates = null;
	var numberOfReRenders = 0;
	function resolveCurrentlyRenderingComponent() {
		if (null === currentlyRenderingComponent) throw Error(formatProdErrorMessage(321));
		return currentlyRenderingComponent;
	}
	function createHook() {
		if (0 < numberOfReRenders) throw Error(formatProdErrorMessage(312));
		return {
			memoizedState: null,
			queue: null,
			next: null
		};
	}
	function createWorkInProgressHook() {
		null === workInProgressHook ? null === firstWorkInProgressHook ? (isReRender = !1, firstWorkInProgressHook = workInProgressHook = createHook()) : (isReRender = !0, workInProgressHook = firstWorkInProgressHook) : null === workInProgressHook.next ? (isReRender = !1, workInProgressHook = workInProgressHook.next = createHook()) : (isReRender = !0, workInProgressHook = workInProgressHook.next);
		return workInProgressHook;
	}
	function getThenableStateAfterSuspending() {
		var state = thenableState;
		thenableState = null;
		return state;
	}
	function resetHooksState() {
		currentlyRenderingKeyPath = currentlyRenderingRequest = currentlyRenderingTask = currentlyRenderingComponent = null;
		didScheduleRenderPhaseUpdate = !1;
		firstWorkInProgressHook = null;
		numberOfReRenders = 0;
		workInProgressHook = renderPhaseUpdates = null;
	}
	function basicStateReducer(state, action) {
		return "function" === typeof action ? action(state) : action;
	}
	function useReducer(reducer, initialArg, init) {
		currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
		workInProgressHook = createWorkInProgressHook();
		if (isReRender) {
			var queue = workInProgressHook.queue;
			initialArg = queue.dispatch;
			if (null !== renderPhaseUpdates && (init = renderPhaseUpdates.get(queue), void 0 !== init)) {
				renderPhaseUpdates.delete(queue);
				queue = workInProgressHook.memoizedState;
				do
					queue = reducer(queue, init.action), init = init.next;
				while (null !== init);
				workInProgressHook.memoizedState = queue;
				return [queue, initialArg];
			}
			return [workInProgressHook.memoizedState, initialArg];
		}
		reducer = reducer === basicStateReducer ? "function" === typeof initialArg ? initialArg() : initialArg : void 0 !== init ? init(initialArg) : initialArg;
		workInProgressHook.memoizedState = reducer;
		reducer = workInProgressHook.queue = {
			last: null,
			dispatch: null
		};
		reducer = reducer.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, reducer);
		return [workInProgressHook.memoizedState, reducer];
	}
	function useMemo(nextCreate, deps) {
		currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
		workInProgressHook = createWorkInProgressHook();
		deps = void 0 === deps ? null : deps;
		if (null !== workInProgressHook) {
			var prevState = workInProgressHook.memoizedState;
			if (null !== prevState && null !== deps) {
				var prevDeps = prevState[1];
				a: if (null === prevDeps) prevDeps = !1;
				else {
					for (var i = 0; i < prevDeps.length && i < deps.length; i++) if (!objectIs(deps[i], prevDeps[i])) {
						prevDeps = !1;
						break a;
					}
					prevDeps = !0;
				}
				if (prevDeps) return prevState[0];
			}
		}
		nextCreate = nextCreate();
		workInProgressHook.memoizedState = [nextCreate, deps];
		return nextCreate;
	}
	function dispatchAction(componentIdentity, queue, action) {
		if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
		if (componentIdentity === currentlyRenderingComponent) if (didScheduleRenderPhaseUpdate = !0, componentIdentity = {
			action,
			next: null
		}, null === renderPhaseUpdates && (renderPhaseUpdates = /* @__PURE__ */ new Map()), action = renderPhaseUpdates.get(queue), void 0 === action) renderPhaseUpdates.set(queue, componentIdentity);
		else {
			for (queue = action; null !== queue.next;) queue = queue.next;
			queue.next = componentIdentity;
		}
	}
	function throwOnUseEffectEventCall() {
		throw Error(formatProdErrorMessage(440));
	}
	function unsupportedStartTransition() {
		throw Error(formatProdErrorMessage(394));
	}
	function unsupportedSetOptimisticState() {
		throw Error(formatProdErrorMessage(479));
	}
	function useActionState(action, initialState, permalink) {
		resolveCurrentlyRenderingComponent();
		var actionStateHookIndex = actionStateCounter++, request = currentlyRenderingRequest;
		if ("function" === typeof action.$$FORM_ACTION) {
			var nextPostbackStateKey = null, componentKeyPath = currentlyRenderingKeyPath;
			request = request.formState;
			var isSignatureEqual = action.$$IS_SIGNATURE_EQUAL;
			if (null !== request && "function" === typeof isSignatureEqual) {
				var postbackKey = request[1];
				isSignatureEqual.call(action, request[2], request[3]) && (nextPostbackStateKey = void 0 !== permalink ? "p" + permalink : "k" + murmurhash3_32_gc(JSON.stringify([
					componentKeyPath,
					null,
					actionStateHookIndex
				]), 0), postbackKey === nextPostbackStateKey && (actionStateMatchingIndex = actionStateHookIndex, initialState = request[0]));
			}
			var boundAction = action.bind(null, initialState);
			action = function(payload) {
				boundAction(payload);
			};
			"function" === typeof boundAction.$$FORM_ACTION && (action.$$FORM_ACTION = function(prefix) {
				prefix = boundAction.$$FORM_ACTION(prefix);
				void 0 !== permalink && (permalink += "", prefix.action = permalink);
				var formData = prefix.data;
				formData && (null === nextPostbackStateKey && (nextPostbackStateKey = void 0 !== permalink ? "p" + permalink : "k" + murmurhash3_32_gc(JSON.stringify([
					componentKeyPath,
					null,
					actionStateHookIndex
				]), 0)), formData.append("$ACTION_KEY", nextPostbackStateKey));
				return prefix;
			});
			return [
				initialState,
				action,
				!1
			];
		}
		var boundAction$22 = action.bind(null, initialState);
		return [
			initialState,
			function(payload) {
				boundAction$22(payload);
			},
			!1
		];
	}
	function unwrapThenable(thenable) {
		var index = thenableIndexCounter;
		thenableIndexCounter += 1;
		null === thenableState && (thenableState = []);
		return trackUsedThenable(thenableState, thenable, index);
	}
	function unsupportedRefresh() {
		throw Error(formatProdErrorMessage(393));
	}
	var HooksDispatcher = {
		readContext: function(context) {
			return context._currentValue2;
		},
		use: function(usable) {
			if (null !== usable && "object" === typeof usable) {
				if ("function" === typeof usable.then) return unwrapThenable(usable);
				if (usable.$$typeof === REACT_CONTEXT_TYPE) return usable._currentValue2;
			}
			throw Error(formatProdErrorMessage(438, String(usable)));
		},
		useContext: function(context) {
			resolveCurrentlyRenderingComponent();
			return context._currentValue2;
		},
		useMemo,
		useReducer,
		useRef: function(initialValue) {
			currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
			workInProgressHook = createWorkInProgressHook();
			var previousRef = workInProgressHook.memoizedState;
			return null === previousRef ? (initialValue = { current: initialValue }, workInProgressHook.memoizedState = initialValue) : previousRef;
		},
		useState: function(initialState) {
			return useReducer(basicStateReducer, initialState);
		},
		useInsertionEffect: noop,
		useLayoutEffect: noop,
		useCallback: function(callback, deps) {
			return useMemo(function() {
				return callback;
			}, deps);
		},
		useImperativeHandle: noop,
		useEffect: noop,
		useDebugValue: noop,
		useDeferredValue: function(value, initialValue) {
			resolveCurrentlyRenderingComponent();
			return void 0 !== initialValue ? initialValue : value;
		},
		useTransition: function() {
			resolveCurrentlyRenderingComponent();
			return [!1, unsupportedStartTransition];
		},
		useId: function() {
			var JSCompiler_inline_result = currentlyRenderingTask.treeContext;
			var overflow = JSCompiler_inline_result.overflow;
			JSCompiler_inline_result = JSCompiler_inline_result.id;
			JSCompiler_inline_result = (JSCompiler_inline_result & ~(1 << 32 - clz32(JSCompiler_inline_result) - 1)).toString(32) + overflow;
			var resumableState = currentResumableState;
			if (null === resumableState) throw Error(formatProdErrorMessage(404));
			overflow = localIdCounter++;
			JSCompiler_inline_result = "_" + resumableState.idPrefix + "R_" + JSCompiler_inline_result;
			0 < overflow && (JSCompiler_inline_result += "H" + overflow.toString(32));
			return JSCompiler_inline_result + "_";
		},
		useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
			if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
			return getServerSnapshot();
		},
		useOptimistic: function(passthrough) {
			resolveCurrentlyRenderingComponent();
			return [passthrough, unsupportedSetOptimisticState];
		},
		useActionState,
		useFormState: useActionState,
		useHostTransitionStatus: function() {
			resolveCurrentlyRenderingComponent();
			return sharedNotPendingObject;
		},
		useMemoCache: function(size) {
			for (var data = Array(size), i = 0; i < size; i++) data[i] = REACT_MEMO_CACHE_SENTINEL;
			return data;
		},
		useCacheRefresh: function() {
			return unsupportedRefresh;
		},
		useEffectEvent: function() {
			return throwOnUseEffectEventCall;
		}
	};
	var currentResumableState = null;
	var DefaultAsyncDispatcher = {
		getCacheForType: function() {
			throw Error(formatProdErrorMessage(248));
		},
		cacheSignal: function() {
			throw Error(formatProdErrorMessage(248));
		}
	};
	var prefix;
	var suffix;
	function describeBuiltInComponentFrame(name) {
		if (void 0 === prefix) try {
			throw Error();
		} catch (x) {
			var match = x.stack.trim().match(/\n( *(at )?)/);
			prefix = match && match[1] || "";
			suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + prefix + name + suffix;
	}
	var reentry = !1;
	function describeNativeComponentFrame(fn, construct) {
		if (!fn || reentry) return "";
		reentry = !0;
		var previousPrepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var RunInRootFrame = { DetermineComponentFrameRoot: function() {
				try {
					if (construct) {
						var Fake = function() {
							throw Error();
						};
						Object.defineProperty(Fake.prototype, "props", { set: function() {
							throw Error();
						} });
						if ("object" === typeof Reflect && Reflect.construct) {
							try {
								Reflect.construct(Fake, []);
							} catch (x) {
								var control = x;
							}
							Reflect.construct(fn, [], Fake);
						} else {
							try {
								Fake.call();
							} catch (x$24) {
								control = x$24;
							}
							fn.call(Fake.prototype);
						}
					} else {
						try {
							throw Error();
						} catch (x$25) {
							control = x$25;
						}
						(Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {});
					}
				} catch (sample) {
					if (sample && control && "string" === typeof sample.stack) return [sample.stack, control.stack];
				}
				return [null, null];
			} };
			RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, "name");
			namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
			if (sampleStack && controlStack) {
				var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
				for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot");) RunInRootFrame++;
				for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes("DetermineComponentFrameRoot");) namePropDescriptor++;
				if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length) for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor];) namePropDescriptor--;
				for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--) if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
					if (1 !== RunInRootFrame || 1 !== namePropDescriptor) do
						if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
							var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
							fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
							return frame;
						}
					while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
					break;
				}
			}
		} finally {
			reentry = !1, Error.prepareStackTrace = previousPrepareStackTrace;
		}
		return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
	}
	function describeComponentStackByType(type) {
		if ("string" === typeof type) return describeBuiltInComponentFrame(type);
		if ("function" === typeof type) return type.prototype && type.prototype.isReactComponent ? describeNativeComponentFrame(type, !0) : describeNativeComponentFrame(type, !1);
		if ("object" === typeof type && null !== type) {
			switch (type.$$typeof) {
				case REACT_FORWARD_REF_TYPE: return describeNativeComponentFrame(type.render, !1);
				case REACT_MEMO_TYPE: return describeNativeComponentFrame(type.type, !1);
				case REACT_LAZY_TYPE:
					var lazyComponent = type, payload = lazyComponent._payload;
					lazyComponent = lazyComponent._init;
					try {
						type = lazyComponent(payload);
					} catch (x) {
						return describeBuiltInComponentFrame("Lazy");
					}
					return describeComponentStackByType(type);
			}
			if ("string" === typeof type.name) {
				a: {
					payload = type.name;
					lazyComponent = type.env;
					var location = type.debugLocation;
					if (null != location && (type = Error.prepareStackTrace, Error.prepareStackTrace = void 0, location = location.stack, Error.prepareStackTrace = type, location.startsWith("Error: react-stack-top-frame\n") && (location = location.slice(29)), type = location.indexOf("\n"), -1 !== type && (location = location.slice(type + 1)), type = location.indexOf("react_stack_bottom_frame"), -1 !== type && (type = location.lastIndexOf("\n", type)), type = -1 !== type ? location = location.slice(0, type) : "", location = type.lastIndexOf("\n"), type = -1 === location ? type : type.slice(location + 1), -1 !== type.indexOf(payload))) {
						payload = "\n" + type;
						break a;
					}
					payload = describeBuiltInComponentFrame(payload + (lazyComponent ? " [" + lazyComponent + "]" : ""));
				}
				return payload;
			}
		}
		switch (type) {
			case REACT_SUSPENSE_LIST_TYPE: return describeBuiltInComponentFrame("SuspenseList");
			case REACT_SUSPENSE_TYPE: return describeBuiltInComponentFrame("Suspense");
		}
		return "";
	}
	function isEligibleForOutlining(request, boundary) {
		return (500 < boundary.byteSize || !1) && null === boundary.contentPreamble;
	}
	function defaultErrorHandler(error) {
		if ("object" === typeof error && null !== error && "string" === typeof error.environmentName) {
			var JSCompiler_inline_result = error.environmentName;
			error = [error].slice(0);
			"string" === typeof error[0] ? error.splice(0, 1, "[%s] " + error[0], " " + JSCompiler_inline_result + " ") : error.splice(0, 0, "[%s]", " " + JSCompiler_inline_result + " ");
			error.unshift(console);
			JSCompiler_inline_result = bind.apply(console.error, error);
			JSCompiler_inline_result();
		} else console.error(error);
		return null;
	}
	function RequestInstance(resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone, formState) {
		var abortSet = /* @__PURE__ */ new Set();
		this.destination = null;
		this.flushScheduled = !1;
		this.resumableState = resumableState;
		this.renderState = renderState;
		this.rootFormatContext = rootFormatContext;
		this.progressiveChunkSize = void 0 === progressiveChunkSize ? 12800 : progressiveChunkSize;
		this.status = 10;
		this.fatalError = null;
		this.pendingRootTasks = this.allPendingTasks = this.nextSegmentId = 0;
		this.completedPreambleSegments = this.completedRootSegment = null;
		this.byteSize = 0;
		this.abortableTasks = abortSet;
		this.pingedTasks = [];
		this.clientRenderedBoundaries = [];
		this.completedBoundaries = [];
		this.partialBoundaries = [];
		this.trackedPostpones = null;
		this.onError = void 0 === onError ? defaultErrorHandler : onError;
		this.onPostpone = void 0 === onPostpone ? noop : onPostpone;
		this.onAllReady = void 0 === onAllReady ? noop : onAllReady;
		this.onShellReady = void 0 === onShellReady ? noop : onShellReady;
		this.onShellError = void 0 === onShellError ? noop : onShellError;
		this.onFatalError = void 0 === onFatalError ? noop : onFatalError;
		this.formState = void 0 === formState ? null : formState;
	}
	function createRequest(children, resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone, formState) {
		resumableState = new RequestInstance(resumableState, renderState, rootFormatContext, progressiveChunkSize, onError, onAllReady, onShellReady, onShellError, onFatalError, onPostpone, formState);
		renderState = createPendingSegment(resumableState, 0, null, rootFormatContext, !1, !1);
		renderState.parentFlushed = !0;
		children = createRenderTask(resumableState, null, children, -1, null, renderState, null, null, resumableState.abortableTasks, null, rootFormatContext, null, emptyTreeContext, null, null);
		pushComponentStack(children);
		resumableState.pingedTasks.push(children);
		return resumableState;
	}
	var currentRequest = null;
	function pingTask(request, task) {
		request.pingedTasks.push(task);
		1 === request.pingedTasks.length && (request.flushScheduled = null !== request.destination, performWork(request));
	}
	function createSuspenseBoundary(request, row, fallbackAbortableTasks, contentPreamble, fallbackPreamble) {
		fallbackAbortableTasks = {
			status: 0,
			rootSegmentID: -1,
			parentFlushed: !1,
			pendingTasks: 0,
			row,
			completedSegments: [],
			byteSize: 0,
			fallbackAbortableTasks,
			errorDigest: null,
			contentState: createHoistableState(),
			fallbackState: createHoistableState(),
			contentPreamble,
			fallbackPreamble,
			trackedContentKeyPath: null,
			trackedFallbackNode: null
		};
		null !== row && (row.pendingTasks++, contentPreamble = row.boundaries, null !== contentPreamble && (request.allPendingTasks++, fallbackAbortableTasks.pendingTasks++, contentPreamble.push(fallbackAbortableTasks)), request = row.inheritedHoistables, null !== request && hoistHoistables(fallbackAbortableTasks.contentState, request));
		return fallbackAbortableTasks;
	}
	function createRenderTask(request, thenableState, node, childIndex, blockedBoundary, blockedSegment, blockedPreamble, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
		request.allPendingTasks++;
		null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
		null !== row && row.pendingTasks++;
		var task = {
			replay: null,
			node,
			childIndex,
			ping: function() {
				return pingTask(request, task);
			},
			blockedBoundary,
			blockedSegment,
			blockedPreamble,
			hoistableState,
			abortSet,
			keyPath,
			formatContext,
			context,
			treeContext,
			row,
			componentStack,
			thenableState
		};
		abortSet.add(task);
		return task;
	}
	function createReplayTask(request, thenableState, replay, node, childIndex, blockedBoundary, hoistableState, abortSet, keyPath, formatContext, context, treeContext, row, componentStack) {
		request.allPendingTasks++;
		null === blockedBoundary ? request.pendingRootTasks++ : blockedBoundary.pendingTasks++;
		null !== row && row.pendingTasks++;
		replay.pendingTasks++;
		var task = {
			replay,
			node,
			childIndex,
			ping: function() {
				return pingTask(request, task);
			},
			blockedBoundary,
			blockedSegment: null,
			blockedPreamble: null,
			hoistableState,
			abortSet,
			keyPath,
			formatContext,
			context,
			treeContext,
			row,
			componentStack,
			thenableState
		};
		abortSet.add(task);
		return task;
	}
	function createPendingSegment(request, index, boundary, parentFormatContext, lastPushedText, textEmbedded) {
		return {
			status: 0,
			parentFlushed: !1,
			id: -1,
			index,
			chunks: [],
			children: [],
			preambleChildren: [],
			parentFormatContext,
			boundary,
			lastPushedText,
			textEmbedded
		};
	}
	function pushComponentStack(task) {
		var node = task.node;
		if ("object" === typeof node && null !== node) switch (node.$$typeof) {
			case REACT_ELEMENT_TYPE: task.componentStack = {
				parent: task.componentStack,
				type: node.type
			};
		}
	}
	function replaceSuspenseComponentStackWithSuspenseFallbackStack(componentStack) {
		return null === componentStack ? null : {
			parent: componentStack.parent,
			type: "Suspense Fallback"
		};
	}
	function getThrownInfo(node$jscomp$0) {
		var errorInfo = {};
		node$jscomp$0 && Object.defineProperty(errorInfo, "componentStack", {
			configurable: !0,
			enumerable: !0,
			get: function() {
				try {
					var info = "", node = node$jscomp$0;
					do
						info += describeComponentStackByType(node.type), node = node.parent;
					while (node);
					var JSCompiler_inline_result = info;
				} catch (x) {
					JSCompiler_inline_result = "\nError generating stack: " + x.message + "\n" + x.stack;
				}
				Object.defineProperty(errorInfo, "componentStack", { value: JSCompiler_inline_result });
				return JSCompiler_inline_result;
			}
		});
		return errorInfo;
	}
	function logRecoverableError(request, error, errorInfo) {
		request = request.onError;
		error = request(error, errorInfo);
		if (null == error || "string" === typeof error) return error;
	}
	function fatalError(request, error) {
		var onShellError = request.onShellError, onFatalError = request.onFatalError;
		onShellError(error);
		onFatalError(error);
		null !== request.destination ? (request.status = 14, request.destination.destroy(error)) : (request.status = 13, request.fatalError = error);
	}
	function finishSuspenseListRow(request, row) {
		unblockSuspenseListRow(request, row.next, row.hoistables);
	}
	function unblockSuspenseListRow(request, unblockedRow, inheritedHoistables) {
		for (; null !== unblockedRow;) {
			null !== inheritedHoistables && (hoistHoistables(unblockedRow.hoistables, inheritedHoistables), unblockedRow.inheritedHoistables = inheritedHoistables);
			var unblockedBoundaries = unblockedRow.boundaries;
			if (null !== unblockedBoundaries) {
				unblockedRow.boundaries = null;
				for (var i = 0; i < unblockedBoundaries.length; i++) {
					var unblockedBoundary = unblockedBoundaries[i];
					null !== inheritedHoistables && hoistHoistables(unblockedBoundary.contentState, inheritedHoistables);
					finishedTask(request, unblockedBoundary, null, null);
				}
			}
			unblockedRow.pendingTasks--;
			if (0 < unblockedRow.pendingTasks) break;
			inheritedHoistables = unblockedRow.hoistables;
			unblockedRow = unblockedRow.next;
		}
	}
	function tryToResolveTogetherRow(request, togetherRow) {
		var boundaries = togetherRow.boundaries;
		if (null !== boundaries && togetherRow.pendingTasks === boundaries.length) {
			for (var allCompleteAndInlinable = !0, i = 0; i < boundaries.length; i++) {
				var rowBoundary = boundaries[i];
				if (1 !== rowBoundary.pendingTasks || rowBoundary.parentFlushed || isEligibleForOutlining(request, rowBoundary)) {
					allCompleteAndInlinable = !1;
					break;
				}
			}
			allCompleteAndInlinable && unblockSuspenseListRow(request, togetherRow, togetherRow.hoistables);
		}
	}
	function createSuspenseListRow(previousRow) {
		var newRow = {
			pendingTasks: 1,
			boundaries: null,
			hoistables: createHoistableState(),
			inheritedHoistables: null,
			together: !1,
			next: null
		};
		null !== previousRow && 0 < previousRow.pendingTasks && (newRow.pendingTasks++, newRow.boundaries = [], previousRow.next = newRow);
		return newRow;
	}
	function renderSuspenseListRows(request, task, keyPath, rows, revealOrder) {
		var prevKeyPath = task.keyPath, prevTreeContext = task.treeContext, prevRow = task.row;
		task.keyPath = keyPath;
		keyPath = rows.length;
		var previousSuspenseListRow = null;
		if (null !== task.replay) {
			var resumeSlots = task.replay.slots;
			if (null !== resumeSlots && "object" === typeof resumeSlots) for (var n = 0; n < keyPath; n++) {
				var i = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? n : keyPath - 1 - n, node = rows[i];
				task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow);
				task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
				var resumeSegmentID = resumeSlots[i];
				"number" === typeof resumeSegmentID ? (resumeNode(request, task, resumeSegmentID, node, i), delete resumeSlots[i]) : renderNode(request, task, node, i);
				0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
			}
			else for (resumeSlots = 0; resumeSlots < keyPath; resumeSlots++) n = "backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder ? resumeSlots : keyPath - 1 - resumeSlots, i = rows[n], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(prevTreeContext, keyPath, n), renderNode(request, task, i, n), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
		} else if ("backwards" !== revealOrder && "unstable_legacy-backwards" !== revealOrder) for (revealOrder = 0; revealOrder < keyPath; revealOrder++) resumeSlots = rows[revealOrder], task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow), task.treeContext = pushTreeContext(prevTreeContext, keyPath, revealOrder), renderNode(request, task, resumeSlots, revealOrder), 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
		else {
			revealOrder = task.blockedSegment;
			resumeSlots = revealOrder.children.length;
			n = revealOrder.chunks.length;
			for (i = keyPath - 1; 0 <= i; i--) {
				node = rows[i];
				task.row = previousSuspenseListRow = createSuspenseListRow(previousSuspenseListRow);
				task.treeContext = pushTreeContext(prevTreeContext, keyPath, i);
				resumeSegmentID = createPendingSegment(request, n, null, task.formatContext, 0 === i ? revealOrder.lastPushedText : !0, !0);
				revealOrder.children.splice(resumeSlots, 0, resumeSegmentID);
				task.blockedSegment = resumeSegmentID;
				try {
					renderNode(request, task, node, i), pushSegmentFinale(resumeSegmentID.chunks, request.renderState, resumeSegmentID.lastPushedText, resumeSegmentID.textEmbedded), resumeSegmentID.status = 1, 0 === --previousSuspenseListRow.pendingTasks && finishSuspenseListRow(request, previousSuspenseListRow);
				} catch (thrownValue) {
					throw resumeSegmentID.status = 12 === request.status ? 3 : 4, thrownValue;
				}
			}
			task.blockedSegment = revealOrder;
			revealOrder.lastPushedText = !1;
		}
		null !== prevRow && null !== previousSuspenseListRow && 0 < previousSuspenseListRow.pendingTasks && (prevRow.pendingTasks++, previousSuspenseListRow.next = prevRow);
		task.treeContext = prevTreeContext;
		task.row = prevRow;
		task.keyPath = prevKeyPath;
	}
	function renderWithHooks(request, task, keyPath, Component, props, secondArg) {
		var prevThenableState = task.thenableState;
		task.thenableState = null;
		currentlyRenderingComponent = {};
		currentlyRenderingTask = task;
		currentlyRenderingRequest = request;
		currentlyRenderingKeyPath = keyPath;
		actionStateCounter = localIdCounter = 0;
		actionStateMatchingIndex = -1;
		thenableIndexCounter = 0;
		thenableState = prevThenableState;
		for (request = Component(props, secondArg); didScheduleRenderPhaseUpdate;) didScheduleRenderPhaseUpdate = !1, actionStateCounter = localIdCounter = 0, actionStateMatchingIndex = -1, thenableIndexCounter = 0, numberOfReRenders += 1, workInProgressHook = null, request = Component(props, secondArg);
		resetHooksState();
		return request;
	}
	function finishFunctionComponent(request, task, keyPath, children, hasId, actionStateCount, actionStateMatchingIndex) {
		var didEmitActionStateMarkers = !1;
		if (0 !== actionStateCount && null !== request.formState) {
			var segment = task.blockedSegment;
			if (null !== segment) {
				didEmitActionStateMarkers = !0;
				segment = segment.chunks;
				for (var i = 0; i < actionStateCount; i++) i === actionStateMatchingIndex ? segment.push("<!--F!-->") : segment.push("<!--F-->");
			}
		}
		actionStateCount = task.keyPath;
		task.keyPath = keyPath;
		hasId ? (keyPath = task.treeContext, task.treeContext = pushTreeContext(keyPath, 1, 0), renderNode(request, task, children, -1), task.treeContext = keyPath) : didEmitActionStateMarkers ? renderNode(request, task, children, -1) : renderNodeDestructive(request, task, children, -1);
		task.keyPath = actionStateCount;
	}
	function renderElement(request, task, keyPath, type, props, ref) {
		if ("function" === typeof type) if (type.prototype && type.prototype.isReactComponent) {
			var newProps = props;
			if ("ref" in props) {
				newProps = {};
				for (var propName in props) "ref" !== propName && (newProps[propName] = props[propName]);
			}
			var defaultProps = type.defaultProps;
			if (defaultProps) {
				newProps === props && (newProps = assign({}, newProps, props));
				for (var propName$43 in defaultProps) void 0 === newProps[propName$43] && (newProps[propName$43] = defaultProps[propName$43]);
			}
			props = newProps;
			newProps = emptyContextObject;
			defaultProps = type.contextType;
			"object" === typeof defaultProps && null !== defaultProps && (newProps = defaultProps._currentValue2);
			newProps = new type(props, newProps);
			var initialState = void 0 !== newProps.state ? newProps.state : null;
			newProps.updater = classComponentUpdater;
			newProps.props = props;
			newProps.state = initialState;
			defaultProps = {
				queue: [],
				replace: !1
			};
			newProps._reactInternals = defaultProps;
			ref = type.contextType;
			newProps.context = "object" === typeof ref && null !== ref ? ref._currentValue2 : emptyContextObject;
			ref = type.getDerivedStateFromProps;
			"function" === typeof ref && (ref = ref(props, initialState), initialState = null === ref || void 0 === ref ? initialState : assign({}, initialState, ref), newProps.state = initialState);
			if ("function" !== typeof type.getDerivedStateFromProps && "function" !== typeof newProps.getSnapshotBeforeUpdate && ("function" === typeof newProps.UNSAFE_componentWillMount || "function" === typeof newProps.componentWillMount)) if (type = newProps.state, "function" === typeof newProps.componentWillMount && newProps.componentWillMount(), "function" === typeof newProps.UNSAFE_componentWillMount && newProps.UNSAFE_componentWillMount(), type !== newProps.state && classComponentUpdater.enqueueReplaceState(newProps, newProps.state, null), null !== defaultProps.queue && 0 < defaultProps.queue.length) if (type = defaultProps.queue, ref = defaultProps.replace, defaultProps.queue = null, defaultProps.replace = !1, ref && 1 === type.length) newProps.state = type[0];
			else {
				defaultProps = ref ? type[0] : newProps.state;
				initialState = !0;
				for (ref = ref ? 1 : 0; ref < type.length; ref++) propName$43 = type[ref], propName$43 = "function" === typeof propName$43 ? propName$43.call(newProps, defaultProps, props, void 0) : propName$43, null != propName$43 && (initialState ? (initialState = !1, defaultProps = assign({}, defaultProps, propName$43)) : assign(defaultProps, propName$43));
				newProps.state = defaultProps;
			}
			else defaultProps.queue = null;
			type = newProps.render();
			if (12 === request.status) throw null;
			props = task.keyPath;
			task.keyPath = keyPath;
			renderNodeDestructive(request, task, type, -1);
			task.keyPath = props;
		} else {
			type = renderWithHooks(request, task, keyPath, type, props, void 0);
			if (12 === request.status) throw null;
			finishFunctionComponent(request, task, keyPath, type, 0 !== localIdCounter, actionStateCounter, actionStateMatchingIndex);
		}
		else if ("string" === typeof type) if (newProps = task.blockedSegment, null === newProps) newProps = props.children, defaultProps = task.formatContext, initialState = task.keyPath, task.formatContext = getChildFormatContext(defaultProps, type, props), task.keyPath = keyPath, renderNode(request, task, newProps, -1), task.formatContext = defaultProps, task.keyPath = initialState;
		else {
			initialState = pushStartInstance(newProps.chunks, type, props, request.resumableState, request.renderState, task.blockedPreamble, task.hoistableState, task.formatContext, newProps.lastPushedText);
			newProps.lastPushedText = !1;
			defaultProps = task.formatContext;
			ref = task.keyPath;
			task.keyPath = keyPath;
			if (3 === (task.formatContext = getChildFormatContext(defaultProps, type, props)).insertionMode) {
				keyPath = createPendingSegment(request, 0, null, task.formatContext, !1, !1);
				newProps.preambleChildren.push(keyPath);
				task.blockedSegment = keyPath;
				try {
					keyPath.status = 6, renderNode(request, task, initialState, -1), pushSegmentFinale(keyPath.chunks, request.renderState, keyPath.lastPushedText, keyPath.textEmbedded), keyPath.status = 1;
				} finally {
					task.blockedSegment = newProps;
				}
			} else renderNode(request, task, initialState, -1);
			task.formatContext = defaultProps;
			task.keyPath = ref;
			a: {
				task = newProps.chunks;
				request = request.resumableState;
				switch (type) {
					case "title":
					case "style":
					case "script":
					case "area":
					case "base":
					case "br":
					case "col":
					case "embed":
					case "hr":
					case "img":
					case "input":
					case "keygen":
					case "link":
					case "meta":
					case "param":
					case "source":
					case "track":
					case "wbr": break a;
					case "body":
						if (1 >= defaultProps.insertionMode) {
							request.hasBody = !0;
							break a;
						}
						break;
					case "html":
						if (0 === defaultProps.insertionMode) {
							request.hasHtml = !0;
							break a;
						}
						break;
					case "head": if (1 >= defaultProps.insertionMode) break a;
				}
				task.push(endChunkForTag(type));
			}
			newProps.lastPushedText = !1;
		}
		else {
			switch (type) {
				case REACT_LEGACY_HIDDEN_TYPE:
				case REACT_STRICT_MODE_TYPE:
				case REACT_PROFILER_TYPE:
				case REACT_FRAGMENT_TYPE:
					type = task.keyPath;
					task.keyPath = keyPath;
					renderNodeDestructive(request, task, props.children, -1);
					task.keyPath = type;
					return;
				case REACT_ACTIVITY_TYPE:
					type = task.blockedSegment;
					null === type ? "hidden" !== props.mode && (type = task.keyPath, task.keyPath = keyPath, renderNode(request, task, props.children, -1), task.keyPath = type) : "hidden" !== props.mode && (request.renderState.generateStaticMarkup || type.chunks.push("<!--&-->"), type.lastPushedText = !1, newProps = task.keyPath, task.keyPath = keyPath, renderNode(request, task, props.children, -1), task.keyPath = newProps, request.renderState.generateStaticMarkup || type.chunks.push("<!--/&-->"), type.lastPushedText = !1);
					return;
				case REACT_SUSPENSE_LIST_TYPE:
					a: {
						type = props.children;
						props = props.revealOrder;
						if ("forwards" === props || "backwards" === props || "unstable_legacy-backwards" === props) {
							if (isArrayImpl(type)) {
								renderSuspenseListRows(request, task, keyPath, type, props);
								break a;
							}
							if (newProps = getIteratorFn(type)) {
								if (newProps = newProps.call(type)) {
									defaultProps = newProps.next();
									if (!defaultProps.done) {
										do
											defaultProps = newProps.next();
										while (!defaultProps.done);
										renderSuspenseListRows(request, task, keyPath, type, props);
									}
									break a;
								}
							}
						}
						"together" === props ? (props = task.keyPath, newProps = task.row, defaultProps = task.row = createSuspenseListRow(null), defaultProps.boundaries = [], defaultProps.together = !0, task.keyPath = keyPath, renderNodeDestructive(request, task, type, -1), 0 === --defaultProps.pendingTasks && finishSuspenseListRow(request, defaultProps), task.keyPath = props, task.row = newProps, null !== newProps && 0 < defaultProps.pendingTasks && (newProps.pendingTasks++, defaultProps.next = newProps)) : (props = task.keyPath, task.keyPath = keyPath, renderNodeDestructive(request, task, type, -1), task.keyPath = props);
					}
					return;
				case REACT_VIEW_TRANSITION_TYPE:
				case REACT_SCOPE_TYPE: throw Error(formatProdErrorMessage(343));
				case REACT_SUSPENSE_TYPE:
					a: if (null !== task.replay) {
						type = task.keyPath;
						newProps = task.formatContext;
						defaultProps = task.row;
						task.keyPath = keyPath;
						task.formatContext = getSuspenseContentFormatContext(request.resumableState, newProps);
						task.row = null;
						keyPath = props.children;
						try {
							renderNode(request, task, keyPath, -1);
						} finally {
							task.keyPath = type, task.formatContext = newProps, task.row = defaultProps;
						}
					} else {
						type = task.keyPath;
						ref = task.formatContext;
						var prevRow = task.row, parentBoundary = task.blockedBoundary;
						propName$43 = task.blockedPreamble;
						var parentHoistableState = task.hoistableState;
						propName = task.blockedSegment;
						var fallback = props.fallback;
						props = props.children;
						var fallbackAbortSet = /* @__PURE__ */ new Set();
						var newBoundary = createSuspenseBoundary(request, task.row, fallbackAbortSet, null, null);
						null !== request.trackedPostpones && (newBoundary.trackedContentKeyPath = keyPath);
						var boundarySegment = createPendingSegment(request, propName.chunks.length, newBoundary, task.formatContext, !1, !1);
						propName.children.push(boundarySegment);
						propName.lastPushedText = !1;
						var contentRootSegment = createPendingSegment(request, 0, null, task.formatContext, !1, !1);
						contentRootSegment.parentFlushed = !0;
						if (null !== request.trackedPostpones) {
							newProps = task.componentStack;
							defaultProps = [
								keyPath[0],
								"Suspense Fallback",
								keyPath[2]
							];
							initialState = [
								defaultProps[1],
								defaultProps[2],
								[],
								null
							];
							request.trackedPostpones.workingMap.set(defaultProps, initialState);
							newBoundary.trackedFallbackNode = initialState;
							task.blockedSegment = boundarySegment;
							task.blockedPreamble = newBoundary.fallbackPreamble;
							task.keyPath = defaultProps;
							task.formatContext = getSuspenseFallbackFormatContext(request.resumableState, ref);
							task.componentStack = replaceSuspenseComponentStackWithSuspenseFallbackStack(newProps);
							boundarySegment.status = 6;
							try {
								renderNode(request, task, fallback, -1), pushSegmentFinale(boundarySegment.chunks, request.renderState, boundarySegment.lastPushedText, boundarySegment.textEmbedded), boundarySegment.status = 1;
							} catch (thrownValue) {
								throw boundarySegment.status = 12 === request.status ? 3 : 4, thrownValue;
							} finally {
								task.blockedSegment = propName, task.blockedPreamble = propName$43, task.keyPath = type, task.formatContext = ref;
							}
							task = createRenderTask(request, null, props, -1, newBoundary, contentRootSegment, newBoundary.contentPreamble, newBoundary.contentState, task.abortSet, keyPath, getSuspenseContentFormatContext(request.resumableState, task.formatContext), task.context, task.treeContext, null, newProps);
							pushComponentStack(task);
							request.pingedTasks.push(task);
						} else {
							task.blockedBoundary = newBoundary;
							task.blockedPreamble = newBoundary.contentPreamble;
							task.hoistableState = newBoundary.contentState;
							task.blockedSegment = contentRootSegment;
							task.keyPath = keyPath;
							task.formatContext = getSuspenseContentFormatContext(request.resumableState, ref);
							task.row = null;
							contentRootSegment.status = 6;
							try {
								if (renderNode(request, task, props, -1), pushSegmentFinale(contentRootSegment.chunks, request.renderState, contentRootSegment.lastPushedText, contentRootSegment.textEmbedded), contentRootSegment.status = 1, queueCompletedSegment(newBoundary, contentRootSegment), 0 === newBoundary.pendingTasks && 0 === newBoundary.status) {
									if (newBoundary.status = 1, !isEligibleForOutlining(request, newBoundary)) {
										null !== prevRow && 0 === --prevRow.pendingTasks && finishSuspenseListRow(request, prevRow);
										0 === request.pendingRootTasks && task.blockedPreamble && preparePreamble(request);
										break a;
									}
								} else null !== prevRow && prevRow.together && tryToResolveTogetherRow(request, prevRow);
							} catch (thrownValue$30) {
								newBoundary.status = 4, 12 === request.status ? (contentRootSegment.status = 3, newProps = request.fatalError) : (contentRootSegment.status = 4, newProps = thrownValue$30), defaultProps = getThrownInfo(task.componentStack), initialState = logRecoverableError(request, newProps, defaultProps), newBoundary.errorDigest = initialState, untrackBoundary(request, newBoundary);
							} finally {
								task.blockedBoundary = parentBoundary, task.blockedPreamble = propName$43, task.hoistableState = parentHoistableState, task.blockedSegment = propName, task.keyPath = type, task.formatContext = ref, task.row = prevRow;
							}
							task = createRenderTask(request, null, fallback, -1, parentBoundary, boundarySegment, newBoundary.fallbackPreamble, newBoundary.fallbackState, fallbackAbortSet, [
								keyPath[0],
								"Suspense Fallback",
								keyPath[2]
							], getSuspenseFallbackFormatContext(request.resumableState, task.formatContext), task.context, task.treeContext, task.row, replaceSuspenseComponentStackWithSuspenseFallbackStack(task.componentStack));
							pushComponentStack(task);
							request.pingedTasks.push(task);
						}
					}
					return;
			}
			if ("object" === typeof type && null !== type) switch (type.$$typeof) {
				case REACT_FORWARD_REF_TYPE:
					if ("ref" in props) for (fallback in newProps = {}, props) "ref" !== fallback && (newProps[fallback] = props[fallback]);
					else newProps = props;
					type = renderWithHooks(request, task, keyPath, type.render, newProps, ref);
					finishFunctionComponent(request, task, keyPath, type, 0 !== localIdCounter, actionStateCounter, actionStateMatchingIndex);
					return;
				case REACT_MEMO_TYPE:
					renderElement(request, task, keyPath, type.type, props, ref);
					return;
				case REACT_CONTEXT_TYPE:
					defaultProps = props.children;
					newProps = task.keyPath;
					props = props.value;
					initialState = type._currentValue2;
					type._currentValue2 = props;
					ref = currentActiveSnapshot;
					currentActiveSnapshot = type = {
						parent: ref,
						depth: null === ref ? 0 : ref.depth + 1,
						context: type,
						parentValue: initialState,
						value: props
					};
					task.context = type;
					task.keyPath = keyPath;
					renderNodeDestructive(request, task, defaultProps, -1);
					request = currentActiveSnapshot;
					if (null === request) throw Error(formatProdErrorMessage(403));
					request.context._currentValue2 = request.parentValue;
					request = currentActiveSnapshot = request.parent;
					task.context = request;
					task.keyPath = newProps;
					return;
				case REACT_CONSUMER_TYPE:
					props = props.children;
					type = props(type._context._currentValue2);
					props = task.keyPath;
					task.keyPath = keyPath;
					renderNodeDestructive(request, task, type, -1);
					task.keyPath = props;
					return;
				case REACT_LAZY_TYPE:
					newProps = type._init;
					type = newProps(type._payload);
					if (12 === request.status) throw null;
					renderElement(request, task, keyPath, type, props, ref);
					return;
			}
			throw Error(formatProdErrorMessage(130, null == type ? type : typeof type, ""));
		}
	}
	function resumeNode(request, task, segmentId, node, childIndex) {
		var prevReplay = task.replay, blockedBoundary = task.blockedBoundary, resumedSegment = createPendingSegment(request, 0, null, task.formatContext, !1, !1);
		resumedSegment.id = segmentId;
		resumedSegment.parentFlushed = !0;
		try {
			task.replay = null, task.blockedSegment = resumedSegment, renderNode(request, task, node, childIndex), resumedSegment.status = 1, null === blockedBoundary ? request.completedRootSegment = resumedSegment : (queueCompletedSegment(blockedBoundary, resumedSegment), blockedBoundary.parentFlushed && request.partialBoundaries.push(blockedBoundary));
		} finally {
			task.replay = prevReplay, task.blockedSegment = null;
		}
	}
	function renderNodeDestructive(request, task, node, childIndex) {
		null !== task.replay && "number" === typeof task.replay.slots ? resumeNode(request, task, task.replay.slots, node, childIndex) : (task.node = node, task.childIndex = childIndex, node = task.componentStack, pushComponentStack(task), retryNode(request, task), task.componentStack = node);
	}
	function retryNode(request, task) {
		var node = task.node, childIndex = task.childIndex;
		if (null !== node) {
			if ("object" === typeof node) {
				switch (node.$$typeof) {
					case REACT_ELEMENT_TYPE:
						var type = node.type, key = node.key, props = node.props;
						node = props.ref;
						var ref = void 0 !== node ? node : null, name = getComponentNameFromType(type), keyOrIndex = null == key ? -1 === childIndex ? 0 : childIndex : key;
						key = [
							task.keyPath,
							name,
							keyOrIndex
						];
						if (null !== task.replay) a: {
							var replay = task.replay;
							childIndex = replay.nodes;
							for (node = 0; node < childIndex.length; node++) {
								var node$jscomp$0 = childIndex[node];
								if (keyOrIndex === node$jscomp$0[1]) {
									if (4 === node$jscomp$0.length) {
										if (null !== name && name !== node$jscomp$0[0]) throw Error(formatProdErrorMessage(490, node$jscomp$0[0], name));
										var childNodes = node$jscomp$0[2];
										name = node$jscomp$0[3];
										keyOrIndex = task.node;
										task.replay = {
											nodes: childNodes,
											slots: name,
											pendingTasks: 1
										};
										try {
											renderElement(request, task, key, type, props, ref);
											if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length) throw Error(formatProdErrorMessage(488));
											task.replay.pendingTasks--;
										} catch (x) {
											if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then)) throw task.node === keyOrIndex ? task.replay = replay : childIndex.splice(node, 1), x;
											task.replay.pendingTasks--;
											props = getThrownInfo(task.componentStack);
											key = request;
											request = task.blockedBoundary;
											type = x;
											props = logRecoverableError(key, type, props);
											abortRemainingReplayNodes(key, request, childNodes, name, type, props);
										}
										task.replay = replay;
									} else {
										if (type !== REACT_SUSPENSE_TYPE) throw Error(formatProdErrorMessage(490, "Suspense", getComponentNameFromType(type) || "Unknown"));
										b: {
											replay = void 0;
											type = node$jscomp$0[5];
											ref = node$jscomp$0[2];
											name = node$jscomp$0[3];
											keyOrIndex = null === node$jscomp$0[4] ? [] : node$jscomp$0[4][2];
											node$jscomp$0 = null === node$jscomp$0[4] ? null : node$jscomp$0[4][3];
											var prevKeyPath = task.keyPath, prevContext = task.formatContext, prevRow = task.row, previousReplaySet = task.replay, parentBoundary = task.blockedBoundary, parentHoistableState = task.hoistableState, content = props.children, fallback = props.fallback, fallbackAbortSet = /* @__PURE__ */ new Set();
											props = createSuspenseBoundary(request, task.row, fallbackAbortSet, null, null);
											props.parentFlushed = !0;
											props.rootSegmentID = type;
											task.blockedBoundary = props;
											task.hoistableState = props.contentState;
											task.keyPath = key;
											task.formatContext = getSuspenseContentFormatContext(request.resumableState, prevContext);
											task.row = null;
											task.replay = {
												nodes: ref,
												slots: name,
												pendingTasks: 1
											};
											try {
												renderNode(request, task, content, -1);
												if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length) throw Error(formatProdErrorMessage(488));
												task.replay.pendingTasks--;
												if (0 === props.pendingTasks && 0 === props.status) {
													props.status = 1;
													request.completedBoundaries.push(props);
													break b;
												}
											} catch (error) {
												props.status = 4, childNodes = getThrownInfo(task.componentStack), replay = logRecoverableError(request, error, childNodes), props.errorDigest = replay, task.replay.pendingTasks--, request.clientRenderedBoundaries.push(props);
											} finally {
												task.blockedBoundary = parentBoundary, task.hoistableState = parentHoistableState, task.replay = previousReplaySet, task.keyPath = prevKeyPath, task.formatContext = prevContext, task.row = prevRow;
											}
											childNodes = createReplayTask(request, null, {
												nodes: keyOrIndex,
												slots: node$jscomp$0,
												pendingTasks: 0
											}, fallback, -1, parentBoundary, props.fallbackState, fallbackAbortSet, [
												key[0],
												"Suspense Fallback",
												key[2]
											], getSuspenseFallbackFormatContext(request.resumableState, task.formatContext), task.context, task.treeContext, task.row, replaceSuspenseComponentStackWithSuspenseFallbackStack(task.componentStack));
											pushComponentStack(childNodes);
											request.pingedTasks.push(childNodes);
										}
									}
									childIndex.splice(node, 1);
									break a;
								}
							}
						}
						else renderElement(request, task, key, type, props, ref);
						return;
					case REACT_PORTAL_TYPE: throw Error(formatProdErrorMessage(257));
					case REACT_LAZY_TYPE:
						childNodes = node._init;
						node = childNodes(node._payload);
						if (12 === request.status) throw null;
						renderNodeDestructive(request, task, node, childIndex);
						return;
				}
				if (isArrayImpl(node)) {
					renderChildrenArray(request, task, node, childIndex);
					return;
				}
				if (childNodes = getIteratorFn(node)) {
					if (childNodes = childNodes.call(node)) {
						node = childNodes.next();
						if (!node.done) {
							props = [];
							do
								props.push(node.value), node = childNodes.next();
							while (!node.done);
							renderChildrenArray(request, task, props, childIndex);
						}
						return;
					}
				}
				if ("function" === typeof node.then) return task.thenableState = null, renderNodeDestructive(request, task, unwrapThenable(node), childIndex);
				if (node.$$typeof === REACT_CONTEXT_TYPE) return renderNodeDestructive(request, task, node._currentValue2, childIndex);
				childIndex = Object.prototype.toString.call(node);
				throw Error(formatProdErrorMessage(31, "[object Object]" === childIndex ? "object with keys {" + Object.keys(node).join(", ") + "}" : childIndex));
			}
			if ("string" === typeof node) childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(childIndex.chunks, node, request.renderState, childIndex.lastPushedText));
			else if ("number" === typeof node || "bigint" === typeof node) childIndex = task.blockedSegment, null !== childIndex && (childIndex.lastPushedText = pushTextInstance(childIndex.chunks, "" + node, request.renderState, childIndex.lastPushedText));
		}
	}
	function renderChildrenArray(request, task, children, childIndex) {
		var prevKeyPath = task.keyPath;
		if (-1 !== childIndex && (task.keyPath = [
			task.keyPath,
			"Fragment",
			childIndex
		], null !== task.replay)) {
			for (var replay = task.replay, replayNodes = replay.nodes, j = 0; j < replayNodes.length; j++) {
				var node = replayNodes[j];
				if (node[1] === childIndex) {
					childIndex = node[2];
					node = node[3];
					task.replay = {
						nodes: childIndex,
						slots: node,
						pendingTasks: 1
					};
					try {
						renderChildrenArray(request, task, children, -1);
						if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length) throw Error(formatProdErrorMessage(488));
						task.replay.pendingTasks--;
					} catch (x) {
						if ("object" === typeof x && null !== x && (x === SuspenseException || "function" === typeof x.then)) throw x;
						task.replay.pendingTasks--;
						children = getThrownInfo(task.componentStack);
						var boundary = task.blockedBoundary, error = x;
						children = logRecoverableError(request, error, children);
						abortRemainingReplayNodes(request, boundary, childIndex, node, error, children);
					}
					task.replay = replay;
					replayNodes.splice(j, 1);
					break;
				}
			}
			task.keyPath = prevKeyPath;
			return;
		}
		replay = task.treeContext;
		replayNodes = children.length;
		if (null !== task.replay && (j = task.replay.slots, null !== j && "object" === typeof j)) {
			for (childIndex = 0; childIndex < replayNodes; childIndex++) node = children[childIndex], task.treeContext = pushTreeContext(replay, replayNodes, childIndex), boundary = j[childIndex], "number" === typeof boundary ? (resumeNode(request, task, boundary, node, childIndex), delete j[childIndex]) : renderNode(request, task, node, childIndex);
			task.treeContext = replay;
			task.keyPath = prevKeyPath;
			return;
		}
		for (j = 0; j < replayNodes; j++) childIndex = children[j], task.treeContext = pushTreeContext(replay, replayNodes, j), renderNode(request, task, childIndex, j);
		task.treeContext = replay;
		task.keyPath = prevKeyPath;
	}
	function trackPostponedBoundary(request, trackedPostpones, boundary) {
		boundary.status = 5;
		boundary.rootSegmentID = request.nextSegmentId++;
		request = boundary.trackedContentKeyPath;
		if (null === request) throw Error(formatProdErrorMessage(486));
		var fallbackReplayNode = boundary.trackedFallbackNode, children = [], boundaryNode = trackedPostpones.workingMap.get(request);
		if (void 0 === boundaryNode) return boundary = [
			request[1],
			request[2],
			children,
			null,
			fallbackReplayNode,
			boundary.rootSegmentID
		], trackedPostpones.workingMap.set(request, boundary), addToReplayParent(boundary, request[0], trackedPostpones), boundary;
		boundaryNode[4] = fallbackReplayNode;
		boundaryNode[5] = boundary.rootSegmentID;
		return boundaryNode;
	}
	function trackPostpone(request, trackedPostpones, task, segment) {
		segment.status = 5;
		var keyPath = task.keyPath, boundary = task.blockedBoundary;
		if (null === boundary) segment.id = request.nextSegmentId++, trackedPostpones.rootSlots = segment.id, null !== request.completedRootSegment && (request.completedRootSegment.status = 5);
		else {
			if (null !== boundary && 0 === boundary.status) {
				var boundaryNode = trackPostponedBoundary(request, trackedPostpones, boundary);
				if (boundary.trackedContentKeyPath === keyPath && -1 === task.childIndex) {
					-1 === segment.id && (segment.id = segment.parentFlushed ? boundary.rootSegmentID : request.nextSegmentId++);
					boundaryNode[3] = segment.id;
					return;
				}
			}
			-1 === segment.id && (segment.id = segment.parentFlushed && null !== boundary ? boundary.rootSegmentID : request.nextSegmentId++);
			if (-1 === task.childIndex) null === keyPath ? trackedPostpones.rootSlots = segment.id : (task = trackedPostpones.workingMap.get(keyPath), void 0 === task ? (task = [
				keyPath[1],
				keyPath[2],
				[],
				segment.id
			], addToReplayParent(task, keyPath[0], trackedPostpones)) : task[3] = segment.id);
			else {
				if (null === keyPath) {
					if (request = trackedPostpones.rootSlots, null === request) request = trackedPostpones.rootSlots = {};
					else if ("number" === typeof request) throw Error(formatProdErrorMessage(491));
				} else if (boundary = trackedPostpones.workingMap, boundaryNode = boundary.get(keyPath), void 0 === boundaryNode) request = {}, boundaryNode = [
					keyPath[1],
					keyPath[2],
					[],
					request
				], boundary.set(keyPath, boundaryNode), addToReplayParent(boundaryNode, keyPath[0], trackedPostpones);
				else if (request = boundaryNode[3], null === request) request = boundaryNode[3] = {};
				else if ("number" === typeof request) throw Error(formatProdErrorMessage(491));
				request[task.childIndex] = segment.id;
			}
		}
	}
	function untrackBoundary(request, boundary) {
		request = request.trackedPostpones;
		null !== request && (boundary = boundary.trackedContentKeyPath, null !== boundary && (boundary = request.workingMap.get(boundary), void 0 !== boundary && (boundary.length = 4, boundary[2] = [], boundary[3] = null)));
	}
	function spawnNewSuspendedReplayTask(request, task, thenableState) {
		return createReplayTask(request, thenableState, task.replay, task.node, task.childIndex, task.blockedBoundary, task.hoistableState, task.abortSet, task.keyPath, task.formatContext, task.context, task.treeContext, task.row, task.componentStack);
	}
	function spawnNewSuspendedRenderTask(request, task, thenableState) {
		var segment = task.blockedSegment, newSegment = createPendingSegment(request, segment.chunks.length, null, task.formatContext, segment.lastPushedText, !0);
		segment.children.push(newSegment);
		segment.lastPushedText = !1;
		return createRenderTask(request, thenableState, task.node, task.childIndex, task.blockedBoundary, newSegment, task.blockedPreamble, task.hoistableState, task.abortSet, task.keyPath, task.formatContext, task.context, task.treeContext, task.row, task.componentStack);
	}
	function renderNode(request, task, node, childIndex) {
		var previousFormatContext = task.formatContext, previousContext = task.context, previousKeyPath = task.keyPath, previousTreeContext = task.treeContext, previousComponentStack = task.componentStack, segment = task.blockedSegment;
		if (null === segment) {
			segment = task.replay;
			try {
				return renderNodeDestructive(request, task, node, childIndex);
			} catch (thrownValue) {
				if (resetHooksState(), node = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue, 12 !== request.status && "object" === typeof node && null !== node) {
					if ("function" === typeof node.then) {
						childIndex = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
						request = spawnNewSuspendedReplayTask(request, task, childIndex).ping;
						node.then(request, request);
						task.formatContext = previousFormatContext;
						task.context = previousContext;
						task.keyPath = previousKeyPath;
						task.treeContext = previousTreeContext;
						task.componentStack = previousComponentStack;
						task.replay = segment;
						switchContext(previousContext);
						return;
					}
					if ("Maximum call stack size exceeded" === node.message) {
						node = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
						node = spawnNewSuspendedReplayTask(request, task, node);
						request.pingedTasks.push(node);
						task.formatContext = previousFormatContext;
						task.context = previousContext;
						task.keyPath = previousKeyPath;
						task.treeContext = previousTreeContext;
						task.componentStack = previousComponentStack;
						task.replay = segment;
						switchContext(previousContext);
						return;
					}
				}
			}
		} else {
			var childrenLength = segment.children.length, chunkLength = segment.chunks.length;
			try {
				return renderNodeDestructive(request, task, node, childIndex);
			} catch (thrownValue$62) {
				if (resetHooksState(), segment.children.length = childrenLength, segment.chunks.length = chunkLength, node = thrownValue$62 === SuspenseException ? getSuspendedThenable() : thrownValue$62, 12 !== request.status && "object" === typeof node && null !== node) {
					if ("function" === typeof node.then) {
						segment = node;
						node = thrownValue$62 === SuspenseException ? getThenableStateAfterSuspending() : null;
						request = spawnNewSuspendedRenderTask(request, task, node).ping;
						segment.then(request, request);
						task.formatContext = previousFormatContext;
						task.context = previousContext;
						task.keyPath = previousKeyPath;
						task.treeContext = previousTreeContext;
						task.componentStack = previousComponentStack;
						switchContext(previousContext);
						return;
					}
					if ("Maximum call stack size exceeded" === node.message) {
						segment = thrownValue$62 === SuspenseException ? getThenableStateAfterSuspending() : null;
						segment = spawnNewSuspendedRenderTask(request, task, segment);
						request.pingedTasks.push(segment);
						task.formatContext = previousFormatContext;
						task.context = previousContext;
						task.keyPath = previousKeyPath;
						task.treeContext = previousTreeContext;
						task.componentStack = previousComponentStack;
						switchContext(previousContext);
						return;
					}
				}
			}
		}
		task.formatContext = previousFormatContext;
		task.context = previousContext;
		task.keyPath = previousKeyPath;
		task.treeContext = previousTreeContext;
		switchContext(previousContext);
		throw node;
	}
	function abortTaskSoft(task) {
		var boundary = task.blockedBoundary, segment = task.blockedSegment;
		null !== segment && (segment.status = 3, finishedTask(this, boundary, task.row, segment));
	}
	function abortRemainingReplayNodes(request$jscomp$0, boundary, nodes, slots, error, errorDigest$jscomp$0) {
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (4 === node.length) abortRemainingReplayNodes(request$jscomp$0, boundary, node[2], node[3], error, errorDigest$jscomp$0);
			else {
				node = node[5];
				var request = request$jscomp$0, errorDigest = errorDigest$jscomp$0, resumedBoundary = createSuspenseBoundary(request, null, /* @__PURE__ */ new Set(), null, null);
				resumedBoundary.parentFlushed = !0;
				resumedBoundary.rootSegmentID = node;
				resumedBoundary.status = 4;
				resumedBoundary.errorDigest = errorDigest;
				resumedBoundary.parentFlushed && request.clientRenderedBoundaries.push(resumedBoundary);
			}
		}
		nodes.length = 0;
		if (null !== slots) {
			if (null === boundary) throw Error(formatProdErrorMessage(487));
			4 !== boundary.status && (boundary.status = 4, boundary.errorDigest = errorDigest$jscomp$0, boundary.parentFlushed && request$jscomp$0.clientRenderedBoundaries.push(boundary));
			if ("object" === typeof slots) for (var index in slots) delete slots[index];
		}
	}
	function abortTask(task, request, error) {
		var boundary = task.blockedBoundary, segment = task.blockedSegment;
		if (null !== segment) {
			if (6 === segment.status) return;
			segment.status = 3;
		}
		var errorInfo = getThrownInfo(task.componentStack);
		if (null === boundary) {
			if (13 !== request.status && 14 !== request.status) {
				boundary = task.replay;
				if (null === boundary) {
					null !== request.trackedPostpones && null !== segment ? (boundary = request.trackedPostpones, logRecoverableError(request, error, errorInfo), trackPostpone(request, boundary, task, segment), finishedTask(request, null, task.row, segment)) : (logRecoverableError(request, error, errorInfo), fatalError(request, error));
					return;
				}
				boundary.pendingTasks--;
				0 === boundary.pendingTasks && 0 < boundary.nodes.length && (segment = logRecoverableError(request, error, errorInfo), abortRemainingReplayNodes(request, null, boundary.nodes, boundary.slots, error, segment));
				request.pendingRootTasks--;
				0 === request.pendingRootTasks && completeShell(request);
			}
		} else {
			var trackedPostpones$63 = request.trackedPostpones;
			if (4 !== boundary.status) {
				if (null !== trackedPostpones$63 && null !== segment) return logRecoverableError(request, error, errorInfo), trackPostpone(request, trackedPostpones$63, task, segment), boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
					return abortTask(fallbackTask, request, error);
				}), boundary.fallbackAbortableTasks.clear(), finishedTask(request, boundary, task.row, segment);
				boundary.status = 4;
				segment = logRecoverableError(request, error, errorInfo);
				boundary.status = 4;
				boundary.errorDigest = segment;
				untrackBoundary(request, boundary);
				boundary.parentFlushed && request.clientRenderedBoundaries.push(boundary);
			}
			boundary.pendingTasks--;
			segment = boundary.row;
			null !== segment && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
			boundary.fallbackAbortableTasks.forEach(function(fallbackTask) {
				return abortTask(fallbackTask, request, error);
			});
			boundary.fallbackAbortableTasks.clear();
		}
		task = task.row;
		null !== task && 0 === --task.pendingTasks && finishSuspenseListRow(request, task);
		request.allPendingTasks--;
		0 === request.allPendingTasks && completeAll(request);
	}
	function safelyEmitEarlyPreloads(request, shellComplete) {
		try {
			var renderState = request.renderState, onHeaders = renderState.onHeaders;
			if (onHeaders) {
				var headers = renderState.headers;
				if (headers) {
					renderState.headers = null;
					var linkHeader = headers.preconnects;
					headers.fontPreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.fontPreloads);
					headers.highImagePreloads && (linkHeader && (linkHeader += ", "), linkHeader += headers.highImagePreloads);
					if (!shellComplete) {
						var queueIter = renderState.styles.values(), queueStep = queueIter.next();
						b: for (; 0 < headers.remainingCapacity && !queueStep.done; queueStep = queueIter.next()) for (var sheetIter = queueStep.value.sheets.values(), sheetStep = sheetIter.next(); 0 < headers.remainingCapacity && !sheetStep.done; sheetStep = sheetIter.next()) {
							var sheet = sheetStep.value, props = sheet.props, key = props.href, props$jscomp$0 = sheet.props, header = getPreloadAsHeader(props$jscomp$0.href, "style", {
								crossOrigin: props$jscomp$0.crossOrigin,
								integrity: props$jscomp$0.integrity,
								nonce: props$jscomp$0.nonce,
								type: props$jscomp$0.type,
								fetchPriority: props$jscomp$0.fetchPriority,
								referrerPolicy: props$jscomp$0.referrerPolicy,
								media: props$jscomp$0.media
							});
							if (0 <= (headers.remainingCapacity -= header.length + 2)) renderState.resets.style[key] = PRELOAD_NO_CREDS, linkHeader && (linkHeader += ", "), linkHeader += header, renderState.resets.style[key] = "string" === typeof props.crossOrigin || "string" === typeof props.integrity ? [props.crossOrigin, props.integrity] : PRELOAD_NO_CREDS;
							else break b;
						}
					}
					linkHeader ? onHeaders({ Link: linkHeader }) : onHeaders({});
				}
			}
		} catch (error) {
			logRecoverableError(request, error, {});
		}
	}
	function completeShell(request) {
		null === request.trackedPostpones && safelyEmitEarlyPreloads(request, !0);
		null === request.trackedPostpones && preparePreamble(request);
		request.onShellError = noop;
		request = request.onShellReady;
		request();
	}
	function completeAll(request) {
		safelyEmitEarlyPreloads(request, null === request.trackedPostpones ? !0 : null === request.completedRootSegment || 5 !== request.completedRootSegment.status);
		preparePreamble(request);
		request = request.onAllReady;
		request();
	}
	function queueCompletedSegment(boundary, segment) {
		if (0 === segment.chunks.length && 1 === segment.children.length && null === segment.children[0].boundary && -1 === segment.children[0].id) {
			var childSegment = segment.children[0];
			childSegment.id = segment.id;
			childSegment.parentFlushed = !0;
			1 !== childSegment.status && 3 !== childSegment.status && 4 !== childSegment.status || queueCompletedSegment(boundary, childSegment);
		} else boundary.completedSegments.push(segment);
	}
	function finishedTask(request, boundary, row, segment) {
		null !== row && (0 === --row.pendingTasks ? finishSuspenseListRow(request, row) : row.together && tryToResolveTogetherRow(request, row));
		request.allPendingTasks--;
		if (null === boundary) {
			if (null !== segment && segment.parentFlushed) {
				if (null !== request.completedRootSegment) throw Error(formatProdErrorMessage(389));
				request.completedRootSegment = segment;
			}
			request.pendingRootTasks--;
			0 === request.pendingRootTasks && completeShell(request);
		} else if (boundary.pendingTasks--, 4 !== boundary.status) if (0 === boundary.pendingTasks) {
			if (0 === boundary.status && (boundary.status = 1), null !== segment && segment.parentFlushed && (1 === segment.status || 3 === segment.status) && queueCompletedSegment(boundary, segment), boundary.parentFlushed && request.completedBoundaries.push(boundary), 1 === boundary.status) row = boundary.row, null !== row && hoistHoistables(row.hoistables, boundary.contentState), isEligibleForOutlining(request, boundary) || (boundary.fallbackAbortableTasks.forEach(abortTaskSoft, request), boundary.fallbackAbortableTasks.clear(), null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row)), 0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary.contentPreamble && preparePreamble(request);
			else if (5 === boundary.status && (boundary = boundary.row, null !== boundary)) {
				if (null !== request.trackedPostpones) {
					row = request.trackedPostpones;
					var postponedRow = boundary.next;
					if (null !== postponedRow && (segment = postponedRow.boundaries, null !== segment)) for (postponedRow.boundaries = null, postponedRow = 0; postponedRow < segment.length; postponedRow++) {
						var postponedBoundary = segment[postponedRow];
						trackPostponedBoundary(request, row, postponedBoundary);
						finishedTask(request, postponedBoundary, null, null);
					}
				}
				0 === --boundary.pendingTasks && finishSuspenseListRow(request, boundary);
			}
		} else null === segment || !segment.parentFlushed || 1 !== segment.status && 3 !== segment.status || (queueCompletedSegment(boundary, segment), 1 === boundary.completedSegments.length && boundary.parentFlushed && request.partialBoundaries.push(boundary)), boundary = boundary.row, null !== boundary && boundary.together && tryToResolveTogetherRow(request, boundary);
		0 === request.allPendingTasks && completeAll(request);
	}
	function performWork(request$jscomp$2) {
		if (14 !== request$jscomp$2.status && 13 !== request$jscomp$2.status) {
			var prevContext = currentActiveSnapshot, prevDispatcher = ReactSharedInternals.H;
			ReactSharedInternals.H = HooksDispatcher;
			var prevAsyncDispatcher = ReactSharedInternals.A;
			ReactSharedInternals.A = DefaultAsyncDispatcher;
			var prevRequest = currentRequest;
			currentRequest = request$jscomp$2;
			var prevResumableState = currentResumableState;
			currentResumableState = request$jscomp$2.resumableState;
			try {
				var pingedTasks = request$jscomp$2.pingedTasks, i;
				for (i = 0; i < pingedTasks.length; i++) {
					var task = pingedTasks[i], request = request$jscomp$2, segment = task.blockedSegment;
					if (null === segment) {
						var request$jscomp$0 = request;
						if (0 !== task.replay.pendingTasks) {
							switchContext(task.context);
							try {
								"number" === typeof task.replay.slots ? resumeNode(request$jscomp$0, task, task.replay.slots, task.node, task.childIndex) : retryNode(request$jscomp$0, task);
								if (1 === task.replay.pendingTasks && 0 < task.replay.nodes.length) throw Error(formatProdErrorMessage(488));
								task.replay.pendingTasks--;
								task.abortSet.delete(task);
								finishedTask(request$jscomp$0, task.blockedBoundary, task.row, null);
							} catch (thrownValue) {
								resetHooksState();
								var x = thrownValue === SuspenseException ? getSuspendedThenable() : thrownValue;
								if ("object" === typeof x && null !== x && "function" === typeof x.then) {
									var ping = task.ping;
									x.then(ping, ping);
									task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
								} else {
									task.replay.pendingTasks--;
									task.abortSet.delete(task);
									var errorInfo = getThrownInfo(task.componentStack);
									request = void 0;
									var request$jscomp$1 = request$jscomp$0, boundary = task.blockedBoundary, error$jscomp$0 = 12 === request$jscomp$0.status ? request$jscomp$0.fatalError : x, replayNodes = task.replay.nodes, resumeSlots = task.replay.slots;
									request = logRecoverableError(request$jscomp$1, error$jscomp$0, errorInfo);
									abortRemainingReplayNodes(request$jscomp$1, boundary, replayNodes, resumeSlots, error$jscomp$0, request);
									request$jscomp$0.pendingRootTasks--;
									0 === request$jscomp$0.pendingRootTasks && completeShell(request$jscomp$0);
									request$jscomp$0.allPendingTasks--;
									0 === request$jscomp$0.allPendingTasks && completeAll(request$jscomp$0);
								}
							}
						}
					} else if (request$jscomp$0 = void 0, request$jscomp$1 = segment, 0 === request$jscomp$1.status) {
						request$jscomp$1.status = 6;
						switchContext(task.context);
						var childrenLength = request$jscomp$1.children.length, chunkLength = request$jscomp$1.chunks.length;
						try {
							retryNode(request, task), pushSegmentFinale(request$jscomp$1.chunks, request.renderState, request$jscomp$1.lastPushedText, request$jscomp$1.textEmbedded), task.abortSet.delete(task), request$jscomp$1.status = 1, finishedTask(request, task.blockedBoundary, task.row, request$jscomp$1);
						} catch (thrownValue) {
							resetHooksState();
							request$jscomp$1.children.length = childrenLength;
							request$jscomp$1.chunks.length = chunkLength;
							var x$jscomp$0 = thrownValue === SuspenseException ? getSuspendedThenable() : 12 === request.status ? request.fatalError : thrownValue;
							if (12 === request.status && null !== request.trackedPostpones) {
								var trackedPostpones = request.trackedPostpones, thrownInfo = getThrownInfo(task.componentStack);
								task.abortSet.delete(task);
								logRecoverableError(request, x$jscomp$0, thrownInfo);
								trackPostpone(request, trackedPostpones, task, request$jscomp$1);
								finishedTask(request, task.blockedBoundary, task.row, request$jscomp$1);
							} else if ("object" === typeof x$jscomp$0 && null !== x$jscomp$0 && "function" === typeof x$jscomp$0.then) {
								request$jscomp$1.status = 0;
								task.thenableState = thrownValue === SuspenseException ? getThenableStateAfterSuspending() : null;
								var ping$jscomp$0 = task.ping;
								x$jscomp$0.then(ping$jscomp$0, ping$jscomp$0);
							} else {
								var errorInfo$jscomp$0 = getThrownInfo(task.componentStack);
								task.abortSet.delete(task);
								request$jscomp$1.status = 4;
								var boundary$jscomp$0 = task.blockedBoundary, row = task.row;
								null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
								request.allPendingTasks--;
								request$jscomp$0 = logRecoverableError(request, x$jscomp$0, errorInfo$jscomp$0);
								if (null === boundary$jscomp$0) fatalError(request, x$jscomp$0);
								else if (boundary$jscomp$0.pendingTasks--, 4 !== boundary$jscomp$0.status) {
									boundary$jscomp$0.status = 4;
									boundary$jscomp$0.errorDigest = request$jscomp$0;
									untrackBoundary(request, boundary$jscomp$0);
									var boundaryRow = boundary$jscomp$0.row;
									null !== boundaryRow && 0 === --boundaryRow.pendingTasks && finishSuspenseListRow(request, boundaryRow);
									boundary$jscomp$0.parentFlushed && request.clientRenderedBoundaries.push(boundary$jscomp$0);
									0 === request.pendingRootTasks && null === request.trackedPostpones && null !== boundary$jscomp$0.contentPreamble && preparePreamble(request);
								}
								0 === request.allPendingTasks && completeAll(request);
							}
						}
					}
				}
				pingedTasks.splice(0, i);
				null !== request$jscomp$2.destination && flushCompletedQueues(request$jscomp$2, request$jscomp$2.destination);
			} catch (error) {
				logRecoverableError(request$jscomp$2, error, {}), fatalError(request$jscomp$2, error);
			} finally {
				currentResumableState = prevResumableState, ReactSharedInternals.H = prevDispatcher, ReactSharedInternals.A = prevAsyncDispatcher, prevDispatcher === HooksDispatcher && switchContext(prevContext), currentRequest = prevRequest;
			}
		}
	}
	function preparePreambleFromSubtree(request, segment, collectedPreambleSegments) {
		segment.preambleChildren.length && collectedPreambleSegments.push(segment.preambleChildren);
		for (var pendingPreambles = !1, i = 0; i < segment.children.length; i++) pendingPreambles = preparePreambleFromSegment(request, segment.children[i], collectedPreambleSegments) || pendingPreambles;
		return pendingPreambles;
	}
	function preparePreambleFromSegment(request, segment, collectedPreambleSegments) {
		var boundary = segment.boundary;
		if (null === boundary) return preparePreambleFromSubtree(request, segment, collectedPreambleSegments);
		var preamble = boundary.contentPreamble, fallbackPreamble = boundary.fallbackPreamble;
		if (null === preamble || null === fallbackPreamble) return !1;
		switch (boundary.status) {
			case 1:
				hoistPreambleState(request.renderState, preamble);
				request.byteSize += boundary.byteSize;
				segment = boundary.completedSegments[0];
				if (!segment) throw Error(formatProdErrorMessage(391));
				return preparePreambleFromSubtree(request, segment, collectedPreambleSegments);
			case 5: if (null !== request.trackedPostpones) return !0;
			case 4: if (1 === segment.status) return hoistPreambleState(request.renderState, fallbackPreamble), preparePreambleFromSubtree(request, segment, collectedPreambleSegments);
			default: return !0;
		}
	}
	function preparePreamble(request) {
		if (request.completedRootSegment && null === request.completedPreambleSegments) {
			var collectedPreambleSegments = [], originalRequestByteSize = request.byteSize, hasPendingPreambles = preparePreambleFromSegment(request, request.completedRootSegment, collectedPreambleSegments), preamble = request.renderState.preamble;
			!1 === hasPendingPreambles || preamble.headChunks && preamble.bodyChunks ? request.completedPreambleSegments = collectedPreambleSegments : request.byteSize = originalRequestByteSize;
		}
	}
	function flushSubtree(request, destination, segment, hoistableState) {
		segment.parentFlushed = !0;
		switch (segment.status) {
			case 0: segment.id = request.nextSegmentId++;
			case 5: return hoistableState = segment.id, segment.lastPushedText = !1, segment.textEmbedded = !1, request = request.renderState, destination.push("<template id=\""), destination.push(request.placeholderPrefix), request = hoistableState.toString(16), destination.push(request), destination.push("\"></template>");
			case 1:
				segment.status = 2;
				var r = !0, chunks = segment.chunks, chunkIdx = 0;
				segment = segment.children;
				for (var childIdx = 0; childIdx < segment.length; childIdx++) {
					for (r = segment[childIdx]; chunkIdx < r.index; chunkIdx++) destination.push(chunks[chunkIdx]);
					r = flushSegment(request, destination, r, hoistableState);
				}
				for (; chunkIdx < chunks.length - 1; chunkIdx++) destination.push(chunks[chunkIdx]);
				chunkIdx < chunks.length && (r = destination.push(chunks[chunkIdx]));
				return r;
			case 3: return !0;
			default: throw Error(formatProdErrorMessage(390));
		}
	}
	var flushedByteSize = 0;
	function flushSegment(request, destination, segment, hoistableState) {
		var boundary = segment.boundary;
		if (null === boundary) return flushSubtree(request, destination, segment, hoistableState);
		boundary.parentFlushed = !0;
		if (4 === boundary.status) {
			var row = boundary.row;
			null !== row && 0 === --row.pendingTasks && finishSuspenseListRow(request, row);
			request.renderState.generateStaticMarkup || (boundary = boundary.errorDigest, destination.push("<!--$!-->"), destination.push("<template"), boundary && (destination.push(" data-dgst=\""), boundary = escapeTextForBrowser(boundary), destination.push(boundary), destination.push("\"")), destination.push("></template>"));
			flushSubtree(request, destination, segment, hoistableState);
			request = request.renderState.generateStaticMarkup ? !0 : destination.push("<!--/$-->");
			return request;
		}
		if (1 !== boundary.status) return 0 === boundary.status && (boundary.rootSegmentID = request.nextSegmentId++), 0 < boundary.completedSegments.length && request.partialBoundaries.push(boundary), writeStartPendingSuspenseBoundary(destination, request.renderState, boundary.rootSegmentID), hoistableState && hoistHoistables(hoistableState, boundary.fallbackState), flushSubtree(request, destination, segment, hoistableState), destination.push("<!--/$-->");
		if (!flushingPartialBoundaries && isEligibleForOutlining(request, boundary) && flushedByteSize + boundary.byteSize > request.progressiveChunkSize) return boundary.rootSegmentID = request.nextSegmentId++, request.completedBoundaries.push(boundary), writeStartPendingSuspenseBoundary(destination, request.renderState, boundary.rootSegmentID), flushSubtree(request, destination, segment, hoistableState), destination.push("<!--/$-->");
		flushedByteSize += boundary.byteSize;
		hoistableState && hoistHoistables(hoistableState, boundary.contentState);
		segment = boundary.row;
		null !== segment && isEligibleForOutlining(request, boundary) && 0 === --segment.pendingTasks && finishSuspenseListRow(request, segment);
		request.renderState.generateStaticMarkup || destination.push("<!--$-->");
		segment = boundary.completedSegments;
		if (1 !== segment.length) throw Error(formatProdErrorMessage(391));
		flushSegment(request, destination, segment[0], hoistableState);
		request = request.renderState.generateStaticMarkup ? !0 : destination.push("<!--/$-->");
		return request;
	}
	function flushSegmentContainer(request, destination, segment, hoistableState) {
		writeStartSegment(destination, request.renderState, segment.parentFormatContext, segment.id);
		flushSegment(request, destination, segment, hoistableState);
		return writeEndSegment(destination, segment.parentFormatContext);
	}
	function flushCompletedBoundary(request, destination, boundary) {
		flushedByteSize = boundary.byteSize;
		for (var completedSegments = boundary.completedSegments, i = 0; i < completedSegments.length; i++) flushPartiallyCompletedSegment(request, destination, boundary, completedSegments[i]);
		completedSegments.length = 0;
		completedSegments = boundary.row;
		null !== completedSegments && isEligibleForOutlining(request, boundary) && 0 === --completedSegments.pendingTasks && finishSuspenseListRow(request, completedSegments);
		writeHoistablesForBoundary(destination, boundary.contentState, request.renderState);
		completedSegments = request.resumableState;
		request = request.renderState;
		i = boundary.rootSegmentID;
		boundary = boundary.contentState;
		var requiresStyleInsertion = request.stylesToHoist;
		request.stylesToHoist = !1;
		destination.push(request.startInlineScript);
		destination.push(">");
		requiresStyleInsertion ? (0 === (completedSegments.instructions & 4) && (completedSegments.instructions |= 4, destination.push("$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data=\"$!\",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};")), 0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, destination.push("$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if(\"/$\"===d||\"/&\"===d)if(0===h)break;else h--;else\"$\"!==d&&\"$?\"!==d&&\"$~\"!==d&&\"$!\"!==d&&\"&\"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data=\"$\";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data=\"$~\",$RB.push(a,b),2===$RB.length&&(\"number\"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};")), 0 === (completedSegments.instructions & 8) ? (completedSegments.instructions |= 8, destination.push("$RM=new Map;$RR=function(n,w,p){function u(q){this._p=null;q()}for(var r=new Map,t=document,h,b,e=t.querySelectorAll(\"link[data-precedence],style[data-precedence]\"),v=[],k=0;b=e[k++];)\"not all\"===b.getAttribute(\"media\")?v.push(b):(\"LINK\"===b.tagName&&$RM.set(b.getAttribute(\"href\"),b),r.set(b.dataset.precedence,h=b));e=0;b=[];var l,a;for(k=!0;;){if(k){var f=p[e++];if(!f){k=!1;e=0;continue}var c=!1,m=0;var d=f[m++];if(a=$RM.get(d)){var g=a._p;c=!0}else{a=t.createElement(\"link\");a.href=d;a.rel=\n\"stylesheet\";for(a.dataset.precedence=l=f[m++];g=f[m++];)a.setAttribute(g,f[m++]);g=a._p=new Promise(function(q,x){a.onload=u.bind(a,q);a.onerror=u.bind(a,x)});$RM.set(d,a)}d=a.getAttribute(\"media\");!g||d&&!matchMedia(d).matches||b.push(g);if(c)continue}else{a=v[e++];if(!a)break;l=a.getAttribute(\"data-precedence\");a.removeAttribute(\"media\")}c=r.get(l)||h;c===h&&(h=a);r.set(l,a);c?c.parentNode.insertBefore(a,c.nextSibling):(c=t.head,c.insertBefore(a,c.firstChild))}if(p=document.getElementById(n))p.previousSibling.data=\n\"$~\";Promise.all(b).then($RC.bind(null,n,w),$RX.bind(null,n,\"CSS failed to load\"))};$RR(\"")) : destination.push("$RR(\"")) : (0 === (completedSegments.instructions & 2) && (completedSegments.instructions |= 2, destination.push("$RB=[];$RV=function(a){$RT=performance.now();for(var b=0;b<a.length;b+=2){var c=a[b],e=a[b+1];null!==e.parentNode&&e.parentNode.removeChild(e);var f=c.parentNode;if(f){var g=c.previousSibling,h=0;do{if(c&&8===c.nodeType){var d=c.data;if(\"/$\"===d||\"/&\"===d)if(0===h)break;else h--;else\"$\"!==d&&\"$?\"!==d&&\"$~\"!==d&&\"$!\"!==d&&\"&\"!==d||h++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;e.firstChild;)f.insertBefore(e.firstChild,c);g.data=\"$\";g._reactRetry&&requestAnimationFrame(g._reactRetry)}}a.length=0};\n$RC=function(a,b){if(b=document.getElementById(b))(a=document.getElementById(a))?(a.previousSibling.data=\"$~\",$RB.push(a,b),2===$RB.length&&(\"number\"!==typeof $RT?requestAnimationFrame($RV.bind(null,$RB)):(a=performance.now(),setTimeout($RV.bind(null,$RB),2300>a&&2E3<a?2300-a:$RT+300-a)))):b.parentNode.removeChild(b)};")), destination.push("$RC(\""));
		completedSegments = i.toString(16);
		destination.push(request.boundaryPrefix);
		destination.push(completedSegments);
		destination.push("\",\"");
		destination.push(request.segmentPrefix);
		destination.push(completedSegments);
		requiresStyleInsertion ? (destination.push("\","), writeStyleResourceDependenciesInJS(destination, boundary)) : destination.push("\"");
		boundary = destination.push(")<\/script>");
		return writeBootstrap(destination, request) && boundary;
	}
	function flushPartiallyCompletedSegment(request, destination, boundary, segment) {
		if (2 === segment.status) return !0;
		var hoistableState = boundary.contentState, segmentID = segment.id;
		if (-1 === segmentID) {
			if (-1 === (segment.id = boundary.rootSegmentID)) throw Error(formatProdErrorMessage(392));
			return flushSegmentContainer(request, destination, segment, hoistableState);
		}
		if (segmentID === boundary.rootSegmentID) return flushSegmentContainer(request, destination, segment, hoistableState);
		flushSegmentContainer(request, destination, segment, hoistableState);
		boundary = request.resumableState;
		request = request.renderState;
		destination.push(request.startInlineScript);
		destination.push(">");
		0 === (boundary.instructions & 1) ? (boundary.instructions |= 1, destination.push("$RS=function(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS(\"")) : destination.push("$RS(\"");
		destination.push(request.segmentPrefix);
		segmentID = segmentID.toString(16);
		destination.push(segmentID);
		destination.push("\",\"");
		destination.push(request.placeholderPrefix);
		destination.push(segmentID);
		destination = destination.push("\")<\/script>");
		return destination;
	}
	var flushingPartialBoundaries = !1;
	function flushCompletedQueues(request, destination) {
		try {
			if (!(0 < request.pendingRootTasks)) {
				var i, completedRootSegment = request.completedRootSegment;
				if (null !== completedRootSegment) {
					if (5 === completedRootSegment.status) return;
					var completedPreambleSegments = request.completedPreambleSegments;
					if (null === completedPreambleSegments) return;
					flushedByteSize = request.byteSize;
					var resumableState = request.resumableState, renderState = request.renderState, preamble = renderState.preamble, htmlChunks = preamble.htmlChunks, headChunks = preamble.headChunks, i$jscomp$0;
					if (htmlChunks) {
						for (i$jscomp$0 = 0; i$jscomp$0 < htmlChunks.length; i$jscomp$0++) destination.push(htmlChunks[i$jscomp$0]);
						if (headChunks) for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++) destination.push(headChunks[i$jscomp$0]);
						else {
							var chunk = startChunkForTag("head");
							destination.push(chunk);
							destination.push(">");
						}
					} else if (headChunks) for (i$jscomp$0 = 0; i$jscomp$0 < headChunks.length; i$jscomp$0++) destination.push(headChunks[i$jscomp$0]);
					var charsetChunks = renderState.charsetChunks;
					for (i$jscomp$0 = 0; i$jscomp$0 < charsetChunks.length; i$jscomp$0++) destination.push(charsetChunks[i$jscomp$0]);
					charsetChunks.length = 0;
					renderState.preconnects.forEach(flushResource, destination);
					renderState.preconnects.clear();
					var viewportChunks = renderState.viewportChunks;
					for (i$jscomp$0 = 0; i$jscomp$0 < viewportChunks.length; i$jscomp$0++) destination.push(viewportChunks[i$jscomp$0]);
					viewportChunks.length = 0;
					renderState.fontPreloads.forEach(flushResource, destination);
					renderState.fontPreloads.clear();
					renderState.highImagePreloads.forEach(flushResource, destination);
					renderState.highImagePreloads.clear();
					currentlyFlushingRenderState = renderState;
					renderState.styles.forEach(flushStylesInPreamble, destination);
					currentlyFlushingRenderState = null;
					var importMapChunks = renderState.importMapChunks;
					for (i$jscomp$0 = 0; i$jscomp$0 < importMapChunks.length; i$jscomp$0++) destination.push(importMapChunks[i$jscomp$0]);
					importMapChunks.length = 0;
					renderState.bootstrapScripts.forEach(flushResource, destination);
					renderState.scripts.forEach(flushResource, destination);
					renderState.scripts.clear();
					renderState.bulkPreloads.forEach(flushResource, destination);
					renderState.bulkPreloads.clear();
					resumableState.instructions |= 32;
					var hoistableChunks = renderState.hoistableChunks;
					for (i$jscomp$0 = 0; i$jscomp$0 < hoistableChunks.length; i$jscomp$0++) destination.push(hoistableChunks[i$jscomp$0]);
					for (resumableState = hoistableChunks.length = 0; resumableState < completedPreambleSegments.length; resumableState++) {
						var segments = completedPreambleSegments[resumableState];
						for (renderState = 0; renderState < segments.length; renderState++) flushSegment(request, destination, segments[renderState], null);
					}
					var preamble$jscomp$0 = request.renderState.preamble, headChunks$jscomp$0 = preamble$jscomp$0.headChunks;
					if (preamble$jscomp$0.htmlChunks || headChunks$jscomp$0) {
						var chunk$jscomp$0 = endChunkForTag("head");
						destination.push(chunk$jscomp$0);
					}
					var bodyChunks = preamble$jscomp$0.bodyChunks;
					if (bodyChunks) for (completedPreambleSegments = 0; completedPreambleSegments < bodyChunks.length; completedPreambleSegments++) destination.push(bodyChunks[completedPreambleSegments]);
					flushSegment(request, destination, completedRootSegment, null);
					request.completedRootSegment = null;
					var renderState$jscomp$0 = request.renderState;
					if (0 !== request.allPendingTasks || 0 !== request.clientRenderedBoundaries.length || 0 !== request.completedBoundaries.length || null !== request.trackedPostpones && (0 !== request.trackedPostpones.rootNodes.length || null !== request.trackedPostpones.rootSlots)) {
						var resumableState$jscomp$0 = request.resumableState;
						if (0 === (resumableState$jscomp$0.instructions & 64)) {
							resumableState$jscomp$0.instructions |= 64;
							destination.push(renderState$jscomp$0.startInlineScript);
							if (0 === (resumableState$jscomp$0.instructions & 32)) {
								resumableState$jscomp$0.instructions |= 32;
								var shellId = "_" + resumableState$jscomp$0.idPrefix + "R_";
								destination.push(" id=\"");
								var chunk$jscomp$1 = escapeTextForBrowser(shellId);
								destination.push(chunk$jscomp$1);
								destination.push("\"");
							}
							destination.push(">");
							destination.push("requestAnimationFrame(function(){$RT=performance.now()});");
							destination.push("<\/script>");
						}
					}
					writeBootstrap(destination, renderState$jscomp$0);
				}
				var renderState$jscomp$1 = request.renderState;
				completedRootSegment = 0;
				var viewportChunks$jscomp$0 = renderState$jscomp$1.viewportChunks;
				for (completedRootSegment = 0; completedRootSegment < viewportChunks$jscomp$0.length; completedRootSegment++) destination.push(viewportChunks$jscomp$0[completedRootSegment]);
				viewportChunks$jscomp$0.length = 0;
				renderState$jscomp$1.preconnects.forEach(flushResource, destination);
				renderState$jscomp$1.preconnects.clear();
				renderState$jscomp$1.fontPreloads.forEach(flushResource, destination);
				renderState$jscomp$1.fontPreloads.clear();
				renderState$jscomp$1.highImagePreloads.forEach(flushResource, destination);
				renderState$jscomp$1.highImagePreloads.clear();
				renderState$jscomp$1.styles.forEach(preloadLateStyles, destination);
				renderState$jscomp$1.scripts.forEach(flushResource, destination);
				renderState$jscomp$1.scripts.clear();
				renderState$jscomp$1.bulkPreloads.forEach(flushResource, destination);
				renderState$jscomp$1.bulkPreloads.clear();
				var hoistableChunks$jscomp$0 = renderState$jscomp$1.hoistableChunks;
				for (completedRootSegment = 0; completedRootSegment < hoistableChunks$jscomp$0.length; completedRootSegment++) destination.push(hoistableChunks$jscomp$0[completedRootSegment]);
				hoistableChunks$jscomp$0.length = 0;
				var clientRenderedBoundaries = request.clientRenderedBoundaries;
				for (i = 0; i < clientRenderedBoundaries.length; i++) {
					var boundary = clientRenderedBoundaries[i];
					renderState$jscomp$1 = destination;
					var resumableState$jscomp$1 = request.resumableState, renderState$jscomp$2 = request.renderState, id = boundary.rootSegmentID, errorDigest = boundary.errorDigest;
					renderState$jscomp$1.push(renderState$jscomp$2.startInlineScript);
					renderState$jscomp$1.push(">");
					0 === (resumableState$jscomp$1.instructions & 4) ? (resumableState$jscomp$1.instructions |= 4, renderState$jscomp$1.push("$RX=function(b,c,d,e,f){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data=\"$!\",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),f&&(a.cstck=f),b._reactRetry&&b._reactRetry())};;$RX(\"")) : renderState$jscomp$1.push("$RX(\"");
					renderState$jscomp$1.push(renderState$jscomp$2.boundaryPrefix);
					var chunk$jscomp$2 = id.toString(16);
					renderState$jscomp$1.push(chunk$jscomp$2);
					renderState$jscomp$1.push("\"");
					if (errorDigest) {
						renderState$jscomp$1.push(",");
						var chunk$jscomp$3 = escapeJSStringsForInstructionScripts(errorDigest || "");
						renderState$jscomp$1.push(chunk$jscomp$3);
					}
					var JSCompiler_inline_result = renderState$jscomp$1.push(")<\/script>");
					if (!JSCompiler_inline_result) {
						request.destination = null;
						i++;
						clientRenderedBoundaries.splice(0, i);
						return;
					}
				}
				clientRenderedBoundaries.splice(0, i);
				var completedBoundaries = request.completedBoundaries;
				for (i = 0; i < completedBoundaries.length; i++) if (!flushCompletedBoundary(request, destination, completedBoundaries[i])) {
					request.destination = null;
					i++;
					completedBoundaries.splice(0, i);
					return;
				}
				completedBoundaries.splice(0, i);
				flushingPartialBoundaries = !0;
				var partialBoundaries = request.partialBoundaries;
				for (i = 0; i < partialBoundaries.length; i++) {
					var boundary$69 = partialBoundaries[i];
					a: {
						clientRenderedBoundaries = request;
						boundary = destination;
						flushedByteSize = boundary$69.byteSize;
						var completedSegments = boundary$69.completedSegments;
						for (JSCompiler_inline_result = 0; JSCompiler_inline_result < completedSegments.length; JSCompiler_inline_result++) if (!flushPartiallyCompletedSegment(clientRenderedBoundaries, boundary, boundary$69, completedSegments[JSCompiler_inline_result])) {
							JSCompiler_inline_result++;
							completedSegments.splice(0, JSCompiler_inline_result);
							var JSCompiler_inline_result$jscomp$0 = !1;
							break a;
						}
						completedSegments.splice(0, JSCompiler_inline_result);
						var row = boundary$69.row;
						null !== row && row.together && 1 === boundary$69.pendingTasks && (1 === row.pendingTasks ? unblockSuspenseListRow(clientRenderedBoundaries, row, row.hoistables) : row.pendingTasks--);
						JSCompiler_inline_result$jscomp$0 = writeHoistablesForBoundary(boundary, boundary$69.contentState, clientRenderedBoundaries.renderState);
					}
					if (!JSCompiler_inline_result$jscomp$0) {
						request.destination = null;
						i++;
						partialBoundaries.splice(0, i);
						return;
					}
				}
				partialBoundaries.splice(0, i);
				flushingPartialBoundaries = !1;
				var largeBoundaries = request.completedBoundaries;
				for (i = 0; i < largeBoundaries.length; i++) if (!flushCompletedBoundary(request, destination, largeBoundaries[i])) {
					request.destination = null;
					i++;
					largeBoundaries.splice(0, i);
					return;
				}
				largeBoundaries.splice(0, i);
			}
		} finally {
			flushingPartialBoundaries = !1, 0 === request.allPendingTasks && 0 === request.clientRenderedBoundaries.length && 0 === request.completedBoundaries.length && (request.flushScheduled = !1, i = request.resumableState, i.hasBody && (partialBoundaries = endChunkForTag("body"), destination.push(partialBoundaries)), i.hasHtml && (i = endChunkForTag("html"), destination.push(i)), request.status = 14, destination.push(null), request.destination = null);
		}
	}
	function enqueueFlush(request) {
		if (!1 === request.flushScheduled && 0 === request.pingedTasks.length && null !== request.destination) {
			request.flushScheduled = !0;
			var destination = request.destination;
			destination ? flushCompletedQueues(request, destination) : request.flushScheduled = !1;
		}
	}
	function startFlowing(request, destination) {
		if (13 === request.status) request.status = 14, destination.destroy(request.fatalError);
		else if (14 !== request.status && null === request.destination) {
			request.destination = destination;
			try {
				flushCompletedQueues(request, destination);
			} catch (error) {
				logRecoverableError(request, error, {}), fatalError(request, error);
			}
		}
	}
	function abort(request, reason) {
		if (11 === request.status || 10 === request.status) request.status = 12;
		try {
			var abortableTasks = request.abortableTasks;
			if (0 < abortableTasks.size) {
				var error = void 0 === reason ? Error(formatProdErrorMessage(432)) : "object" === typeof reason && null !== reason && "function" === typeof reason.then ? Error(formatProdErrorMessage(530)) : reason;
				request.fatalError = error;
				abortableTasks.forEach(function(task) {
					return abortTask(task, request, error);
				});
				abortableTasks.clear();
			}
			null !== request.destination && flushCompletedQueues(request, request.destination);
		} catch (error$71) {
			logRecoverableError(request, error$71, {}), fatalError(request, error$71);
		}
	}
	function addToReplayParent(node, parentKeyPath, trackedPostpones) {
		if (null === parentKeyPath) trackedPostpones.rootNodes.push(node);
		else {
			var workingMap = trackedPostpones.workingMap, parentNode = workingMap.get(parentKeyPath);
			void 0 === parentNode && (parentNode = [
				parentKeyPath[1],
				parentKeyPath[2],
				[],
				null
			], workingMap.set(parentKeyPath, parentNode), addToReplayParent(parentNode, parentKeyPath[0], trackedPostpones));
			parentNode[2].push(node);
		}
	}
	function onError() {}
	function renderToStringImpl(children, options, generateStaticMarkup, abortReason) {
		var didFatal = !1, fatalError = null, result = "", readyToStream = !1;
		options = createResumableState(options ? options.identifierPrefix : void 0);
		children = createRequest(children, options, createRenderState(options, generateStaticMarkup), createFormatContext(0, null, 0, null), Infinity, onError, void 0, function() {
			readyToStream = !0;
		}, void 0, void 0, void 0);
		children.flushScheduled = null !== children.destination;
		performWork(children);
		10 === children.status && (children.status = 11);
		null === children.trackedPostpones && safelyEmitEarlyPreloads(children, 0 === children.pendingRootTasks);
		abort(children, abortReason);
		startFlowing(children, {
			push: function(chunk) {
				null !== chunk && (result += chunk);
				return !0;
			},
			destroy: function(error) {
				didFatal = !0;
				fatalError = error;
			}
		});
		if (didFatal && fatalError !== abortReason) throw fatalError;
		if (!readyToStream) throw Error(formatProdErrorMessage(426));
		return result;
	}
	exports.renderToStaticMarkup = function(children, options) {
		return renderToStringImpl(children, options, !0, "The server used \"renderToStaticMarkup\" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to \"renderToReadableStream\" which supports Suspense on the server");
	};
	exports.renderToString = function(children, options) {
		return renderToStringImpl(children, options, !1, "The server used \"renderToString\" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to \"renderToReadableStream\" which supports Suspense on the server");
	};
	exports.version = "19.2.8";
}));
//#endregion
//#region node_modules/.pnpm/react-dom@19.2.8_react@19.2.8/node_modules/react-dom/server.edge.js
var require_server_edge = /* @__PURE__ */ __commonJSMin(((exports) => {
	var b;
	var l;
	b = require_react_dom_server_edge_production();
	l = require_react_dom_server_legacy_browser_production();
	exports.version = b.version;
	exports.renderToReadableStream = b.renderToReadableStream;
	exports.renderToString = l.renderToString;
	exports.renderToStaticMarkup = l.renderToStaticMarkup;
	exports.resume = b.resume;
}));
//#endregion
//#region node_modules/.pnpm/react@19.2.8/node_modules/react/cjs/react-jsx-runtime.production.js
/**
* @license React
* react-jsx-runtime.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_jsx_runtime_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
		var key = null;
		void 0 !== maybeKey && (key = "" + maybeKey);
		void 0 !== config.key && (key = "" + config.key);
		if ("key" in config) {
			maybeKey = {};
			for (var propName in config) "key" !== propName && (maybeKey[propName] = config[propName]);
		} else maybeKey = config;
		config = maybeKey.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== config ? config : null,
			props: maybeKey
		};
	}
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.jsx = jsxProd;
	exports.jsxs = jsxProd;
}));
//#endregion
//#region node_modules/.pnpm/react@19.2.8/node_modules/react/jsx-runtime.js
var require_jsx_runtime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_jsx_runtime_production();
}));
//#endregion
//#region node_modules/.pnpm/@react-router+dev@8.3.0_react-router@8.3.0_react-dom@19.2.8_react@19.2.8__react@19.2.8__8ca46b613f4bb6254daceb2b6d039905/node_modules/@react-router/dev/dist/config/defaults/entry.server.web.tsx
var entry_server_web_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var import_server_edge = require_server_edge();
var import_jsx_runtime = require_jsx_runtime();
var streamTimeout = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, routerContext, _loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	let shellRendered = false;
	let userAgent = request.headers.get("user-agent");
	const body = await (0, import_server_edge.renderToReadableStream)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServerRouter, {
		context: routerContext,
		url: request.url
	}), {
		signal: AbortSignal.timeout(6e3),
		onError(error) {
			responseStatusCode = 500;
			if (shellRendered) console.error(error);
		}
	});
	shellRendered = true;
	if (userAgent && isbot(userAgent) || routerContext.isSpaMode) await body.allReady;
	responseHeaders.set("Content-Type", "text/html");
	return new Response(body, {
		headers: responseHeaders,
		status: responseStatusCode
	});
}
//#endregion
//#region src/lib/artifacts-api.ts
var ArtifactsError = class extends Error {
	status;
	constructor(message, status) {
		super(message);
		this.status = status;
		this.name = "ArtifactsError";
	}
};
async function readJson(transport, path, init) {
	const response = await transport(`https://artifacts.internal/v1${path}`, init);
	if (!response.ok) throw new ArtifactsError(`artifacts request ${path} failed (${response.status})`, response.status);
	if (!(response.headers.get("content-type")?.toLowerCase())?.startsWith("application/json")) throw new ArtifactsError(`artifacts request ${path} returned non-JSON`, response.status);
	return response.json();
}
function createArtifactsClient(transport) {
	return {
		bootstrap: () => readJson(transport, "/bootstrap"),
		groupInfo: () => readJson(transport, "/group"),
		groupMembers: () => readJson(transport, "/group/members"),
		agentInfo: () => readJson(transport, "/agent"),
		getText: (key) => readJson(transport, `/text/${encodeURIComponent(key)}`),
		setText: (key, value) => readJson(transport, `/text/${encodeURIComponent(key)}`, {
			method: "PUT",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ value })
		}),
		sendToAgent: (event) => readJson(transport, "/agent/events", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(event)
		})
	};
}
//#endregion
//#region src/lib/artifacts.server.ts
async function getArtifactsClient(context) {
	const { env } = context.get(cloudflareContext);
	return createArtifactsClient(fetch);
}
//#endregion
//#region src/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout,
	default: () => root_default,
	loader: () => loader$4
});
async function loader$4({ context }) {
	const client = await getArtifactsClient(context);
	const [group, agent, members] = await Promise.all([
		client.groupInfo(),
		client.agentInfo(),
		client.groupMembers()
	]);
	return {
		basePath: context.get(siteBasePathContext),
		group,
		agent,
		members
	};
}
function Layout({ children }) {
	const data = useRouteLoaderData("root");
	const baseHref = data?.basePath === "/" ? "/" : `${data?.basePath ?? ""}/`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("base", { href: baseHref }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Links, {})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollRestoration, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var root_default = withComponentProps(function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
});
var ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary() {
	const error = useRouteError();
	const title = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : "The site could not render this page";
	const message = isRouteErrorResponse(error) ? typeof error.data === "string" ? error.data : "The requested route returned an error." : error instanceof Error ? error.message : "An unexpected error occurred.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto flex min-h-[100dvh] max-w-2xl items-center px-6 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-destructive",
				children: "Site error"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-3xl font-semibold tracking-tight",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted-foreground",
				children: message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: ".",
				className: "mt-8 inline-flex text-sm font-medium text-primary underline underline-offset-4",
				children: "Return to the site"
			})
		] })
	});
});
//#endregion
//#region node_modules/.pnpm/lucide-react@1.26.0_react@19.2.8/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
/**
* @license lucide-react v1.26.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var mergeClasses = (...classes) => classes.filter((className, index, array) => {
	return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
//#endregion
//#region node_modules/.pnpm/lucide-react@1.26.0_react@19.2.8/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
/**
* @license lucide-react v1.26.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
//#endregion
//#region node_modules/.pnpm/lucide-react@1.26.0_react@19.2.8/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
/**
* @license lucide-react v1.26.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toCamelCase = (string) => string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
//#endregion
//#region node_modules/.pnpm/lucide-react@1.26.0_react@19.2.8/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
/**
* @license lucide-react v1.26.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var toPascalCase = (string) => {
	const camelCase = toCamelCase(string);
	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
//#endregion
//#region node_modules/.pnpm/lucide-react@1.26.0_react@19.2.8/node_modules/lucide-react/dist/esm/defaultAttributes.mjs
/**
* @license lucide-react v1.26.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var defaultAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
};
//#endregion
//#region node_modules/.pnpm/lucide-react@1.26.0_react@19.2.8/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
/**
* @license lucide-react v1.26.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var hasA11yProp = (props) => {
	for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
	return false;
};
//#endregion
//#region node_modules/.pnpm/lucide-react@1.26.0_react@19.2.8/node_modules/lucide-react/dist/esm/context.mjs
/**
* @license lucide-react v1.26.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LucideContext = (0, import_react.createContext)({});
var useLucideContext = () => (0, import_react.useContext)(LucideContext);
//#endregion
//#region node_modules/.pnpm/lucide-react@1.26.0_react@19.2.8/node_modules/lucide-react/dist/esm/Icon.mjs
/**
* @license lucide-react v1.26.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Icon = (0, import_react.forwardRef)(({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => {
	const { size: contextSize = 24, strokeWidth: contextStrokeWidth = 2, absoluteStrokeWidth: contextAbsoluteStrokeWidth = false, color: contextColor = "currentColor", className: contextClass = "" } = useLucideContext() ?? {};
	const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
	return (0, import_react.createElement)("svg", {
		ref,
		...defaultAttributes,
		width: size ?? contextSize ?? defaultAttributes.width,
		height: size ?? contextSize ?? defaultAttributes.height,
		stroke: color ?? contextColor,
		strokeWidth: calculatedStrokeWidth,
		className: mergeClasses("lucide", contextClass, className),
		...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
		...rest
	}, [...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)), ...Array.isArray(children) ? children : [children]]);
});
//#endregion
//#region node_modules/.pnpm/lucide-react@1.26.0_react@19.2.8/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
/**
* @license lucide-react v1.26.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var createLucideIcon = (iconName, iconNode) => {
	const Component = (0, import_react.forwardRef)(({ className, ...props }, ref) => (0, import_react.createElement)(Icon, {
		ref,
		iconNode,
		className: mergeClasses(`lucide-${toKebabCase(toPascalCase(iconName))}`, `lucide-${iconName}`, className),
		...props
	}));
	Component.displayName = toPascalCase(iconName);
	return Component;
};
/**
* @license lucide-react v1.26.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Send = createLucideIcon("send", [["path", {
	d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
	key: "1ffxy3"
}], ["path", {
	d: "m21.854 2.147-10.94 10.939",
	key: "12cjpa"
}]]);
/**
* @license lucide-react v1.26.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Sparkles = createLucideIcon("sparkles", [
	["path", {
		d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
		key: "1s2grr"
	}],
	["path", {
		d: "M20 2v4",
		key: "1rf3ol"
	}],
	["path", {
		d: "M22 4h-4",
		key: "gwowj6"
	}],
	["circle", {
		cx: "4",
		cy: "20",
		r: "2",
		key: "6kqj1y"
	}]
]);
//#endregion
//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function r(e) {
	var t, f, n = "";
	if ("string" == typeof e || "number" == typeof e) n += e;
	else if ("object" == typeof e) if (Array.isArray(e)) {
		var o = e.length;
		for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
	} else for (f in e) e[f] && (n && (n += " "), n += f);
	return n;
}
function clsx() {
	for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
	return n;
}
//#endregion
//#region node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs
/**
* Copyright 2022 Joe Bell. All rights reserved.
*
* This file is licensed to you under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with the
* License. You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR REPRESENTATIONS OF ANY KIND, either express or implied. See the
* License for the specific language governing permissions and limitations under
* the License.
*/ var falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
var cx = clsx;
var cva = (base, config) => (props) => {
	var _config_compoundVariants;
	if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
	const { variants, defaultVariants } = config;
	const getVariantClassNames = Object.keys(variants).map((variant) => {
		const variantProp = props === null || props === void 0 ? void 0 : props[variant];
		const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
		if (variantProp === null) return null;
		const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
		return variants[variant][variantKey];
	});
	const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
		let [key, value] = param;
		if (value === void 0) return acc;
		acc[key] = value;
		return acc;
	}, {});
	return cx(base, getVariantClassNames, config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
		let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
		return Object.entries(compoundVariantOptions).every((param) => {
			let [key, value] = param;
			return Array.isArray(value) ? value.includes({
				...defaultVariants,
				...propsWithoutUndefined
			}[key]) : {
				...defaultVariants,
				...propsWithoutUndefined
			}[key] === value;
		}) ? [
			...acc,
			cvClass,
			cvClassName
		] : acc;
	}, []), props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};
//#endregion
//#region node_modules/.pnpm/tailwind-merge@3.6.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs
/**
* Concatenates two arrays faster than the array spread operator.
*/
var concatArrays = (array1, array2) => {
	const combinedArray = new Array(array1.length + array2.length);
	for (let i = 0; i < array1.length; i++) combinedArray[i] = array1[i];
	for (let i = 0; i < array2.length; i++) combinedArray[array1.length + i] = array2[i];
	return combinedArray;
};
var createClassValidatorObject = (classGroupId, validator) => ({
	classGroupId,
	validator
});
var createClassPartObject = (nextPart = /* @__PURE__ */ new Map(), validators = null, classGroupId) => ({
	nextPart,
	validators,
	classGroupId
});
var CLASS_PART_SEPARATOR = "-";
var EMPTY_CONFLICTS = [];
var ARBITRARY_PROPERTY_PREFIX = "arbitrary..";
var createClassGroupUtils = (config) => {
	const classMap = createClassMap(config);
	const { conflictingClassGroups, conflictingClassGroupModifiers } = config;
	const getClassGroupId = (className) => {
		if (className.startsWith("[") && className.endsWith("]")) return getGroupIdForArbitraryProperty(className);
		const classParts = className.split(CLASS_PART_SEPARATOR);
		return getGroupRecursive(classParts, classParts[0] === "" && classParts.length > 1 ? 1 : 0, classMap);
	};
	const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
		if (hasPostfixModifier) {
			const modifierConflicts = conflictingClassGroupModifiers[classGroupId];
			const baseConflicts = conflictingClassGroups[classGroupId];
			if (modifierConflicts) {
				if (baseConflicts) return concatArrays(baseConflicts, modifierConflicts);
				return modifierConflicts;
			}
			return baseConflicts || EMPTY_CONFLICTS;
		}
		return conflictingClassGroups[classGroupId] || EMPTY_CONFLICTS;
	};
	return {
		getClassGroupId,
		getConflictingClassGroupIds
	};
};
var getGroupRecursive = (classParts, startIndex, classPartObject) => {
	if (classParts.length - startIndex === 0) return classPartObject.classGroupId;
	const currentClassPart = classParts[startIndex];
	const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
	if (nextClassPartObject) {
		const result = getGroupRecursive(classParts, startIndex + 1, nextClassPartObject);
		if (result) return result;
	}
	const validators = classPartObject.validators;
	if (validators === null) return;
	const classRest = startIndex === 0 ? classParts.join(CLASS_PART_SEPARATOR) : classParts.slice(startIndex).join(CLASS_PART_SEPARATOR);
	const validatorsLength = validators.length;
	for (let i = 0; i < validatorsLength; i++) {
		const validatorObj = validators[i];
		if (validatorObj.validator(classRest)) return validatorObj.classGroupId;
	}
};
/**
* Get the class group ID for an arbitrary property.
*
* @param className - The class name to get the group ID for. Is expected to be string starting with `[` and ending with `]`.
*/
var getGroupIdForArbitraryProperty = (className) => className.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
	const content = className.slice(1, -1);
	const colonIndex = content.indexOf(":");
	const property = content.slice(0, colonIndex);
	return property ? ARBITRARY_PROPERTY_PREFIX + property : void 0;
})();
/**
* Exported for testing only
*/
var createClassMap = (config) => {
	const { theme, classGroups } = config;
	return processClassGroups(classGroups, theme);
};
var processClassGroups = (classGroups, theme) => {
	const classMap = createClassPartObject();
	for (const classGroupId in classGroups) {
		const group = classGroups[classGroupId];
		processClassesRecursively(group, classMap, classGroupId, theme);
	}
	return classMap;
};
var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
	const len = classGroup.length;
	for (let i = 0; i < len; i++) {
		const classDefinition = classGroup[i];
		processClassDefinition(classDefinition, classPartObject, classGroupId, theme);
	}
};
var processClassDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	if (typeof classDefinition === "string") {
		processStringDefinition(classDefinition, classPartObject, classGroupId);
		return;
	}
	if (typeof classDefinition === "function") {
		processFunctionDefinition(classDefinition, classPartObject, classGroupId, theme);
		return;
	}
	processObjectDefinition(classDefinition, classPartObject, classGroupId, theme);
};
var processStringDefinition = (classDefinition, classPartObject, classGroupId) => {
	const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
	classPartObjectToEdit.classGroupId = classGroupId;
};
var processFunctionDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	if (isThemeGetter(classDefinition)) {
		processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
		return;
	}
	if (classPartObject.validators === null) classPartObject.validators = [];
	classPartObject.validators.push(createClassValidatorObject(classGroupId, classDefinition));
};
var processObjectDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	const entries = Object.entries(classDefinition);
	const len = entries.length;
	for (let i = 0; i < len; i++) {
		const [key, value] = entries[i];
		processClassesRecursively(value, getPart(classPartObject, key), classGroupId, theme);
	}
};
var getPart = (classPartObject, path) => {
	let current = classPartObject;
	const parts = path.split(CLASS_PART_SEPARATOR);
	const len = parts.length;
	for (let i = 0; i < len; i++) {
		const part = parts[i];
		let next = current.nextPart.get(part);
		if (!next) {
			next = createClassPartObject();
			current.nextPart.set(part, next);
		}
		current = next;
	}
	return current;
};
var isThemeGetter = (func) => "isThemeGetter" in func && func.isThemeGetter === true;
var createLruCache = (maxCacheSize) => {
	if (maxCacheSize < 1) return {
		get: () => void 0,
		set: () => {}
	};
	let cacheSize = 0;
	let cache = Object.create(null);
	let previousCache = Object.create(null);
	const update = (key, value) => {
		cache[key] = value;
		cacheSize++;
		if (cacheSize > maxCacheSize) {
			cacheSize = 0;
			previousCache = cache;
			cache = Object.create(null);
		}
	};
	return {
		get(key) {
			let value = cache[key];
			if (value !== void 0) return value;
			if ((value = previousCache[key]) !== void 0) {
				update(key, value);
				return value;
			}
		},
		set(key, value) {
			if (key in cache) cache[key] = value;
			else update(key, value);
		}
	};
};
var IMPORTANT_MODIFIER = "!";
var MODIFIER_SEPARATOR = ":";
var EMPTY_MODIFIERS = [];
var createResultObject = (modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition, isExternal) => ({
	modifiers,
	hasImportantModifier,
	baseClassName,
	maybePostfixModifierPosition,
	isExternal
});
var createParseClassName = (config) => {
	const { prefix, experimentalParseClassName } = config;
	/**
	* Parse class name into parts.
	*
	* Inspired by `splitAtTopLevelOnly` used in Tailwind CSS
	* @see https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
	*/
	let parseClassName = (className) => {
		const modifiers = [];
		let bracketDepth = 0;
		let parenDepth = 0;
		let modifierStart = 0;
		let postfixModifierPosition;
		const len = className.length;
		for (let index = 0; index < len; index++) {
			const currentCharacter = className[index];
			if (bracketDepth === 0 && parenDepth === 0) {
				if (currentCharacter === MODIFIER_SEPARATOR) {
					modifiers.push(className.slice(modifierStart, index));
					modifierStart = index + 1;
					continue;
				}
				if (currentCharacter === "/") {
					postfixModifierPosition = index;
					continue;
				}
			}
			if (currentCharacter === "[") bracketDepth++;
			else if (currentCharacter === "]") bracketDepth--;
			else if (currentCharacter === "(") parenDepth++;
			else if (currentCharacter === ")") parenDepth--;
		}
		const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.slice(modifierStart);
		let baseClassName = baseClassNameWithImportantModifier;
		let hasImportantModifier = false;
		if (baseClassNameWithImportantModifier.endsWith(IMPORTANT_MODIFIER)) {
			baseClassName = baseClassNameWithImportantModifier.slice(0, -1);
			hasImportantModifier = true;
		} else if (baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER)) {
			baseClassName = baseClassNameWithImportantModifier.slice(1);
			hasImportantModifier = true;
		}
		const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
		return createResultObject(modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition);
	};
	if (prefix) {
		const fullPrefix = prefix + MODIFIER_SEPARATOR;
		const parseClassNameOriginal = parseClassName;
		parseClassName = (className) => className.startsWith(fullPrefix) ? parseClassNameOriginal(className.slice(fullPrefix.length)) : createResultObject(EMPTY_MODIFIERS, false, className, void 0, true);
	}
	if (experimentalParseClassName) {
		const parseClassNameOriginal = parseClassName;
		parseClassName = (className) => experimentalParseClassName({
			className,
			parseClassName: parseClassNameOriginal
		});
	}
	return parseClassName;
};
/**
* Sorts modifiers according to following schema:
* - Predefined modifiers are sorted alphabetically
* - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
*/
var createSortModifiers = (config) => {
	const modifierWeights = /* @__PURE__ */ new Map();
	config.orderSensitiveModifiers.forEach((mod, index) => {
		modifierWeights.set(mod, 1e6 + index);
	});
	return (modifiers) => {
		const result = [];
		let currentSegment = [];
		for (let i = 0; i < modifiers.length; i++) {
			const modifier = modifiers[i];
			const isArbitrary = modifier[0] === "[";
			const isOrderSensitive = modifierWeights.has(modifier);
			if (isArbitrary || isOrderSensitive) {
				if (currentSegment.length > 0) {
					currentSegment.sort();
					result.push(...currentSegment);
					currentSegment = [];
				}
				result.push(modifier);
			} else currentSegment.push(modifier);
		}
		if (currentSegment.length > 0) {
			currentSegment.sort();
			result.push(...currentSegment);
		}
		return result;
	};
};
var createConfigUtils = (config) => ({
	cache: createLruCache(config.cacheSize),
	parseClassName: createParseClassName(config),
	sortModifiers: createSortModifiers(config),
	postfixLookupClassGroupIds: createPostfixLookupClassGroupIds(config),
	...createClassGroupUtils(config)
});
var createPostfixLookupClassGroupIds = (config) => {
	const lookup = Object.create(null);
	const classGroupIds = config.postfixLookupClassGroups;
	if (classGroupIds) for (let i = 0; i < classGroupIds.length; i++) lookup[classGroupIds[i]] = true;
	return lookup;
};
var SPLIT_CLASSES_REGEX = /\s+/;
var mergeClassList = (classList, configUtils) => {
	const { parseClassName, getClassGroupId, getConflictingClassGroupIds, sortModifiers, postfixLookupClassGroupIds } = configUtils;
	/**
	* Set of classGroupIds in following format:
	* `{importantModifier}{variantModifiers}{classGroupId}`
	* @example 'float'
	* @example 'hover:focus:bg-color'
	* @example 'md:!pr'
	*/
	const classGroupsInConflict = [];
	const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
	let result = "";
	for (let index = classNames.length - 1; index >= 0; index -= 1) {
		const originalClassName = classNames[index];
		const { isExternal, modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition } = parseClassName(originalClassName);
		if (isExternal) {
			result = originalClassName + (result.length > 0 ? " " + result : result);
			continue;
		}
		let hasPostfixModifier = !!maybePostfixModifierPosition;
		let classGroupId;
		if (hasPostfixModifier) {
			classGroupId = getClassGroupId(baseClassName.substring(0, maybePostfixModifierPosition));
			const classGroupIdWithPostfix = classGroupId && postfixLookupClassGroupIds[classGroupId] ? getClassGroupId(baseClassName) : void 0;
			if (classGroupIdWithPostfix && classGroupIdWithPostfix !== classGroupId) {
				classGroupId = classGroupIdWithPostfix;
				hasPostfixModifier = false;
			}
		} else classGroupId = getClassGroupId(baseClassName);
		if (!classGroupId) {
			if (!hasPostfixModifier) {
				result = originalClassName + (result.length > 0 ? " " + result : result);
				continue;
			}
			classGroupId = getClassGroupId(baseClassName);
			if (!classGroupId) {
				result = originalClassName + (result.length > 0 ? " " + result : result);
				continue;
			}
			hasPostfixModifier = false;
		}
		const variantModifier = modifiers.length === 0 ? "" : modifiers.length === 1 ? modifiers[0] : sortModifiers(modifiers).join(":");
		const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
		const classId = modifierId + classGroupId;
		if (classGroupsInConflict.indexOf(classId) > -1) continue;
		classGroupsInConflict.push(classId);
		const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
		for (let i = 0; i < conflictGroups.length; ++i) {
			const group = conflictGroups[i];
			classGroupsInConflict.push(modifierId + group);
		}
		result = originalClassName + (result.length > 0 ? " " + result : result);
	}
	return result;
};
/**
* The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
*
* Specifically:
* - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
* - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
*
* Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
*/
var twJoin = (...classLists) => {
	let index = 0;
	let argument;
	let resolvedValue;
	let string = "";
	while (index < classLists.length) if (argument = classLists[index++]) {
		if (resolvedValue = toValue(argument)) {
			string && (string += " ");
			string += resolvedValue;
		}
	}
	return string;
};
var toValue = (mix) => {
	if (typeof mix === "string") return mix;
	let resolvedValue;
	let string = "";
	for (let k = 0; k < mix.length; k++) if (mix[k]) {
		if (resolvedValue = toValue(mix[k])) {
			string && (string += " ");
			string += resolvedValue;
		}
	}
	return string;
};
var createTailwindMerge = (createConfigFirst, ...createConfigRest) => {
	let configUtils;
	let cacheGet;
	let cacheSet;
	let functionToCall;
	const initTailwindMerge = (classList) => {
		configUtils = createConfigUtils(createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst()));
		cacheGet = configUtils.cache.get;
		cacheSet = configUtils.cache.set;
		functionToCall = tailwindMerge;
		return tailwindMerge(classList);
	};
	const tailwindMerge = (classList) => {
		const cachedResult = cacheGet(classList);
		if (cachedResult) return cachedResult;
		const result = mergeClassList(classList, configUtils);
		cacheSet(classList, result);
		return result;
	};
	functionToCall = initTailwindMerge;
	return (...args) => functionToCall(twJoin(...args));
};
var fallbackThemeArr = [];
var fromTheme = (key) => {
	const themeGetter = (theme) => theme[key] || fallbackThemeArr;
	themeGetter.isThemeGetter = true;
	return themeGetter;
};
var arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
var arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
var fractionRegex = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/;
var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
var isFraction = (value) => fractionRegex.test(value);
var isNumber = (value) => !!value && !Number.isNaN(Number(value));
var isInteger = (value) => !!value && Number.isInteger(Number(value));
var isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
var isTshirtSize = (value) => tshirtUnitRegex.test(value);
var isAny = () => true;
var isLengthOnly = (value) => lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
var isNever = () => false;
var isShadow = (value) => shadowRegex.test(value);
var isImage = (value) => imageRegex.test(value);
var isAnyNonArbitrary = (value) => !isArbitraryValue(value) && !isArbitraryVariable(value);
var isNamedContainerQuery = (value) => value.startsWith("@container") && (value[10] === "/" && value[11] !== void 0 || value[11] === "s" && value[16] !== void 0 && value.startsWith("-size/", 10) || value[11] === "n" && value[18] !== void 0 && value.startsWith("-normal/", 10));
var isArbitrarySize = (value) => getIsArbitraryValue(value, isLabelSize, isNever);
var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
var isArbitraryLength = (value) => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
var isArbitraryNumber = (value) => getIsArbitraryValue(value, isLabelNumber, isNumber);
var isArbitraryWeight = (value) => getIsArbitraryValue(value, isLabelWeight, isAny);
var isArbitraryFamilyName = (value) => getIsArbitraryValue(value, isLabelFamilyName, isNever);
var isArbitraryPosition = (value) => getIsArbitraryValue(value, isLabelPosition, isNever);
var isArbitraryImage = (value) => getIsArbitraryValue(value, isLabelImage, isImage);
var isArbitraryShadow = (value) => getIsArbitraryValue(value, isLabelShadow, isShadow);
var isArbitraryVariable = (value) => arbitraryVariableRegex.test(value);
var isArbitraryVariableLength = (value) => getIsArbitraryVariable(value, isLabelLength);
var isArbitraryVariableFamilyName = (value) => getIsArbitraryVariable(value, isLabelFamilyName);
var isArbitraryVariablePosition = (value) => getIsArbitraryVariable(value, isLabelPosition);
var isArbitraryVariableSize = (value) => getIsArbitraryVariable(value, isLabelSize);
var isArbitraryVariableImage = (value) => getIsArbitraryVariable(value, isLabelImage);
var isArbitraryVariableShadow = (value) => getIsArbitraryVariable(value, isLabelShadow, true);
var isArbitraryVariableWeight = (value) => getIsArbitraryVariable(value, isLabelWeight, true);
var getIsArbitraryValue = (value, testLabel, testValue) => {
	const result = arbitraryValueRegex.exec(value);
	if (result) {
		if (result[1]) return testLabel(result[1]);
		return testValue(result[2]);
	}
	return false;
};
var getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
	const result = arbitraryVariableRegex.exec(value);
	if (result) {
		if (result[1]) return testLabel(result[1]);
		return shouldMatchNoLabel;
	}
	return false;
};
var isLabelPosition = (label) => label === "position" || label === "percentage";
var isLabelImage = (label) => label === "image" || label === "url";
var isLabelSize = (label) => label === "length" || label === "size" || label === "bg-size";
var isLabelLength = (label) => label === "length";
var isLabelNumber = (label) => label === "number";
var isLabelFamilyName = (label) => label === "family-name";
var isLabelWeight = (label) => label === "number" || label === "weight";
var isLabelShadow = (label) => label === "shadow";
var getDefaultConfig = () => {
	/**
	* Theme getters for theme variable namespaces
	* @see https://tailwindcss.com/docs/theme#theme-variable-namespaces
	*/
	const themeColor = fromTheme("color");
	const themeFont = fromTheme("font");
	const themeText = fromTheme("text");
	const themeFontWeight = fromTheme("font-weight");
	const themeTracking = fromTheme("tracking");
	const themeLeading = fromTheme("leading");
	const themeBreakpoint = fromTheme("breakpoint");
	const themeContainer = fromTheme("container");
	const themeSpacing = fromTheme("spacing");
	const themeRadius = fromTheme("radius");
	const themeShadow = fromTheme("shadow");
	const themeInsetShadow = fromTheme("inset-shadow");
	const themeTextShadow = fromTheme("text-shadow");
	const themeDropShadow = fromTheme("drop-shadow");
	const themeBlur = fromTheme("blur");
	const themePerspective = fromTheme("perspective");
	const themeAspect = fromTheme("aspect");
	const themeEase = fromTheme("ease");
	const themeAnimate = fromTheme("animate");
	/**
	* Helpers to avoid repeating the same scales
	*
	* We use functions that create a new array every time they're called instead of static arrays.
	* This ensures that users who modify any scale by mutating the array (e.g. with `array.push(element)`) don't accidentally mutate arrays in other parts of the config.
	*/
	const scaleBreak = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	];
	const scalePosition = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	];
	const scalePositionWithArbitrary = () => [
		...scalePosition(),
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleOverflow = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	];
	const scaleOverscroll = () => [
		"auto",
		"contain",
		"none"
	];
	const scaleUnambiguousSpacing = () => [
		isArbitraryVariable,
		isArbitraryValue,
		themeSpacing
	];
	const scaleInset = () => [
		isFraction,
		"full",
		"auto",
		...scaleUnambiguousSpacing()
	];
	const scaleGridTemplateColsRows = () => [
		isInteger,
		"none",
		"subgrid",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridColRowStartAndEnd = () => [
		"auto",
		{ span: [
			"full",
			isInteger,
			isArbitraryVariable,
			isArbitraryValue
		] },
		isInteger,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridColRowStartOrEnd = () => [
		isInteger,
		"auto",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridAutoColsRows = () => [
		"auto",
		"min",
		"max",
		"fr",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleAlignPrimaryAxis = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	];
	const scaleAlignSecondaryAxis = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	];
	const scaleMargin = () => ["auto", ...scaleUnambiguousSpacing()];
	const scaleSizing = () => [
		isFraction,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleSizingInline = () => [
		isFraction,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleSizingBlock = () => [
		isFraction,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleColor = () => [
		themeColor,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleBgPosition = () => [
		...scalePosition(),
		isArbitraryVariablePosition,
		isArbitraryPosition,
		{ position: [isArbitraryVariable, isArbitraryValue] }
	];
	const scaleBgRepeat = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }];
	const scaleBgSize = () => [
		"auto",
		"cover",
		"contain",
		isArbitraryVariableSize,
		isArbitrarySize,
		{ size: [isArbitraryVariable, isArbitraryValue] }
	];
	const scaleGradientStopPosition = () => [
		isPercent,
		isArbitraryVariableLength,
		isArbitraryLength
	];
	const scaleRadius = () => [
		"",
		"none",
		"full",
		themeRadius,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleBorderWidth = () => [
		"",
		isNumber,
		isArbitraryVariableLength,
		isArbitraryLength
	];
	const scaleLineStyle = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	];
	const scaleBlendMode = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	];
	const scaleMaskImagePosition = () => [
		isNumber,
		isPercent,
		isArbitraryVariablePosition,
		isArbitraryPosition
	];
	const scaleBlur = () => [
		"",
		"none",
		themeBlur,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleRotate = () => [
		"none",
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleScale = () => [
		"none",
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleSkew = () => [
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleTranslate = () => [
		isFraction,
		"full",
		...scaleUnambiguousSpacing()
	];
	return {
		cacheSize: 500,
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [isTshirtSize],
			breakpoint: [isTshirtSize],
			color: [isAny],
			container: [isTshirtSize],
			"drop-shadow": [isTshirtSize],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [isAnyNonArbitrary],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [isTshirtSize],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [isTshirtSize],
			shadow: [isTshirtSize],
			spacing: ["px", isNumber],
			text: [isTshirtSize],
			"text-shadow": [isTshirtSize],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			/**
			* Aspect Ratio
			* @see https://tailwindcss.com/docs/aspect-ratio
			*/
			aspect: [{ aspect: [
				"auto",
				"square",
				isFraction,
				isArbitraryValue,
				isArbitraryVariable,
				themeAspect
			] }],
			/**
			* Container
			* @see https://tailwindcss.com/docs/container
			* @deprecated since Tailwind CSS v4.0.0
			*/
			container: ["container"],
			/**
			* Container Type
			* @see https://tailwindcss.com/docs/responsive-design#container-queries
			*/
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Container Name
			* @see https://tailwindcss.com/docs/responsive-design#named-containers
			*/
			"container-named": [isNamedContainerQuery],
			/**
			* Columns
			* @see https://tailwindcss.com/docs/columns
			*/
			columns: [{ columns: [
				isNumber,
				isArbitraryValue,
				isArbitraryVariable,
				themeContainer
			] }],
			/**
			* Break After
			* @see https://tailwindcss.com/docs/break-after
			*/
			"break-after": [{ "break-after": scaleBreak() }],
			/**
			* Break Before
			* @see https://tailwindcss.com/docs/break-before
			*/
			"break-before": [{ "break-before": scaleBreak() }],
			/**
			* Break Inside
			* @see https://tailwindcss.com/docs/break-inside
			*/
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			/**
			* Box Decoration Break
			* @see https://tailwindcss.com/docs/box-decoration-break
			*/
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			/**
			* Box Sizing
			* @see https://tailwindcss.com/docs/box-sizing
			*/
			box: [{ box: ["border", "content"] }],
			/**
			* Display
			* @see https://tailwindcss.com/docs/display
			*/
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			/**
			* Screen Reader Only
			* @see https://tailwindcss.com/docs/display#screen-reader-only
			*/
			sr: ["sr-only", "not-sr-only"],
			/**
			* Floats
			* @see https://tailwindcss.com/docs/float
			*/
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			/**
			* Clear
			* @see https://tailwindcss.com/docs/clear
			*/
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			/**
			* Isolation
			* @see https://tailwindcss.com/docs/isolation
			*/
			isolation: ["isolate", "isolation-auto"],
			/**
			* Object Fit
			* @see https://tailwindcss.com/docs/object-fit
			*/
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			/**
			* Object Position
			* @see https://tailwindcss.com/docs/object-position
			*/
			"object-position": [{ object: scalePositionWithArbitrary() }],
			/**
			* Overflow
			* @see https://tailwindcss.com/docs/overflow
			*/
			overflow: [{ overflow: scaleOverflow() }],
			/**
			* Overflow X
			* @see https://tailwindcss.com/docs/overflow
			*/
			"overflow-x": [{ "overflow-x": scaleOverflow() }],
			/**
			* Overflow Y
			* @see https://tailwindcss.com/docs/overflow
			*/
			"overflow-y": [{ "overflow-y": scaleOverflow() }],
			/**
			* Overscroll Behavior
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			overscroll: [{ overscroll: scaleOverscroll() }],
			/**
			* Overscroll Behavior X
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			"overscroll-x": [{ "overscroll-x": scaleOverscroll() }],
			/**
			* Overscroll Behavior Y
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			"overscroll-y": [{ "overscroll-y": scaleOverscroll() }],
			/**
			* Position
			* @see https://tailwindcss.com/docs/position
			*/
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			/**
			* Inset
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			inset: [{ inset: scaleInset() }],
			/**
			* Inset Inline
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-x": [{ "inset-x": scaleInset() }],
			/**
			* Inset Block
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-y": [{ "inset-y": scaleInset() }],
			/**
			* Inset Inline Start
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			* @todo class group will be renamed to `inset-s` in next major release
			*/
			start: [{
				"inset-s": scaleInset(),
				/**
				* @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
				* @see https://github.com/tailwindlabs/tailwindcss/pull/19613
				*/
				start: scaleInset()
			}],
			/**
			* Inset Inline End
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			* @todo class group will be renamed to `inset-e` in next major release
			*/
			end: [{
				"inset-e": scaleInset(),
				/**
				* @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
				* @see https://github.com/tailwindlabs/tailwindcss/pull/19613
				*/
				end: scaleInset()
			}],
			/**
			* Inset Block Start
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-bs": [{ "inset-bs": scaleInset() }],
			/**
			* Inset Block End
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-be": [{ "inset-be": scaleInset() }],
			/**
			* Top
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			top: [{ top: scaleInset() }],
			/**
			* Right
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			right: [{ right: scaleInset() }],
			/**
			* Bottom
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			bottom: [{ bottom: scaleInset() }],
			/**
			* Left
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			left: [{ left: scaleInset() }],
			/**
			* Visibility
			* @see https://tailwindcss.com/docs/visibility
			*/
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			/**
			* Z-Index
			* @see https://tailwindcss.com/docs/z-index
			*/
			z: [{ z: [
				isInteger,
				"auto",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Flex Basis
			* @see https://tailwindcss.com/docs/flex-basis
			*/
			basis: [{ basis: [
				isFraction,
				"full",
				"auto",
				themeContainer,
				...scaleUnambiguousSpacing()
			] }],
			/**
			* Flex Direction
			* @see https://tailwindcss.com/docs/flex-direction
			*/
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			/**
			* Flex Wrap
			* @see https://tailwindcss.com/docs/flex-wrap
			*/
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			/**
			* Flex
			* @see https://tailwindcss.com/docs/flex
			*/
			flex: [{ flex: [
				isNumber,
				isFraction,
				"auto",
				"initial",
				"none",
				isArbitraryValue
			] }],
			/**
			* Flex Grow
			* @see https://tailwindcss.com/docs/flex-grow
			*/
			grow: [{ grow: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Flex Shrink
			* @see https://tailwindcss.com/docs/flex-shrink
			*/
			shrink: [{ shrink: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Order
			* @see https://tailwindcss.com/docs/order
			*/
			order: [{ order: [
				isInteger,
				"first",
				"last",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Grid Template Columns
			* @see https://tailwindcss.com/docs/grid-template-columns
			*/
			"grid-cols": [{ "grid-cols": scaleGridTemplateColsRows() }],
			/**
			* Grid Column Start / End
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-start-end": [{ col: scaleGridColRowStartAndEnd() }],
			/**
			* Grid Column Start
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-start": [{ "col-start": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Column End
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-end": [{ "col-end": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Template Rows
			* @see https://tailwindcss.com/docs/grid-template-rows
			*/
			"grid-rows": [{ "grid-rows": scaleGridTemplateColsRows() }],
			/**
			* Grid Row Start / End
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-start-end": [{ row: scaleGridColRowStartAndEnd() }],
			/**
			* Grid Row Start
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-start": [{ "row-start": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Row End
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-end": [{ "row-end": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Auto Flow
			* @see https://tailwindcss.com/docs/grid-auto-flow
			*/
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			/**
			* Grid Auto Columns
			* @see https://tailwindcss.com/docs/grid-auto-columns
			*/
			"auto-cols": [{ "auto-cols": scaleGridAutoColsRows() }],
			/**
			* Grid Auto Rows
			* @see https://tailwindcss.com/docs/grid-auto-rows
			*/
			"auto-rows": [{ "auto-rows": scaleGridAutoColsRows() }],
			/**
			* Gap
			* @see https://tailwindcss.com/docs/gap
			*/
			gap: [{ gap: scaleUnambiguousSpacing() }],
			/**
			* Gap X
			* @see https://tailwindcss.com/docs/gap
			*/
			"gap-x": [{ "gap-x": scaleUnambiguousSpacing() }],
			/**
			* Gap Y
			* @see https://tailwindcss.com/docs/gap
			*/
			"gap-y": [{ "gap-y": scaleUnambiguousSpacing() }],
			/**
			* Justify Content
			* @see https://tailwindcss.com/docs/justify-content
			*/
			"justify-content": [{ justify: [...scaleAlignPrimaryAxis(), "normal"] }],
			/**
			* Justify Items
			* @see https://tailwindcss.com/docs/justify-items
			*/
			"justify-items": [{ "justify-items": [...scaleAlignSecondaryAxis(), "normal"] }],
			/**
			* Justify Self
			* @see https://tailwindcss.com/docs/justify-self
			*/
			"justify-self": [{ "justify-self": ["auto", ...scaleAlignSecondaryAxis()] }],
			/**
			* Align Content
			* @see https://tailwindcss.com/docs/align-content
			*/
			"align-content": [{ content: ["normal", ...scaleAlignPrimaryAxis()] }],
			/**
			* Align Items
			* @see https://tailwindcss.com/docs/align-items
			*/
			"align-items": [{ items: [...scaleAlignSecondaryAxis(), { baseline: ["", "last"] }] }],
			/**
			* Align Self
			* @see https://tailwindcss.com/docs/align-self
			*/
			"align-self": [{ self: [
				"auto",
				...scaleAlignSecondaryAxis(),
				{ baseline: ["", "last"] }
			] }],
			/**
			* Place Content
			* @see https://tailwindcss.com/docs/place-content
			*/
			"place-content": [{ "place-content": scaleAlignPrimaryAxis() }],
			/**
			* Place Items
			* @see https://tailwindcss.com/docs/place-items
			*/
			"place-items": [{ "place-items": [...scaleAlignSecondaryAxis(), "baseline"] }],
			/**
			* Place Self
			* @see https://tailwindcss.com/docs/place-self
			*/
			"place-self": [{ "place-self": ["auto", ...scaleAlignSecondaryAxis()] }],
			/**
			* Padding
			* @see https://tailwindcss.com/docs/padding
			*/
			p: [{ p: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline
			* @see https://tailwindcss.com/docs/padding
			*/
			px: [{ px: scaleUnambiguousSpacing() }],
			/**
			* Padding Block
			* @see https://tailwindcss.com/docs/padding
			*/
			py: [{ py: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline Start
			* @see https://tailwindcss.com/docs/padding
			*/
			ps: [{ ps: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline End
			* @see https://tailwindcss.com/docs/padding
			*/
			pe: [{ pe: scaleUnambiguousSpacing() }],
			/**
			* Padding Block Start
			* @see https://tailwindcss.com/docs/padding
			*/
			pbs: [{ pbs: scaleUnambiguousSpacing() }],
			/**
			* Padding Block End
			* @see https://tailwindcss.com/docs/padding
			*/
			pbe: [{ pbe: scaleUnambiguousSpacing() }],
			/**
			* Padding Top
			* @see https://tailwindcss.com/docs/padding
			*/
			pt: [{ pt: scaleUnambiguousSpacing() }],
			/**
			* Padding Right
			* @see https://tailwindcss.com/docs/padding
			*/
			pr: [{ pr: scaleUnambiguousSpacing() }],
			/**
			* Padding Bottom
			* @see https://tailwindcss.com/docs/padding
			*/
			pb: [{ pb: scaleUnambiguousSpacing() }],
			/**
			* Padding Left
			* @see https://tailwindcss.com/docs/padding
			*/
			pl: [{ pl: scaleUnambiguousSpacing() }],
			/**
			* Margin
			* @see https://tailwindcss.com/docs/margin
			*/
			m: [{ m: scaleMargin() }],
			/**
			* Margin Inline
			* @see https://tailwindcss.com/docs/margin
			*/
			mx: [{ mx: scaleMargin() }],
			/**
			* Margin Block
			* @see https://tailwindcss.com/docs/margin
			*/
			my: [{ my: scaleMargin() }],
			/**
			* Margin Inline Start
			* @see https://tailwindcss.com/docs/margin
			*/
			ms: [{ ms: scaleMargin() }],
			/**
			* Margin Inline End
			* @see https://tailwindcss.com/docs/margin
			*/
			me: [{ me: scaleMargin() }],
			/**
			* Margin Block Start
			* @see https://tailwindcss.com/docs/margin
			*/
			mbs: [{ mbs: scaleMargin() }],
			/**
			* Margin Block End
			* @see https://tailwindcss.com/docs/margin
			*/
			mbe: [{ mbe: scaleMargin() }],
			/**
			* Margin Top
			* @see https://tailwindcss.com/docs/margin
			*/
			mt: [{ mt: scaleMargin() }],
			/**
			* Margin Right
			* @see https://tailwindcss.com/docs/margin
			*/
			mr: [{ mr: scaleMargin() }],
			/**
			* Margin Bottom
			* @see https://tailwindcss.com/docs/margin
			*/
			mb: [{ mb: scaleMargin() }],
			/**
			* Margin Left
			* @see https://tailwindcss.com/docs/margin
			*/
			ml: [{ ml: scaleMargin() }],
			/**
			* Space Between X
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-x": [{ "space-x": scaleUnambiguousSpacing() }],
			/**
			* Space Between X Reverse
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-x-reverse": ["space-x-reverse"],
			/**
			* Space Between Y
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-y": [{ "space-y": scaleUnambiguousSpacing() }],
			/**
			* Space Between Y Reverse
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-y-reverse": ["space-y-reverse"],
			/**
			* Size
			* @see https://tailwindcss.com/docs/width#setting-both-width-and-height
			*/
			size: [{ size: scaleSizing() }],
			/**
			* Inline Size
			* @see https://tailwindcss.com/docs/width
			*/
			"inline-size": [{ inline: ["auto", ...scaleSizingInline()] }],
			/**
			* Min-Inline Size
			* @see https://tailwindcss.com/docs/min-width
			*/
			"min-inline-size": [{ "min-inline": ["auto", ...scaleSizingInline()] }],
			/**
			* Max-Inline Size
			* @see https://tailwindcss.com/docs/max-width
			*/
			"max-inline-size": [{ "max-inline": ["none", ...scaleSizingInline()] }],
			/**
			* Block Size
			* @see https://tailwindcss.com/docs/height
			*/
			"block-size": [{ block: ["auto", ...scaleSizingBlock()] }],
			/**
			* Min-Block Size
			* @see https://tailwindcss.com/docs/min-height
			*/
			"min-block-size": [{ "min-block": ["auto", ...scaleSizingBlock()] }],
			/**
			* Max-Block Size
			* @see https://tailwindcss.com/docs/max-height
			*/
			"max-block-size": [{ "max-block": ["none", ...scaleSizingBlock()] }],
			/**
			* Width
			* @see https://tailwindcss.com/docs/width
			*/
			w: [{ w: [
				themeContainer,
				"screen",
				...scaleSizing()
			] }],
			/**
			* Min-Width
			* @see https://tailwindcss.com/docs/min-width
			*/
			"min-w": [{ "min-w": [
				themeContainer,
				"screen",
				"none",
				...scaleSizing()
			] }],
			/**
			* Max-Width
			* @see https://tailwindcss.com/docs/max-width
			*/
			"max-w": [{ "max-w": [
				themeContainer,
				"screen",
				"none",
				"prose",
				{ screen: [themeBreakpoint] },
				...scaleSizing()
			] }],
			/**
			* Height
			* @see https://tailwindcss.com/docs/height
			*/
			h: [{ h: [
				"screen",
				"lh",
				...scaleSizing()
			] }],
			/**
			* Min-Height
			* @see https://tailwindcss.com/docs/min-height
			*/
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...scaleSizing()
			] }],
			/**
			* Max-Height
			* @see https://tailwindcss.com/docs/max-height
			*/
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				...scaleSizing()
			] }],
			/**
			* Font Size
			* @see https://tailwindcss.com/docs/font-size
			*/
			"font-size": [{ text: [
				"base",
				themeText,
				isArbitraryVariableLength,
				isArbitraryLength
			] }],
			/**
			* Font Smoothing
			* @see https://tailwindcss.com/docs/font-smoothing
			*/
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			/**
			* Font Style
			* @see https://tailwindcss.com/docs/font-style
			*/
			"font-style": ["italic", "not-italic"],
			/**
			* Font Weight
			* @see https://tailwindcss.com/docs/font-weight
			*/
			"font-weight": [{ font: [
				themeFontWeight,
				isArbitraryVariableWeight,
				isArbitraryWeight
			] }],
			/**
			* Font Stretch
			* @see https://tailwindcss.com/docs/font-stretch
			*/
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				isPercent,
				isArbitraryValue
			] }],
			/**
			* Font Family
			* @see https://tailwindcss.com/docs/font-family
			*/
			"font-family": [{ font: [
				isArbitraryVariableFamilyName,
				isArbitraryFamilyName,
				themeFont
			] }],
			/**
			* Font Feature Settings
			* @see https://tailwindcss.com/docs/font-feature-settings
			*/
			"font-features": [{ "font-features": [isArbitraryValue] }],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-normal": ["normal-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-ordinal": ["ordinal"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-slashed-zero": ["slashed-zero"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			/**
			* Letter Spacing
			* @see https://tailwindcss.com/docs/letter-spacing
			*/
			tracking: [{ tracking: [
				themeTracking,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Line Clamp
			* @see https://tailwindcss.com/docs/line-clamp
			*/
			"line-clamp": [{ "line-clamp": [
				isNumber,
				"none",
				isArbitraryVariable,
				isArbitraryNumber
			] }],
			/**
			* Line Height
			* @see https://tailwindcss.com/docs/line-height
			*/
			leading: [{ leading: [themeLeading, ...scaleUnambiguousSpacing()] }],
			/**
			* List Style Image
			* @see https://tailwindcss.com/docs/list-style-image
			*/
			"list-image": [{ "list-image": [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* List Style Position
			* @see https://tailwindcss.com/docs/list-style-position
			*/
			"list-style-position": [{ list: ["inside", "outside"] }],
			/**
			* List Style Type
			* @see https://tailwindcss.com/docs/list-style-type
			*/
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Text Alignment
			* @see https://tailwindcss.com/docs/text-align
			*/
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			/**
			* Placeholder Color
			* @deprecated since Tailwind CSS v3.0.0
			* @see https://v3.tailwindcss.com/docs/placeholder-color
			*/
			"placeholder-color": [{ placeholder: scaleColor() }],
			/**
			* Text Color
			* @see https://tailwindcss.com/docs/text-color
			*/
			"text-color": [{ text: scaleColor() }],
			/**
			* Text Decoration
			* @see https://tailwindcss.com/docs/text-decoration
			*/
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			/**
			* Text Decoration Style
			* @see https://tailwindcss.com/docs/text-decoration-style
			*/
			"text-decoration-style": [{ decoration: [...scaleLineStyle(), "wavy"] }],
			/**
			* Text Decoration Thickness
			* @see https://tailwindcss.com/docs/text-decoration-thickness
			*/
			"text-decoration-thickness": [{ decoration: [
				isNumber,
				"from-font",
				"auto",
				isArbitraryVariable,
				isArbitraryLength
			] }],
			/**
			* Text Decoration Color
			* @see https://tailwindcss.com/docs/text-decoration-color
			*/
			"text-decoration-color": [{ decoration: scaleColor() }],
			/**
			* Text Underline Offset
			* @see https://tailwindcss.com/docs/text-underline-offset
			*/
			"underline-offset": [{ "underline-offset": [
				isNumber,
				"auto",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Text Transform
			* @see https://tailwindcss.com/docs/text-transform
			*/
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			/**
			* Text Overflow
			* @see https://tailwindcss.com/docs/text-overflow
			*/
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			/**
			* Text Wrap
			* @see https://tailwindcss.com/docs/text-wrap
			*/
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			/**
			* Text Indent
			* @see https://tailwindcss.com/docs/text-indent
			*/
			indent: [{ indent: scaleUnambiguousSpacing() }],
			/**
			* Tab Size
			* @see https://tailwindcss.com/docs/tab-size
			*/
			"tab-size": [{ tab: [
				isInteger,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Vertical Alignment
			* @see https://tailwindcss.com/docs/vertical-align
			*/
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Whitespace
			* @see https://tailwindcss.com/docs/whitespace
			*/
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			/**
			* Word Break
			* @see https://tailwindcss.com/docs/word-break
			*/
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			/**
			* Overflow Wrap
			* @see https://tailwindcss.com/docs/overflow-wrap
			*/
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			/**
			* Hyphens
			* @see https://tailwindcss.com/docs/hyphens
			*/
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			/**
			* Content
			* @see https://tailwindcss.com/docs/content
			*/
			content: [{ content: [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Background Attachment
			* @see https://tailwindcss.com/docs/background-attachment
			*/
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			/**
			* Background Clip
			* @see https://tailwindcss.com/docs/background-clip
			*/
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			/**
			* Background Origin
			* @see https://tailwindcss.com/docs/background-origin
			*/
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			/**
			* Background Position
			* @see https://tailwindcss.com/docs/background-position
			*/
			"bg-position": [{ bg: scaleBgPosition() }],
			/**
			* Background Repeat
			* @see https://tailwindcss.com/docs/background-repeat
			*/
			"bg-repeat": [{ bg: scaleBgRepeat() }],
			/**
			* Background Size
			* @see https://tailwindcss.com/docs/background-size
			*/
			"bg-size": [{ bg: scaleBgSize() }],
			/**
			* Background Image
			* @see https://tailwindcss.com/docs/background-image
			*/
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						isInteger,
						isArbitraryVariable,
						isArbitraryValue
					],
					radial: [
						"",
						isArbitraryVariable,
						isArbitraryValue
					],
					conic: [
						isInteger,
						isArbitraryVariable,
						isArbitraryValue
					]
				},
				isArbitraryVariableImage,
				isArbitraryImage
			] }],
			/**
			* Background Color
			* @see https://tailwindcss.com/docs/background-color
			*/
			"bg-color": [{ bg: scaleColor() }],
			/**
			* Gradient Color Stops From Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-from-pos": [{ from: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops Via Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-via-pos": [{ via: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops To Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-to-pos": [{ to: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops From
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-from": [{ from: scaleColor() }],
			/**
			* Gradient Color Stops Via
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-via": [{ via: scaleColor() }],
			/**
			* Gradient Color Stops To
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-to": [{ to: scaleColor() }],
			/**
			* Border Radius
			* @see https://tailwindcss.com/docs/border-radius
			*/
			rounded: [{ rounded: scaleRadius() }],
			/**
			* Border Radius Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-s": [{ "rounded-s": scaleRadius() }],
			/**
			* Border Radius End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-e": [{ "rounded-e": scaleRadius() }],
			/**
			* Border Radius Top
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-t": [{ "rounded-t": scaleRadius() }],
			/**
			* Border Radius Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-r": [{ "rounded-r": scaleRadius() }],
			/**
			* Border Radius Bottom
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-b": [{ "rounded-b": scaleRadius() }],
			/**
			* Border Radius Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-l": [{ "rounded-l": scaleRadius() }],
			/**
			* Border Radius Start Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-ss": [{ "rounded-ss": scaleRadius() }],
			/**
			* Border Radius Start End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-se": [{ "rounded-se": scaleRadius() }],
			/**
			* Border Radius End End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-ee": [{ "rounded-ee": scaleRadius() }],
			/**
			* Border Radius End Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-es": [{ "rounded-es": scaleRadius() }],
			/**
			* Border Radius Top Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-tl": [{ "rounded-tl": scaleRadius() }],
			/**
			* Border Radius Top Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-tr": [{ "rounded-tr": scaleRadius() }],
			/**
			* Border Radius Bottom Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-br": [{ "rounded-br": scaleRadius() }],
			/**
			* Border Radius Bottom Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-bl": [{ "rounded-bl": scaleRadius() }],
			/**
			* Border Width
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w": [{ border: scaleBorderWidth() }],
			/**
			* Border Width Inline
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-x": [{ "border-x": scaleBorderWidth() }],
			/**
			* Border Width Block
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-y": [{ "border-y": scaleBorderWidth() }],
			/**
			* Border Width Inline Start
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-s": [{ "border-s": scaleBorderWidth() }],
			/**
			* Border Width Inline End
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-e": [{ "border-e": scaleBorderWidth() }],
			/**
			* Border Width Block Start
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-bs": [{ "border-bs": scaleBorderWidth() }],
			/**
			* Border Width Block End
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-be": [{ "border-be": scaleBorderWidth() }],
			/**
			* Border Width Top
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-t": [{ "border-t": scaleBorderWidth() }],
			/**
			* Border Width Right
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-r": [{ "border-r": scaleBorderWidth() }],
			/**
			* Border Width Bottom
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-b": [{ "border-b": scaleBorderWidth() }],
			/**
			* Border Width Left
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-l": [{ "border-l": scaleBorderWidth() }],
			/**
			* Divide Width X
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-x": [{ "divide-x": scaleBorderWidth() }],
			/**
			* Divide Width X Reverse
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-x-reverse": ["divide-x-reverse"],
			/**
			* Divide Width Y
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-y": [{ "divide-y": scaleBorderWidth() }],
			/**
			* Divide Width Y Reverse
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-y-reverse": ["divide-y-reverse"],
			/**
			* Border Style
			* @see https://tailwindcss.com/docs/border-style
			*/
			"border-style": [{ border: [
				...scaleLineStyle(),
				"hidden",
				"none"
			] }],
			/**
			* Divide Style
			* @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
			*/
			"divide-style": [{ divide: [
				...scaleLineStyle(),
				"hidden",
				"none"
			] }],
			/**
			* Border Color
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color": [{ border: scaleColor() }],
			/**
			* Border Color Inline
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-x": [{ "border-x": scaleColor() }],
			/**
			* Border Color Block
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-y": [{ "border-y": scaleColor() }],
			/**
			* Border Color Inline Start
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-s": [{ "border-s": scaleColor() }],
			/**
			* Border Color Inline End
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-e": [{ "border-e": scaleColor() }],
			/**
			* Border Color Block Start
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-bs": [{ "border-bs": scaleColor() }],
			/**
			* Border Color Block End
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-be": [{ "border-be": scaleColor() }],
			/**
			* Border Color Top
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-t": [{ "border-t": scaleColor() }],
			/**
			* Border Color Right
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-r": [{ "border-r": scaleColor() }],
			/**
			* Border Color Bottom
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-b": [{ "border-b": scaleColor() }],
			/**
			* Border Color Left
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-l": [{ "border-l": scaleColor() }],
			/**
			* Divide Color
			* @see https://tailwindcss.com/docs/divide-color
			*/
			"divide-color": [{ divide: scaleColor() }],
			/**
			* Outline Style
			* @see https://tailwindcss.com/docs/outline-style
			*/
			"outline-style": [{ outline: [
				...scaleLineStyle(),
				"none",
				"hidden"
			] }],
			/**
			* Outline Offset
			* @see https://tailwindcss.com/docs/outline-offset
			*/
			"outline-offset": [{ "outline-offset": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Outline Width
			* @see https://tailwindcss.com/docs/outline-width
			*/
			"outline-w": [{ outline: [
				"",
				isNumber,
				isArbitraryVariableLength,
				isArbitraryLength
			] }],
			/**
			* Outline Color
			* @see https://tailwindcss.com/docs/outline-color
			*/
			"outline-color": [{ outline: scaleColor() }],
			/**
			* Box Shadow
			* @see https://tailwindcss.com/docs/box-shadow
			*/
			shadow: [{ shadow: [
				"",
				"none",
				themeShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Box Shadow Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
			*/
			"shadow-color": [{ shadow: scaleColor() }],
			/**
			* Inset Box Shadow
			* @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
			*/
			"inset-shadow": [{ "inset-shadow": [
				"none",
				themeInsetShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Inset Box Shadow Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
			*/
			"inset-shadow-color": [{ "inset-shadow": scaleColor() }],
			/**
			* Ring Width
			* @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
			*/
			"ring-w": [{ ring: scaleBorderWidth() }],
			/**
			* Ring Width Inset
			* @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-w-inset": ["ring-inset"],
			/**
			* Ring Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
			*/
			"ring-color": [{ ring: scaleColor() }],
			/**
			* Ring Offset Width
			* @see https://v3.tailwindcss.com/docs/ring-offset-width
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-offset-w": [{ "ring-offset": [isNumber, isArbitraryLength] }],
			/**
			* Ring Offset Color
			* @see https://v3.tailwindcss.com/docs/ring-offset-color
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-offset-color": [{ "ring-offset": scaleColor() }],
			/**
			* Inset Ring Width
			* @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
			*/
			"inset-ring-w": [{ "inset-ring": scaleBorderWidth() }],
			/**
			* Inset Ring Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
			*/
			"inset-ring-color": [{ "inset-ring": scaleColor() }],
			/**
			* Text Shadow
			* @see https://tailwindcss.com/docs/text-shadow
			*/
			"text-shadow": [{ "text-shadow": [
				"none",
				themeTextShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Text Shadow Color
			* @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
			*/
			"text-shadow-color": [{ "text-shadow": scaleColor() }],
			/**
			* Opacity
			* @see https://tailwindcss.com/docs/opacity
			*/
			opacity: [{ opacity: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Mix Blend Mode
			* @see https://tailwindcss.com/docs/mix-blend-mode
			*/
			"mix-blend": [{ "mix-blend": [
				...scaleBlendMode(),
				"plus-darker",
				"plus-lighter"
			] }],
			/**
			* Background Blend Mode
			* @see https://tailwindcss.com/docs/background-blend-mode
			*/
			"bg-blend": [{ "bg-blend": scaleBlendMode() }],
			/**
			* Mask Clip
			* @see https://tailwindcss.com/docs/mask-clip
			*/
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			/**
			* Mask Composite
			* @see https://tailwindcss.com/docs/mask-composite
			*/
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			/**
			* Mask Image
			* @see https://tailwindcss.com/docs/mask-image
			*/
			"mask-image-linear-pos": [{ "mask-linear": [isNumber] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": scaleMaskImagePosition() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": scaleMaskImagePosition() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": scaleColor() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": scaleColor() }],
			"mask-image-t-from-pos": [{ "mask-t-from": scaleMaskImagePosition() }],
			"mask-image-t-to-pos": [{ "mask-t-to": scaleMaskImagePosition() }],
			"mask-image-t-from-color": [{ "mask-t-from": scaleColor() }],
			"mask-image-t-to-color": [{ "mask-t-to": scaleColor() }],
			"mask-image-r-from-pos": [{ "mask-r-from": scaleMaskImagePosition() }],
			"mask-image-r-to-pos": [{ "mask-r-to": scaleMaskImagePosition() }],
			"mask-image-r-from-color": [{ "mask-r-from": scaleColor() }],
			"mask-image-r-to-color": [{ "mask-r-to": scaleColor() }],
			"mask-image-b-from-pos": [{ "mask-b-from": scaleMaskImagePosition() }],
			"mask-image-b-to-pos": [{ "mask-b-to": scaleMaskImagePosition() }],
			"mask-image-b-from-color": [{ "mask-b-from": scaleColor() }],
			"mask-image-b-to-color": [{ "mask-b-to": scaleColor() }],
			"mask-image-l-from-pos": [{ "mask-l-from": scaleMaskImagePosition() }],
			"mask-image-l-to-pos": [{ "mask-l-to": scaleMaskImagePosition() }],
			"mask-image-l-from-color": [{ "mask-l-from": scaleColor() }],
			"mask-image-l-to-color": [{ "mask-l-to": scaleColor() }],
			"mask-image-x-from-pos": [{ "mask-x-from": scaleMaskImagePosition() }],
			"mask-image-x-to-pos": [{ "mask-x-to": scaleMaskImagePosition() }],
			"mask-image-x-from-color": [{ "mask-x-from": scaleColor() }],
			"mask-image-x-to-color": [{ "mask-x-to": scaleColor() }],
			"mask-image-y-from-pos": [{ "mask-y-from": scaleMaskImagePosition() }],
			"mask-image-y-to-pos": [{ "mask-y-to": scaleMaskImagePosition() }],
			"mask-image-y-from-color": [{ "mask-y-from": scaleColor() }],
			"mask-image-y-to-color": [{ "mask-y-to": scaleColor() }],
			"mask-image-radial": [{ "mask-radial": [isArbitraryVariable, isArbitraryValue] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": scaleMaskImagePosition() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": scaleMaskImagePosition() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": scaleColor() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": scaleColor() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": scalePosition() }],
			"mask-image-conic-pos": [{ "mask-conic": [isNumber] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": scaleMaskImagePosition() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": scaleMaskImagePosition() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": scaleColor() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": scaleColor() }],
			/**
			* Mask Mode
			* @see https://tailwindcss.com/docs/mask-mode
			*/
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			/**
			* Mask Origin
			* @see https://tailwindcss.com/docs/mask-origin
			*/
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			/**
			* Mask Position
			* @see https://tailwindcss.com/docs/mask-position
			*/
			"mask-position": [{ mask: scaleBgPosition() }],
			/**
			* Mask Repeat
			* @see https://tailwindcss.com/docs/mask-repeat
			*/
			"mask-repeat": [{ mask: scaleBgRepeat() }],
			/**
			* Mask Size
			* @see https://tailwindcss.com/docs/mask-size
			*/
			"mask-size": [{ mask: scaleBgSize() }],
			/**
			* Mask Type
			* @see https://tailwindcss.com/docs/mask-type
			*/
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			/**
			* Mask Image
			* @see https://tailwindcss.com/docs/mask-image
			*/
			"mask-image": [{ mask: [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Filter
			* @see https://tailwindcss.com/docs/filter
			*/
			filter: [{ filter: [
				"",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Blur
			* @see https://tailwindcss.com/docs/blur
			*/
			blur: [{ blur: scaleBlur() }],
			/**
			* Brightness
			* @see https://tailwindcss.com/docs/brightness
			*/
			brightness: [{ brightness: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Contrast
			* @see https://tailwindcss.com/docs/contrast
			*/
			contrast: [{ contrast: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Drop Shadow
			* @see https://tailwindcss.com/docs/drop-shadow
			*/
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				themeDropShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Drop Shadow Color
			* @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
			*/
			"drop-shadow-color": [{ "drop-shadow": scaleColor() }],
			/**
			* Grayscale
			* @see https://tailwindcss.com/docs/grayscale
			*/
			grayscale: [{ grayscale: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Hue Rotate
			* @see https://tailwindcss.com/docs/hue-rotate
			*/
			"hue-rotate": [{ "hue-rotate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Invert
			* @see https://tailwindcss.com/docs/invert
			*/
			invert: [{ invert: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Saturate
			* @see https://tailwindcss.com/docs/saturate
			*/
			saturate: [{ saturate: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Sepia
			* @see https://tailwindcss.com/docs/sepia
			*/
			sepia: [{ sepia: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Filter
			* @see https://tailwindcss.com/docs/backdrop-filter
			*/
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Blur
			* @see https://tailwindcss.com/docs/backdrop-blur
			*/
			"backdrop-blur": [{ "backdrop-blur": scaleBlur() }],
			/**
			* Backdrop Brightness
			* @see https://tailwindcss.com/docs/backdrop-brightness
			*/
			"backdrop-brightness": [{ "backdrop-brightness": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Contrast
			* @see https://tailwindcss.com/docs/backdrop-contrast
			*/
			"backdrop-contrast": [{ "backdrop-contrast": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Grayscale
			* @see https://tailwindcss.com/docs/backdrop-grayscale
			*/
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Hue Rotate
			* @see https://tailwindcss.com/docs/backdrop-hue-rotate
			*/
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Invert
			* @see https://tailwindcss.com/docs/backdrop-invert
			*/
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Opacity
			* @see https://tailwindcss.com/docs/backdrop-opacity
			*/
			"backdrop-opacity": [{ "backdrop-opacity": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Saturate
			* @see https://tailwindcss.com/docs/backdrop-saturate
			*/
			"backdrop-saturate": [{ "backdrop-saturate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Sepia
			* @see https://tailwindcss.com/docs/backdrop-sepia
			*/
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Border Collapse
			* @see https://tailwindcss.com/docs/border-collapse
			*/
			"border-collapse": [{ border: ["collapse", "separate"] }],
			/**
			* Border Spacing
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing": [{ "border-spacing": scaleUnambiguousSpacing() }],
			/**
			* Border Spacing X
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing-x": [{ "border-spacing-x": scaleUnambiguousSpacing() }],
			/**
			* Border Spacing Y
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing-y": [{ "border-spacing-y": scaleUnambiguousSpacing() }],
			/**
			* Table Layout
			* @see https://tailwindcss.com/docs/table-layout
			*/
			"table-layout": [{ table: ["auto", "fixed"] }],
			/**
			* Caption Side
			* @see https://tailwindcss.com/docs/caption-side
			*/
			caption: [{ caption: ["top", "bottom"] }],
			/**
			* Transition Property
			* @see https://tailwindcss.com/docs/transition-property
			*/
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Behavior
			* @see https://tailwindcss.com/docs/transition-behavior
			*/
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			/**
			* Transition Duration
			* @see https://tailwindcss.com/docs/transition-duration
			*/
			duration: [{ duration: [
				isNumber,
				"initial",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Timing Function
			* @see https://tailwindcss.com/docs/transition-timing-function
			*/
			ease: [{ ease: [
				"linear",
				"initial",
				themeEase,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Delay
			* @see https://tailwindcss.com/docs/transition-delay
			*/
			delay: [{ delay: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Animation
			* @see https://tailwindcss.com/docs/animation
			*/
			animate: [{ animate: [
				"none",
				themeAnimate,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backface Visibility
			* @see https://tailwindcss.com/docs/backface-visibility
			*/
			backface: [{ backface: ["hidden", "visible"] }],
			/**
			* Perspective
			* @see https://tailwindcss.com/docs/perspective
			*/
			perspective: [{ perspective: [
				themePerspective,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Perspective Origin
			* @see https://tailwindcss.com/docs/perspective-origin
			*/
			"perspective-origin": [{ "perspective-origin": scalePositionWithArbitrary() }],
			/**
			* Rotate
			* @see https://tailwindcss.com/docs/rotate
			*/
			rotate: [{ rotate: scaleRotate() }],
			/**
			* Rotate X
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-x": [{ "rotate-x": scaleRotate() }],
			/**
			* Rotate Y
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-y": [{ "rotate-y": scaleRotate() }],
			/**
			* Rotate Z
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-z": [{ "rotate-z": scaleRotate() }],
			/**
			* Scale
			* @see https://tailwindcss.com/docs/scale
			*/
			scale: [{ scale: scaleScale() }],
			/**
			* Scale X
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-x": [{ "scale-x": scaleScale() }],
			/**
			* Scale Y
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-y": [{ "scale-y": scaleScale() }],
			/**
			* Scale Z
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-z": [{ "scale-z": scaleScale() }],
			/**
			* Scale 3D
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-3d": ["scale-3d"],
			/**
			* Skew
			* @see https://tailwindcss.com/docs/skew
			*/
			skew: [{ skew: scaleSkew() }],
			/**
			* Skew X
			* @see https://tailwindcss.com/docs/skew
			*/
			"skew-x": [{ "skew-x": scaleSkew() }],
			/**
			* Skew Y
			* @see https://tailwindcss.com/docs/skew
			*/
			"skew-y": [{ "skew-y": scaleSkew() }],
			/**
			* Transform
			* @see https://tailwindcss.com/docs/transform
			*/
			transform: [{ transform: [
				isArbitraryVariable,
				isArbitraryValue,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			/**
			* Transform Origin
			* @see https://tailwindcss.com/docs/transform-origin
			*/
			"transform-origin": [{ origin: scalePositionWithArbitrary() }],
			/**
			* Transform Style
			* @see https://tailwindcss.com/docs/transform-style
			*/
			"transform-style": [{ transform: ["3d", "flat"] }],
			/**
			* Translate
			* @see https://tailwindcss.com/docs/translate
			*/
			translate: [{ translate: scaleTranslate() }],
			/**
			* Translate X
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-x": [{ "translate-x": scaleTranslate() }],
			/**
			* Translate Y
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-y": [{ "translate-y": scaleTranslate() }],
			/**
			* Translate Z
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-z": [{ "translate-z": scaleTranslate() }],
			/**
			* Translate None
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-none": ["translate-none"],
			/**
			* Zoom
			* @see https://tailwindcss.com/docs/zoom
			*/
			zoom: [{ zoom: [
				isInteger,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Accent Color
			* @see https://tailwindcss.com/docs/accent-color
			*/
			accent: [{ accent: scaleColor() }],
			/**
			* Appearance
			* @see https://tailwindcss.com/docs/appearance
			*/
			appearance: [{ appearance: ["none", "auto"] }],
			/**
			* Caret Color
			* @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
			*/
			"caret-color": [{ caret: scaleColor() }],
			/**
			* Color Scheme
			* @see https://tailwindcss.com/docs/color-scheme
			*/
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			/**
			* Cursor
			* @see https://tailwindcss.com/docs/cursor
			*/
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Field Sizing
			* @see https://tailwindcss.com/docs/field-sizing
			*/
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			/**
			* Pointer Events
			* @see https://tailwindcss.com/docs/pointer-events
			*/
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			/**
			* Resize
			* @see https://tailwindcss.com/docs/resize
			*/
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			/**
			* Scroll Behavior
			* @see https://tailwindcss.com/docs/scroll-behavior
			*/
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			/**
			* Scrollbar Thumb Color
			* @see https://tailwindcss.com/docs/scrollbar-color
			*/
			"scrollbar-thumb-color": [{ "scrollbar-thumb": scaleColor() }],
			/**
			* Scrollbar Track Color
			* @see https://tailwindcss.com/docs/scrollbar-color
			*/
			"scrollbar-track-color": [{ "scrollbar-track": scaleColor() }],
			/**
			* Scrollbar Gutter
			* @see https://tailwindcss.com/docs/scrollbar-gutter
			*/
			"scrollbar-gutter": [{ "scrollbar-gutter": [
				"auto",
				"stable",
				"both"
			] }],
			/**
			* Scrollbar Width
			* @see https://tailwindcss.com/docs/scrollbar-width
			*/
			"scrollbar-w": [{ scrollbar: [
				"auto",
				"thin",
				"none"
			] }],
			/**
			* Scroll Margin
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-m": [{ "scroll-m": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mx": [{ "scroll-mx": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-my": [{ "scroll-my": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline Start
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-ms": [{ "scroll-ms": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline End
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-me": [{ "scroll-me": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block Start
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mbs": [{ "scroll-mbs": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block End
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mbe": [{ "scroll-mbe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Top
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mt": [{ "scroll-mt": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Right
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mr": [{ "scroll-mr": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Bottom
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mb": [{ "scroll-mb": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Left
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-ml": [{ "scroll-ml": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-p": [{ "scroll-p": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-px": [{ "scroll-px": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-py": [{ "scroll-py": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline Start
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-ps": [{ "scroll-ps": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline End
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pe": [{ "scroll-pe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block Start
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pbs": [{ "scroll-pbs": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block End
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pbe": [{ "scroll-pbe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Top
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pt": [{ "scroll-pt": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Right
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pr": [{ "scroll-pr": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Bottom
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pb": [{ "scroll-pb": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Left
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pl": [{ "scroll-pl": scaleUnambiguousSpacing() }],
			/**
			* Scroll Snap Align
			* @see https://tailwindcss.com/docs/scroll-snap-align
			*/
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			/**
			* Scroll Snap Stop
			* @see https://tailwindcss.com/docs/scroll-snap-stop
			*/
			"snap-stop": [{ snap: ["normal", "always"] }],
			/**
			* Scroll Snap Type
			* @see https://tailwindcss.com/docs/scroll-snap-type
			*/
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			/**
			* Scroll Snap Type Strictness
			* @see https://tailwindcss.com/docs/scroll-snap-type
			*/
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			/**
			* Touch Action
			* @see https://tailwindcss.com/docs/touch-action
			*/
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			/**
			* Touch Action X
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			/**
			* Touch Action Y
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			/**
			* Touch Action Pinch Zoom
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-pz": ["touch-pinch-zoom"],
			/**
			* User Select
			* @see https://tailwindcss.com/docs/user-select
			*/
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			/**
			* Will Change
			* @see https://tailwindcss.com/docs/will-change
			*/
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Fill
			* @see https://tailwindcss.com/docs/fill
			*/
			fill: [{ fill: ["none", ...scaleColor()] }],
			/**
			* Stroke Width
			* @see https://tailwindcss.com/docs/stroke-width
			*/
			"stroke-w": [{ stroke: [
				isNumber,
				isArbitraryVariableLength,
				isArbitraryLength,
				isArbitraryNumber
			] }],
			/**
			* Stroke
			* @see https://tailwindcss.com/docs/stroke
			*/
			stroke: [{ stroke: ["none", ...scaleColor()] }],
			/**
			* Forced Color Adjust
			* @see https://tailwindcss.com/docs/forced-color-adjust
			*/
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			"container-named": ["container-type"],
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": ["right", "left"],
			"inset-y": ["top", "bottom"],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: ["pr", "pl"],
			py: ["pt", "pb"],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: ["mr", "ml"],
			my: ["mt", "mb"],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": ["border-w-r", "border-w-l"],
			"border-w-y": ["border-w-t", "border-w-b"],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": ["border-color-r", "border-color-l"],
			"border-color-y": ["border-color-t", "border-color-b"],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": ["scroll-mr", "scroll-ml"],
			"scroll-my": ["scroll-mt", "scroll-mb"],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": ["scroll-pr", "scroll-pl"],
			"scroll-py": ["scroll-pt", "scroll-pb"],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		postfixLookupClassGroups: ["container-type"],
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
};
var twMerge = /*#__PURE__*/ createTailwindMerge(getDefaultConfig);
//#endregion
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/components/ui/alert.tsx
var alertVariants = cva("relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[1rem_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5", {
	variants: { variant: {
		default: "bg-card text-card-foreground",
		destructive: "bg-card text-destructive [&>svg]:text-destructive"
	} },
	defaultVariants: { variant: "default" }
});
function Alert({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "alert",
		role: "alert",
		className: cn(alertVariants({ variant }), className),
		...props
	});
}
function AlertTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "alert-title",
		className: cn("col-start-2 font-medium tracking-tight", className),
		...props
	});
}
function AlertDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "alert-description",
		className: cn("col-start-2 text-sm text-muted-foreground", className),
		...props
	});
}
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.4_@types+react@19.2.17_react@19.2.8/node_modules/@radix-ui/react-compose-refs/dist/index.mjs
var __defProp$6 = Object.defineProperty;
var __name$6 = (target, value) => __defProp$6(target, "name", {
	value,
	configurable: true
});
function setRef(ref, value) {
	if (typeof ref === "function") return ref(value);
	else if (ref !== null && ref !== void 0) ref.current = value;
}
__name$6(setRef, "setRef");
function composeRefs(...refs) {
	return (node) => {
		let hasCleanup = false;
		const cleanups = refs.map((ref) => {
			const cleanup = setRef(ref, node);
			if (!hasCleanup && typeof cleanup == "function") hasCleanup = true;
			return cleanup;
		});
		if (hasCleanup) return () => {
			for (let i = 0; i < cleanups.length; i++) {
				const cleanup = cleanups[i];
				if (typeof cleanup == "function") cleanup();
				else setRef(refs[i], null);
			}
		};
	};
}
__name$6(composeRefs, "composeRefs");
function useComposedRefs(...refs) {
	return import_react.useCallback(composeRefs(...refs), refs);
}
__name$6(useComposedRefs, "useComposedRefs");
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-slot@1.3.1_@types+react@19.2.17_react@19.2.8/node_modules/@radix-ui/react-slot/dist/index.mjs
var __defProp$5 = Object.defineProperty;
var __name$5 = (target, value) => __defProp$5(target, "name", {
	value,
	configurable: true
});
var mergeProps = /* @__PURE__ */ __name$5(((slotProps, childProps) => {
	const overrideProps = { ...childProps };
	for (const propName in childProps) {
		const slotPropValue = slotProps[propName];
		const childPropValue = childProps[propName];
		if (/^on[A-Z]/.test(propName)) {
			if (slotPropValue && childPropValue) {
				const slotIsFunction = typeof slotPropValue === "function";
				const childIsFunction = typeof childPropValue === "function";
				overrideProps[propName] = (...args) => {
					const result = childIsFunction ? childPropValue(...args) : void 0;
					if (slotIsFunction) slotPropValue(...args);
					return result;
				};
			} else if (slotPropValue) overrideProps[propName] = slotPropValue;
		} else if (propName === "style") overrideProps[propName] = {
			...typeof slotPropValue === "object" ? slotPropValue : null,
			...typeof childPropValue === "object" ? childPropValue : null
		};
		else if (propName === "className") overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
		else if (propName === "aria-describedby") overrideProps[propName] = concatAriaDescribedby(childPropValue, slotPropValue);
	}
	return {
		...slotProps,
		...overrideProps
	};
}), "mergeProps");
function concatAriaDescribedby(...values) {
	const ids = /* @__PURE__ */ new Set();
	for (const value of values) {
		if (typeof value !== "string") continue;
		for (const id of String(value).trim().split(/\s+/)) if (id) ids.add(id);
	}
	return ids.size > 0 ? Array.from(ids).join(" ") : void 0;
}
__name$5(concatAriaDescribedby, "concatAriaDescribedby");
var SlotContext = import_react.createContext(mergeProps);
SlotContext.displayName = "SlotContext";
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
	const Slot2 = import_react.forwardRef((props, forwardedRef) => {
		const context = import_react.useContext(SlotContext);
		let { children, mergeProps: mergePropsProp = context, ...slotProps } = props;
		let slottableElement = null;
		let hasSlottable = false;
		const newChildren = [];
		if (isLazyComponent(children) && typeof use === "function") children = use(children._payload);
		import_react.Children.forEach(children, (maybeSlottable) => {
			if (isSlottable(maybeSlottable)) {
				hasSlottable = true;
				const slottable = maybeSlottable;
				let child = "child" in slottable.props ? slottable.props.child : slottable.props.children;
				if (isLazyComponent(child) && typeof use === "function") child = use(child._payload);
				slottableElement = getSlottableElementFromSlottable(slottable, child);
				newChildren.push(slottableElement?.props?.children);
			} else newChildren.push(maybeSlottable);
		});
		if (slottableElement) slottableElement = import_react.cloneElement(slottableElement, void 0, newChildren);
		else if (!hasSlottable && import_react.Children.count(children) === 1 && import_react.isValidElement(children)) slottableElement = children;
		const slottableElementRef = slottableElement ? getElementRef(slottableElement) : void 0;
		const composedRef = useComposedRefs(forwardedRef, slottableElementRef);
		if (!slottableElement) {
			if (children || children === 0) throw new Error(hasSlottable ? createSlottableError(ownerName) : createSlotError(ownerName));
			return children;
		}
		const mergedProps = mergePropsProp(slotProps, slottableElement.props ?? {});
		if (slottableElement.type !== import_react.Fragment) mergedProps.ref = forwardedRef ? composedRef : slottableElementRef;
		return import_react.cloneElement(slottableElement, mergedProps);
	});
	Slot2.displayName = `${ownerName}.Slot`;
	return Slot2;
}
__name$5(createSlot, "createSlot");
var Slot = /* @__PURE__ */ createSlot("Slot");
var SLOTTABLE_IDENTIFIER = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function createSlottable(ownerName) {
	const Slottable2 = /* @__PURE__ */ __name$5((props) => "child" in props ? props.children(props.child) : props.children, "Slottable");
	Slottable2.displayName = `${ownerName}.Slottable`;
	Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
	return Slottable2;
}
__name$5(createSlottable, "createSlottable");
var getSlottableElementFromSlottable = /* @__PURE__ */ __name$5((slottable, child) => {
	if ("child" in slottable.props) {
		const child2 = slottable.props.child;
		if (!import_react.isValidElement(child2)) return null;
		return import_react.cloneElement(child2, void 0, slottable.props.children(child2.props.children));
	}
	return import_react.isValidElement(child) ? child : null;
}, "getSlottableElementFromSlottable");
function getElementRef(element) {
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.ref;
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.props.ref;
	return element.props.ref || element.ref;
}
__name$5(getElementRef, "getElementRef");
function isSlottable(child) {
	return import_react.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
__name$5(isSlottable, "isSlottable");
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
function isLazyComponent(element) {
	return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
__name$5(isLazyComponent, "isLazyComponent");
function isPromiseLike(value) {
	return typeof value === "object" && value !== null && "then" in value;
}
__name$5(isPromiseLike, "isPromiseLike");
var createSlotError = /* @__PURE__ */ __name$5((ownerName) => {
	return `${ownerName} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`;
}, "createSlotError");
var createSlottableError = /* @__PURE__ */ __name$5((ownerName) => {
	return `${ownerName} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`;
}, "createSlottableError");
var use = import_react[" use ".trim().toString()];
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-primitive@2.1.8_@types+react-dom@19.2.3_@types+react@19.2.17__@types+re_5a133ce654fa3debbe1f74a46e43e709/node_modules/@radix-ui/react-primitive/dist/index.mjs
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var __defProp$4 = Object.defineProperty;
var __name$4 = (target, value) => __defProp$4(target, "name", {
	value,
	configurable: true
});
var Primitive = [
	"a",
	"button",
	"div",
	"form",
	"h2",
	"h3",
	"img",
	"input",
	"label",
	"li",
	"nav",
	"ol",
	"p",
	"select",
	"span",
	"svg",
	"ul"
].reduce((primitive, node) => {
	const Slot = /* @__PURE__ */ createSlot(`Primitive.${node}`);
	const Node = import_react.forwardRef((props, forwardedRef) => {
		const { asChild, ...primitiveProps } = props;
		const Comp = asChild ? Slot : node;
		if (typeof window !== "undefined") window[Symbol.for("radix-ui")] = true;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
			...primitiveProps,
			ref: forwardedRef
		});
	});
	Node.displayName = `Primitive.${node}`;
	return {
		...primitive,
		[node]: Node
	};
}, {});
function dispatchDiscreteCustomEvent(target, event) {
	if (target) import_react_dom.flushSync(() => target.dispatchEvent(event));
}
__name$4(dispatchDiscreteCustomEvent, "dispatchDiscreteCustomEvent");
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-context@1.2.1_@types+react@19.2.17_react@19.2.8/node_modules/@radix-ui/react-context/dist/index.mjs
var __defProp$3 = Object.defineProperty;
var __name$3 = (target, value) => __defProp$3(target, "name", {
	value,
	configurable: true
});
// @__NO_SIDE_EFFECTS__
function createContext2(rootComponentName, defaultContext) {
	const Context = import_react.createContext(defaultContext);
	Context.displayName = rootComponentName + "Context";
	const Provider = /* @__PURE__ */ __name$3((props) => {
		const { children, ...context } = props;
		const value = import_react.useMemo(() => context, Object.values(context));
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Context.Provider, {
			value,
			children
		});
	}, "Provider");
	Provider.displayName = rootComponentName + "Provider";
	function useContext2(consumerName, options = {}) {
		const { optional = false } = options;
		const context = import_react.useContext(Context);
		if (context) return context;
		if (defaultContext !== void 0) return defaultContext;
		if (optional) return void 0;
		throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
	}
	__name$3(useContext2, "useContext");
	return [Provider, useContext2];
}
__name$3(createContext2, "createContext");
// @__NO_SIDE_EFFECTS__
function createContextScope(scopeName, createContextScopeDeps = []) {
	let defaultContexts = [];
	function createContext3(rootComponentName, defaultContext) {
		const BaseContext = import_react.createContext(defaultContext);
		BaseContext.displayName = rootComponentName + "Context";
		const index = defaultContexts.length;
		defaultContexts = [...defaultContexts, defaultContext];
		const Provider = /* @__PURE__ */ __name$3((props) => {
			const { scope, children, ...context } = props;
			const Context = scope?.[scopeName]?.[index] || BaseContext;
			const value = import_react.useMemo(() => context, Object.values(context));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Context.Provider, {
				value,
				children
			});
		}, "Provider");
		Provider.displayName = rootComponentName + "Provider";
		function useContext2(consumerName, scope, options = {}) {
			const { optional = false } = options;
			const Context = scope?.[scopeName]?.[index] || BaseContext;
			const context = import_react.useContext(Context);
			if (context) return context;
			if (defaultContext !== void 0) return defaultContext;
			if (optional) return void 0;
			throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
		}
		__name$3(useContext2, "useContext");
		return [Provider, useContext2];
	}
	__name$3(createContext3, "createContext");
	const createScope = /* @__PURE__ */ __name$3(() => {
		const scopeContexts = defaultContexts.map((defaultContext) => {
			return import_react.createContext(defaultContext);
		});
		return /* @__PURE__ */ __name$3(function useScope(scope) {
			const contexts = scope?.[scopeName] || scopeContexts;
			return import_react.useMemo(() => ({ [`__scope${scopeName}`]: {
				...scope,
				[scopeName]: contexts
			} }), [scope, contexts]);
		}, "useScope");
	}, "createScope");
	createScope.scopeName = scopeName;
	return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
__name$3(createContextScope, "createContextScope");
function composeContextScopes(...scopes) {
	const baseScope = scopes[0];
	if (scopes.length === 1) return baseScope;
	const createScope = /* @__PURE__ */ __name$3(() => {
		const scopeHooks = scopes.map((createScope2) => ({
			useScope: createScope2(),
			scopeName: createScope2.scopeName
		}));
		return /* @__PURE__ */ __name$3(function useComposedScopes(overrideScopes) {
			const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
				const currentScope = useScope(overrideScopes)[`__scope${scopeName}`];
				return {
					...nextScopes2,
					...currentScope
				};
			}, {});
			return import_react.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
		}, "useComposedScopes");
	}, "createScope");
	createScope.scopeName = baseScope.scopeName;
	return createScope;
}
__name$3(composeContextScopes, "composeContextScopes");
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-use-layout-effect@1.1.3_@types+react@19.2.17_react@19.2.8/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
var useLayoutEffect2 = globalThis?.document ? import_react.useLayoutEffect : () => {};
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.3_@types+react@19.2.17_react@19.2.8/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
var __defProp$2 = Object.defineProperty;
var __name$2 = (target, value) => __defProp$2(target, "name", {
	value,
	configurable: true
});
function useCallbackRef(callback) {
	const callbackRef = import_react.useRef(callback);
	import_react.useEffect(() => {
		callbackRef.current = callback;
	});
	return import_react.useMemo(() => ((...args) => callbackRef.current?.(...args)), []);
}
__name$2(useCallbackRef, "useCallbackRef");
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-avatar@1.2.4_@types+react-dom@19.2.3_@types+react@19.2.17__@types+react_6a533ea4dc63fb1d11e9f9824ee96a89/node_modules/@radix-ui/react-avatar/dist/index.mjs
var __defProp$1 = Object.defineProperty;
var __name$1 = (target, value) => __defProp$1(target, "name", {
	value,
	configurable: true
});
var AVATAR_NAME = "Avatar";
var [createAvatarContext, createAvatarScope] = /* @__PURE__ */ createContextScope(AVATAR_NAME);
var STATIC_IMAGE_COUNT_STATE = [0, () => void 0];
var [AvatarProvider, useAvatarContext] = createAvatarContext(AVATAR_NAME);
var Avatar$1 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$1(function Avatar2(props, forwardedRef) {
	const { __scopeAvatar, ...avatarProps } = props;
	const [imageLoadingStatus, setImageLoadingStatus] = import_react.useState("idle");
	const [imageCount, setImageCount] = useImageCount();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarProvider, {
		scope: __scopeAvatar,
		imageLoadingStatus,
		setImageLoadingStatus,
		imageCount,
		setImageCount,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
			...avatarProps,
			ref: forwardedRef
		})
	});
}, "Avatar"));
var IMAGE_NAME = "AvatarImage";
var AvatarImage$1 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$1(function AvatarImage2(props, forwardedRef) {
	const { __scopeAvatar, src, onLoadingStatusChange, ...imageProps } = props;
	const context = useAvatarContext(IMAGE_NAME, __scopeAvatar);
	context.setImageCount;
	const imageLoadingStatus = useImageLoadingStatus(src, {
		referrerPolicy: imageProps.referrerPolicy,
		crossOrigin: imageProps.crossOrigin,
		loadingStatus: context.imageLoadingStatus,
		setLoadingStatus: context.setImageLoadingStatus
	});
	const handleLoadingStatusChange = useCallbackRef((status) => {
		onLoadingStatusChange?.(status);
	});
	const loadingStatusRef = import_react.useRef(imageLoadingStatus);
	useLayoutEffect2(() => {
		const previousLoadingStatus = loadingStatusRef.current;
		loadingStatusRef.current = imageLoadingStatus;
		if (imageLoadingStatus !== previousLoadingStatus) handleLoadingStatusChange(imageLoadingStatus);
	}, [imageLoadingStatus, handleLoadingStatusChange]);
	return imageLoadingStatus === "loaded" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.img, {
		...imageProps,
		ref: forwardedRef,
		src
	}) : null;
}, "AvatarImage"));
var FALLBACK_NAME = "AvatarFallback";
var AvatarFallback$1 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$1(function AvatarFallback2(props, forwardedRef) {
	const { __scopeAvatar, delayMs, ...fallbackProps } = props;
	const context = useAvatarContext(FALLBACK_NAME, __scopeAvatar);
	const [canRender, setCanRender] = import_react.useState(delayMs === void 0);
	import_react.useEffect(() => {
		if (delayMs !== void 0) {
			const timerId = window.setTimeout(() => setCanRender(true), delayMs);
			return () => window.clearTimeout(timerId);
		}
	}, [delayMs]);
	return canRender && context.imageLoadingStatus !== "loaded" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		...fallbackProps,
		ref: forwardedRef
	}) : null;
}, "AvatarFallback"));
function useImageLoadingStatus(src, { loadingStatus, setLoadingStatus, referrerPolicy, crossOrigin }) {
	useLayoutEffect2(() => {
		if (!src) {
			setLoadingStatus("error");
			return;
		}
		const image = new window.Image();
		const handleLoad = /* @__PURE__ */ __name$1((event) => {
			const image2 = event.currentTarget;
			setLoadingStatus(getImageLoadingStatus(image2));
		}, "handleLoad");
		const handleError = /* @__PURE__ */ __name$1(() => setLoadingStatus("error"), "handleError");
		image.addEventListener("load", handleLoad);
		image.addEventListener("error", handleError);
		if (referrerPolicy) image.referrerPolicy = referrerPolicy;
		image.crossOrigin = crossOrigin ?? null;
		image.src = src;
		setLoadingStatus(getImageLoadingStatus(image));
		return () => {
			image.removeEventListener("load", handleLoad);
			image.removeEventListener("error", handleError);
			setLoadingStatus("idle");
		};
	}, [
		src,
		crossOrigin,
		referrerPolicy,
		setLoadingStatus
	]);
	return loadingStatus;
}
__name$1(useImageLoadingStatus, "useImageLoadingStatus");
function getImageLoadingStatus(image) {
	return image.complete ? image.naturalWidth > 0 ? "loaded" : "error" : "loading";
}
__name$1(getImageLoadingStatus, "getImageLoadingStatus");
function useImageCount() {
	return STATIC_IMAGE_COUNT_STATE;
}
__name$1(useImageCount, "useImageCount");
function useUpdateImageCount(setImageCount) {}
__name$1(useUpdateImageCount, "useUpdateImageCount");
//#endregion
//#region node_modules/.pnpm/@radix-ui+react-label@2.1.13_@types+react-dom@19.2.3_@types+react@19.2.17__@types+react_1a71cc2d227950086603d33e7dfe5bc7/node_modules/@radix-ui/react-label/dist/index.mjs
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
	value,
	configurable: true
});
var Label$1 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function Label2(props, forwardedRef) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.label, {
		...props,
		ref: forwardedRef,
		onMouseDown: (event) => {
			if (event.target.closest("button, input, select, textarea")) return;
			props.onMouseDown?.(event);
			if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
		}
	});
}, "Label"));
//#endregion
//#region src/components/ui/avatar.tsx
function Avatar({ className, size = "default", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
		"data-slot": "avatar",
		"data-size": size,
		className: cn("group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6", className),
		...props
	});
}
function AvatarImage({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
		"data-slot": "avatar-image",
		className: cn("aspect-square size-full object-cover", className),
		...props
	});
}
function AvatarFallback({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
		"data-slot": "avatar-fallback",
		className: cn("flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs", className),
		...props
	});
}
//#endregion
//#region src/components/ui/badge.tsx
var badgeVariants = cva("inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", {
	variants: { variant: {
		default: "bg-primary text-primary-foreground",
		secondary: "bg-secondary text-secondary-foreground",
		destructive: "bg-destructive text-white",
		outline: "border-border text-foreground",
		ghost: "hover:bg-accent hover:text-accent-foreground",
		link: "text-primary underline-offset-4 hover:underline"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant = "default", asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "span", {
		"data-slot": "badge",
		"data-variant": variant,
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
//#region src/components/ui/button.tsx
var buttonVariants = cva("inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-white hover:bg-destructive/90",
			outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			xs: "h-6 rounded-md px-2 text-xs",
			sm: "h-8 rounded-md px-3",
			lg: "h-10 rounded-md px-6",
			icon: "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		"data-slot": "button",
		"data-variant": variant,
		"data-size": size,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
//#region src/components/ui/card.tsx
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card",
		className: cn("flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-header",
		className: cn("grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-title",
		className: cn("leading-none font-semibold", className),
		...props
	});
}
function CardDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-description",
		className: cn("text-sm text-muted-foreground", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "card-content",
		className: cn("px-6", className),
		...props
	});
}
//#endregion
//#region src/components/ui/input.tsx
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		"data-slot": "input",
		className: cn("h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		...props
	});
}
//#endregion
//#region src/components/ui/label.tsx
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
		"data-slot": "label",
		className: cn("flex items-center gap-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
		...props
	});
}
//#endregion
//#region src/components/ui/skeleton.tsx
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "skeleton",
		className: cn("animate-pulse rounded-md bg-accent", className),
		...props
	});
}
//#endregion
//#region src/components/ui/table.tsx
function Table({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-slot": "table-container",
		className: "relative w-full overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
			"data-slot": "table",
			className: cn("w-full caption-bottom text-sm", className),
			...props
		})
	});
}
function TableHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
		"data-slot": "table-header",
		className: cn("[&_tr]:border-b", className),
		...props
	});
}
function TableBody({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
		"data-slot": "table-body",
		className: cn("[&_tr:last-child]:border-0", className),
		...props
	});
}
function TableRow({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
		"data-slot": "table-row",
		className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
		...props
	});
}
function TableHead({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		"data-slot": "table-head",
		className: cn("h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground", className),
		...props
	});
}
function TableCell({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		"data-slot": "table-cell",
		className: cn("p-2 align-middle whitespace-nowrap", className),
		...props
	});
}
function TableCaption({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
		"data-slot": "table-caption",
		className: cn("mt-4 text-sm text-muted-foreground", className),
		...props
	});
}
//#endregion
//#region src/components/ui/textarea.tsx
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		"data-slot": "textarea",
		className: cn("flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		...props
	});
}
//#endregion
//#region src/routes/home.tsx
var home_exports = /* @__PURE__ */ __exportAll({
	HydrateFallback: () => HydrateFallback,
	action: () => action,
	default: () => home_default,
	loader: () => loader$3
});
var TEXT_KEY = "welcome";
function profileName(profile) {
	return profile.name?.trim() || `Member ${profile.inbox_id.slice(0, 8)}`;
}
function initials(value) {
	return value.trim().split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?";
}
async function loader$3({ context }) {
	return data({
		text: (await (await getArtifactsClient(context)).getText(TEXT_KEY)).value ?? "",
		eventIdempotencyKey: crypto.randomUUID()
	});
}
async function action({ context, request }) {
	const form = await request.formData();
	const intent = form.get("intent");
	const client = await getArtifactsClient(context);
	if (intent === "save-text") {
		const value = form.get("value");
		if (typeof value !== "string") return data({
			ok: false,
			message: "Enter a text value."
		}, 400);
		await client.setText(TEXT_KEY, value);
		return data({
			ok: true,
			message: "Saved for this group."
		});
	}
	if (intent === "send-event") {
		const message = form.get("message");
		const idempotencyKey = form.get("idempotency_key");
		if (typeof message !== "string" || !message.trim() || typeof idempotencyKey !== "string" || !idempotencyKey) return data({
			ok: false,
			message: "Write a message before sending."
		}, 400);
		return data({
			ok: true,
			message: (await client.sendToAgent({
				idempotencyKey,
				body: {
					message: message.trim(),
					source: "starter-welcome-page"
				}
			})).deduped ? "That event was already accepted." : "Event queued for the assistant."
		});
	}
	return data({
		ok: false,
		message: "Unknown form action."
	}, 400);
}
var HydrateFallback = withHydrateFallbackProps(function HydrateFallback() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-44" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-12 h-72 w-full" })]
	});
});
var home_default = withComponentProps(function Home() {
	const rootData = useRouteLoaderData("root");
	if (rootData === void 0) throw new Error("root site data is unavailable");
	const { group, agent, members } = rootData;
	const { text, eventIdempotencyKey } = useLoaderData();
	const actionData = useActionData();
	const navigation = useNavigation();
	const pendingIntent = navigation.formData?.get("intent");
	const agentName = profileName(agent);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-[100dvh] bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex min-h-18 max-w-6xl items-center justify-between gap-4 px-6 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "font-semibold tracking-tight",
					children: "Convos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/about",
						className: "text-sm text-muted-foreground hover:text-foreground",
						children: "About"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: group.is_active ? "Group space active" : "Group space inactive"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl gap-6 px-6 pb-12 pt-8 lg:grid-cols-[1.3fr_0.7fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border bg-card p-7 text-card-foreground shadow-sm sm:p-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								className: "size-14 rounded-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "rounded-xl bg-accent text-accent-foreground",
									children: initials(group.name)
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-muted-foreground",
								children: "Your shared space"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 text-4xl font-semibold tracking-tight sm:text-5xl",
								children: group.name
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-8 max-w-xl text-lg leading-8 text-muted-foreground",
							children: "A focused home for the people and work in this conversation."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-10 grid gap-5 border-t pt-6 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-sm text-muted-foreground",
									children: "Members"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 text-2xl font-semibold",
									children: group.member_count
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-sm text-muted-foreground",
									children: "Conversation ID"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 truncate font-mono text-sm",
									children: group.conversation_id
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-sm text-muted-foreground",
									children: "Kind"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 font-medium capitalize",
									children: group.kind
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-sm text-muted-foreground",
									children: "Created"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 font-medium",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
										dateTime: group.created_at,
										children: group.created_at.slice(0, 10)
									})
								})] })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your assistant" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Available to help this group move work forward." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						size: "lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
							src: agent.image ?? void 0,
							alt: agentName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: initials(agentName) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-semibold",
							children: agentName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm text-muted-foreground",
							children: agent.member_kind === "agent" ? "Group assistant" : agent.inbox_id
						})]
					})]
				}) })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-6 pb-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold tracking-tight",
						children: "People in this group"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Live member profiles from this conversation."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "py-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCaption, {
							className: "sr-only",
							children: "Current conversation member profiles"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Member" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Kind" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
								className: "hidden md:table-cell",
								children: "Inbox ID"
							})
						] }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: members.map((member) => {
							const name = profileName(member);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
										src: member.image ?? void 0,
										alt: name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: initials(name) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: name
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: member.member_kind === "agent" ? "Agent" : "Member" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "hidden max-w-64 truncate font-mono text-xs text-muted-foreground md:table-cell",
									children: member.inbox_id
								})
							] }, member.inbox_id);
						}) })
					] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl gap-6 px-6 pb-16 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Persistent group text" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "This value is stored by the assistant-scoped artifacts API." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Form, {
						method: "post",
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "hidden",
								name: "intent",
								value: "save-text"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "persistent-value",
									children: "Welcome note"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "persistent-value",
									name: "value",
									defaultValue: text,
									maxLength: 65536
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: navigation.state !== "idle" && pendingIntent === "save-text",
								children: pendingIntent === "save-text" ? "Saving…" : "Save text"
							})
						]
					}) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Send an assistant event" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Events enter the same durable turn pipeline as other messages." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Form, {
						method: "post",
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "hidden",
								name: "intent",
								value: "send-event"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "hidden",
								name: "idempotency_key",
								value: eventIdempotencyKey
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "event-message",
									children: "Message"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "event-message",
									name: "message",
									placeholder: "Ask the assistant to follow up…",
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: navigation.state !== "idle" && pendingIntent === "send-event",
								children: pendingIntent === "send-event" ? "Sending…" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {}), "Send event"] })
							})
						]
					}) })] }),
					actionData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
						variant: actionData.ok ? "default" : "destructive",
						className: "lg:col-span-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, { children: actionData.ok ? "Done" : "Could not submit" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDescription, { children: actionData.message })
						]
					}) : null
				]
			})
		]
	});
});
//#endregion
//#region src/routes/about.tsx
var about_exports = /* @__PURE__ */ __exportAll({ default: () => about_default });
var about_default = withComponentProps(function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-[100dvh] max-w-3xl px-6 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				children: "Mounted-route example"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-4xl font-semibold tracking-tight",
				children: "A full-stack site, inside the conversation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 max-w-2xl text-lg leading-8 text-muted-foreground",
				children: "This nested route demonstrates client navigation and direct refreshes at every supported site mount depth."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Platform preview checks" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "These routes exercise redirects, resource responses, and error boundaries without adding application-specific infrastructure." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-wrap gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "resource.txt",
								children: "Open resource route"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/redirect",
								children: "Follow redirect"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/error",
								children: "Open error boundary"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "Back to group"
				})
			})
		]
	});
});
//#endregion
//#region src/routes/redirect.ts
var redirect_exports = /* @__PURE__ */ __exportAll({ loader: () => loader$2 });
function loader$2() {
	return redirect("/about");
}
//#endregion
//#region src/routes/resource.ts
var resource_exports = /* @__PURE__ */ __exportAll({ loader: () => loader$1 });
function loader$1() {
	return new Response("Convos agent site resource route\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
//#endregion
//#region src/routes/error.tsx
var error_exports = /* @__PURE__ */ __exportAll({
	default: () => error_default,
	loader: () => loader
});
function loader() {
	throw new Response("Intentional platform-preview error", {
		status: 418,
		statusText: "Preview error"
	});
}
var error_default = withComponentProps(function UnreachableErrorRoute() {
	return null;
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "./assets/entry.client-Dy1J0qwe.js",
		"imports": [
			"./assets/components-kMiEj0ay.js",
			"./assets/react-dom-CVcHS0en.js",
			"./assets/errorBoundaries-fg0r-UvE.js",
			"./assets/jsx-runtime-Clg48yVa.js"
		],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "./assets/root-kvkkNLzs.js",
			"imports": [
				"./assets/components-kMiEj0ay.js",
				"./assets/react-dom-CVcHS0en.js",
				"./assets/errorBoundaries-fg0r-UvE.js",
				"./assets/jsx-runtime-Clg48yVa.js",
				"./assets/lib-D0TpdqKd.js"
			],
			"css": ["./assets/root-Cv0Ul3bz.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/home": {
			"id": "routes/home",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "./assets/home-main-DNHueGQW.js",
			"imports": [
				"./assets/components-kMiEj0ay.js",
				"./assets/react-dom-CVcHS0en.js",
				"./assets/lib-D0TpdqKd.js",
				"./assets/jsx-runtime-Clg48yVa.js",
				"./assets/utils-B6KiDbIe.js",
				"./assets/card-HPOoYhsl.js",
				"./assets/home-BKfFdPCB.js",
				"./assets/errorBoundaries-fg0r-UvE.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/about": {
			"id": "routes/about",
			"parentId": "root",
			"path": "about",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "./assets/about-DWc_Yb57.js",
			"imports": [
				"./assets/components-kMiEj0ay.js",
				"./assets/lib-D0TpdqKd.js",
				"./assets/jsx-runtime-Clg48yVa.js",
				"./assets/card-HPOoYhsl.js",
				"./assets/errorBoundaries-fg0r-UvE.js",
				"./assets/utils-B6KiDbIe.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/redirect": {
			"id": "routes/redirect",
			"parentId": "root",
			"path": "redirect",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "./assets/redirect-BvRk9kiK.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/resource": {
			"id": "routes/resource",
			"parentId": "root",
			"path": "resource.txt",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "./assets/resource-BvRk9kiK.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/error": {
			"id": "routes/error",
			"parentId": "root",
			"path": "error",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "./assets/error-DXqb18cR.js",
			"imports": ["./assets/components-kMiEj0ay.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "./assets/manifest-9cf91991.js",
	"version": "9cf91991",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "dist/client";
var basename = "/";
var future = {
	"unstable_enableNodeReadableStream": false,
	"unstable_optimizeDeps": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = { "mode": "initial" };
var publicPath = "./";
var entry = { module: entry_server_web_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/home": {
		id: "routes/home",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: home_exports
	},
	"routes/about": {
		id: "routes/about",
		parentId: "root",
		path: "about",
		index: void 0,
		caseSensitive: void 0,
		module: about_exports
	},
	"routes/redirect": {
		id: "routes/redirect",
		parentId: "root",
		path: "redirect",
		index: void 0,
		caseSensitive: void 0,
		module: redirect_exports
	},
	"routes/resource": {
		id: "routes/resource",
		parentId: "root",
		path: "resource.txt",
		index: void 0,
		caseSensitive: void 0,
		module: resource_exports
	},
	"routes/error": {
		id: "routes/error",
		parentId: "root",
		path: "error",
		index: void 0,
		caseSensitive: void 0,
		module: error_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
