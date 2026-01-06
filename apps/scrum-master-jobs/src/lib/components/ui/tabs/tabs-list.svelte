<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type TabsListVariant = "default" | "neo";

	type TabsListProps = TabsPrimitive.ListProps & {
		variant?: TabsListVariant;
	};

	let {
		ref = $bindable(null),
		variant = "neo",
		class: className,
		...restProps
	}: TabsListProps = $props();

	const variantClasses: Record<TabsListVariant, string> = {
		default: "bg-muted rounded-lg p-[3px]",
		neo: "bg-card border-[4px] border-border p-1 rounded-none shadow-[4px_4px_0_0_var(--border)]",
	};
</script>

<TabsPrimitive.List
	bind:ref
	data-slot="tabs-list"
	class={cn(
		"text-muted-foreground inline-flex h-9 w-fit items-center justify-center",
		variantClasses[variant],
		className
	)}
	{...restProps}
/>
