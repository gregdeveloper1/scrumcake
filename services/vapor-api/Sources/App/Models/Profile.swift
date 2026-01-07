// Profile.swift - Fluent model for profiles table
// Read-only model - Supabase manages writes via RLS

import Fluent
import Vapor

final class Profile: Model, Content, @unchecked Sendable {
    static let schema = "profiles"

    // Note: profiles.id references auth.users(id)
    @ID(custom: "id", generatedBy: .database)
    var id: UUID?

    @Field(key: "username")
    var username: String

    @OptionalField(key: "name")
    var name: String?

    @OptionalField(key: "avatar_url")
    var avatarURL: String?

    @OptionalField(key: "bio")
    var bio: String?

    @OptionalField(key: "location")
    var location: String?

    @OptionalField(key: "website")
    var website: String?

    @OptionalField(key: "github")
    var github: String?

    @OptionalField(key: "twitter")
    var twitter: String?

    @Timestamp(key: "created_at", on: .create)
    var createdAt: Date?

    @Timestamp(key: "updated_at", on: .update)
    var updatedAt: Date?

    init() {}
}
