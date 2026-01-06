<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	type InputType = Exclude<HTMLInputTypeAttribute, "file">;
	type InputVariant = "default" | "neo";

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, "type"> &
			({ type: "file"; files?: FileList } | { type?: InputType; files?: undefined }) & {
				variant?: InputVariant;
			}
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		variant = "neo",
		class: className,
		"data-slot": dataSlot = "input",
		...restProps
	}: Props = $props();

	const defaultClasses = "border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground rounded-md border shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

	const neoClasses = "border-[4px] border-border bg-background selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground rounded-none shadow-none focus:shadow-[5px_5px_0_0_var(--border)] focus:outline-none font-medium transition-shadow duration-150";

	const variantClasses: Record<InputVariant, string> = {
		default: defaultClasses,
		neo: neoClasses,
	};
</script>

{#if type === "file"}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			"flex h-9 w-full min-w-0 px-3 pt-1.5 text-sm font-medium transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
			"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
			variantClasses[variant],
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		data-slot={dataSlot}
		class={cn(
			"flex h-9 w-full min-w-0 px-3 py-1 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
			"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
			variantClasses[variant],
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
