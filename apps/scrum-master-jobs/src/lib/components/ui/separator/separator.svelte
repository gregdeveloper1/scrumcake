<script lang="ts">
	import { Separator as SeparatorPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type SeparatorVariant = "default" | "neo" | "neo-dashed";

	type SeparatorProps = SeparatorPrimitive.RootProps & {
		variant?: SeparatorVariant;
	};

	let {
		ref = $bindable(null),
		class: className,
		variant = "neo",
		"data-slot": dataSlot = "separator",
		...restProps
	}: SeparatorProps = $props();

	const variantClasses: Record<SeparatorVariant, string> = {
		default: "bg-border data-[orientation=horizontal]:h-px data-[orientation=vertical]:w-px",
		neo: "bg-border data-[orientation=horizontal]:h-[3px] data-[orientation=vertical]:w-[3px]",
		"neo-dashed": "border-dashed border-border data-[orientation=horizontal]:border-t-[3px] data-[orientation=horizontal]:h-0 data-[orientation=vertical]:border-l-[3px] data-[orientation=vertical]:w-0 bg-transparent",
	};
</script>

<SeparatorPrimitive.Root
	bind:ref
	data-slot={dataSlot}
	class={cn(
		"shrink-0 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full",
		variantClasses[variant],
		className
	)}
	{...restProps}
/>
