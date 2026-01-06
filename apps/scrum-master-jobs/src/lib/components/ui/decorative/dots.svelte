<script lang="ts">
	import { cn } from "$lib/utils.js";

	type DotsColor = "border" | "primary" | "secondary" | "accent" | "muted";
	type DotsSize = "sm" | "md" | "lg";
	type DotsSpacing = "tight" | "normal" | "loose";

	interface DotsProps {
		color?: DotsColor;
		size?: DotsSize;
		spacing?: DotsSpacing;
		class?: string;
	}

	let { color = "border", size = "md", spacing = "normal", class: className }: DotsProps = $props();

	const colorMap: Record<DotsColor, string> = {
		border: "var(--border)",
		primary: "var(--primary)",
		secondary: "var(--secondary)",
		accent: "var(--accent)",
		muted: "var(--muted-foreground)",
	};

	const sizeMap: Record<DotsSize, string> = {
		sm: "4px",
		md: "6px",
		lg: "8px",
	};

	const spacingMap: Record<DotsSpacing, string> = {
		tight: "12px",
		normal: "20px",
		loose: "30px",
	};

	let bgStyle = $derived(
		`background-image: radial-gradient(circle, ${colorMap[color]} ${sizeMap[size]}, transparent ${sizeMap[size]}); background-size: ${spacingMap[spacing]} ${spacingMap[spacing]};`
	);
</script>

<div class={cn("w-full h-full", className)} style={bgStyle}></div>
