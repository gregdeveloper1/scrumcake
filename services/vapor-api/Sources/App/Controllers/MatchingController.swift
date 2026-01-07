// MatchingController.swift - Job matching endpoints
// JWT protected - requires Supabase authentication

import Vapor
import Fluent

struct MatchingController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let matching = routes.grouped("matching")

        // JWT protected endpoints
        let protected = matching.grouped(SupabaseJWTMiddleware())
        protected.get("jobs", use: getMatchedJobs)
    }

    // MARK: - GET /api/v1/matching/jobs

    /// Get jobs matched to user's profile
    @Sendable
    func getMatchedJobs(req: Request) async throws -> [MatchedJobDTO] {
        // Get authenticated user from JWT
        let user = try req.auth.require(AuthenticatedUser.self)

        // Get user's profile
        guard let profile = try await Profile.find(user.id, on: req.db) else {
            throw Abort(.notFound, reason: "Profile not found")
        }

        // Get active jobs
        let jobs = try await Job.query(on: req.db)
            .filter(\.$isActive == true)
            .with(\.$company)
            .sort(\.$postedAt, .descending)
            .limit(50)
            .all()

        // Calculate match scores
        let matchingService = MatchingService()
        var matchedJobs: [MatchedJobDTO] = []

        for job in jobs {
            let score = matchingService.calculateJobMatchScore(profile: profile, job: job)
            let dto = try MatchedJobDTO(from: job, matchScore: score)
            matchedJobs.append(dto)
        }

        // Sort by match score (descending)
        matchedJobs.sort { $0.matchScore > $1.matchScore }

        // Return top matches
        return Array(matchedJobs.prefix(20))
    }
}

// MARK: - Matched Job DTO

struct MatchedJobDTO: Content {
    let id: UUID
    let title: String
    let slug: String
    let company: CompanyDTO
    let location: String?
    let locationType: String
    let employmentType: String
    let experienceLevel: String
    let salary: SalaryDTO?
    let skills: [String]
    let postedAt: Date?
    let matchScore: Double
    let matchReasons: [String]

    init(from job: Job, matchScore: Double) throws {
        self.id = try job.requireID()
        self.title = job.title
        self.slug = job.slug
        self.company = CompanyDTO(from: job.company)
        self.location = job.location
        self.locationType = job.locationType.rawValue
        self.employmentType = job.employmentType.rawValue
        self.experienceLevel = job.experienceLevel.rawValue
        self.skills = job.skills
        self.postedAt = job.postedAt
        self.matchScore = matchScore

        // Generate match reasons
        var reasons: [String] = []
        if matchScore >= 0.8 {
            reasons.append("Excellent skill match")
        } else if matchScore >= 0.6 {
            reasons.append("Good skill match")
        }
        if job.locationType == .remote {
            reasons.append("Remote position")
        }
        self.matchReasons = reasons

        // Salary
        if let min = job.salaryMin, let max = job.salaryMax {
            self.salary = SalaryDTO(
                min: min,
                max: max,
                currency: job.salaryCurrency ?? "USD"
            )
        } else {
            self.salary = nil
        }
    }
}
