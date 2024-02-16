<script lang="ts">
	import { formatDate } from '$lib/utils/formatDate';
	import Header from '$lib/components/Header.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { morePosts } from './loadMorePosts';
	import { onMount } from 'svelte';
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

<!-- <Hero /> -->

<section class="grid justify-center max-w-5xl mx-auto p-6 lg:p-0">
	{#if firstPost}
		<div class="w-full flex flex-col sm:flex-row rounded-2xl">
			<article class="px-4 py-24 flex flex-col justify-between items-center">
				<div class="gap-5">
					<h2 class="text-white text-5xl text-center uppercase leading-tight">
						<a
							href={`${firstPost.node.slug}`}
							class="hover:text-orange-200 transition duration-500 ease-in-out"
						>
							{firstPost.node.title}
						</a>
					</h2>
				</div>
				<div class="flex text-sm justify-center font-mukta py-10 pb-20">
					<div class="text-white">
						<span class="text-orange-400">By </span>{firstPost.node.author?.name}
					</div>
					<div class="text-orange-400 text-sm pl-1">
						{formatDate(firstPost.node.publishedAt)}
					</div>
				</div>
				<a
					href={`${firstPost.node.slug}`}
					class="text-white border flex w-40 flex-1 justify-center items-center p-2 rounded-sm uppercase border-white hover:text-orange-200 hover:border-orange-200 transition duration-300 font-mukta font-thin ease-in-out"
				>
					Read post
				</a>
			</article>
		</div>
	{/if}

	<section class="flex flex-col relative my-20 items-center">
		{#each allPosts?.slice(1) || [] as { node }}
			<article
				class="relative pb-28 before:content-[''] w-2/3 before:absolute before:w-px before:bg-white/5 before:h-full before:-left-20 before:top-4"
			>
				<div class="w-2 h-2 rounded-full bg-orange-600 absolute -left-[84px] top-4" />
				<a href={`${node.slug}`} class="flex flex-col mb-1">
					<h2
						class="text-white text-3xl uppercase hover:text-orange-200 transition duration-500 ease-in-out"
					>
						{node.title}
					</h2>
				</a>
				<div class="text-gray-400">
					{node.brief}
				</div>
				<div class="text-orange-400 absolute -left-48 top-3 font-mukta font-thin uppercase text-xs">
					{formatDate(node.publishedAt)}
				</div>
			</article>
		{/each}
	</section>

	{#if hasMorePosts}
		<button
			class="bg-orange-700 rounded-full w-60 m-auto px-6 py-3 text-orange-100 font-bold transition duration-300 ease-in-out transform hover:scale-105 hover:bg-orange-600 hover:shadow-lg"
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
