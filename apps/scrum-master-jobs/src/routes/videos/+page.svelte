<!--
	Videos Page - TikTok-style Single Video Feed
	=============================================

	A single video player within the main content area layout:
	- One video at a time (TikTok-style)
	- Navigation arrows to go between videos
	- Spring animation on transitions
	- White/background color (respects theme)
	- Same layout constraints as community tab
-->

<script lang="ts">
	/**
	 * Videos Page Script
	 * ==================
	 * Handles video playback, navigation, and user interactions.
	 * Uses Svelte 5 runes for reactive state management.
	 */

	import { onMount } from 'svelte';
	import { setActiveSection } from '$lib/stores/navigation.svelte';
	import { videos, formatViewCount, type Video } from '$lib/data/videos';
	import { cn } from '$lib/utils';

	// ============================================
	// LIFECYCLE
	// ============================================

	/**
	 * Set the active navigation section to 'videos' when component mounts.
	 * This updates the NavigationSidebar and hides the RightSidebar.
	 */
	onMount(() => {
		setActiveSection('videos');
	});

	// ============================================
	// STATE MANAGEMENT
	// ============================================

	/** Current index in the videos array (0-based) */
	let currentIndex = $state(0);

	/** Whether a transition animation is in progress */
	let isAnimating = $state(false);

	/** Direction of the current animation: 'up' (next) or 'down' (prev) */
	let animationDirection = $state<'up' | 'down' | null>(null);

	/** Derived: The currently displayed video object */
	let currentVideo = $derived(videos[currentIndex]);

	/** Set of video IDs the user has liked (local state only) */
	let liked = $state<Set<string>>(new Set());

	/** Set of video IDs the user has saved/bookmarked (local state only) */
	let saved = $state<Set<string>>(new Set());

	// ============================================
	// NAVIGATION FUNCTIONS
	// ============================================

	/**
	 * Navigate to the previous video in the list.
	 * Triggers a 3D flip animation with 'down' direction.
	 * Blocked if already at first video or animation in progress.
	 */
	function prevVideo() {
		if (currentIndex > 0 && !isAnimating) {
			animationDirection = 'down';
			isAnimating = true;

			// Two-phase animation: exit (150ms) then enter (300ms)
			setTimeout(() => {
				currentIndex--;
				setTimeout(() => {
					isAnimating = false;
					animationDirection = null;
				}, 300);
			}, 150);
		}
	}

	/**
	 * Navigate to the next video in the list.
	 * Triggers a 3D flip animation with 'up' direction.
	 * Blocked if already at last video or animation in progress.
	 */
	function nextVideo() {
		if (currentIndex < videos.length - 1 && !isAnimating) {
			animationDirection = 'up';
			isAnimating = true;

			// Two-phase animation: exit (150ms) then enter (300ms)
			setTimeout(() => {
				currentIndex++;
				setTimeout(() => {
					isAnimating = false;
					animationDirection = null;
				}, 300);
			}, 150);
		}
	}

	/**
	 * Global keyboard event handler for video navigation.
	 * Supports: ArrowUp/K (prev), ArrowDown/J/Space (next)
	 */
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowUp' || e.key === 'k') {
			e.preventDefault();
			prevVideo();
		} else if (e.key === 'ArrowDown' || e.key === 'j' || e.key === ' ') {
			e.preventDefault();
			nextVideo();
		}
	}

	// ============================================
	// INTERACTION HANDLERS
	// ============================================

	/**
	 * Toggle the liked state for a video.
	 * @param videoId - The ID of the video to toggle
	 */
	function toggleLike(videoId: string) {
		if (liked.has(videoId)) {
			liked.delete(videoId);
		} else {
			liked.add(videoId);
		}
		// Trigger reactivity by reassigning the Set
		liked = liked;
	}

	/**
	 * Toggle the saved/bookmarked state for a video.
	 * @param videoId - The ID of the video to toggle
	 */
	function toggleSave(videoId: string) {
		if (saved.has(videoId)) {
			saved.delete(videoId);
		} else {
			saved.add(videoId);
		}
		// Trigger reactivity by reassigning the Set
		saved = saved;
	}

	// ============================================
	// UTILITY FUNCTIONS
	// ============================================

	/**
	 * Format a number for display (e.g., 1500 -> "1K", 1500000 -> "1.5M")
	 * @param num - The number to format
	 * @returns Formatted string with K/M suffix
	 */
	function formatCount(num: number): string {
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(1)}M`;
		} else if (num >= 1000) {
			return `${Math.floor(num / 1000)}K`;
		}
		return num.toString();
	}
</script>

<!-- ============================================
     GLOBAL EVENT LISTENERS
     ============================================ -->
<!-- Listen for keyboard events globally (J/K or Arrow keys for navigation) -->
<svelte:window onkeydown={handleKeydown} />

<!-- ============================================
     SEO META TAGS
     ============================================ -->
<svelte:head>
	<title>Videos | DevCommunity</title>
	<meta name="description" content="Watch developer content shorts" />
</svelte:head>

<!-- ============================================
     MAIN PAGE CONTAINER
     ============================================
     Uses theme-aware background color and minimum height
     to fill the viewport below the header.
-->
<div class="p-4 lg:p-6 bg-background min-h-[calc(100vh-4rem-36px)]">

	<!-- ========================================
	     VIDEO PLAYER LAYOUT
	     ========================================
	     Flexbox container with:
	     - Main video area (with nav arrows) on the left
	     - Video playlist on the right (large screens only)
	-->
	<div class="flex gap-4 items-start">

		<!-- ====================================
		     MAIN VIDEO AREA WITH ARROWS
		     ====================================
		     Centers the video player with navigation
		     arrows on each side. Uses perspective
		     for 3D flip animation effect.
		-->
		<div class="flex-1 flex justify-center items-center gap-4 perspective-1000">

			<!-- PREVIOUS VIDEO ARROW
			     - Disabled at first video or during animation
			     - Shows muted style when disabled
			     - Scales up on hover when enabled
			-->
			<button
				onclick={prevVideo}
				disabled={currentIndex === 0 || isAnimating}
				class={cn(
					'w-10 h-10 rounded-full flex items-center justify-center transition-all border shrink-0',
					currentIndex === 0
						? 'bg-muted text-muted-foreground/30 border-transparent cursor-not-allowed'
						: 'bg-card text-foreground border-border hover:bg-muted hover:scale-110'
				)}
				aria-label="Previous video"
			>
				<!-- ChevronUp icon -->
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="m18 15-6-6-6 6"/>
				</svg>
			</button>

			<!-- VIDEO CARD WITH 3D ANIMATION
			     - Applies 3D flip rotation based on animation direction
			     - Up direction: rotates forward (negative X)
			     - Down direction: rotates backward (positive X)
			     - Uses preserve-3d for child element depth
			-->
			<div
				class={cn(
					'relative w-full max-w-sm transition-all duration-300',
					!isAnimating && 'opacity-100 scale-100 rotate-x-0 blur-0',
					isAnimating && animationDirection === 'up' && 'opacity-0 scale-90 -rotate-x-12 blur-sm',
					isAnimating && animationDirection === 'down' && 'opacity-0 scale-90 rotate-x-12 blur-sm'
				)}
				style="transform-style: preserve-3d; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);"
			>
				<!-- ================================
				     VIDEO PLAYER CONTAINER
				     ================================
				     9:16 aspect ratio (portrait/mobile format)
				     with black background and rounded corners.
				-->
				<div class="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-xl border border-border">

					<!-- HTML5 VIDEO ELEMENT
					     - Autoplay enabled for seamless experience
					     - Loop for continuous playback
					     - Playsinline prevents fullscreen on mobile
					     - Native controls shown for user interaction
					-->
					<video
						src={currentVideo.videoUrl}
						class="absolute inset-0 w-full h-full object-cover"
						autoplay
						loop
						playsinline
						controls
					>
						<!-- Empty captions track for accessibility compliance -->
						<track kind="captions" />
					</video>

					<!-- ============================
					     VIDEO INFO OVERLAY
					     ============================
					     Semi-transparent gradient overlay at bottom
					     showing creator info, title, and tags.
					     Offset from right to not cover action buttons.
					-->
					<div class="absolute bottom-0 left-0 right-14 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">

						<!-- CREATOR INFO ROW
						     Shows avatar, username, verified badge, and follow button
						-->
						<div class="flex items-center gap-3 mb-3 pointer-events-auto">
							<!-- Creator Avatar -->
							<img
								src={currentVideo.creator.avatar}
								alt={currentVideo.creator.name}
								class="w-10 h-10 rounded-full border-2 border-white object-cover"
							/>
							<div class="flex-1 min-w-0">
								<!-- Username with optional verified badge -->
								<div class="flex items-center gap-1.5">
									<span class="text-white font-semibold text-sm">@{currentVideo.creator.username}</span>
									{#if currentVideo.creator.verified}
										<!-- Blue checkmark verified badge -->
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#60a5fa" stroke="none">
											<circle cx="12" cy="12" r="10"/>
											<path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									{/if}
								</div>
								<!-- Follow button (UI only, no action) -->
								<button class="text-white text-xs bg-white/20 px-3 py-1 rounded-full mt-1 hover:bg-white/30 transition-colors">
									Follow
								</button>
							</div>
						</div>

						<!-- VIDEO TITLE & DESCRIPTION -->
						<h2 class="text-white font-semibold text-base mb-1">{currentVideo.title}</h2>
						<p class="text-white/80 text-sm line-clamp-2">{currentVideo.description}</p>

						<!-- HASHTAGS (limited to first 3) -->
						<div class="flex flex-wrap gap-1.5 mt-2">
							{#each currentVideo.tags.slice(0, 3) as tag}
								<span class="text-white/70 text-xs">#{tag}</span>
							{/each}
						</div>
					</div>

					<!-- ============================
					     ACTION BUTTONS (RIGHT SIDE)
					     ============================
					     TikTok-style vertical action bar with:
					     Like, Comment, Save, Share buttons.
					     Each shows icon + count below.
					-->
					<div class="absolute right-2 bottom-20 flex flex-col items-center gap-4 z-20">

						<!-- LIKE BUTTON
						     - Toggles red background when liked
						     - Shows filled heart when liked
						     - Count increases by 1 when liked
						-->
						<button
							class="flex flex-col items-center gap-1"
							onclick={() => toggleLike(currentVideo.id)}
						>
							<div class={cn(
								'w-11 h-11 rounded-full flex items-center justify-center transition-all',
								liked.has(currentVideo.id) ? 'bg-red-500 scale-110' : 'bg-black/40 hover:bg-black/60'
							)}>
								<!-- Heart icon: filled when liked -->
								<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={liked.has(currentVideo.id) ? 'white' : 'none'} stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
								</svg>
							</div>
							<span class="text-white text-xs font-medium">
								{formatCount(currentVideo.likes + (liked.has(currentVideo.id) ? 1 : 0))}
							</span>
						</button>

						<!-- COMMENT BUTTON (UI only, no action) -->
						<button class="flex flex-col items-center gap-1">
							<div class="w-11 h-11 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
								<!-- Message bubble icon -->
								<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
								</svg>
							</div>
							<span class="text-white text-xs font-medium">{formatCount(currentVideo.comments)}</span>
						</button>

						<!-- SAVE/BOOKMARK BUTTON
						     - Toggles yellow background when saved
						     - Shows filled bookmark when saved
						-->
						<button
							class="flex flex-col items-center gap-1"
							onclick={() => toggleSave(currentVideo.id)}
						>
							<div class={cn(
								'w-11 h-11 rounded-full flex items-center justify-center transition-all',
								saved.has(currentVideo.id) ? 'bg-yellow-500 scale-110' : 'bg-black/40 hover:bg-black/60'
							)}>
								<!-- Bookmark icon: filled when saved -->
								<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={saved.has(currentVideo.id) ? 'white' : 'none'} stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
								</svg>
							</div>
							<span class="text-white text-xs font-medium">{formatCount(currentVideo.saves)}</span>
						</button>

						<!-- SHARE BUTTON (UI only, no action) -->
						<button class="flex flex-col items-center gap-1">
							<div class="w-11 h-11 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
								<!-- Share/upload icon -->
								<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/>
								</svg>
							</div>
							<span class="text-white text-xs font-medium">{formatCount(currentVideo.shares)}</span>
						</button>
					</div>
				</div>

				<!-- VIDEO STATS BAR (Below player)
				     Shows view count and formatted duration
				-->
				<div class="mt-3 px-2">
					<div class="flex items-center gap-3 text-sm text-muted-foreground">
						<span class="flex items-center gap-1">
							<!-- Eye icon for views -->
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
								<circle cx="12" cy="12" r="3"/>
							</svg>
							{formatViewCount(currentVideo.views)} views
						</span>
						<span>·</span>
						<!-- Duration formatted as M:SS -->
						<span>{Math.floor(currentVideo.duration / 60)}:{(currentVideo.duration % 60).toString().padStart(2, '0')}</span>
					</div>
				</div>
			</div>

			<!-- NEXT VIDEO ARROW
			     - Disabled at last video or during animation
			     - Shows muted style when disabled
			     - Scales up on hover when enabled
			-->
			<button
				onclick={nextVideo}
				disabled={currentIndex === videos.length - 1 || isAnimating}
				class={cn(
					'w-10 h-10 rounded-full flex items-center justify-center transition-all border shrink-0',
					currentIndex === videos.length - 1
						? 'bg-muted text-muted-foreground/30 border-transparent cursor-not-allowed'
						: 'bg-card text-foreground border-border hover:bg-muted hover:scale-110'
				)}
				aria-label="Next video"
			>
				<!-- ChevronDown icon -->
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="m6 9 6 6 6-6"/>
				</svg>
			</button>
		</div>

		<!-- ========================================
		     RIGHT COLUMN - VIDEO PLAYLIST
		     ========================================
		     Scrollable list of all videos. Hidden on
		     mobile (lg:block). Shows currently playing
		     indicator on the active video.
		-->
		<div class="hidden lg:block w-72 shrink-0">
			<!-- Sticky positioning so playlist stays visible while scrolling -->
			<div class="sticky top-4">
				<!-- Scrollable container with max height -->
				<div class="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
					{#each videos as video, index}
						<!-- VIDEO LIST ITEM
						     - Full-width button for click handling
						     - Highlighted ring when this video is playing
						-->
						<button
							onclick={() => { currentIndex = index; }}
							class={cn(
								'w-full flex gap-3 p-2 rounded-lg text-left transition-all',
								index === currentIndex
									? 'bg-primary/10 ring-1 ring-primary/30'
									: 'hover:bg-muted/50'
							)}
						>
							<!-- THUMBNAIL with duration badge -->
							<div class="relative w-20 aspect-[9/16] rounded-md overflow-hidden bg-muted shrink-0">
								<!-- Muted video for thumbnail preview -->
								<video
									src={video.videoUrl}
									class="absolute inset-0 w-full h-full object-cover"
									muted
									preload="metadata"
								>
									<track kind="captions" />
								</video>
								<!-- "Now Playing" overlay with pause icon -->
								{#if index === currentIndex}
									<div class="absolute inset-0 bg-black/40 flex items-center justify-center">
										<div class="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
											<!-- Pause icon (two vertical bars) -->
											<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="text-foreground">
												<rect x="6" y="4" width="4" height="16" />
												<rect x="14" y="4" width="4" height="16" />
											</svg>
										</div>
									</div>
								{/if}
								<!-- Duration badge (bottom-right) -->
								<div class="absolute bottom-1 right-1 px-1 py-0.5 bg-black/70 rounded text-white text-[10px]">
									{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
								</div>
							</div>

							<!-- VIDEO INFO (title, creator, views) -->
							<div class="flex-1 min-w-0 py-0.5">
								<h4 class="text-xs font-medium text-foreground line-clamp-2 leading-tight">
									{video.title}
								</h4>
								<p class="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
									@{video.creator.username}
									{#if video.creator.verified}
										<!-- Smaller verified badge for list view -->
										<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#3b82f6" stroke="none">
											<circle cx="12" cy="12" r="10"/>
											<path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									{/if}
								</p>
								<p class="text-[10px] text-muted-foreground mt-0.5">
									{formatViewCount(video.views)} views
								</p>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- ============================================
     CUSTOM CSS FOR 3D ANIMATIONS
     ============================================
     These styles enable the 3D flip transition effect
     when navigating between videos. Uses CSS perspective
     and rotateX transforms for depth illusion.
-->
<style>
	/**
	 * PERSPECTIVE CONTAINER
	 * Creates a 3D rendering context for child elements.
	 * The 1000px value provides a moderate depth effect.
	 */
	.perspective-1000 {
		perspective: 1000px;
	}

	/**
	 * ROTATION STATES
	 * Global utility classes for X-axis rotation.
	 * - rotate-x-0: No rotation (resting state)
	 * - -rotate-x-12: Tilted forward (going to next video)
	 * - rotate-x-12: Tilted backward (going to previous video)
	 */
	:global(.rotate-x-0) {
		transform: rotateX(0deg);
	}

	:global(.-rotate-x-12) {
		transform: rotateX(-12deg);
	}

	:global(.rotate-x-12) {
		transform: rotateX(12deg);
	}

	/**
	 * BLUR STATES
	 * Global utility classes for blur effects during transition.
	 * - blur-0: Clear/sharp (resting state)
	 * - blur-sm: Slightly blurred (during animation)
	 */
	:global(.blur-0) {
		filter: blur(0);
	}

	:global(.blur-sm) {
		filter: blur(4px);
	}
</style>
