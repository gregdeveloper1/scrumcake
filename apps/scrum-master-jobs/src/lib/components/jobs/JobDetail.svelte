<!--
	JobDetail.svelte - Full Job Description Panel
	==============================================

	The right-side panel showing complete job details.
	LinkedIn-style layout with sticky header.

	Sections:
	- Header with title, company, and apply button
	- Job meta info (type, experience, posted date)
	- About the role
	- Requirements
	- Benefits
	- Skills/Tags
-->

<script lang="ts">
	/**
	 * JobDetail Component Script
	 * ==========================
	 * Full job detail panel for the right side of the split view.
	 * Shows comprehensive job information with sticky header.
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
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	// ============================================
	// COMPONENT PROPS
	// ============================================
	interface Props {
		/** The job to display (null shows empty state) */
		job: Job | null;
		/** Additional CSS classes */
		class?: string;
	}

	let { job, class: className }: Props = $props();

	// ============================================
	// LOCAL STATE
	// ============================================

	/** Whether the user has bookmarked/saved this job */
	let isSaved = $state(false);

	/** Reference to scroll container for programmatic scroll control */
	let scrollViewport: HTMLDivElement | null = $state(null);

	// ============================================
	// EFFECTS
	// ============================================

	/**
	 * Reset scroll position when a new job is selected.
	 * Ensures user always sees the top of job details.
	 */
	$effect(() => {
		if (job?.id && scrollViewport) {
			scrollViewport.scrollTop = 0;
		}
	});

	// ============================================
	// STYLE MAPPINGS
	// ============================================

	/**
	 * Color schemes for location type badges.
	 * Matches JobCard color scheme for consistency.
	 */
	const locationTypeColors = {
		'Remote': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
		'Hybrid': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
		'On-site': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
	};
</script>

<!-- ============================================
     MAIN CONTENT (when job is selected)
     ============================================ -->
{#if job}
	<div class={cn('flex flex-col h-full bg-card overflow-hidden', className)}>
		<!-- ========================================
		     FIXED HEADER
		     ========================================
		     Stays visible while content scrolls.
		     Contains: logo, title, badges, actions.
		-->
		<div class="shrink-0 bg-card border-b border-border p-6">
			<div class="flex items-start gap-4">
				<!-- COMPANY LOGO (larger than card version) -->
				<Avatar.Root class="h-16 w-16 shrink-0 rounded-xl">
					<Avatar.Image src={job.company.logo} alt={job.company.name} />
					<Avatar.Fallback class="rounded-xl text-lg">
						{job.company.name.slice(0, 2).toUpperCase()}
					</Avatar.Fallback>
				</Avatar.Root>

				<!-- TITLE & COMPANY INFO -->
				<div class="flex-1 min-w-0">
					<!-- Job title as main heading -->
					<h1 class="text-xl font-bold text-foreground leading-tight">
						{job.title}
					</h1>
					<!-- Company and location -->
					<p class="text-base text-muted-foreground mt-1">
						{job.company.name} · {job.location}
					</p>
					<!-- BADGE ROW: Location type, employment type, experience level -->
					<div class="flex items-center gap-2 mt-2 flex-wrap">
						<!-- Remote/Hybrid/On-site badge -->
						<Badge variant="secondary" class={cn('text-xs', locationTypeColors[job.locationType])}>
							{job.locationType}
						</Badge>
						<!-- Full-time/Part-time/Contract -->
						<Badge variant="outline" class="text-xs">
							{job.employmentType}
						</Badge>
						<!-- Entry/Mid/Senior level -->
						<Badge variant="outline" class="text-xs">
							{job.experienceLevel} level
						</Badge>
						<!-- Easy Apply badge if enabled -->
						{#if job.isEasyApply}
							<Badge variant="secondary" class="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
								<svg class="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
									<path d="m9 11 3 3L22 4"/>
								</svg>
								Easy Apply
							</Badge>
						{/if}
					</div>
				</div>

				<!-- ACTION BUTTONS (Save + Apply) -->
				<div class="flex items-center gap-2 shrink-0">
					<!-- Save/Bookmark toggle button -->
					<Button
						variant="ghost"
						size="icon"
						class="h-10 w-10"
						onclick={() => isSaved = !isSaved}
					>
						<svg
							class={cn('h-5 w-5 transition-colors', isSaved ? 'fill-primary text-primary' : 'text-muted-foreground')}
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
					</Button>
					<!-- Primary CTA: Apply button -->
					<Button class="px-6">
						{job.isEasyApply ? 'Easy Apply' : 'Apply Now'}
					</Button>
				</div>
			</div>

			<!-- META ROW: Posted date, applicants, salary -->
			<div class="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
				<!-- Posted date with clock icon -->
				<span class="flex items-center gap-1">
					<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"/>
						<polyline points="12 6 12 12 16 14"/>
					</svg>
					{formatPostedDate(job.postedAt)}
				</span>
				<!-- Applicant count with users icon -->
				{#if job.applicants}
					<span class="flex items-center gap-1">
						<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
							<circle cx="9" cy="7" r="4"/>
							<path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
							<path d="M16 3.13a4 4 0 0 1 0 7.75"/>
						</svg>
						{job.applicants} applicants
					</span>
				{/if}
				<!-- Salary range with dollar icon (highlighted) -->
				{#if job.salary}
					<span class="flex items-center gap-1 font-medium text-foreground">
						<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="10"/>
							<path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
							<path d="M12 18V6"/>
						</svg>
						{formatSalary(job.salary)}
					</span>
				{/if}
			</div>
		</div>

		<!-- ========================================
		     SCROLLABLE CONTENT AREA
		     ========================================
		     Contains all job detail sections.
		     Scroll position resets when job changes.
		-->
		<div
			bind:this={scrollViewport}
			class="flex-1 min-h-0 overflow-y-auto"
		>
			<div class="p-6 space-y-6">
				<!-- ABOUT THE ROLE SECTION
				     Free-form description text with preserved line breaks
				-->
				<section>
					<h2 class="text-lg font-semibold mb-3">About the role</h2>
					<p class="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
						{job.description}
					</p>
				</section>

				<Separator />

				<!-- REQUIREMENTS SECTION
				     Bulleted list with checkmark icons
				-->
				<section>
					<h2 class="text-lg font-semibold mb-3">Requirements</h2>
					<ul class="space-y-2">
						{#each job.requirements as requirement}
							<li class="flex items-start gap-2 text-sm text-muted-foreground">
								<!-- Check icon in primary color -->
								<svg class="h-4 w-4 mt-0.5 text-primary shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M20 6 9 17l-5-5"/>
								</svg>
								<span>{requirement}</span>
							</li>
						{/each}
					</ul>
				</section>

				<Separator />

				<!-- BENEFITS SECTION
				     Two-column grid with green checkmark icons
				-->
				<section>
					<h2 class="text-lg font-semibold mb-3">Benefits</h2>
					<ul class="grid grid-cols-2 gap-2">
						{#each job.benefits as benefit}
							<li class="flex items-center gap-2 text-sm text-muted-foreground">
								<!-- Circle check icon in green -->
								<svg class="h-4 w-4 text-green-500 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
									<path d="m9 11 3 3L22 4"/>
								</svg>
								<span>{benefit}</span>
							</li>
						{/each}
					</ul>
				</section>

				<Separator />

				<!-- SKILLS SECTION
				     Horizontal list of skill badges
				-->
				<section>
					<h2 class="text-lg font-semibold mb-3">Skills</h2>
					<div class="flex flex-wrap gap-2">
						{#each job.skills as skill}
							<Badge variant="secondary" class="text-xs">
								{skill}
							</Badge>
						{/each}
					</div>
				</section>

				<Separator />

				<!-- COMPANY INFO SECTION
				     Card-style display with company logo and "View Company" button
				-->
				<section>
					<h2 class="text-lg font-semibold mb-3">About {job.company.name}</h2>
					<div class="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
						<!-- Company logo (smaller version) -->
						<Avatar.Root class="h-12 w-12 shrink-0 rounded-lg">
							<Avatar.Image src={job.company.logo} alt={job.company.name} />
							<Avatar.Fallback class="rounded-lg">
								{job.company.name.slice(0, 2).toUpperCase()}
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex-1">
							<h3 class="font-semibold">{job.company.name}</h3>
							<p class="text-sm text-muted-foreground">{job.company.location}</p>
						</div>
						<!-- CTA to view company profile (UI only) -->
						<Button variant="outline" size="sm">
							View Company
						</Button>
					</div>
				</section>
			</div>
		</div>
	</div>
<!-- ============================================
     EMPTY STATE (no job selected)
     ============================================
     Shows when job prop is null.
     Prompts user to select a job from the list.
-->
{:else}
	<div class={cn('flex flex-col items-center justify-center h-full bg-card text-center p-8', className)}>
		<!-- Briefcase icon in muted circle -->
		<div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
			<svg class="h-8 w-8 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
				<rect width="20" height="14" x="2" y="6" rx="2"/>
			</svg>
		</div>
		<h2 class="text-lg font-semibold text-foreground">Select a job</h2>
		<p class="text-sm text-muted-foreground mt-1 max-w-xs">
			Click on a job listing to view the full details and apply
		</p>
	</div>
{/if}
