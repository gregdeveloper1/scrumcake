// SupabaseJWTMiddleware.swift - Validates Supabase JWT tokens
// Vapor 4.x compatible with JWT 4.x

import Vapor
import JWT

// MARK: - Supabase JWT Payload

struct SupabaseJWTPayload: JWTPayload {
    // Standard claims
    let sub: SubjectClaim      // User ID (UUID)
    let aud: String            // Audience (usually "authenticated")
    let exp: ExpirationClaim   // Expiration time
    let iat: IssuedAtClaim     // Issued at

    // Supabase-specific claims
    let email: String?
    let phone: String?
    let role: String?          // "authenticated", "anon", etc.
    let aal: String?           // Authenticator Assurance Level
    let sessionId: String?

    enum CodingKeys: String, CodingKey {
        case sub, aud, exp, iat, email, phone, role, aal
        case sessionId = "session_id"
    }

    func verify(using signer: JWTSigner) throws {
        // Verify expiration
        try exp.verifyNotExpired()

        // Verify audience includes "authenticated"
        guard aud == "authenticated" else {
            throw JWTError.claimVerificationFailure(
                name: "aud",
                reason: "Invalid audience"
            )
        }
    }
}

// MARK: - Authenticated User

struct AuthenticatedUser: Authenticatable, Sendable {
    let id: UUID
    let email: String?
    let role: String

    init(from payload: SupabaseJWTPayload) throws {
        guard let userID = UUID(uuidString: payload.sub.value) else {
            throw Abort(.unauthorized, reason: "Invalid user ID in token")
        }
        self.id = userID
        self.email = payload.email
        self.role = payload.role ?? "authenticated"
    }
}

// MARK: - JWT Middleware

struct SupabaseJWTMiddleware: AsyncMiddleware {
    func respond(to request: Request, chainingTo next: any AsyncResponder) async throws -> Response {
        // Extract Bearer token from Authorization header
        guard request.headers.bearerAuthorization != nil else {
            throw Abort(.unauthorized, reason: "Missing authorization header")
        }

        do {
            // Verify and decode the JWT
            let payload = try request.jwt.verify(as: SupabaseJWTPayload.self)

            // Create authenticated user and store in request
            let user = try AuthenticatedUser(from: payload)
            request.auth.login(user)

            return try await next.respond(to: request)
        } catch let error as JWTError {
            throw Abort(.unauthorized, reason: "Invalid token: \(error.localizedDescription)")
        } catch {
            throw Abort(.unauthorized, reason: "Token verification failed")
        }
    }
}

// MARK: - Request Extension

extension Request {
    /// Get the authenticated user from the request
    var authenticatedUser: AuthenticatedUser? {
        auth.get(AuthenticatedUser.self)
    }
}
