// routes.swift - Route registration
// Vapor 5 compatible: uses @Sendable closures

import Vapor

func routes(_ app: Application) throws {
    // MARK: - Health Check

    app.get("health") { req async -> HealthResponse in
        HealthResponse(
            status: "ok",
            version: "1.0.0",
            timestamp: Date()
        )
    }

    // MARK: - API v1 Routes

    let api = app.grouped("api", "v1")

    // Jobs routes (public)
    try api.register(collection: JobsController())

    // Matching routes (JWT protected)
    try api.register(collection: MatchingController())
}

// MARK: - Health Response DTO

struct HealthResponse: Content {
    let status: String
    let version: String
    let timestamp: Date
}
