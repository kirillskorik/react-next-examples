import type { GetServerSideProps, NextPage } from "next";
import { renderToString } from "react-dom/server";
import { InstantSearch } from "react-instantsearch-hooks";
import { getServerState } from "react-instantsearch-hooks-server";
import {
	InstantSearchServerState,
	InstantSearchSSRProvider,
} from "react-instantsearch-hooks-web";

import Content from "@src/components/organisms/Content";
import Footer from "@src/components/organisms/Footer";
import Header from "@src/components/organisms/Header";
import Layout from "@src/components/organisms/Layout";
import DesktopSearch from "@src/components/templates/DesktopSearch";
import MobileSearch from "@src/components/templates/MobileSearch";
import {
	typesenseInstantsearchDesktopAdapter,
	useNextRouterHandler,
} from "@src/utils";

interface ISearchPageProps {
	serverState?: InstantSearchServerState;
	url?: string;
}

interface RouteParams {
	q?: string;
	brand?: string;
}

const SearchPage: NextPage<ISearchPageProps> = ({ url, serverState }) => {
	console.log("rerender");
	const { initialUiState, NextRouterHandler } =
		useNextRouterHandler<RouteParams>({
			url,
			routeToState(params) {
				return {
					musicWorks: {
						query: params.q,
					},
				};
			},
			stateToRoute(uiState) {
				const indexUiState = uiState.musicWorks;
				return {
					q: indexUiState.query,
				};
			},
		});
	return (
		<InstantSearchSSRProvider {...serverState}>
			<Layout className="flex">
				<InstantSearch
					searchClient={typesenseInstantsearchDesktopAdapter.searchClient}
					indexName="musicWorks"
					initialUiState={initialUiState}
				>
					<NextRouterHandler />

					<Header className="lg:!fixed" />
					<Content className="mt-[117px] max-lg:hidden lg:flex-row lg:items-start">
						<DesktopSearch />
					</Content>
					<Footer />
				</InstantSearch>
			</Layout>
		</InstantSearchSSRProvider>
	);
};

export const getServerSideProps: GetServerSideProps<ISearchPageProps> = async ({
	req,
}) => {
	const protocol = req.headers.referer?.split("://")[0] ?? "https";
	const url = `${protocol}://${req.headers.host ? req.headers.host : ""}${
		req.url ? req.url : ""
	}`;

	const serverState = await getServerState(<SearchPage url={url} />, {
		renderToString,
	});

	return {
		props: {
			serverState,
			url,
		},
	};
};

export default SearchPage;
