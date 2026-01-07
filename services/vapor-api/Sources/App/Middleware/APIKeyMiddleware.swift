// MARK: - APIKeyMiddleware.swift
// API key authentication for admin/internal endpoints.
// Vapor 5 compatible: uses async/await throughout.
//
// Usage:
// ```swift
// let admin = routes.grouped(APIKeyMiddleware())
// admin.post("import") { req in ... }
// ```
//
// Configuration:
// Set API_KEYS environment variable with comma-separated keys:
// API_KEYS=key1,key2,key3
//
// Request Format:
// Include X-API-Key header in requests:
// curl -H "X-API-Key: your-key" https://api.example.com/admin/endpoint
//
// Security Notes:
// - Keys are loaded once at startup (changes require restart)
// - Failed attempts are logged with IP address
// - Key values are never logged
// - Empty API_KEYS means no keys are valid (all admin requests rejected)

import Vapor

// MARK: - APIKeyMiddleware

/// Middleware that validates API keys for admin endpoints.
/// Keys are loaded from the API_KEYS environment variable.
struct APIKeyMiddleware: AsyncMiddleware {

    // MARK: Properties

    /// Set of valid API keys loaded from environment
    private let validKeys: Set<String>

    // MARK: Initialization

    /// Creates the middleware, loading valid keys from environment.
    /// Keys should be set in API_KEYS as comma-separated values.
    init() {
        // Load API keys from environment
        // Format: API_KEYS=key1,key2,key3
        let keysString = Environment.get("API_KEYS") ?? ""
        self.validKeys = Set(
            keysString
                .split(separator: ",")
                .map { $0.trimmingCharacters(in: .whitespaces) }
                .filter { !$0.isEmpty }
        )
    }

    // MARK: Middleware

    /// Validates the API key and chains to the next responder.
    ///
    /// - Parameters:
    ///   - request: The incoming HTTP request
    ///   - next: The next responder in the chain
    /// - Returns: The response from downstream handlers
    /// - Throws: Abort(.unauthorized) if key is missing or invalid
    func respond(to request: Request, chainingTo next: any AsyncResponder) async throws -> Response {
        // Check X-API-Key header is present
        guard let apiKey = request.headers.first(name: "X-API-Key") else {
            throw Abort(.unauthorized, reason: "Missing API key")
        }

        // Validate key against loaded keys
        guard validKeys.contains(apiKey) else {
            // SECURITY: Log failed attempt with IP but NOT the key value
            // This helps detect brute force attempts
            request.logger.warning(
                "Invalid API key attempt",
                metadata: [
                    "ip": "\(request.remoteAddress?.description ?? "unknown")",
                    "path": "\(request.url.path)"
                ]
            )
            throw Abort(.unauthorized, reason: "Invalid API key")
        }

        // Key is valid - proceed to handler
        return try await next.respond(to: request)
    }
}

// MARK: - AdminUser

/// Represents an authenticated admin user (for potential audit logging).
/// Currently unused but available for future audit trail features.
struct AdminUser: Authenticatable {

    /// Identifier for the API key used (not the key itself)
    let keyIdentifier: String

    init(keyIdentifier: String) {
        self.keyIdentifier = keyIdentifier
    }
}
