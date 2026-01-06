/**
 * Jobs Page Server Load
 * =====================
 *
 * Fetches jobs from Supabase with company information.
 * Falls back to mock data if database is empty or errors.
 */

import type { PageServerLoad } from './$types';
import { jobs as mockJobs } from '$lib/data/jobs';
import type { JobWithCompany } from '$lib/supabase/types';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		// Fetch jobs with company data
		const { data: dbJobs, error } = await locals.supabase
			.from('jobs')
			.select(`
				*,
				company:companies(*)
			`)
			.eq('is_active', true)
			.order('posted_at', { ascending: false });

		if (error) {
			console.error('Error fetching jobs:', error);
			// Fall back to mock data
			return { jobs: mockJobs, source: 'mock' as const };
		}

		// If no jobs in database, use mock data
		if (!dbJobs || dbJobs.length === 0) {
			return { jobs: mockJobs, source: 'mock' as const };
		}

		// Transform database jobs to match frontend Job type
		const jobs = dbJobs.map((job: JobWithCompany) => ({
			id: job.id,
			title: job.title,
			description: job.description,
			requirements: job.requirements,
			benefits: job.benefits,
			company: {
				name: job.company?.name ?? 'Unknown Company',
				logo: job.company?.logo_url ?? '/placeholder-company.png',
				location: job.company?.location ?? 'Remote',
				industry: job.company?.industry ?? 'Technology',
				website: job.company?.website ?? '',
				description: job.company?.description ?? ''
			},
			location: job.location ?? 'Remote',
			locationType: job.location_type,
			employmentType: job.employment_type,
			experienceLevel: job.experience_level,
			salary: job.salary_min && job.salary_max ? {
				min: job.salary_min,
				max: job.salary_max,
				currency: job.salary_currency
			} : undefined,
			skills: job.skills,
			postedAt: job.posted_at,
			applyUrl: job.apply_url ?? '',
			isEasyApply: job.is_easy_apply,
			isFeatured: job.is_featured
		}));

		return { jobs, source: 'database' as const };
	} catch (err) {
		console.error('Error in jobs load:', err);
		return { jobs: mockJobs, source: 'mock' as const };
	}
};
