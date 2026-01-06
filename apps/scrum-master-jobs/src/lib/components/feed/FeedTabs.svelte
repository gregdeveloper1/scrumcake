<script lang="ts">
	import { cn } from '$lib/utils';

	type TabType = 'relevant' | 'latest' | 'top';

	interface Props {
		activeTab?: TabType;
		onTabChange?: (tab: TabType) => void;
	}

	let { activeTab = $bindable('relevant'), onTabChange }: Props = $props();

	const tabs = [
		{ id: 'relevant' as const, label: 'Relevant' },
		{ id: 'latest' as const, label: 'Latest' },
		{ id: 'top' as const, label: 'Top' }
	];

	function handleTabClick(tab: TabType) {
		activeTab = tab;
		onTabChange?.(tab);
	}
</script>

<div class="flex gap-1 border-b border-border">
	{#each tabs as tab}
		<button
			onclick={() => handleTabClick(tab.id)}
			class={cn(
				'px-4 py-3 text-sm font-medium transition-colors relative',
				activeTab === tab.id
					? 'text-foreground'
					: 'text-muted-foreground hover:text-foreground'
			)}
		>
			{tab.label}
			{#if activeTab === tab.id}
				<span class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
			{/if}
		</button>
	{/each}
</div>
