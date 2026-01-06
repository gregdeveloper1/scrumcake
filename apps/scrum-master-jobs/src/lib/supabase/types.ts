/**
 * Supabase Database Types
 * =======================
 *
 * TypeScript types for the Supabase database schema.
 * These match the tables created in 001_initial_schema.sql.
 *
 * For auto-generated types, run:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts
 */

// ============================================
// ENUMS (match database enums)
// ============================================

export type LocationType = 'Remote' | 'Hybrid' | 'On-site';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
export type ExperienceLevel = 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
export type MatchAction = 'like' | 'pass' | 'superlike';

// ============================================
// TABLE TYPES
// ============================================

export interface Profile {
	id: string;
	username: string;
	name: string | null;
	avatar_url: string | null;
	bio: string | null;
	location: string | null;
	website: string | null;
	github: string | null;
	twitter: string | null;
	created_at: string;
	updated_at: string;
}

export interface Company {
	id: string;
	name: string;
	slug: string;
	logo_url: string | null;
	website: string | null;
	location: string | null;
	industry: string | null;
	description: string | null;
	employee_count: string | null;
	founded_year: number | null;
	is_verified: boolean;
	created_at: string;
	updated_at: string;
}

export interface Job {
	id: string;
	company_id: string;
	title: string;
	slug: string;
	description: string;
	requirements: string[];
	benefits: string[];
	skills: string[];
	location: string | null;
	location_type: LocationType;
	employment_type: EmploymentType;
	experience_level: ExperienceLevel;
	salary_min: number | null;
	salary_max: number | null;
	salary_currency: string;
	apply_url: string | null;
	is_easy_apply: boolean;
	is_featured: boolean;
	is_active: boolean;
	content_hash: string | null;
	source: string | null;
	source_url: string | null;
	posted_at: string;
	expires_at: string | null;
	created_at: string;
	updated_at: string;
}

export interface JobWithCompany extends Job {
	company: Company;
}

export interface Bookmark {
	id: string;
	user_id: string;
	job_id: string;
	notes: string | null;
	created_at: string;
}

export interface Article {
	id: string;
	author_id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	content: string;
	cover_image_url: string | null;
	tags: string[];
	community: string;
	is_published: boolean;
	is_featured: boolean;
	reading_time: number;
	hearts_count: number;
	unicorns_count: number;
	saves_count: number;
	comments_count: number;
	views_count: number;
	published_at: string | null;
	created_at: string;
	updated_at: string;
}

export interface ArticleWithAuthor extends Article {
	author: Profile;
}

export interface Match {
	id: string;
	from_user_id: string;
	to_user_id: string;
	action: MatchAction;
	is_mutual: boolean;
	created_at: string;
}

export interface LinkedAccount {
	id: string;
	user_id: string;
	linked_site: string;
	linked_user_id: string;
	linked_at: string;
}

// ============================================
// INSERT TYPES (for creating new records)
// ============================================

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;
export type CompanyInsert = Omit<Company, 'id' | 'created_at' | 'updated_at'>;
export type JobInsert = Omit<Job, 'id' | 'created_at' | 'updated_at'>;
export type BookmarkInsert = Omit<Bookmark, 'id' | 'created_at'>;
export type ArticleInsert = Omit<Article, 'id' | 'created_at' | 'updated_at' | 'hearts_count' | 'unicorns_count' | 'saves_count' | 'comments_count' | 'views_count'>;
export type MatchInsert = Omit<Match, 'id' | 'is_mutual' | 'created_at'>;

// ============================================
// UPDATE TYPES (for updating records)
// ============================================

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
export type CompanyUpdate = Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>;
export type JobUpdate = Partial<Omit<Job, 'id' | 'created_at' | 'updated_at'>>;
export type ArticleUpdate = Partial<Omit<Article, 'id' | 'author_id' | 'created_at' | 'updated_at'>>;
