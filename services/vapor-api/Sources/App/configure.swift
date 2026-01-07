// configure.swift - Application configuration
// Vapor 5 compatible: uses async/await throughout

import Vapor
import Fluent
import FluentPostgresDriver
import JWT

public func configure(_ app: Application) async throws {
    // MARK: - Environment

    // Load environment variables
    let databaseURL = Environment.get("DATABASE_URL")
        ?? "postgres://postgres:postgres@localhost:5432/jobboard"

    let supabaseJWTSecret = Environment.get("SUPABASE_JWT_SECRET")
        ?? "your-supabase-jwt-secret"

    // MARK: - Database Configuration

    // Parse DATABASE_URL and configure PostgreSQL
    if let url = URL(string: databaseURL) {
        var tlsConfig: TLSConfiguration = .makeClientConfiguration()
        tlsConfig.certificateVerification = .none

        let config = SQLPostgresConfiguration(
            hostname: url.host ?? "localhost",
            port: url.port ?? 5432,
            username: url.user ?? "postgres",
            password: url.password ?? "postgres",
            database: url.path.trimmingCharacters(in: CharacterSet(charactersIn: "/")),
            tls: .require(try NIOSSLContext(configuration: tlsConfig))
        )

        app.databases.use(
            .postgres(configuration: config),
            as: .psql
        )
    }

    // MARK: - JWT Configuration

    // Add Supabase JWT signer for token verification
    // Supabase uses HS256 (HMAC-SHA256) for JWT signing
    app.jwt.signers.use(.hs256(key: supabaseJWTSecret))

    // MARK: - Middleware

    // CORS for frontend
    let corsConfig = CORSMiddleware.Configuration(
        allowedOrigin: .all,
        allowedMethods: [.GET, .POST, .PUT, .DELETE, .PATCH, .OPTIONS],
        allowedHeaders: [
            .accept,
            .authorization,
            .contentType,
            .origin,
            .xRequestedWith,
            .init("X-API-Key")
        ]
    )
    app.middleware.use(CORSMiddleware(configuration: corsConfig))

    // Error middleware
    app.middleware.use(ErrorMiddleware.default(environment: app.environment))

    // MARK: - Routes

    try routes(app)

    // MARK: - Logging

    app.logger.info("Vapor API configured successfully")
    app.logger.info("Environment: \(app.environment.name)")
}
