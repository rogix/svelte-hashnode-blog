import {
	TagPostsByPublicationDocument,
	type TagPostsByPublicationQuery,
	type TagPostsByPublicationQueryVariables
} from '$lib/graphql/generated/graphql';

import { request } from 'graphql-request';

const GQL_ENDPOINT = import.meta.env.VITE_PUBLIC_HASHNODE_GQL_ENDPOINT as string;
const PUBLICATION_HOST = import.meta.env.VITE_PUBLIC_HASHNODE_PUBLICATION_HOST as string;

export async function load({ params }) {
	const data = await request<TagPostsByPublicationQuery, TagPostsByPublicationQueryVariables>(
		GQL_ENDPOINT,
		TagPostsByPublicationDocument,
		{
			first: 10,
			host: PUBLICATION_HOST,
			tagSlug: params.slug
		}
	);

	const publication = data.publication;
	const posts = data.publication?.posts;

	return {
		props: {
			tag: params.slug,
			publication,
			posts
		}
	};
}
