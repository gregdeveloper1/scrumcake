/**
 * jobs.ts - Mock Job Listings Data
 * =================================
 *
 * Contains ~30 realistic tech job listings with company info,
 * salary ranges, requirements, and benefits.
 *
 * Used by:
 * - /jobs route (job board page)
 * - JobCard, JobDetail, JobFilters components
 * - RightSidebar (listings section)
 *
 * Data includes:
 * - 20 tech companies (Stripe, Vercel, Netflix, etc.)
 * - 30 job listings across various roles and levels
 * - Helper functions for filtering and formatting
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

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

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate ISO date string for N days ago.
 * Used to create realistic "posted at" dates.
 * @param days - Number of days in the past
 * @returns ISO date string
 */
function daysAgo(days: number): string {
	const date = new Date();
	date.setDate(date.getDate() - days);
	return date.toISOString();
}

// ============================================
// COMPANY DATA
// ============================================

/**
 * Mock companies for job listings.
 * Uses Clearbit logo API for real company logos.
 * Includes major tech companies across various industries.
 */
const companies: Record<string, Company> = {
	stripe: {
		name: 'Stripe',
		logo: 'https://logo.clearbit.com/stripe.com',
		location: 'San Francisco, CA',
		industry: 'Fintech'
	},
	vercel: {
		name: 'Vercel',
		logo: 'https://logo.clearbit.com/vercel.com',
		location: 'San Francisco, CA',
		industry: 'Developer Tools'
	},
	netflix: {
		name: 'Netflix',
		logo: 'https://logo.clearbit.com/netflix.com',
		location: 'Los Gatos, CA',
		industry: 'Entertainment'
	},
	spotify: {
		name: 'Spotify',
		logo: 'https://logo.clearbit.com/spotify.com',
		location: 'Stockholm, Sweden',
		industry: 'Music & Entertainment'
	},
	airbnb: {
		name: 'Airbnb',
		logo: 'https://logo.clearbit.com/airbnb.com',
		location: 'San Francisco, CA',
		industry: 'Travel & Hospitality'
	},
	notion: {
		name: 'Notion',
		logo: 'https://logo.clearbit.com/notion.so',
		location: 'San Francisco, CA',
		industry: 'Productivity'
	},
	figma: {
		name: 'Figma',
		logo: 'https://logo.clearbit.com/figma.com',
		location: 'San Francisco, CA',
		industry: 'Design Tools'
	},
	linear: {
		name: 'Linear',
		logo: 'https://logo.clearbit.com/linear.app',
		location: 'San Francisco, CA',
		industry: 'Developer Tools'
	},
	supabase: {
		name: 'Supabase',
		logo: 'https://logo.clearbit.com/supabase.com',
		location: 'San Francisco, CA',
		industry: 'Developer Tools'
	},
	planetscale: {
		name: 'PlanetScale',
		logo: 'https://logo.clearbit.com/planetscale.com',
		location: 'San Francisco, CA',
		industry: 'Database'
	},
	discord: {
		name: 'Discord',
		logo: 'https://logo.clearbit.com/discord.com',
		location: 'San Francisco, CA',
		industry: 'Social & Communication'
	},
	shopify: {
		name: 'Shopify',
		logo: 'https://logo.clearbit.com/shopify.com',
		location: 'Ottawa, Canada',
		industry: 'E-commerce'
	},
	github: {
		name: 'GitHub',
		logo: 'https://logo.clearbit.com/github.com',
		location: 'San Francisco, CA',
		industry: 'Developer Tools'
	},
	twilio: {
		name: 'Twilio',
		logo: 'https://logo.clearbit.com/twilio.com',
		location: 'San Francisco, CA',
		industry: 'Communications'
	},
	datadog: {
		name: 'Datadog',
		logo: 'https://logo.clearbit.com/datadoghq.com',
		location: 'New York, NY',
		industry: 'Monitoring & Analytics'
	},
	plaid: {
		name: 'Plaid',
		logo: 'https://logo.clearbit.com/plaid.com',
		location: 'San Francisco, CA',
		industry: 'Fintech'
	},
	coinbase: {
		name: 'Coinbase',
		logo: 'https://logo.clearbit.com/coinbase.com',
		location: 'San Francisco, CA',
		industry: 'Crypto & Web3'
	},
	openai: {
		name: 'OpenAI',
		logo: 'https://logo.clearbit.com/openai.com',
		location: 'San Francisco, CA',
		industry: 'AI & Machine Learning'
	},
	anthropic: {
		name: 'Anthropic',
		logo: 'https://logo.clearbit.com/anthropic.com',
		location: 'San Francisco, CA',
		industry: 'AI & Machine Learning'
	},
	meta: {
		name: 'Meta',
		logo: 'https://logo.clearbit.com/meta.com',
		location: 'Menlo Park, CA',
		industry: 'Social Media'
	}
};

// ============================================
// JOB LISTINGS DATA
// ============================================

/**
 * Complete list of mock job listings.
 * Includes 30 jobs across various roles, levels, and companies.
 * Each job has realistic details including salary, requirements, and benefits.
 */
export const jobs: Job[] = [
	{
		id: 'job-001',
		title: 'Senior Frontend Engineer',
		company: companies.stripe,
		location: 'San Francisco, CA',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Senior',
		salary: { min: 180000, max: 250000, currency: 'USD' },
		description: `We're looking for a Senior Frontend Engineer to help build the future of online payments. You'll work on our dashboard, APIs, and developer tools used by millions of businesses worldwide.

As part of our frontend team, you'll have the opportunity to shape how businesses interact with Stripe's products. You'll collaborate with designers, product managers, and other engineers to deliver exceptional user experiences.`,
		requirements: [
			'5+ years of experience with modern JavaScript/TypeScript',
			'Deep expertise in React and state management',
			'Experience with design systems and component libraries',
			'Strong understanding of web performance optimization',
			'Excellent communication and collaboration skills'
		],
		benefits: [
			'Competitive salary and equity',
			'Health, dental, and vision insurance',
			'401(k) with company match',
			'Flexible PTO policy',
			'Home office stipend'
		],
		skills: ['React', 'TypeScript', 'GraphQL', 'Node.js', 'CSS'],
		postedAt: daysAgo(2),
		applicants: 47,
		isEasyApply: true
	},
	{
		id: 'job-002',
		title: 'Full Stack Developer',
		company: companies.vercel,
		location: 'Remote',
		locationType: 'Remote',
		employmentType: 'Full-time',
		experienceLevel: 'Mid',
		salary: { min: 150000, max: 200000, currency: 'USD' },
		description: `Join Vercel and help us build the best developer experience for frontend teams. You'll work on Next.js, our deployment platform, and various internal tools.

We're a remote-first company with a strong culture of ownership and autonomy. You'll have the freedom to make impactful decisions while working alongside some of the best engineers in the industry.`,
		requirements: [
			'3+ years of full-stack development experience',
			'Proficiency in Next.js and React',
			'Experience with serverless architectures',
			'Familiarity with CI/CD pipelines',
			'Self-motivated with strong problem-solving skills'
		],
		benefits: [
			'Competitive compensation',
			'Fully remote work',
			'Stock options',
			'Unlimited PTO',
			'Learning & development budget'
		],
		skills: ['Next.js', 'React', 'Node.js', 'Vercel', 'PostgreSQL'],
		postedAt: daysAgo(1),
		applicants: 89,
		isEasyApply: true
	},
	{
		id: 'job-003',
		title: 'Staff Software Engineer',
		company: companies.netflix,
		location: 'Los Gatos, CA',
		locationType: 'On-site',
		employmentType: 'Full-time',
		experienceLevel: 'Lead',
		salary: { min: 250000, max: 350000, currency: 'USD' },
		description: `Netflix is seeking a Staff Software Engineer to lead initiatives on our streaming platform. You'll architect solutions that scale to hundreds of millions of users and drive technical excellence across teams.

This is a high-impact role where you'll define technical strategy, mentor engineers, and solve some of the most challenging problems in video streaming technology.`,
		requirements: [
			'8+ years of software engineering experience',
			'Experience leading large-scale distributed systems',
			'Track record of technical leadership and mentorship',
			'Strong understanding of streaming technologies',
			'Excellent written and verbal communication'
		],
		benefits: [
			'Top-of-market compensation',
			'Unlimited PTO',
			'Stock options',
			'Comprehensive health benefits',
			'Relocation assistance'
		],
		skills: ['Java', 'Python', 'AWS', 'Kafka', 'Microservices'],
		postedAt: daysAgo(5),
		applicants: 156,
		isEasyApply: false
	},
	{
		id: 'job-004',
		title: 'Backend Engineer',
		company: companies.spotify,
		location: 'Stockholm, Sweden',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Mid',
		salary: { min: 70000, max: 95000, currency: 'EUR' },
		description: `Join Spotify's backend team and help us scale music streaming to over 500 million users. You'll work on our recommendation systems, playlist features, and audio delivery infrastructure.

We value collaboration, innovation, and a data-driven approach to solving problems. You'll be part of a diverse, international team that's passionate about music and technology.`,
		requirements: [
			'3+ years backend development experience',
			'Proficiency in Python, Java, or Go',
			'Experience with microservices architecture',
			'Knowledge of data streaming technologies',
			'Passion for music and audio technology'
		],
		benefits: [
			'Competitive salary',
			'Stock options',
			'Flexible working hours',
			'Free Spotify Premium',
			'Parental leave'
		],
		skills: ['Python', 'Java', 'GCP', 'Kubernetes', 'gRPC'],
		postedAt: daysAgo(3),
		applicants: 72,
		isEasyApply: true
	},
	{
		id: 'job-005',
		title: 'Product Designer',
		company: companies.airbnb,
		location: 'San Francisco, CA',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Senior',
		salary: { min: 160000, max: 220000, currency: 'USD' },
		description: `Airbnb is looking for a Senior Product Designer to help create magical travel experiences. You'll work on features used by millions of hosts and guests worldwide.

You'll collaborate with cross-functional teams to design intuitive interfaces, conduct user research, and iterate based on feedback. Your work will directly impact how people experience travel.`,
		requirements: [
			'5+ years of product design experience',
			'Strong portfolio demonstrating UX/UI skills',
			'Experience with design systems',
			'Proficiency in Figma and prototyping tools',
			'Excellent storytelling and presentation skills'
		],
		benefits: [
			'Competitive compensation',
			'Travel credit',
			'Equity',
			'Health benefits',
			'Sabbatical program'
		],
		skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'Mobile Design'],
		postedAt: daysAgo(4),
		applicants: 203,
		isEasyApply: false
	},
	{
		id: 'job-006',
		title: 'Software Engineer, Growth',
		company: companies.notion,
		location: 'San Francisco, CA',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Mid',
		salary: { min: 140000, max: 190000, currency: 'USD' },
		description: `Join Notion's Growth team and help us bring the power of connected workspaces to more people. You'll work on experiments, optimize our funnel, and build features that drive user acquisition and retention.

We're looking for someone who's comfortable with ambiguity, loves diving into data, and can ship quickly while maintaining high quality.`,
		requirements: [
			'3+ years of software engineering experience',
			'Experience with A/B testing frameworks',
			'Data analysis skills (SQL, analytics tools)',
			'Full-stack capabilities',
			'Growth mindset and experimentation focus'
		],
		benefits: [
			'Competitive salary and equity',
			'Health insurance',
			'Unlimited PTO',
			'Learning stipend',
			'Team offsites'
		],
		skills: ['React', 'TypeScript', 'Python', 'SQL', 'A/B Testing'],
		postedAt: daysAgo(1),
		applicants: 64,
		isEasyApply: true
	},
	{
		id: 'job-007',
		title: 'Design Engineer',
		company: companies.figma,
		location: 'San Francisco, CA',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Senior',
		salary: { min: 170000, max: 230000, currency: 'USD' },
		description: `Figma is looking for a Design Engineer to bridge the gap between design and engineering. You'll create pixel-perfect implementations, build prototypes, and help define our design system.

This role is perfect for someone who's equally comfortable in Figma and code, and who cares deeply about craft and attention to detail.`,
		requirements: [
			'5+ years of frontend development experience',
			'Strong design sensibility and attention to detail',
			'Experience building and maintaining design systems',
			'Proficiency in CSS, animations, and interactions',
			'Ability to work closely with designers'
		],
		benefits: [
			'Competitive salary and equity',
			'Health benefits',
			'Flexible work schedule',
			'Professional development',
			'Home office setup'
		],
		skills: ['React', 'CSS', 'Figma', 'Design Systems', 'Animation'],
		postedAt: daysAgo(6),
		applicants: 91,
		isEasyApply: true
	},
	{
		id: 'job-008',
		title: 'Engineering Manager',
		company: companies.linear,
		location: 'Remote',
		locationType: 'Remote',
		employmentType: 'Full-time',
		experienceLevel: 'Lead',
		salary: { min: 200000, max: 280000, currency: 'USD' },
		description: `Linear is seeking an Engineering Manager to lead one of our product teams. You'll manage a team of talented engineers, drive technical decisions, and help us build the best issue tracking tool in the world.

We're a small, high-performing team that values quality, speed, and craft. You'll have significant impact on our product and culture.`,
		requirements: [
			'5+ years of engineering experience',
			'2+ years of management experience',
			'Strong technical background',
			'Experience with remote teams',
			'Excellent communication skills'
		],
		benefits: [
			'Competitive salary and equity',
			'Fully remote',
			'Unlimited PTO',
			'Equipment budget',
			'Team retreats'
		],
		skills: ['Leadership', 'React', 'TypeScript', 'System Design', 'People Management'],
		postedAt: daysAgo(2),
		applicants: 38,
		isEasyApply: false
	},
	{
		id: 'job-009',
		title: 'Database Engineer',
		company: companies.supabase,
		location: 'Remote',
		locationType: 'Remote',
		employmentType: 'Full-time',
		experienceLevel: 'Senior',
		salary: { min: 160000, max: 220000, currency: 'USD' },
		description: `Supabase is building the open-source Firebase alternative. We're looking for a Database Engineer to help us scale PostgreSQL to millions of databases and improve our real-time capabilities.

You'll work on challenging distributed systems problems, contribute to open-source, and help developers build amazing products.`,
		requirements: [
			'5+ years of database engineering experience',
			'Deep PostgreSQL expertise',
			'Experience with distributed systems',
			'Understanding of replication and sharding',
			'Open-source contributions preferred'
		],
		benefits: [
			'Competitive salary and equity',
			'Fully remote',
			'Unlimited PTO',
			'Conference budget',
			'Open source contribution time'
		],
		skills: ['PostgreSQL', 'Go', 'Rust', 'Distributed Systems', 'Kubernetes'],
		postedAt: daysAgo(7),
		applicants: 45,
		isEasyApply: true
	},
	{
		id: 'job-010',
		title: 'Senior Backend Engineer',
		company: companies.planetscale,
		location: 'Remote',
		locationType: 'Remote',
		employmentType: 'Full-time',
		experienceLevel: 'Senior',
		salary: { min: 180000, max: 240000, currency: 'USD' },
		description: `PlanetScale is revolutionizing how developers work with databases. We're looking for a Senior Backend Engineer to help build our serverless database platform powered by Vitess.

You'll tackle complex distributed systems challenges and work with cutting-edge database technology used by some of the largest companies in the world.`,
		requirements: [
			'5+ years backend development experience',
			'Experience with Go or similar languages',
			'Knowledge of MySQL/distributed databases',
			'Understanding of cloud infrastructure',
			'Strong debugging and optimization skills'
		],
		benefits: [
			'Competitive salary and equity',
			'Fully remote',
			'Unlimited PTO',
			'Home office stipend',
			'Health benefits'
		],
		skills: ['Go', 'MySQL', 'Vitess', 'Kubernetes', 'AWS'],
		postedAt: daysAgo(4),
		applicants: 52,
		isEasyApply: true
	},
	{
		id: 'job-011',
		title: 'Platform Engineer',
		company: companies.discord,
		location: 'San Francisco, CA',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Mid',
		salary: { min: 150000, max: 200000, currency: 'USD' },
		description: `Discord is looking for a Platform Engineer to help build infrastructure that serves 150+ million monthly active users. You'll work on our core platform, improving reliability, scalability, and developer productivity.

Join us in building the future of communication for gaming communities and beyond.`,
		requirements: [
			'3+ years of platform/infrastructure experience',
			'Experience with Kubernetes and containerization',
			'Proficiency in Python or Go',
			'Understanding of networking and distributed systems',
			'On-call experience preferred'
		],
		benefits: [
			'Competitive salary and equity',
			'Health benefits',
			'Unlimited PTO',
			'Gaming setup allowance',
			'Nitro subscription'
		],
		skills: ['Python', 'Go', 'Kubernetes', 'Terraform', 'GCP'],
		postedAt: daysAgo(3),
		applicants: 87,
		isEasyApply: true
	},
	{
		id: 'job-012',
		title: 'Frontend Developer',
		company: companies.shopify,
		location: 'Ottawa, Canada',
		locationType: 'Remote',
		employmentType: 'Full-time',
		experienceLevel: 'Mid',
		salary: { min: 120000, max: 160000, currency: 'CAD' },
		description: `Shopify is looking for a Frontend Developer to help empower entrepreneurs worldwide. You'll work on our merchant-facing products, helping business owners build and scale their online stores.

We believe in making commerce better for everyone, and you'll be part of that mission.`,
		requirements: [
			'3+ years of frontend development experience',
			'Proficiency in React and modern JavaScript',
			'Experience with e-commerce or complex web apps',
			'Understanding of accessibility standards',
			'Collaborative and empathetic mindset'
		],
		benefits: [
			'Competitive salary and equity',
			'Remote-first culture',
			'Health benefits',
			'$5,000 home office budget',
			'Employee stock purchase plan'
		],
		skills: ['React', 'TypeScript', 'GraphQL', 'Ruby', 'Accessibility'],
		postedAt: daysAgo(5),
		applicants: 124,
		isEasyApply: true
	},
	{
		id: 'job-013',
		title: 'DevOps Engineer',
		company: companies.github,
		location: 'Remote',
		locationType: 'Remote',
		employmentType: 'Full-time',
		experienceLevel: 'Senior',
		salary: { min: 170000, max: 230000, currency: 'USD' },
		description: `GitHub is looking for a DevOps Engineer to help us scale the world's largest developer platform. You'll work on CI/CD infrastructure, deployment automation, and developer tooling.

Join a team that's passionate about making developers' lives easier and more productive.`,
		requirements: [
			'5+ years of DevOps/SRE experience',
			'Experience with GitHub Actions or similar CI/CD',
			'Proficiency in Infrastructure as Code',
			'Knowledge of container orchestration',
			'Strong scripting skills (Bash, Python)'
		],
		benefits: [
			'Competitive compensation',
			'Microsoft benefits package',
			'Stock awards',
			'Unlimited PTO',
			'Remote-first'
		],
		skills: ['GitHub Actions', 'Kubernetes', 'Terraform', 'Azure', 'Python'],
		postedAt: daysAgo(2),
		applicants: 76,
		isEasyApply: false
	},
	{
		id: 'job-014',
		title: 'API Engineer',
		company: companies.twilio,
		location: 'San Francisco, CA',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Mid',
		salary: { min: 140000, max: 190000, currency: 'USD' },
		description: `Twilio is looking for an API Engineer to help build communication APIs that power millions of interactions every day. You'll design, build, and maintain APIs that developers love to use.

We're obsessed with developer experience, and you'll play a key role in making our APIs intuitive and reliable.`,
		requirements: [
			'3+ years of backend development experience',
			'Experience designing RESTful APIs',
			'Proficiency in Java, Python, or Go',
			'Understanding of API security best practices',
			'Strong documentation skills'
		],
		benefits: [
			'Competitive salary and equity',
			'Health benefits',
			'401(k) match',
			'Flexible PTO',
			'Learning budget'
		],
		skills: ['Java', 'REST APIs', 'OpenAPI', 'AWS', 'PostgreSQL'],
		postedAt: daysAgo(6),
		applicants: 58,
		isEasyApply: true
	},
	{
		id: 'job-015',
		title: 'Site Reliability Engineer',
		company: companies.datadog,
		location: 'New York, NY',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Senior',
		salary: { min: 180000, max: 250000, currency: 'USD' },
		description: `Datadog is seeking an SRE to help us maintain 99.99% uptime for our observability platform. You'll work on infrastructure that ingests trillions of data points daily.

You'll be part of a team that's at the forefront of monitoring and observability technology.`,
		requirements: [
			'5+ years of SRE/DevOps experience',
			'Experience with large-scale distributed systems',
			'Proficiency in Go or Python',
			'Strong Kubernetes and cloud experience',
			'Incident management experience'
		],
		benefits: [
			'Competitive salary and equity',
			'Health benefits',
			'Unlimited PTO',
			'401(k)',
			'Commuter benefits'
		],
		skills: ['Go', 'Kubernetes', 'AWS', 'Terraform', 'Prometheus'],
		postedAt: daysAgo(1),
		applicants: 43,
		isEasyApply: true
	},
	{
		id: 'job-016',
		title: 'Security Engineer',
		company: companies.plaid,
		location: 'San Francisco, CA',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Senior',
		salary: { min: 190000, max: 260000, currency: 'USD' },
		description: `Plaid connects millions of financial accounts, and security is at our core. We're looking for a Security Engineer to help protect our infrastructure and the sensitive data our customers trust us with.

You'll work on everything from security architecture to incident response, with a focus on proactive defense.`,
		requirements: [
			'5+ years of security engineering experience',
			'Experience with cloud security (AWS/GCP)',
			'Knowledge of authentication and encryption',
			'Familiarity with compliance frameworks (SOC2, PCI)',
			'Strong coding skills for security tooling'
		],
		benefits: [
			'Competitive salary and equity',
			'Health benefits',
			'401(k)',
			'Unlimited PTO',
			'Professional development'
		],
		skills: ['AWS Security', 'Python', 'Kubernetes', 'SOC2', 'Cryptography'],
		postedAt: daysAgo(8),
		applicants: 31,
		isEasyApply: false
	},
	{
		id: 'job-017',
		title: 'Blockchain Engineer',
		company: companies.coinbase,
		location: 'Remote',
		locationType: 'Remote',
		employmentType: 'Full-time',
		experienceLevel: 'Senior',
		salary: { min: 200000, max: 280000, currency: 'USD' },
		description: `Coinbase is looking for a Blockchain Engineer to help build the future of finance. You'll work on our wallet infrastructure, smart contracts, and blockchain integrations.

Join us in creating an open financial system for the world.`,
		requirements: [
			'5+ years of software engineering experience',
			'Experience with Ethereum or other blockchains',
			'Proficiency in Solidity or Rust',
			'Understanding of DeFi protocols',
			'Strong cryptography fundamentals'
		],
		benefits: [
			'Competitive salary and equity',
			'Crypto benefits',
			'Health insurance',
			'Remote-first',
			'Annual crypto stipend'
		],
		skills: ['Solidity', 'Rust', 'Go', 'Ethereum', 'Web3'],
		postedAt: daysAgo(4),
		applicants: 67,
		isEasyApply: true
	},
	{
		id: 'job-018',
		title: 'Machine Learning Engineer',
		company: companies.openai,
		location: 'San Francisco, CA',
		locationType: 'On-site',
		employmentType: 'Full-time',
		experienceLevel: 'Senior',
		salary: { min: 300000, max: 450000, currency: 'USD' },
		description: `OpenAI is seeking a Machine Learning Engineer to work on cutting-edge AI research and deployment. You'll help build and scale large language models that are transforming how people interact with AI.

This is an opportunity to work at the frontier of AI technology with world-class researchers.`,
		requirements: [
			'5+ years of ML engineering experience',
			'Experience training large-scale models',
			'Proficiency in PyTorch or JAX',
			'Strong systems engineering skills',
			'PhD preferred but not required'
		],
		benefits: [
			'Top-of-market compensation',
			'Equity',
			'Health benefits',
			'Meals and snacks',
			'Research time'
		],
		skills: ['Python', 'PyTorch', 'Transformers', 'CUDA', 'Distributed Training'],
		postedAt: daysAgo(3),
		applicants: 412,
		isEasyApply: false
	},
	{
		id: 'job-019',
		title: 'Research Engineer',
		company: companies.anthropic,
		location: 'San Francisco, CA',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Senior',
		salary: { min: 280000, max: 400000, currency: 'USD' },
		description: `Anthropic is looking for a Research Engineer to help build safe, beneficial AI systems. You'll work at the intersection of research and engineering, turning cutting-edge ideas into production-ready systems.

We're focused on AI safety and building systems that are helpful, harmless, and honest.`,
		requirements: [
			'5+ years of software engineering experience',
			'Strong ML/AI background',
			'Experience with large-scale distributed systems',
			'Excellent Python skills',
			'Interest in AI safety and alignment'
		],
		benefits: [
			'Competitive compensation',
			'Equity',
			'Health benefits',
			'Flexible schedule',
			'Research budget'
		],
		skills: ['Python', 'JAX', 'PyTorch', 'Distributed Systems', 'NLP'],
		postedAt: daysAgo(5),
		applicants: 287,
		isEasyApply: false
	},
	{
		id: 'job-020',
		title: 'iOS Engineer',
		company: companies.meta,
		location: 'Menlo Park, CA',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Mid',
		salary: { min: 170000, max: 240000, currency: 'USD' },
		description: `Meta is looking for an iOS Engineer to work on our family of apps used by billions of people. You'll build features that connect people and help them share moments with friends and family.

Join a team that's shaping the future of social technology and the metaverse.`,
		requirements: [
			'3+ years of iOS development experience',
			'Proficiency in Swift and UIKit/SwiftUI',
			'Experience with large-scale mobile apps',
			'Understanding of mobile architecture patterns',
			'Strong debugging and profiling skills'
		],
		benefits: [
			'Competitive salary and equity',
			'Health benefits',
			'401(k) match',
			'Generous PTO',
			'On-site amenities'
		],
		skills: ['Swift', 'SwiftUI', 'iOS', 'Objective-C', 'Core Data'],
		postedAt: daysAgo(2),
		applicants: 198,
		isEasyApply: true
	},
	{
		id: 'job-021',
		title: 'Junior Frontend Developer',
		company: companies.notion,
		location: 'San Francisco, CA',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Entry',
		salary: { min: 100000, max: 130000, currency: 'USD' },
		description: `Notion is hiring Junior Frontend Developers to join our growing team. This is a great opportunity to learn from experienced engineers while contributing to a product loved by millions.

We're looking for curious, motivated individuals who are eager to grow and make an impact.`,
		requirements: [
			'0-2 years of professional experience',
			'Strong JavaScript/TypeScript fundamentals',
			'Familiarity with React',
			'Eagerness to learn and grow',
			'Computer Science degree or equivalent experience'
		],
		benefits: [
			'Competitive salary and equity',
			'Health insurance',
			'Mentorship program',
			'Learning stipend',
			'Team events'
		],
		skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
		postedAt: daysAgo(1),
		applicants: 342,
		isEasyApply: true
	},
	{
		id: 'job-022',
		title: 'Data Engineer',
		company: companies.spotify,
		location: 'New York, NY',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Mid',
		salary: { min: 150000, max: 200000, currency: 'USD' },
		description: `Join Spotify's Data Engineering team and help us process petabytes of data to power music recommendations, artist insights, and business analytics.

You'll build data pipelines that enable data scientists and analysts to make better decisions.`,
		requirements: [
			'3+ years of data engineering experience',
			'Proficiency in Python and SQL',
			'Experience with Spark or similar frameworks',
			'Knowledge of data warehousing concepts',
			'Strong problem-solving skills'
		],
		benefits: [
			'Competitive salary',
			'Stock options',
			'Health benefits',
			'Free Spotify Premium',
			'Flexible work'
		],
		skills: ['Python', 'Spark', 'SQL', 'Airflow', 'BigQuery'],
		postedAt: daysAgo(6),
		applicants: 89,
		isEasyApply: true
	},
	{
		id: 'job-023',
		title: 'Technical Writer',
		company: companies.stripe,
		location: 'Remote',
		locationType: 'Remote',
		employmentType: 'Full-time',
		experienceLevel: 'Mid',
		salary: { min: 120000, max: 160000, currency: 'USD' },
		description: `Stripe is looking for a Technical Writer to help create world-class documentation for our APIs and developer tools. Our docs are a key part of the developer experience, and you'll help make them even better.

You'll work closely with engineers to understand complex systems and translate them into clear, helpful content.`,
		requirements: [
			'3+ years of technical writing experience',
			'Ability to read and understand code',
			'Experience with API documentation',
			'Strong writing and editing skills',
			'Developer-focused mindset'
		],
		benefits: [
			'Competitive salary and equity',
			'Remote work',
			'Health benefits',
			'Home office stipend',
			'Learning budget'
		],
		skills: ['Technical Writing', 'API Documentation', 'Markdown', 'Git', 'Developer Experience'],
		postedAt: daysAgo(9),
		applicants: 56,
		isEasyApply: true
	},
	{
		id: 'job-024',
		title: 'QA Engineer',
		company: companies.discord,
		location: 'San Francisco, CA',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Mid',
		salary: { min: 130000, max: 170000, currency: 'USD' },
		description: `Discord is looking for a QA Engineer to help ensure the quality of our product. You'll design test strategies, write automated tests, and work with engineers to ship reliable features.

Quality is everyone's responsibility at Discord, but you'll be the champion.`,
		requirements: [
			'3+ years of QA engineering experience',
			'Experience with test automation frameworks',
			'Proficiency in Python or JavaScript',
			'Understanding of CI/CD pipelines',
			'Strong attention to detail'
		],
		benefits: [
			'Competitive salary and equity',
			'Health benefits',
			'Unlimited PTO',
			'Gaming setup allowance',
			'Nitro subscription'
		],
		skills: ['Python', 'Selenium', 'Cypress', 'CI/CD', 'Test Planning'],
		postedAt: daysAgo(4),
		applicants: 47,
		isEasyApply: true
	},
	{
		id: 'job-025',
		title: 'Product Manager',
		company: companies.figma,
		location: 'San Francisco, CA',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Senior',
		salary: { min: 180000, max: 250000, currency: 'USD' },
		description: `Figma is looking for a Product Manager to help shape the future of design tools. You'll work with designers and engineers to define and deliver features that empower creative teams worldwide.

We're looking for someone who's passionate about design and deeply understands the problems creative professionals face.`,
		requirements: [
			'5+ years of product management experience',
			'Experience with design or developer tools',
			'Strong analytical and strategic thinking',
			'Excellent communication skills',
			'Technical background preferred'
		],
		benefits: [
			'Competitive salary and equity',
			'Health benefits',
			'Flexible work',
			'Professional development',
			'Home office setup'
		],
		skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Agile', 'Figma'],
		postedAt: daysAgo(7),
		applicants: 167,
		isEasyApply: false
	},
	{
		id: 'job-026',
		title: 'Android Developer',
		company: companies.airbnb,
		location: 'San Francisco, CA',
		locationType: 'Hybrid',
		employmentType: 'Full-time',
		experienceLevel: 'Mid',
		salary: { min: 160000, max: 210000, currency: 'USD' },
		description: `Airbnb is seeking an Android Developer to help build experiences that make travel magical. You'll work on our Android app used by millions of travelers and hosts worldwide.

Join us in creating a world where anyone can belong anywhere.`,
		requirements: [
			'3+ years of Android development experience',
			'Proficiency in Kotlin and Java',
			'Experience with modern Android architecture',
			'Understanding of mobile performance optimization',
			'Collaborative mindset'
		],
		benefits: [
			'Competitive compensation',
			'Travel credit',
			'Equity',
			'Health benefits',
			'Sabbatical program'
		],
		skills: ['Kotlin', 'Android', 'Java', 'Jetpack Compose', 'MVVM'],
		postedAt: daysAgo(3),
		applicants: 134,
		isEasyApply: true
	},
	{
		id: 'job-027',
		title: 'Solutions Engineer',
		company: companies.twilio,
		location: 'Remote',
		locationType: 'Remote',
		employmentType: 'Full-time',
		experienceLevel: 'Mid',
		salary: { min: 130000, max: 180000, currency: 'USD' },
		description: `Twilio is looking for a Solutions Engineer to help customers build amazing communication experiences. You'll work with sales teams to demonstrate our products and help customers design solutions.

This is a great role for someone who loves both coding and working with customers.`,
		requirements: [
			'3+ years of software engineering experience',
			'Excellent presentation and communication skills',
			'Experience with web technologies',
			'Customer-facing experience preferred',
			'Ability to travel occasionally'
		],
		benefits: [
			'Competitive salary and equity',
			'Health benefits',
			'Flexible PTO',
			'Remote work',
			'Travel opportunities'
		],
		skills: ['JavaScript', 'Python', 'REST APIs', 'Customer Success', 'Demos'],
		postedAt: daysAgo(5),
		applicants: 62,
		isEasyApply: true
	},
	{
		id: 'job-028',
		title: 'Infrastructure Engineer',
		company: companies.linear,
		location: 'Remote',
		locationType: 'Remote',
		employmentType: 'Full-time',
		experienceLevel: 'Senior',
		salary: { min: 180000, max: 250000, currency: 'USD' },
		description: `Linear is looking for an Infrastructure Engineer to help us build and scale our platform. You'll work on database infrastructure, deployment pipelines, and performance optimization.

We're a small team that values simplicity, speed, and craft.`,
		requirements: [
			'5+ years of infrastructure/DevOps experience',
			'Experience with PostgreSQL at scale',
			'Proficiency in Terraform and Kubernetes',
			'Strong debugging and optimization skills',
			'Interest in developer tools'
		],
		benefits: [
			'Competitive salary and equity',
			'Fully remote',
			'Unlimited PTO',
			'Equipment budget',
			'Team retreats'
		],
		skills: ['PostgreSQL', 'Kubernetes', 'Terraform', 'AWS', 'Node.js'],
		postedAt: daysAgo(8),
		applicants: 29,
		isEasyApply: true
	},
	{
		id: 'job-029',
		title: 'Growth Marketing Manager',
		company: companies.supabase,
		location: 'Remote',
		locationType: 'Remote',
		employmentType: 'Full-time',
		experienceLevel: 'Mid',
		salary: { min: 120000, max: 160000, currency: 'USD' },
		description: `Supabase is looking for a Growth Marketing Manager to help us reach more developers. You'll develop and execute growth strategies, run experiments, and analyze results to drive user acquisition.

We're an open-source company with a developer-first approach to marketing.`,
		requirements: [
			'3+ years of growth marketing experience',
			'Experience marketing to developers',
			'Strong analytical skills',
			'Understanding of developer communities',
			'Creative and data-driven mindset'
		],
		benefits: [
			'Competitive salary and equity',
			'Fully remote',
			'Unlimited PTO',
			'Conference budget',
			'Learning stipend'
		],
		skills: ['Growth Marketing', 'Analytics', 'Content Strategy', 'SEO', 'Developer Marketing'],
		postedAt: daysAgo(2),
		applicants: 78,
		isEasyApply: true
	},
	{
		id: 'job-030',
		title: 'Software Engineering Intern',
		company: companies.github,
		location: 'Remote',
		locationType: 'Remote',
		employmentType: 'Internship',
		experienceLevel: 'Entry',
		salary: { min: 8000, max: 10000, currency: 'USD' },
		description: `GitHub is looking for Software Engineering Interns to join us for a summer internship. You'll work on real projects with experienced engineers and learn how we build tools for developers worldwide.

This is a great opportunity to kickstart your career in software engineering.`,
		requirements: [
			'Currently pursuing CS degree or equivalent',
			'Strong programming fundamentals',
			'Familiarity with Git and GitHub',
			'Eagerness to learn',
			'Good communication skills'
		],
		benefits: [
			'Competitive stipend',
			'Housing assistance',
			'Mentorship program',
			'Full-time offer potential',
			'Swag and perks'
		],
		skills: ['JavaScript', 'Python', 'Git', 'Data Structures', 'Algorithms'],
		postedAt: daysAgo(1),
		applicants: 523,
		isEasyApply: true
	}
];

// ============================================
// HELPER FUNCTIONS - Filter Options
// ============================================

/**
 * Get unique locations from all job listings.
 * @returns Sorted array of location strings
 */
export function getLocations(): string[] {
	const locations = new Set(jobs.map((j) => j.location));
	return Array.from(locations).sort();
}

/**
 * Get all available location types.
 * @returns Array of location type options
 */
export function getLocationTypes(): LocationType[] {
	return ['Remote', 'Hybrid', 'On-site'];
}

/**
 * Get all available employment types.
 * @returns Array of employment type options
 */
export function getEmploymentTypes(): EmploymentType[] {
	return ['Full-time', 'Part-time', 'Contract', 'Internship'];
}

/**
 * Get all available experience levels.
 * @returns Array of experience level options
 */
export function getExperienceLevels(): ExperienceLevel[] {
	return ['Entry', 'Mid', 'Senior', 'Lead', 'Executive'];
}

/**
 * Get unique skills from all job listings.
 * @returns Sorted array of skill strings
 */
export function getSkills(): string[] {
	const skills = new Set(jobs.flatMap((j) => j.skills));
	return Array.from(skills).sort();
}

/**
 * Get unique companies from all job listings.
 * @returns Sorted array of Company objects
 */
export function getCompanies(): Company[] {
	const companyMap = new Map<string, Company>();
	jobs.forEach((j) => companyMap.set(j.company.name, j.company));
	return Array.from(companyMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// ============================================
// HELPER FUNCTIONS - Data Access
// ============================================

/**
 * Find a job by its ID.
 * @param id - Job ID to search for
 * @returns Job object or undefined if not found
 */
export function getJobById(id: string): Job | undefined {
	return jobs.find((j) => j.id === id);
}

// ============================================
// HELPER FUNCTIONS - Formatting
// ============================================

/**
 * Format salary range for display.
 * Uses Intl.NumberFormat for locale-aware formatting.
 * @param salary - Salary object with min, max, currency
 * @returns Formatted string like "$150,000 - $200,000"
 */
export function formatSalary(salary: Salary): string {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: salary.currency,
		maximumFractionDigits: 0
	});
	return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
}

/**
 * Format posted date as relative time.
 * @param dateString - ISO date string
 * @returns Human-readable string like "2 days ago"
 */
export function formatPostedDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - date.getTime());
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return 'Today';
	if (diffDays === 1) return 'Yesterday';
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
	return `${Math.floor(diffDays / 30)} months ago`;
}
