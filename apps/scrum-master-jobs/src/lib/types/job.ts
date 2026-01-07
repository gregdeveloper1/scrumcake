/**
 * Job-related type definitions
 */

export type LocationType = 'Remote' | 'Hybrid' | 'On-site';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
export type ExperienceLevel = 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';

export interface Company {
	name: string;
	logo: string;
	location: string;
	industry?: string;
}

export interface Salary {
	min: number;
	max: number;
	currency: string;
}

export interface Job {
	id: string;
	title: string;
	company: Company;
	location: string;
	locationType: LocationType;
	employmentType: EmploymentType;
	experienceLevel: ExperienceLevel;
	salary?: Salary;
	description: string;
	requirements: string[];
	benefits: string[];
	skills: string[];
	postedAt: string;
	applicants?: number;
	isEasyApply?: boolean;
}
