<script lang="ts">
	import { Popover as PopoverPrimitive } from "bits-ui";
	import PopoverPortal from "./popover-portal.svelte";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	type PopoverVariant = "default" | "neo";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		align = "center",
		variant = "neo",
		portalProps,
		...restProps
	}: PopoverPrimitive.ContentProps & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof PopoverPortal>>;
		variant?: PopoverVariant;
	} = $props();

	const variantClasses: Record<PopoverVariant, string> = {
		default: "rounded-md border shadow-md",
		neo: "rounded-none border-[4px] border-border shadow-[5px_5px_0_0_var(--border)]",
	};
</script>

<PopoverPortal {...portalProps}>
	<PopoverPrimitive.Content
		bind:ref
		data-slot="popover-content"
		{sideOffset}
		{align}
		class={cn(
			"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-end-2 data-[side=right]:slide-in-from-start-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--bits-popover-content-transform-origin) p-4 outline-hidden",
			variantClasses[variant],
			className
		)}
		{...restProps}
	/>
</PopoverPortal>
