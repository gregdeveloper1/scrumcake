<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type AvatarVariant = "default" | "neo";

	type AvatarProps = AvatarPrimitive.RootProps & {
		variant?: AvatarVariant;
	};

	let {
		ref = $bindable(null),
		loadingStatus = $bindable("loading"),
		variant = "neo",
		class: className,
		...restProps
	}: AvatarProps = $props();

	const variantClasses: Record<AvatarVariant, string> = {
		default: "rounded-full",
		neo: "rounded-none border-[3px] border-border shadow-[3px_3px_0_0_var(--border)]",
	};
</script>

<AvatarPrimitive.Root
	bind:ref
	bind:loadingStatus
	data-slot="avatar"
	class={cn("relative flex size-8 shrink-0 overflow-hidden", variantClasses[variant], className)}
	{...restProps}
/>
