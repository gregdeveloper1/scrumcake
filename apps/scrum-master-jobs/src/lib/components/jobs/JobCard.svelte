<!--
	JobCard.svelte - Compact Job Listing Card
	==========================================

	A LinkedIn-style job card showing key information at a glance.
	Used in the job list panel on the left side of the split view.

	Features:
	- Company logo/avatar
	- Job title and company name
	- Location with type badge (Remote/Hybrid/On-site)
	- Salary range
	- Posted time and applicant count
	- Easy Apply badge
	- Save/bookmark button
	- Active/selected state styling
-->

<script lang="ts">
	/**
	 * JobCard Component Script
	 * ========================
	 * Handles job card display, save state, and click interactions.
	 * Uses Svelte 5 runes for reactive state management.
	 */

	// ============================================
	// IMPORTS
	// ============================================
	import type { Job } from '$lib/data/jobs';
	import { formatSalary, formatPostedDate } from '$lib/data/jobs';
	import { cn } from '$lib/utils';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';

	// ============================================
	// COMPONENT PROPS
	// ============================================
	interface Props {
		/** The job data to display */
		job: Job;
		/** Whether this card is currently selected/active */
		isActive?: boolean;
		/** Click handler for selecting this job */
		onclick?: () => void;
		/** Additional CSS classes */
		class?: string;
	}

	let { job, isActive = false, onclick, class: className }: Props = $props();

	// ============================================
	// LOCAL STATE
	// ============================================

	/** Whether the user has bookmarked/saved this job (local state only) */
	let isSaved = $state(false);

	// ============================================
	// EVENT HANDLERS
	// ============================================

	/**
	 * Toggle save state for this job.
	 * Stops propagation to prevent triggering the parent button click.
	 * @param e - The click event
	 */
	function handleSave(e: Event) {
		e.stopPropagation();
		isSaved = !isSaved;
	}

	// ============================================
	// STYLE MAPPINGS
	// ============================================

	/**
	 * Color schemes for location type badges.
	 * - Remote: Green (eco-friendly remote work)
	 * - Hybrid: Blue (blend of options)
	 * - On-site: Orange (requires presence)
	 */
	const locationTypeColors = {
		'Remote': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
		'Hybrid': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
		'On-site': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
	};
</script>

<!-- ============================================
     JOB CARD BUTTON CONTAINER
     ============================================
     Full-width clickable card. Highlights when active.
     Uses border-bottom for list separation style.
-->
<button
	type="button"
	onclick={onclick}
	class={cn(
		'w-full text-left p-4 border-b border-border transition-all duration-200',
		'hover:bg-muted/50',
		isActive && 'bg-primary/5',
		className
	)}
>
	<div class="flex gap-3">
		<!-- COMPANY LOGO
		     Uses Avatar component with fallback for missing images.
		     Fallback shows first 2 letters of company name.
		-->
		<Avatar.Root class="h-12 w-12 shrink-0 rounded-lg">
			<Avatar.Image src={job.company.logo} alt={job.company.name} />
			<Avatar.Fallback class="rounded-lg text-sm">
				{job.company.name.slice(0, 2).toUpperCase()}
			</Avatar.Fallback>
		</Avatar.Root>

		<!-- JOB INFO COLUMN -->
		<div class="flex-1 min-w-0">
			<!-- JOB TITLE - Highlights in primary color when active -->
			<h3 class={cn(
				'font-semibold text-sm leading-tight truncate',
				isActive ? 'text-primary' : 'text-foreground'
			)}>
				{job.title}
			</h3>

			<!-- COMPANY NAME -->
			<p class="text-sm text-muted-foreground mt-0.5">
				{job.company.name}
			</p>

			<!-- LOCATION ROW with map pin icon and location type badge -->
			<p class="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
				<!-- MapPin icon -->
				<svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
					<circle cx="12" cy="10" r="3"/>
				</svg>
				<span class="truncate">{job.location}</span>
				<!-- Location type badge (Remote/Hybrid/On-site) with color coding -->
				<Badge variant="secondary" class={cn('text-[10px] px-1.5 py-0', locationTypeColors[job.locationType])}>
					{job.locationType}
				</Badge>
			</p>

			<!-- SALARY RANGE (if provided) -->
			{#if job.salary}
				<p class="text-xs font-medium text-foreground mt-1">
					{formatSalary(job.salary)}
				</p>
			{/if}

			<!-- META ROW: Posted time, applicant count, and badges -->
			<div class="flex items-center gap-2 mt-2 flex-wrap">
				<!-- Relative time since posting (e.g., "2 days ago") -->
				<span class="text-xs text-muted-foreground">
					{formatPostedDate(job.postedAt)}
				</span>

				<!-- Applicant count if available -->
				{#if job.applicants}
					<span class="text-xs text-muted-foreground">
						· {job.applicants} applicants
					</span>
				{/if}

				<!-- Easy Apply badge with checkmark icon -->
				{#if job.isEasyApply}
					<Badge variant="secondary" class="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
						<svg class="h-3 w-3 mr-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
							<path d="m9 11 3 3L22 4"/>
						</svg>
						Easy Apply
					</Badge>
				{/if}
			</div>
		</div>

		<!-- SAVE/BOOKMARK BUTTON
		     Uses div with role="button" to avoid nested <button> elements.
		     Supports both click and keyboard (Enter) activation.
		     Icon fills when saved, outline when not.
		-->
		<div
			role="button"
			tabindex="0"
			class={cn(
				'h-8 w-8 shrink-0 flex items-center justify-center rounded-md',
				'hover:bg-muted transition-colors cursor-pointer'
			)}
			onclick={handleSave}
			onkeydown={(e) => e.key === 'Enter' && handleSave(e)}
		>
			<!-- Bookmark icon: filled when saved -->
			<svg
				class={cn('h-4 w-4 transition-colors', isSaved ? 'fill-primary text-primary' : 'text-muted-foreground')}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill={isSaved ? 'currentColor' : 'none'}
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
			</svg>
		</div>
	</div>
</button>
