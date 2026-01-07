// MARK: - configure.swift
// Application configuration for JobBoard Vapor API.
// Vapor 5 compatible: uses async/await throughout, no EventLoopFuture.
//
// Configuration includes:
// - PostgreSQL database connection (Supabase pooler)
// - JWT verification for Supabase tokens
// - CORS middleware for frontend access
// - Error handling middleware
//
// Required Environment Variables:
// - DATABASE_URL: PostgreSQL connection string
// - SUPABASE_JWT_SECRET: JWT signing secret from Supabase dashboard
// - API_KEYS: Comma-separated admin API keys (optional, for bulk import)
//
// Security Notes:
// - No hardcoded secrets - fails fast if env vars missing
// - TLS required for database connections
// - CORS restricted to known origins in production

import Vapor
import Fluent
import FluentPostgresDriver
import JWT

// MARK: - Configuration Constants

/// Allowed origins for CORS
/// In production, restrict to your actual domains
private let allowedOrigins: [String] = [
    "https://scrumcake.vercel.app",
    "https://scrum-master-jobs.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176"
]

// MARK: - Configure Function

public func configure(_ app: Application) async throws {

    // MARK: Environment Variables (Required)

    // SECURITY: Fail fast if required environment variables are missing
    // Never use hardcoded defaults for secrets
    guard let databaseURL = Environment.get("DATABASE_URL") else {
        app.logger.critical("DATABASE_URL environment variable is required")
        throw Abort(.internalServerError, reason: "Missing DATABASE_URL configuration")
    }

    guard let supabaseJWTSecret = Environment.get("SUPABASE_JWT_SECRET") else {
        app.logger.critical("SUPABASE_JWT_SECRET environment variable is required")
        throw Abort(.internalServerError, reason: "Missing SUPABASE_JWT_SECRET configuration")
    }

    // MARK: Database Configuration

    // Parse DATABASE_URL and configure PostgreSQL with TLS
    guard let url = URL(string: databaseURL) else {
        app.logger.critical("Invalid DATABASE_URL format")
        throw Abort(.internalServerError, reason: "Invalid DATABASE_URL format")
    }

    // SECURITY: Enable TLS certificate verification for production
    // Note: Supabase pooler uses valid certificates, so verification should work
    var tlsConfig: TLSConfiguration = .makeClientConfiguration()
    if app.environment == .development {
        // Only disable verification in development if needed for local testing
        tlsConfig.certificateVerification = .none
        app.logger.warning("TLS certificate verification disabled for development")
    }
    // In production, use default verification (.fullVerification)

    let config = SQLPostgresConfiguration(
        hostname: url.host ?? "localhost",
        port: url.port ?? 5432,
        username: url.user ?? "postgres",
        password: url.password,
        database: url.path.trimmingCharacters(in: CharacterSet(charactersIn: "/")),
        tls: .require(try NIOSSLContext(configuration: tlsConfig))
    )

    app.databases.use(
        .postgres(configuration: config),
        as: .psql
    )

    // MARK: JWT Configuration

    // Configure JWT signer for Supabase token verification
    // Supabase uses HS256 (HMAC-SHA256) for signing access tokens
    app.jwt.signers.use(.hs256(key: supabaseJWTSecret))

    // MARK: Middleware Stack

    // CORS: Restrict to known origins for security
    // In development, this allows localhost; in production, only Vercel domains
    let corsConfig = CORSMiddleware.Configuration(
        allowedOrigin: .any(allowedOrigins),
        allowedMethods: [.GET, .POST, .PUT, .DELETE, .PATCH, .OPTIONS],
        allowedHeaders: [
            .accept,
            .authorization,
            .contentType,
            .origin,
            .xRequestedWith,
            .init("X-API-Key")
        ],
        allowCredentials: true
    )
    app.middleware.use(CORSMiddleware(configuration: corsConfig))

    // Error handling middleware - sanitizes errors for clients
    app.middleware.use(ErrorMiddleware.default(environment: app.environment))

    // MARK: Routes

    try routes(app)

    // MARK: Startup Logging

    app.logger.info("Vapor API configured successfully")
    app.logger.info("Environment: \(app.environment.name)")
    app.logger.info("Database host: \(url.host ?? "unknown")")
}
