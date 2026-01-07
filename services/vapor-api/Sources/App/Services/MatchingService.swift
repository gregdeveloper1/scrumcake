// MatchingService.swift - Job-to-profile matching algorithm
// Calculates match scores based on skills, location, and preferences

import Vapor

struct MatchingService: Sendable {
    // MARK: - Configuration

    /// Weights for different matching criteria
    struct Weights {
        static let skills: Double = 0.5
        static let location: Double = 0.2
        static let experience: Double = 0.15
        static let recency: Double = 0.15
    }

    // MARK: - Job Matching

    /// Calculate match score between a profile and a job
    /// Returns a score from 0.0 to 1.0
    func calculateJobMatchScore(profile: Profile, job: Job) -> Double {
        var score: Double = 0.0

        // Skills match (50% weight)
        let skillsScore = calculateSkillsScore(profile: profile, job: job)
        score += skillsScore * Weights.skills

        // Location match (20% weight)
        let locationScore = calculateLocationScore(profile: profile, job: job)
        score += locationScore * Weights.location

        // Experience level match (15% weight)
        let experienceScore = calculateExperienceScore(profile: profile, job: job)
        score += experienceScore * Weights.experience

        // Recency bonus (15% weight)
        let recencyScore = calculateRecencyScore(job: job)
        score += recencyScore * Weights.recency

        return min(1.0, max(0.0, score))
    }

    // MARK: - Individual Scores

    /// Calculate skills overlap score
    private func calculateSkillsScore(profile: Profile, job: Job) -> Double {
        // Extract skills from profile bio (basic implementation)
        // In production, profiles would have a dedicated skills field
        let profileSkills = extractSkillsFromBio(profile.bio ?? "")
        let jobSkills = Set(job.skills.map { $0.lowercased() })

        guard !jobSkills.isEmpty else { return 0.5 } // Neutral if no skills required

        let matchingSkills = profileSkills.intersection(jobSkills)
        return Double(matchingSkills.count) / Double(jobSkills.count)
    }

    /// Extract potential skills from bio text
    private func extractSkillsFromBio(_ bio: String) -> Set<String> {
        // Common tech skills to look for
        let knownSkills = [
            "swift", "ios", "swiftui", "uikit", "objective-c",
            "python", "javascript", "typescript", "react", "vue", "svelte",
            "node", "nodejs", "java", "kotlin", "android",
            "aws", "gcp", "azure", "docker", "kubernetes",
            "postgresql", "mysql", "mongodb", "redis",
            "git", "ci/cd", "agile", "scrum",
            "machine learning", "ml", "ai", "data science",
            "graphql", "rest", "api",
        ]

        let bioLower = bio.lowercased()
        var foundSkills: Set<String> = []

        for skill in knownSkills {
            if bioLower.contains(skill) {
                foundSkills.insert(skill)
            }
        }

        return foundSkills
    }

    /// Calculate location preference score
    private func calculateLocationScore(profile: Profile, job: Job) -> Double {
        // Remote jobs are good for everyone
        if job.locationType == .remote {
            return 1.0
        }

        // If profile has location, check for match
        if let profileLocation = profile.location,
           let jobLocation = job.location
        {
            let profileLower = profileLocation.lowercased()
            let jobLower = jobLocation.lowercased()

            // Same city/region
            if profileLower.contains(jobLower) || jobLower.contains(profileLower) {
                return 1.0
            }

            // Hybrid is partial match
            if job.locationType == .hybrid {
                return 0.5
            }
        }

        // On-site job with no location match
        return job.locationType == .onSite ? 0.2 : 0.5
    }

    /// Calculate experience level alignment
    private func calculateExperienceScore(profile: Profile, job: Job) -> Double {
        // Without explicit experience data on profile, return neutral score
        // In production, profiles would have experience_years or level field
        return 0.7 // Slightly positive default
    }

    /// Calculate recency bonus (newer jobs score higher)
    private func calculateRecencyScore(job: Job) -> Double {
        guard let postedAt = job.postedAt else {
            return 0.5
        }

        let daysSincePosted = Calendar.current.dateComponents(
            [.day],
            from: postedAt,
            to: Date()
        ).day ?? 30

        // Full score for jobs < 7 days old
        // Decreasing score up to 30 days
        // Minimum 0.3 for older jobs
        if daysSincePosted < 7 {
            return 1.0
        } else if daysSincePosted < 30 {
            return 1.0 - (Double(daysSincePosted - 7) / 23.0 * 0.5)
        } else {
            return 0.3
        }
    }

    // MARK: - Batch Matching

    /// Find best matching jobs for a profile
    func findBestMatches(profile: Profile, jobs: [Job], limit: Int = 20) -> [(job: Job, score: Double)] {
        jobs
            .map { job in (job: job, score: calculateJobMatchScore(profile: profile, job: job)) }
            .sorted { $0.score > $1.score }
            .prefix(limit)
            .map { $0 }
    }

    /// Find profiles that best match a job (for recruiter use)
    func findBestCandidates(job: Job, profiles: [Profile], limit: Int = 20) -> [(profile: Profile, score: Double)] {
        profiles
            .map { profile in (profile: profile, score: calculateJobMatchScore(profile: profile, job: job)) }
            .sorted { $0.score > $1.score }
            .prefix(limit)
            .map { $0 }
    }
}
