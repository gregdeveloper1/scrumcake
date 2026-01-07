// Job.swift - Fluent model for jobs table
// Read-only model - Supabase manages writes via RLS

import Fluent
import Vapor

// MARK: - Enums (match PostgreSQL ENUM types)

enum LocationType: String, Codable, CaseIterable {
    case remote = "Remote"
    case hybrid = "Hybrid"
    case onSite = "On-site"
}

enum EmploymentType: String, Codable, CaseIterable {
    case fullTime = "Full-time"
    case partTime = "Part-time"
    case contract = "Contract"
    case internship = "Internship"
}

enum ExperienceLevel: String, Codable, CaseIterable {
    case entry = "Entry"
    case mid = "Mid"
    case senior = "Senior"
    case lead = "Lead"
    case executive = "Executive"
}

// MARK: - Job Model

final class Job: Model, Content, @unchecked Sendable {
    static let schema = "jobs"

    @ID(custom: "id", generatedBy: .database)
    var id: UUID?

    @Parent(key: "company_id")
    var company: Company

    @Field(key: "title")
    var title: String

    @Field(key: "slug")
    var slug: String

    @Field(key: "description")
    var description: String

    @Field(key: "requirements")
    var requirements: [String]

    @Field(key: "benefits")
    var benefits: [String]

    @Field(key: "skills")
    var skills: [String]

    @OptionalField(key: "location")
    var location: String?

    @Enum(key: "location_type")
    var locationType: LocationType

    @Enum(key: "employment_type")
    var employmentType: EmploymentType

    @Enum(key: "experience_level")
    var experienceLevel: ExperienceLevel

    @OptionalField(key: "salary_min")
    var salaryMin: Int?

    @OptionalField(key: "salary_max")
    var salaryMax: Int?

    @OptionalField(key: "salary_currency")
    var salaryCurrency: String?

    @OptionalField(key: "apply_url")
    var applyURL: String?

    @Field(key: "is_easy_apply")
    var isEasyApply: Bool

    @Field(key: "is_featured")
    var isFeatured: Bool

    @Field(key: "is_active")
    var isActive: Bool

    @OptionalField(key: "content_hash")
    var contentHash: String?

    @OptionalField(key: "source")
    var source: String?

    @OptionalField(key: "source_url")
    var sourceURL: String?

    @Timestamp(key: "posted_at", on: .none)
    var postedAt: Date?

    @OptionalField(key: "expires_at")
    var expiresAt: Date?

    @Timestamp(key: "created_at", on: .create)
    var createdAt: Date?

    @Timestamp(key: "updated_at", on: .update)
    var updatedAt: Date?

    init() {}
}
