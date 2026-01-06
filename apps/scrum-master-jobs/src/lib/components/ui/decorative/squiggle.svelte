<script lang="ts">
	import { cn } from "$lib/utils.js";

	type SquiggleColor = "border" | "primary" | "secondary" | "accent";
	type SquiggleWeight = "thin" | "medium" | "thick";

	interface SquiggleProps {
		color?: SquiggleColor;
		weight?: SquiggleWeight;
		class?: string;
	}

	let { color = "border", weight = "medium", class: className }: SquiggleProps = $props();

	const colorClasses: Record<SquiggleColor, string> = {
		border: "stroke-border",
		primary: "stroke-primary",
		secondary: "stroke-secondary",
		accent: "stroke-accent",
	};

	const weightClasses: Record<SquiggleWeight, string> = {
		thin: "[stroke-width:2]",
		medium: "[stroke-width:4]",
		thick: "[stroke-width:6]",
	};
</script>

<div class={cn("w-full h-6 overflow-hidden", className)}>
	<svg
		class={cn("w-full h-full fill-none", colorClasses[color], weightClasses[weight])}
		preserveAspectRatio="none"
		viewBox="0 0 200 20"
	>
		<path
			d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10 T120,10 T140,10 T160,10 T180,10 T200,10"
			stroke-linecap="round"
		/>
	</svg>
</div>
