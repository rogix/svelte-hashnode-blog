<script>
	import Header from '$lib/components/Header.svelte';
	import { formatDate } from '$lib/utils/formatDate';

	export let data;

	let tag = data.props;
	let posts = data.props.posts?.edges;
</script>

<Header />

<main class="mx-auto my-10 max-w-5xl px-6">
	<h1 class="mx-auto font-mukta text-4xl uppercase tracking-wider text-orange-100 sm:w-2/3">
		<span class="text-orange-400">#</span>{tag?.tag}
	</h1>

	<section class="relative mx-auto my-20 flex flex-col items-center sm:w-2/3">
		{#if posts}
			{#each posts as { node }}
				<article class="before:absolutesm:w-4/5 relative pb-28">
					<a href={`/${node.slug}`} class="mb-1 flex flex-col">
						<h2
							class="text-3xl uppercase text-white transition duration-500 ease-in-out hover:text-orange-200"
						>
							{node.title}
						</h2>
					</a>
					<div
						class="pb-4 pt-1 font-mukta text-xs font-thin uppercase tracking-wide text-orange-400"
					>
						{formatDate(node.publishedAt)}
					</div>
					<div class="text-gray-400">
						{node.brief}
					</div>
				</article>
			{/each}
		{/if}
	</section>
</main>
