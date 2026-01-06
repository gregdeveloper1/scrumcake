<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	type CardVariant = "default" | "neo" | "neo-offset" | "neo-offset-blue" | "neo-offset-yellow";

	type CardProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: CardVariant;
	};

	let {
		ref = $bindable(null),
		class: className,
		variant = "neo",
		children,
		...restProps
	}: CardProps = $props();

	const variantClasses: Record<CardVariant, string> = {
		default: "rounded-xl border shadow-sm",
		neo: "border-[4px] border-border shadow-[5px_5px_0_0_var(--border)] rounded-none",
		"neo-offset": "border-[4px] border-border rounded-[12px] relative before:content-[''] before:absolute before:top-[5px] before:left-[5px] before:w-full before:h-full before:bg-primary before:border-[4px] before:border-border before:rounded-[12px] before:-z-10",
		"neo-offset-blue": "border-[4px] border-border rounded-[12px] relative before:content-[''] before:absolute before:top-[5px] before:left-[5px] before:w-full before:h-full before:bg-secondary before:border-[4px] before:border-border before:rounded-[12px] before:-z-10",
		"neo-offset-yellow": "border-[4px] border-border rounded-[12px] relative before:content-[''] before:absolute before:top-[5px] before:left-[5px] before:w-full before:h-full before:bg-accent before:border-[4px] before:border-border before:rounded-[12px] before:-z-10",
	};
</script>

<div
	bind:this={ref}
	data-slot="card"
	class={cn(
		"bg-card text-card-foreground flex flex-col gap-6 py-6",
		variantClasses[variant],
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
