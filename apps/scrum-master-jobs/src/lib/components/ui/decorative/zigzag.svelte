<script lang="ts">
	import { cn } from "$lib/utils.js";

	type ZigzagColor = "border" | "primary" | "secondary" | "accent";
	type ZigzagHeight = "sm" | "md" | "lg";

	interface ZigzagProps {
		color?: ZigzagColor;
		height?: ZigzagHeight;
		class?: string;
	}

	let { color = "border", height = "md", class: className }: ZigzagProps = $props();

	const colorClasses: Record<ZigzagColor, string> = {
		border: "fill-border",
		primary: "fill-primary",
		secondary: "fill-secondary",
		accent: "fill-accent",
	};

	const heightClasses: Record<ZigzagHeight, string> = {
		sm: "h-2",
		md: "h-4",
		lg: "h-6",
	};
</script>

<div class={cn("w-full overflow-hidden", heightClasses[height], className)}>
	<svg
		class={cn("w-full h-full", colorClasses[color])}
		preserveAspectRatio="none"
		viewBox="0 0 100 10"
	>
		<polygon
			points="0,10 5,0 10,10 15,0 20,10 25,0 30,10 35,0 40,10 45,0 50,10 55,0 60,10 65,0 70,10 75,0 80,10 85,0 90,10 95,0 100,10"
		/>
	</svg>
</div>
