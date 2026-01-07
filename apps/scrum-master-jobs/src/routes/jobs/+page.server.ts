/**
 * Jobs Page Server Load
 * =====================
 *
 * Fetches jobs from Vapor API (primary) with fallback to Supabase and mock data.
 *
 * Data Flow:
 * 1. Try Vapor API (https://jobboard-vapor-api.fly.dev/api/v1/jobs)
 * 2. Fallback to Supabase direct query
 * 3. Fallback to mock data
 *
 * The Vapor API response uses camelCase (Swift conventions), while Supabase
 * uses snake_case. Both are transformed to the frontend Job type.
 */

import type { PageServerLoad } from './$types';
import { jobs as mockJobs } from '$lib/data/jobs';
import type { JobWithCompany } from '$lib/supabase/types';

// MARK: - Configuration

/** Vapor API base URL (Fly.io deployment) */
const VAPOR_API_URL = 'https://jobboard-vapor-api.fly.dev';

// MARK: - Vapor API Types

/**
 * Company data from Vapor API response.
 * Uses camelCase to match Swift/Vapor naming conventions.
 */
interface VaporCompany {
	id: string;
	name: string;
	slug: string;
	logoURL?: string;
	website?: string;
	location?: string;
	industry?: string;
	isVerified: boolean;
}

/**
 * Salary data from Vapor API response.
 */
interface VaporSalary {
	min: number;
	max: number;
	currency: string;
}

/**
 * Job data from Vapor API response.
 * Uses camelCase to match Swift/Vapor naming conventions.
 */
interface VaporJob {
	id: string;
	title: string;
	slug: string;
	description: string;
	requirements: string[];
	benefits: string[];
	skills: string[];
	location?: string;
	locationType: string;
	employmentType: string;
	experienceLevel: string;
	salary?: VaporSalary;
	company?: VaporCompany;
	postedAt: string;
	applyURL?: string;
	isEasyApply: boolean;
	isFeatured: boolean;
}

/**
 * Paginated response from Vapor API.
 */
interface VaporJobsResponse {
	items: VaporJob[];
	metadata: {
		page: number;
		perPage: number;
		total: number;
		totalPages: number;
	};
}

// MARK: - Data Transformation

/**
 * Transforms a Vapor API job to the frontend Job type.
 * Handles missing fields with sensible defaults.
 */
function transformVaporJob(job: VaporJob) {
	return {
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
	};
}

// MARK: - Server Load Function

export const load: PageServerLoad = async ({ locals, fetch }) => {
	// MARK: Try Vapor API First

	try {
		const response = await fetch(`${VAPOR_API_URL}/api/v1/jobs`);

		if (response.ok) {
			const data: VaporJobsResponse = await response.json();

			// Transform Vapor API response to match frontend Job type
			const jobs = data.items.map(transformVaporJob);

			return { jobs, source: 'vapor-api' as const };
		}
	} catch (err) {
		// Log error and continue to fallback
		console.error('[Jobs] Vapor API error, falling back to Supabase:', err);
	}

	// MARK: Fallback to Supabase

	try {
		// Query Supabase directly with RLS (Row Level Security)
		// Uses snake_case column names (PostgreSQL convention)
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
			console.error('[Jobs] Supabase error:', error.message);
			return { jobs: mockJobs, source: 'mock' as const };
		}

		if (!dbJobs || dbJobs.length === 0) {
			// No jobs in database - use mock data for demo
			return { jobs: mockJobs, source: 'mock' as const };
		}

		// Transform Supabase response (snake_case) to frontend Job type (camelCase)
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
		// Final fallback to mock data
		console.error('[Jobs] Unexpected error:', err);
		return { jobs: mockJobs, source: 'mock' as const };
	}
};
