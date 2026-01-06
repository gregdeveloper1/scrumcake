<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type TabsTriggerVariant = "default" | "neo";

	type TabsTriggerProps = TabsPrimitive.TriggerProps & {
		variant?: TabsTriggerVariant;
	};

	let {
		ref = $bindable(null),
		variant = "neo",
		class: className,
		...restProps
	}: TabsTriggerProps = $props();

	const variantClasses: Record<TabsTriggerVariant, string> = {
		default: "data-[state=active]:bg-background rounded-md border border-transparent data-[state=active]:shadow-sm",
		neo: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-[3px] border-transparent data-[state=active]:border-border rounded-none font-bold uppercase tracking-wide text-xs",
	};
</script>

<TabsPrimitive.Trigger
	bind:ref
	data-slot="tabs-trigger"
	class={cn(
		"dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		variantClasses[variant],
		className
	)}
	{...restProps}
/>
