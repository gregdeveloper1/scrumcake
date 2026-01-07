/**
 * Jobs Page Server Load
 * =====================
 *
 * Fetches jobs from Vapor API (primary) with fallback to Supabase and mock data.
 */

import type { PageServerLoad } from './$types';
import { jobs as mockJobs } from '$lib/data/jobs';
import type { JobWithCompany } from '$lib/supabase/types';

// Vapor API base URL
const VAPOR_API_URL = 'https://jobboard-vapor-api.fly.dev';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	// Try Vapor API first
	try {
		const response = await fetch(`${VAPOR_API_URL}/api/v1/jobs`);

		if (response.ok) {
			const data = await response.json();

			// Transform Vapor API response to match frontend Job type
			const jobs = data.items.map((job: any) => ({
				id: job.id,
				title: job.title,
				description: job.description,
				requirements: job.requirements,
				benefits: job.benefits,
				company: {
					name: job.company?.name ?? 'Unknown Company',
					logo: job.company?.logoURL ?? '/placeholder-company.png',
					location: job.company?.location ?? 'Remote',
					industry: job.company?.industry ?? 'Technology',
					website: job.company?.website ?? '',
					description: ''
				},
				location: job.location ?? 'Remote',
				locationType: job.locationType,
				employmentType: job.employmentType,
				experienceLevel: job.experienceLevel,
				salary: job.salary
					? {
							min: job.salary.min,
							max: job.salary.max,
							currency: job.salary.currency
						}
					: undefined,
				skills: job.skills,
				postedAt: job.postedAt,
				applyUrl: job.applyURL ?? '',
				isEasyApply: job.isEasyApply,
				isFeatured: job.isFeatured
			}));

			return { jobs, source: 'vapor-api' as const };
		}
	} catch (err) {
		console.error('Vapor API error, falling back to Supabase:', err);
	}

	// Fallback to Supabase
	try {
		const { data: dbJobs, error } = await locals.supabase
			.from('jobs')
			.select(
				`
				*,
				company:companies(*)
			`
			)
			.eq('is_active', true)
			.order('posted_at', { ascending: false });

		if (error) {
			console.error('Error fetching jobs:', error);
			return { jobs: mockJobs, source: 'mock' as const };
		}

		if (!dbJobs || dbJobs.length === 0) {
			return { jobs: mockJobs, source: 'mock' as const };
		}

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
			salary:
				job.salary_min && job.salary_max
					? {
							min: job.salary_min,
							max: job.salary_max,
							currency: job.salary_currency
						}
					: undefined,
			skills: job.skills,
			postedAt: job.posted_at,
			applyUrl: job.apply_url ?? '',
			isEasyApply: job.is_easy_apply,
			isFeatured: job.is_featured
		}));

		return { jobs, source: 'supabase' as const };
	} catch (err) {
		console.error('Error in jobs load:', err);
		return { jobs: mockJobs, source: 'mock' as const };
	}
};
