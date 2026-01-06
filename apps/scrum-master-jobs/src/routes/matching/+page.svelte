<!--
	Matching Page - Tinder-Style Developer Matching
	================================================

	A swipe-based interface for matching with other developers.
	- Swipe right to connect
	- Swipe left to pass
	- View developer profiles with skills and interests
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { setActiveSection } from '$lib/stores/navigation.svelte';
	import { users, type User } from '$lib/data/users';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	// Set active section on mount
	onMount(() => {
		setActiveSection('matching');
	});

	// Extended profile data with skills for matching
	interface MatchProfile extends User {
		skills: string[];
		interests: string[];
		lookingFor: string;
	}

	// Add skills and interests to users for matching context
	const skillSets = [
		['TypeScript', 'React', 'Node.js', 'GraphQL', 'AWS'],
		['Python', 'Django', 'PostgreSQL', 'Docker', 'Kubernetes'],
		['Svelte', 'SvelteKit', 'Tailwind', 'Vercel', 'Prisma'],
		['Go', 'Rust', 'gRPC', 'Redis', 'MongoDB'],
		['Swift', 'SwiftUI', 'iOS', 'Firebase', 'CoreData'],
		['Vue', 'Nuxt', 'Vite', 'Pinia', 'Supabase'],
		['Java', 'Spring', 'Kafka', 'Elasticsearch', 'Jenkins'],
		['Ruby', 'Rails', 'Sidekiq', 'Heroku', 'Stripe'],
	];

	const interestSets = [
		['Open Source', 'Mentoring', 'Startups'],
		['AI/ML', 'Data Science', 'Research'],
		['Design Systems', 'Accessibility', 'UX'],
		['DevOps', 'Cloud Architecture', 'Security'],
		['Mobile Apps', 'Cross-platform', 'AR/VR'],
		['Web3', 'Blockchain', 'DeFi'],
		['Gaming', 'Creative Coding', 'WebGL'],
		['Technical Writing', 'Teaching', 'Community'],
	];

	const lookingForOptions = [
		'Co-founder for a startup',
		'Open source collaborators',
		'Mentorship opportunities',
		'Pair programming partners',
		'Side project teammates',
		'Technical discussions',
		'Job referrals',
		'Conference buddies',
	];

	// Create match profiles from users
	const profiles: MatchProfile[] = users.map((user, index) => ({
		...user,
		skills: skillSets[index % skillSets.length],
		interests: interestSets[index % interestSets.length],
		lookingFor: lookingForOptions[index % lookingForOptions.length],
	}));

	// Current profile index
	let currentIndex = $state(0);

	// Swipe state
	let swipeDirection = $state<'left' | 'right' | null>(null);
	let isAnimating = $state(false);
	let dragX = $state(0);
	let isDragging = $state(false);
	let startX = $state(0);

	// Matches and passes
	let matches = $state<string[]>([]);
	let passes = $state<string[]>([]);

	// Current profile
	let currentProfile = $derived(profiles[currentIndex] ?? null);
	let nextProfile = $derived(profiles[currentIndex + 1] ?? null);

	// Swipe thresholds
	const SWIPE_THRESHOLD = 100;

	// Handle swipe action
	function handleSwipe(direction: 'left' | 'right') {
		if (isAnimating || !currentProfile) return;

		isAnimating = true;
		swipeDirection = direction;

		// Add to matches or passes
		if (direction === 'right') {
			matches = [...matches, currentProfile.id];
		} else {
			passes = [...passes, currentProfile.id];
		}

		// Animate out and move to next
		setTimeout(() => {
			currentIndex++;
			swipeDirection = null;
			isAnimating = false;
			dragX = 0;
		}, 300);
	}

	// Drag handlers
	function handleDragStart(e: MouseEvent | TouchEvent) {
		if (isAnimating) return;
		isDragging = true;
		startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
	}

	function handleDragMove(e: MouseEvent | TouchEvent) {
		if (!isDragging) return;
		const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		dragX = currentX - startX;
	}

	function handleDragEnd() {
		if (!isDragging) return;
		isDragging = false;

		if (Math.abs(dragX) > SWIPE_THRESHOLD) {
			handleSwipe(dragX > 0 ? 'right' : 'left');
		} else {
			dragX = 0;
		}
	}

	// Reset and start over
	function resetMatching() {
		currentIndex = 0;
		matches = [];
		passes = [];
	}

	// Card rotation based on drag
	let cardRotation = $derived(isDragging ? dragX * 0.08 : 0);
</script>

<svelte:head>
	<title>Developer Matching | Community</title>
	<meta name="description" content="Find developers to connect with" />
</svelte:head>

<div class="flex h-[calc(100vh-4rem-36px)] flex-col items-center justify-center p-4 overflow-hidden relative bg-background">
	<!-- Dynamic background based on profile photo -->
	{#if currentProfile}
		<div
			class="absolute inset-0 transition-all duration-700 ease-out pointer-events-none -z-10"
			style="background-image: url({currentProfile.avatar.replace('w=100&h=100', 'w=400&h=400')}); background-size: cover; background-position: center; filter: blur(80px) saturate(1.5); opacity: 0.35; transform: scale(1.2);"
		></div>
		<div class="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60 pointer-events-none -z-10"></div>
	{/if}

	{#if currentProfile}
		<!-- Card Stack Container -->
		<div class="relative w-full max-w-sm h-[540px] overflow-visible perspective-1000">
			<!-- Card Stack Effect (deck of cards) -->
			{#each [3, 2, 1] as stackIndex}
				{@const profile = profiles[currentIndex + stackIndex]}
				{#if profile}
					<div
						class="absolute inset-0 transition-all duration-500 ease-out origin-bottom"
						style="
							transform: translateY({stackIndex * 4}px) translateZ({-stackIndex * 20}px) rotateX({stackIndex * 1}deg);
							opacity: {1 - stackIndex * 0.15};
							z-index: {-stackIndex};
							box-shadow: 0 {stackIndex * 4}px {stackIndex * 8}px rgba(0,0,0,0.1);
						"
					>
						<div class="h-full w-full rounded-2xl bg-card border border-border overflow-hidden">
							<div class="relative h-64 shrink-0">
								<img
									src={profile.avatar.replace('w=100&h=100', 'w=400&h=400')}
									alt={profile.name}
									class="h-full w-full object-cover"
								/>
								<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
							</div>
						</div>
					</div>
				{/if}
			{/each}

			<!-- Current Card -->
			<div
				class={cn(
					'absolute inset-0 cursor-grab active:cursor-grabbing',
					isAnimating && swipeDirection === 'left' && 'animate-swipe-left',
					isAnimating && swipeDirection === 'right' && 'animate-swipe-right',
					!isAnimating && !isDragging && 'transition-transform duration-300 ease-out'
				)}
				style="transform: translateX({dragX}px) rotate({cardRotation}deg); z-index: 10;"
				role="button"
				tabindex="0"
				onmousedown={handleDragStart}
				onmousemove={handleDragMove}
				onmouseup={handleDragEnd}
				onmouseleave={handleDragEnd}
				ontouchstart={handleDragStart}
				ontouchmove={handleDragMove}
				ontouchend={handleDragEnd}
			>
				<!-- Swipe Indicators -->
				{#if dragX > 50}
					<div class="absolute top-8 left-8 z-10 rotate-[-20deg] rounded-lg border-4 border-green-500 px-4 py-2">
						<span class="text-2xl font-bold text-green-500">CONNECT</span>
					</div>
				{/if}
				{#if dragX < -50}
					<div class="absolute top-8 right-8 z-10 rotate-[20deg] rounded-lg border-4 border-red-500 px-4 py-2">
						<span class="text-2xl font-bold text-red-500">PASS</span>
					</div>
				{/if}

				<div class="h-full w-full rounded-2xl bg-card border border-border shadow-xl overflow-hidden flex flex-col">
					<!-- Profile Image -->
					<div class="relative h-64 shrink-0">
						<img
							src={currentProfile.avatar.replace('w=100&h=100', 'w=400&h=400')}
							alt={currentProfile.name}
							class="h-full w-full object-cover"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
						<div class="absolute bottom-4 left-4 text-white">
							<h2 class="text-2xl font-bold">{currentProfile.name}</h2>
							<p class="text-sm opacity-90">{currentProfile.work}</p>
						</div>
					</div>

					<!-- Profile Info -->
					<div class="flex-1 overflow-y-auto p-4 space-y-4">
						<!-- Location -->
						<div class="flex items-center gap-2 text-muted-foreground">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
								<circle cx="12" cy="10" r="3"/>
							</svg>
							<span class="text-sm">{currentProfile.location}</span>
						</div>

						<!-- Bio -->
						<p class="text-sm text-foreground">{currentProfile.bio}</p>

						<!-- Looking For -->
						<div class="rounded-lg bg-primary/10 p-3">
							<p class="text-xs text-muted-foreground mb-1">Looking for</p>
							<p class="text-sm font-medium text-primary">{currentProfile.lookingFor}</p>
						</div>

						<!-- Skills -->
						<div>
							<p class="text-xs text-muted-foreground mb-2">Skills</p>
							<div class="flex flex-wrap gap-1.5">
								{#each currentProfile.skills as skill}
									<span class="px-2 py-1 text-xs rounded-full bg-muted text-foreground">{skill}</span>
								{/each}
							</div>
						</div>

						<!-- Interests -->
						<div>
							<p class="text-xs text-muted-foreground mb-2">Interests</p>
							<div class="flex flex-wrap gap-1.5">
								{#each currentProfile.interests as interest}
									<span class="px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">{interest}</span>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="flex items-center gap-4 mt-6">
			<!-- Pass Button -->
			<button
				type="button"
				onclick={() => handleSwipe('left')}
				disabled={isAnimating}
				class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-200 bg-white text-red-500 shadow-lg transition-all hover:scale-110 hover:border-red-500 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M18 6 6 18"/>
					<path d="m6 6 12 12"/>
				</svg>
			</button>

			<!-- Undo Button -->
			<button
				type="button"
				onclick={resetMatching}
				disabled={currentIndex === 0}
				class="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition-all hover:scale-105 hover:text-foreground disabled:opacity-30 disabled:hover:scale-100"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
					<path d="M3 3v5h5"/>
				</svg>
			</button>

			<!-- Connect Button -->
			<button
				type="button"
				onclick={() => handleSwipe('right')}
				disabled={isAnimating}
				class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-200 bg-white text-green-500 shadow-lg transition-all hover:scale-110 hover:border-green-500 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
				</svg>
			</button>
		</div>

		<!-- Stats -->
		<div class="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
			<span>{currentIndex + 1} / {profiles.length}</span>
			<span class="text-green-500">{matches.length} matches</span>
			<span class="text-red-500">{passes.length} passed</span>
		</div>

	{:else}
		<!-- No More Profiles -->
		<div class="text-center space-y-6">
			<div class="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
					<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
				</svg>
			</div>
			<div>
				<h2 class="text-2xl font-bold">You've seen everyone!</h2>
				<p class="text-muted-foreground mt-2">Check back later for new developers</p>
			</div>
			<div class="flex items-center justify-center gap-4 text-sm">
				<span class="text-green-500 font-medium">{matches.length} matches</span>
				<span class="text-muted-foreground">|</span>
				<span class="text-red-500 font-medium">{passes.length} passed</span>
			</div>
			<Button onclick={resetMatching} class="mt-4">
				Start Over
			</Button>
		</div>
	{/if}
</div>

<style>
	.perspective-1000 {
		perspective: 1000px;
	}

	@keyframes swipe-left {
		0% {
			transform: translateX(0) translateY(0) rotate(0deg) scale(1);
			opacity: 1;
		}
		30% {
			transform: translateX(-80px) translateY(-30px) rotate(-15deg) scale(1.02);
			opacity: 1;
		}
		100% {
			transform: translateX(-150vw) translateY(-100px) rotate(-35deg) scale(0.9);
			opacity: 0;
		}
	}

	@keyframes swipe-right {
		0% {
			transform: translateX(0) translateY(0) rotate(0deg) scale(1);
			opacity: 1;
		}
		30% {
			transform: translateX(80px) translateY(-30px) rotate(15deg) scale(1.02);
			opacity: 1;
		}
		100% {
			transform: translateX(150vw) translateY(-100px) rotate(35deg) scale(0.9);
			opacity: 0;
		}
	}

	.animate-swipe-left {
		animation: swipe-left 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
	}

	.animate-swipe-right {
		animation: swipe-right 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
	}
</style>
