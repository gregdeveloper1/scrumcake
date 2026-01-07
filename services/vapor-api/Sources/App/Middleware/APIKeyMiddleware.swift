// APIKeyMiddleware.swift - API key authentication for admin endpoints
// Vapor 5 compatible: uses async/await throughout

import Vapor

struct APIKeyMiddleware: AsyncMiddleware {
    /// Valid API keys (loaded from environment)
    private let validKeys: Set<String>

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

    func respond(to request: Request, chainingTo next: any AsyncResponder) async throws -> Response {
        // Check X-API-Key header
        guard let apiKey = request.headers.first(name: "X-API-Key") else {
            throw Abort(.unauthorized, reason: "Missing API key")
        }

        guard validKeys.contains(apiKey) else {
            // Log failed attempt (without exposing the key)
            request.logger.warning("Invalid API key attempt from \(request.remoteAddress?.description ?? "unknown")")
            throw Abort(.unauthorized, reason: "Invalid API key")
        }

        return try await next.respond(to: request)
    }
}

// MARK: - Admin User (for audit logging)

struct AdminUser: Authenticatable {
    let keyIdentifier: String

    init(keyIdentifier: String) {
        self.keyIdentifier = keyIdentifier
    }
}
