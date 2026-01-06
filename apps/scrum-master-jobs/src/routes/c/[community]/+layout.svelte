<script lang="ts">
	import { page } from '$app/state';
	import { getCommunityById } from '$lib/data/communities';
	import { setContext } from 'svelte';

	let { children } = $props();

	let communityId = $derived(page.params.community ?? '');
	let community = $derived(getCommunityById(communityId));

	// Set community context for child components
	setContext('activeCommunity', {
		get community() {
			return community;
		}
	});
</script>

<svelte:head>
	{#if community}
		<title>{community.name} Community</title>
		<meta name="description" content={community.description} />
	{/if}
</svelte:head>

{@render children()}
