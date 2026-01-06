-- ============================================
-- Sample Data Seed
-- ============================================
-- Run this in Supabase SQL Editor after running migrations

-- ============================================
-- COMPANIES
-- ============================================

INSERT INTO public.companies (id, name, slug, logo_url, website, location, industry, description, employee_count, founded_year, is_verified)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Spotify', 'spotify', 'https://logo.clearbit.com/spotify.com', 'https://spotify.com', 'Stockholm, Sweden', 'Music & Entertainment', 'Spotify is a digital music, podcast, and video service that gives you access to millions of songs and other content from creators all over the world.', '5000+', 2006, true),
  ('c1000000-0000-0000-0000-000000000002', 'Atlassian', 'atlassian', 'https://logo.clearbit.com/atlassian.com', 'https://atlassian.com', 'Sydney, Australia', 'Software', 'Atlassian builds software that helps teams work better together. Our products include Jira, Confluence, Bitbucket, and Trello.', '5000+', 2002, true),
  ('c1000000-0000-0000-0000-000000000003', 'GitLab', 'gitlab', 'https://logo.clearbit.com/gitlab.com', 'https://gitlab.com', 'San Francisco, CA', 'DevOps', 'GitLab is a complete DevOps platform, delivered as a single application, fundamentally changing the way Development, Security, and Ops teams collaborate.', '1000-5000', 2014, true),
  ('c1000000-0000-0000-0000-000000000004', 'Shopify', 'shopify', 'https://logo.clearbit.com/shopify.com', 'https://shopify.com', 'Ottawa, Canada', 'E-commerce', 'Shopify is a leading global commerce company that provides essential internet infrastructure for commerce.', '5000+', 2006, true),
  ('c1000000-0000-0000-0000-000000000005', 'Notion', 'notion', 'https://logo.clearbit.com/notion.so', 'https://notion.so', 'San Francisco, CA', 'Productivity', 'Notion is an all-in-one workspace for your notes, tasks, wikis, and databases.', '500-1000', 2016, true),
  ('c1000000-0000-0000-0000-000000000006', 'Stripe', 'stripe', 'https://logo.clearbit.com/stripe.com', 'https://stripe.com', 'San Francisco, CA', 'Fintech', 'Stripe is a technology company that builds economic infrastructure for the internet.', '5000+', 2010, true),
  ('c1000000-0000-0000-0000-000000000007', 'Figma', 'figma', 'https://logo.clearbit.com/figma.com', 'https://figma.com', 'San Francisco, CA', 'Design', 'Figma is a collaborative interface design tool that runs in the browser.', '500-1000', 2012, true),
  ('c1000000-0000-0000-0000-000000000008', 'Linear', 'linear', 'https://logo.clearbit.com/linear.app', 'https://linear.app', 'San Francisco, CA', 'Software', 'Linear is a better way to build products. Streamlined issues, sprints, and roadmaps.', '50-100', 2019, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- JOBS
-- ============================================

INSERT INTO public.jobs (company_id, title, slug, description, requirements, benefits, skills, location, location_type, employment_type, experience_level, salary_min, salary_max, salary_currency, apply_url, is_featured, is_active, posted_at)
VALUES
  -- Spotify Jobs
  ('c1000000-0000-0000-0000-000000000001', 'Senior Scrum Master', 'senior-scrum-master',
   'We are looking for an experienced Scrum Master to join our Agile team. You will facilitate Scrum ceremonies, remove impediments, and coach teams on Agile best practices. This role requires strong facilitation skills and experience working with cross-functional teams in a fast-paced environment.',
   ARRAY['5+ years experience as Scrum Master', 'CSM or PSM certification required', 'Experience with Jira and Confluence', 'Strong facilitation and coaching skills', 'Experience with scaled Agile frameworks (SAFe, LeSS)'],
   ARRAY['Competitive salary and equity', 'Remote-first culture', 'Learning & development budget', 'Health and wellness programs', 'Flexible working hours'],
   ARRAY['Scrum', 'Agile', 'Jira', 'Confluence', 'SAFe', 'Kanban', 'Facilitation'],
   'Stockholm, Sweden', 'Hybrid', 'Full-time', 'Senior', 120000, 160000, 'USD',
   'https://www.lifeatspotify.com/jobs', true, true, NOW() - INTERVAL '2 days'),

  ('c1000000-0000-0000-0000-000000000001', 'Agile Coach', 'agile-coach',
   'Join Spotify as an Agile Coach and help our teams reach their full potential. You will work with multiple squads and tribes to improve their Agile practices and delivery capabilities.',
   ARRAY['7+ years in Agile roles', 'ICAgile or similar certification', 'Experience coaching at scale', 'Strong communication skills'],
   ARRAY['Stock options', 'Remote work', 'Annual bonus', 'Parental leave'],
   ARRAY['Agile Coaching', 'Scrum', 'Kanban', 'Leadership', 'Change Management'],
   'Remote', 'Remote', 'Full-time', 'Lead', 140000, 180000, 'USD',
   'https://www.lifeatspotify.com/jobs', true, true, NOW() - INTERVAL '5 days'),

  -- Atlassian Jobs
  ('c1000000-0000-0000-0000-000000000002', 'Scrum Master - Jira Team', 'scrum-master-jira-team',
   'Be part of the team that builds Jira! We are looking for a Scrum Master to help our engineering teams deliver amazing features to millions of users worldwide.',
   ARRAY['3+ years Scrum Master experience', 'Technical background preferred', 'Experience with software development teams', 'Excellent problem-solving skills'],
   ARRAY['Work from anywhere', 'Unlimited PTO', 'Home office setup allowance', 'Learning stipend'],
   ARRAY['Scrum', 'Jira', 'Technical Understanding', 'Agile', 'Team Facilitation'],
   'Sydney, Australia', 'Remote', 'Full-time', 'Mid', 100000, 130000, 'USD',
   'https://www.atlassian.com/company/careers', false, true, NOW() - INTERVAL '7 days'),

  -- GitLab Jobs
  ('c1000000-0000-0000-0000-000000000003', 'Engineering Manager / Scrum Master', 'engineering-manager-scrum-master',
   'GitLab is looking for an Engineering Manager who can also serve as a Scrum Master for our DevOps team. This hybrid role combines people management with Agile facilitation.',
   ARRAY['5+ years engineering management', 'Scrum Master certification', 'Experience with distributed teams', 'Strong technical background'],
   ARRAY['All-remote company', 'Equity compensation', 'Generous PTO', 'Home office budget'],
   ARRAY['Scrum', 'Engineering Management', 'DevOps', 'Git', 'CI/CD', 'Leadership'],
   'Remote', 'Remote', 'Full-time', 'Lead', 150000, 190000, 'USD',
   'https://about.gitlab.com/jobs/', true, true, NOW() - INTERVAL '3 days'),

  -- Shopify Jobs
  ('c1000000-0000-0000-0000-000000000004', 'Scrum Master - Commerce Platform', 'scrum-master-commerce-platform',
   'Help Shopify build the future of commerce! We need a passionate Scrum Master to work with our platform engineering teams.',
   ARRAY['4+ years Scrum Master experience', 'E-commerce experience preferred', 'Experience with multiple Agile frameworks', 'Strong analytical skills'],
   ARRAY['Stock options', 'Flexible work', 'Health benefits', 'Learning budget'],
   ARRAY['Scrum', 'Kanban', 'E-commerce', 'Platform Engineering', 'Agile Metrics'],
   'Ottawa, Canada', 'Hybrid', 'Full-time', 'Senior', 110000, 145000, 'USD',
   'https://www.shopify.com/careers', false, true, NOW() - INTERVAL '10 days'),

  -- Notion Jobs
  ('c1000000-0000-0000-0000-000000000005', 'Scrum Master', 'scrum-master-notion',
   'Join Notion and help us build tools that empower teams to organize their work and life. We are looking for a Scrum Master who is passionate about productivity and collaboration.',
   ARRAY['3+ years Scrum Master experience', 'Experience in startup environments', 'Strong coaching mindset', 'Passion for productivity tools'],
   ARRAY['Competitive salary', 'Equity', 'Wellness stipend', 'Professional development'],
   ARRAY['Scrum', 'Agile', 'Product Development', 'Coaching', 'Facilitation'],
   'San Francisco, CA', 'Hybrid', 'Full-time', 'Mid', 130000, 160000, 'USD',
   'https://www.notion.so/careers', false, true, NOW() - INTERVAL '4 days'),

  -- Stripe Jobs
  ('c1000000-0000-0000-0000-000000000006', 'Technical Program Manager / Scrum Master', 'tpm-scrum-master',
   'Stripe is looking for a Technical Program Manager with strong Scrum Master skills to help coordinate complex engineering initiatives across multiple teams.',
   ARRAY['5+ years program management', 'Scrum Master certification', 'Technical background (CS degree or equivalent)', 'Fintech experience preferred'],
   ARRAY['Competitive compensation', 'Equity', 'Health coverage', 'Remote-friendly'],
   ARRAY['Scrum', 'Program Management', 'Technical Coordination', 'Fintech', 'Cross-team Collaboration'],
   'San Francisco, CA', 'Remote', 'Full-time', 'Senior', 160000, 200000, 'USD',
   'https://stripe.com/jobs', true, true, NOW() - INTERVAL '1 day'),

  -- Figma Jobs
  ('c1000000-0000-0000-0000-000000000007', 'Agile Program Manager', 'agile-program-manager',
   'Figma is hiring an Agile Program Manager to help scale our engineering organization. You will work closely with product and engineering leaders to improve delivery practices.',
   ARRAY['6+ years in Agile roles', 'Experience scaling Agile practices', 'Strong stakeholder management', 'Design tool experience a plus'],
   ARRAY['Top-tier compensation', 'Equity package', 'Wellness benefits', 'Learning & development'],
   ARRAY['Agile', 'Program Management', 'Scrum', 'Scaling Practices', 'Stakeholder Management'],
   'San Francisco, CA', 'Hybrid', 'Full-time', 'Lead', 170000, 210000, 'USD',
   'https://www.figma.com/careers/', false, true, NOW() - INTERVAL '6 days'),

  -- Linear Jobs
  ('c1000000-0000-0000-0000-000000000008', 'Founding Scrum Master', 'founding-scrum-master',
   'Be the first dedicated Scrum Master at Linear! Help us establish and evolve our Agile practices as we scale our team and product.',
   ARRAY['4+ years Scrum Master experience', 'Startup experience required', 'Experience establishing Agile practices from scratch', 'Strong product sense'],
   ARRAY['Founding team equity', 'Competitive salary', 'Remote-first', 'Health benefits'],
   ARRAY['Scrum', 'Startup', 'Process Design', 'Agile Transformation', 'Product Management'],
   'Remote', 'Remote', 'Full-time', 'Senior', 140000, 170000, 'USD',
   'https://linear.app/jobs', true, true, NOW()),

  -- Entry level job
  ('c1000000-0000-0000-0000-000000000002', 'Junior Scrum Master', 'junior-scrum-master',
   'Start your career as a Scrum Master at Atlassian! We are looking for enthusiastic individuals who are passionate about Agile and want to learn from experienced coaches.',
   ARRAY['1+ years in Agile environment', 'Scrum Master certification (or willingness to obtain)', 'Strong communication skills', 'Growth mindset'],
   ARRAY['Mentorship program', 'Learning budget', 'Career growth', 'Great culture'],
   ARRAY['Scrum', 'Agile', 'Communication', 'Team Collaboration', 'Learning'],
   'Sydney, Australia', 'Hybrid', 'Full-time', 'Entry', 70000, 90000, 'USD',
   'https://www.atlassian.com/company/careers', false, true, NOW() - INTERVAL '12 days'),

  -- Contract position
  ('c1000000-0000-0000-0000-000000000003', 'Contract Scrum Master', 'contract-scrum-master',
   'GitLab needs a contract Scrum Master to help with a 6-month transformation initiative. This is a great opportunity for experienced practitioners looking for project-based work.',
   ARRAY['5+ years Scrum Master experience', 'Transformation experience', 'Available for 6-month engagement', 'Strong documentation skills'],
   ARRAY['Competitive hourly rate', 'Fully remote', 'Flexible schedule', 'Extension possible'],
   ARRAY['Scrum', 'Transformation', 'Change Management', 'Documentation', 'Training'],
   'Remote', 'Remote', 'Contract', 'Senior', 80, 120, 'USD',
   'https://about.gitlab.com/jobs/', false, true, NOW() - INTERVAL '8 days')
ON CONFLICT DO NOTHING;

-- Output count
SELECT
  (SELECT COUNT(*) FROM public.companies) as companies_count,
  (SELECT COUNT(*) FROM public.jobs) as jobs_count;
