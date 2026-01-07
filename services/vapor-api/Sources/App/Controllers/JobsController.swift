// JobsController.swift - Job listing and search endpoints
// Vapor 5 compatible: uses async/await throughout

import Vapor
import Fluent

struct JobsController: RouteCollection {
    func boot(routes: any RoutesBuilder) throws {
        let jobs = routes.grouped("jobs")

        // Public endpoints
        jobs.get(use: index)
        jobs.get(":jobID", use: show)
        jobs.get("search", use: search)
        jobs.get("slug", ":slug", use: showBySlug)

        // Admin endpoints (API key protected)
        let adminJobs = jobs.grouped(APIKeyMiddleware())
        adminJobs.post("bulk", use: bulkImport)
        adminJobs.delete("expired", use: cleanExpired)
    }

    // MARK: - GET /api/v1/jobs

    /// List jobs with filtering and pagination
    @Sendable
    func index(req: Request) async throws -> PaginatedResponse<JobDTO> {
        let filters = try req.query.decode(JobFilters.self)

        var query = Job.query(on: req.db)
            .filter(\.$isActive == true)
            .with(\.$company)

        // Apply filters
        if let locationType = filters.locationType {
            query = query.filter(\.$locationType == locationType)
        }
        if let employmentType = filters.employmentType {
            query = query.filter(\.$employmentType == employmentType)
        }
        if let experienceLevel = filters.experienceLevel {
            query = query.filter(\.$experienceLevel == experienceLevel)
        }
        if let companyID = filters.companyID {
            query = query.filter(\.$company.$id == companyID)
        }

        // Skills filter (PostgreSQL array overlap)
        if let skills = filters.skills, !skills.isEmpty {
            query = query.filter(\.$skills, .custom("&&"), skills)
        }

        // Basic search (title/description)
        if let search = filters.search, !search.isEmpty {
            let searchTerm = "%\(search.lowercased())%"
            query = query.group(.or) { group in
                group.filter(\.$title, .custom("ILIKE"), searchTerm)
                group.filter(\.$description, .custom("ILIKE"), searchTerm)
            }
        }

        // Get total count
        let total = try await query.count()

        // Pagination
        let page = filters.pageNumber
        let perPage = filters.itemsPerPage
        let offset = (page - 1) * perPage

        let jobs = try await query
            .sort(\.$isFeatured, .descending)
            .sort(\.$postedAt, .descending)
            .offset(offset)
            .limit(perPage)
            .all()

        // Transform to DTOs
        let dtos = try jobs.map { try JobDTO(from: $0) }

        return PaginatedResponse(
            items: dtos,
            metadata: .init(
                page: page,
                perPage: perPage,
                total: total,
                totalPages: (total + perPage - 1) / perPage
            )
        )
    }

    // MARK: - GET /api/v1/jobs/:jobID

    /// Get job by ID
    @Sendable
    func show(req: Request) async throws -> JobDTO {
        guard let jobID = req.parameters.get("jobID", as: UUID.self) else {
            throw Abort(.badRequest, reason: "Invalid job ID")
        }

        guard let job = try await Job.query(on: req.db)
            .filter(\.$id == jobID)
            .filter(\.$isActive == true)
            .with(\.$company)
            .first()
        else {
            throw Abort(.notFound, reason: "Job not found")
        }

        return try JobDTO(from: job)
    }

    // MARK: - GET /api/v1/jobs/slug/:slug

    /// Get job by slug
    @Sendable
    func showBySlug(req: Request) async throws -> JobDTO {
        guard let slug = req.parameters.get("slug") else {
            throw Abort(.badRequest, reason: "Invalid slug")
        }

        guard let job = try await Job.query(on: req.db)
            .filter(\.$slug == slug)
            .filter(\.$isActive == true)
            .with(\.$company)
            .first()
        else {
            throw Abort(.notFound, reason: "Job not found")
        }

        return try JobDTO(from: job)
    }

    // MARK: - GET /api/v1/jobs/search

    /// Full-text search across jobs
    @Sendable
    func search(req: Request) async throws -> [JobDTO] {
        guard let q = req.query[String.self, at: "q"], !q.isEmpty else {
            throw Abort(.badRequest, reason: "Query parameter 'q' is required")
        }

        let limit = min(req.query[Int.self, at: "limit"] ?? 20, 100)

        // PostgreSQL full-text search
        let searchQuery = q.split(separator: " ").map { "\($0):*" }.joined(separator: " & ")

        let jobs = try await Job.query(on: req.db)
            .filter(\.$isActive == true)
            .filter(.sql(unsafeRaw: "to_tsvector('english', title || ' ' || description) @@ to_tsquery('english', '\(searchQuery)')"))
            .with(\.$company)
            .sort(\.$postedAt, .descending)
            .limit(limit)
            .all()

        return try jobs.map { try JobDTO(from: $0) }
    }

    // MARK: - POST /api/v1/jobs/bulk (Admin)

    /// Bulk import jobs with deduplication
    @Sendable
    func bulkImport(req: Request) async throws -> BulkImportResult {
        let imports = try req.content.decode([JobImportDTO].self)

        var inserted = 0
        var deduplicated = 0
        var errors: [String] = []

        for (index, jobImport) in imports.enumerated() {
            do {
                // Generate content hash for deduplication
                let contentHash = DeduplicationService.generateHash(
                    title: jobImport.title,
                    company: jobImport.companyName,
                    description: jobImport.description
                )

                // Check for existing job with same hash
                let existing = try await Job.query(on: req.db)
                    .filter(\.$contentHash == contentHash)
                    .first()

                if existing != nil {
                    deduplicated += 1
                    continue
                }

                // Find or create company
                let company = try await findOrCreateCompany(
                    name: jobImport.companyName,
                    slug: jobImport.companySlug,
                    on: req.db
                )

                // Create job
                let job = Job()
                job.$company.id = try company.requireID()
                job.title = jobImport.title
                job.slug = generateSlug(from: jobImport.title)
                job.description = jobImport.description
                job.requirements = jobImport.requirements ?? []
                job.benefits = jobImport.benefits ?? []
                job.skills = jobImport.skills ?? []
                job.location = jobImport.location
                job.locationType = LocationType(rawValue: jobImport.locationType ?? "Remote") ?? .remote
                job.employmentType = EmploymentType(rawValue: jobImport.employmentType ?? "Full-time") ?? .fullTime
                job.experienceLevel = ExperienceLevel(rawValue: jobImport.experienceLevel ?? "Mid") ?? .mid
                job.salaryMin = jobImport.salaryMin
                job.salaryMax = jobImport.salaryMax
                job.salaryCurrency = jobImport.salaryCurrency
                job.applyURL = jobImport.applyURL
                job.isEasyApply = false
                job.isFeatured = false
                job.isActive = true
                job.contentHash = contentHash
                job.source = jobImport.source
                job.sourceURL = jobImport.sourceURL
                job.postedAt = Date()

                try await job.save(on: req.db)
                inserted += 1

            } catch {
                errors.append("Row \(index + 1): \(error.localizedDescription)")
            }
        }

        return BulkImportResult(
            total: imports.count,
            inserted: inserted,
            deduplicated: deduplicated,
            errors: errors
        )
    }

    // MARK: - DELETE /api/v1/jobs/expired (Admin)

    /// Clean up expired jobs
    @Sendable
    func cleanExpired(req: Request) async throws -> HTTPStatus {
        try await Job.query(on: req.db)
            .filter(\.$expiresAt < Date())
            .set(\.$isActive, to: false)
            .update()

        return .ok
    }

    // MARK: - Helpers

    private func findOrCreateCompany(name: String, slug: String?, on db: any Database) async throws -> Company {
        let companySlug = slug ?? generateSlug(from: name)

        if let existing = try await Company.query(on: db)
            .filter(\.$slug == companySlug)
            .first()
        {
            return existing
        }

        let company = Company()
        company.name = name
        company.slug = companySlug
        company.isVerified = false
        try await company.save(on: db)

        return company
    }

    private func generateSlug(from text: String) -> String {
        text.lowercased()
            .replacingOccurrences(of: " ", with: "-")
            .filter { $0.isLetter || $0.isNumber || $0 == "-" }
    }
}
