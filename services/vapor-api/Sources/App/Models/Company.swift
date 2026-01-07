// Company.swift - Fluent model for companies table
// Read-only model - Supabase manages writes via RLS

import Fluent
import Vapor

final class Company: Model, Content, @unchecked Sendable {
    static let schema = "companies"

    @ID(custom: "id", generatedBy: .database)
    var id: UUID?

    @Field(key: "name")
    var name: String

    @Field(key: "slug")
    var slug: String

    @OptionalField(key: "logo_url")
    var logoURL: String?

    @OptionalField(key: "website")
    var website: String?

    @OptionalField(key: "location")
    var location: String?

    @OptionalField(key: "industry")
    var industry: String?

    @OptionalField(key: "description")
    var description: String?

    @OptionalField(key: "employee_count")
    var employeeCount: String?

    @OptionalField(key: "founded_year")
    var foundedYear: Int?

    @Field(key: "is_verified")
    var isVerified: Bool

    @Timestamp(key: "created_at", on: .create)
    var createdAt: Date?

    @Timestamp(key: "updated_at", on: .update)
    var updatedAt: Date?

    // Relationships
    @Children(for: \.$company)
    var jobs: [Job]

    init() {}
}
