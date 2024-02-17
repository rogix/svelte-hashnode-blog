<script lang="ts">
	import { onMount } from 'svelte';
	import { morePosts } from './loadMorePosts';
	import { formatDate } from '$lib/utils/formatDate';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Subscribe from '$lib/components/Subscribe.svelte';

	export let data;
	let hasMorePosts: boolean = true;

	let publication = data.props.publication;

	let posts = data.props.posts.publication?.posts.edges;
	let firstPost = posts ? posts[0] : null;
	let initialPosts = posts
		? posts.map((post) => {
				return {
					node: {
						...post.node
					}
				};
			})
		: [];

	let allPosts = [...initialPosts];

	let isLoading = false;

	async function loadMorePosts() {
		isLoading = true;
		try {
			const data = await morePosts();

			if (!data || !data.newPosts) {
				console.error('Failed to load more posts: data is', data);
				return;
			}

			const newPosts = data.newPosts;

			newPosts.forEach((post) => {
				if (!post || !post.node) {
					console.error('Invalid post:', post);
					return;
				}

				if (!data.pageInfo.hasNextPage) {
					hasMorePosts = false;
				}

				if (!allPosts.some((existingPost) => existingPost.node.id === post.node.id)) {
					allPosts = [
						...allPosts,
						{
							node: {
								...post.node
							}
						}
					];
				}
			});
		} catch (error) {
			console.error('An error occurred while loading more posts:', error);
		} finally {
			isLoading = false;
		}
	}

	onMount(loadMorePosts);
</script>

<Header />

<section class="mx-auto grid max-w-5xl items-center justify-center justify-items-center p-6 lg:p-0">
	{#if firstPost}
		<div class="flex w-full flex-col rounded-2xl sm:flex-row">
			<article class="flex flex-col items-center justify-between px-4 py-24">
				<div class="gap-5">
					<h2 class="text-center text-5xl uppercase leading-tight text-white">
						<a
							href={`${firstPost.node.slug}`}
							class="transition duration-500 ease-in-out hover:text-orange-200"
						>
							{firstPost.node.title}
						</a>
					</h2>
				</div>
				<div class="flex justify-center py-10 pb-20 font-mukta text-sm">
					<div class="text-white">
						<span class="text-orange-400">By </span>{firstPost.node.author?.name}
					</div>
					<div class="pl-1 text-sm text-orange-400">
						{formatDate(firstPost.node.publishedAt)}
					</div>
				</div>
				<a
					href={`${firstPost.node.slug}`}
					class="flex w-40 flex-1 items-center justify-center rounded-sm border border-white p-2 font-mukta font-thin uppercase text-white transition duration-300 ease-in-out hover:border-orange-200 hover:text-orange-200"
				>
					Read post
				</a>
			</article>
		</div>
	{/if}

	<section class="relative my-20 flex flex-col items-center sm:w-3/4">
		{#each allPosts?.slice(1) || [] as { node }}
			<article
				class="relative pb-28 before:absolute before:-left-20 before:top-4 before:h-full before:w-px before:bg-white/5 before:content-[''] sm:w-4/5"
			>
				<div class="absolute -left-[84px] top-4 h-2 w-2 rounded-full bg-orange-600" />

				<a href={`${node.slug}`} class="mb-1 flex flex-col">
					<h2
						class="text-3xl uppercase text-white transition duration-500 ease-in-out hover:text-orange-200"
					>
						{node.title}
					</h2>
				</a>
				<div
					class="-left-48 top-3 font-mukta text-xs font-thin uppercase text-orange-400 lg:absolute"
				>
					{formatDate(node.publishedAt)}
				</div>
				<div class="text-gray-400">
					{node.brief}
				</div>
			</article>
		{/each}
	</section>

	{#if hasMorePosts}
		<button
			class="m-auto w-60 transform rounded-full bg-orange-700 px-6 py-3 font-bold text-orange-100 transition duration-300 ease-in-out hover:scale-105 hover:bg-orange-600 hover:shadow-lg"
			on:click={loadMorePosts}
		>
			{isLoading ? 'Loading...' : 'Load more'}
		</button>
	{/if}

	{#if publication}
		<Subscribe {publication} />
	{/if}
</section>

<Footer />
