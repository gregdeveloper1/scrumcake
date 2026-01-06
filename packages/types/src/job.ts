/**
 * Job-related type definitions
 * @module @jobboard/types/job
 */

/**
 * Work arrangement type.
 * - Remote: Work from anywhere
 * - Hybrid: Mix of remote and office
 * - On-site: Required to be in office
 */
export type LocationType = 'Remote' | 'Hybrid' | 'On-site';

/**
 * Employment arrangement type.
 * Determines hours, benefits eligibility, and contract structure.
 */
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

/**
 * Seniority/experience level for the role.
 * Maps to years of experience and responsibility level.
 */
export type ExperienceLevel = 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';

/**
 * Company information displayed in job listings.
 */
export interface Company {
	/** Company display name */
	name: string;
	/** Logo URL (uses Clearbit for real company logos) */
	logo: string;
	/** Company headquarters location */
	location: string;
	/** Industry category (optional) */
	industry?: string;
}

/**
 * Salary range for a job listing.
 */
export interface Salary {
	/** Minimum salary in the range */
	min: number;
	/** Maximum salary in the range */
	max: number;
	/** ISO 4217 currency code (USD, EUR, CAD, etc.) */
	currency: string;
}

/**
 * Complete job listing data structure.
 */
export interface Job {
	/** Unique identifier for the job */
	id: string;
	/** Job title/position name */
	title: string;
	/** Company offering the position */
	company: Company;
	/** Job location (city, state/country) */
	location: string;
	/** Work arrangement (Remote/Hybrid/On-site) */
	locationType: LocationType;
	/** Employment type (Full-time/Part-time/Contract/Internship) */
	employmentType: EmploymentType;
	/** Seniority level required */
	experienceLevel: ExperienceLevel;
	/** Salary range (optional for some listings) */
	salary?: Salary;
	/** Full job description text */
	description: string;
	/** List of job requirements/qualifications */
	requirements: string[];
	/** List of benefits offered */
	benefits: string[];
	/** Required/preferred skills (used for filtering) */
	skills: string[];
	/** ISO date string when job was posted */
	postedAt: string;
	/** Number of applicants (optional) */
	applicants?: number;
	/** Whether Easy Apply is enabled */
	isEasyApply?: boolean;
}
