<script>
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';

	export let data;

	const post = data.props?.post.publication?.post?.content.html;
	const postTitle = data.props?.post.publication?.post?.title;
	const postCoverImage = data.props?.post.publication?.post?.coverImage?.url;
</script>

<Header />

<main class="mx-auto my-10 max-w-5xl px-6">
	<article class="prose mx-auto dark:prose-invert">
		<h1 class="font-sans font-semibold">{postTitle}</h1>
		<img src={postCoverImage} alt="Post" class="h-[400px] w-full rounded-2xl object-cover" />
		{@html post}
	</article>
</main>

<Footer />
