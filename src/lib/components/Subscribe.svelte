<script lang="ts">
	import { request } from 'graphql-request';

	import {
		SubscribeToNewsletterDocument,
		type PublicationFragment,
		type SubscribeToNewsletterMutation,
		type SubscribeToNewsletterMutationVariables,
		type SubscribeToNewsletterPayload
	} from '$lib/graphql/generated/graphql';

	const GQL_ENDPOINT = import.meta.env.VITE_PUBLIC_HASHNODE_GQL_ENDPOINT as string;

	let status: SubscribeToNewsletterPayload['status'];
	let requestInProgress = false;
	let email = '';

	export let publication: PublicationFragment;

	const subscribe = async () => {
		if (!email) return;

		requestInProgress = true;

		try {
			const data = await request<
				SubscribeToNewsletterMutation,
				SubscribeToNewsletterMutationVariables
			>(GQL_ENDPOINT, SubscribeToNewsletterDocument, {
				input: { publicationId: publication.id, email }
			});
			requestInProgress = false;
			status = data.subscribeToNewsletter.status;
		} catch (error) {
			requestInProgress = false;
			console.error('Failed to subscribe:', error);
		}
	};
</script>

<section
	class="m-auto my-32 flex h-52 w-full flex-col items-center justify-center gap-14 rounded-b border-t-2 border-t-orange-400 bg-zinc-900/20 bg-gradient-to-r from-[#292929] to-[#252424] px-6 py-40 shadow-lg sm:w-3/4 sm:px-20"
>
	{#if status === 'PENDING'}
		<p class="text-lg text-white">Please check your email to confirm your subscription</p>
	{:else}
		<h2 class="text-center text-lg text-white">
			I believe developers can learn from each other and grow together. Subscribe to my blog and
			let's connect!
		</h2>
		<div class="flex w-full flex-col gap-4 sm:flex-row md:flex">
			<input
				type="email"
				name="email"
				autocomplete="email"
				class="focused w-full rounded bg-zinc-900/60 px-4 py-4 text-white sm:w-96"
				bind:value={email}
				placeholder="Enter your email"
			/>
			<button
				class="focused transform rounded bg-orange-700 px-8 py-4 text-sm text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-orange-600 hover:shadow-lg"
				on:click={subscribe}
				disabled={requestInProgress}
			>
				{requestInProgress ? 'Subscribing...' : 'Subscribe'}
			</button>
		</div>
	{/if}
</section>
