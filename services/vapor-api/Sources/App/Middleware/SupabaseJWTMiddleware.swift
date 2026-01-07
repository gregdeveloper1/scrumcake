// MARK: - SupabaseJWTMiddleware.swift
// Validates Supabase JWT tokens for authenticated API endpoints.
// Vapor 4.x compatible with JWT 4.x.
//
// Usage:
// ```swift
// let protected = routes.grouped(SupabaseJWTMiddleware())
// protected.get("me") { req in
//     let user = try req.auth.require(AuthenticatedUser.self)
//     return user.id.uuidString
// }
// ```
//
// Token Format (Supabase):
// - Algorithm: HS256 (HMAC-SHA256)
// - Issuer: Supabase project URL
// - Audience: "authenticated" for logged-in users
// - Subject: User UUID
//
// Security Notes:
// - Tokens are verified using SUPABASE_JWT_SECRET
// - Expiration is enforced (exp claim)
// - Generic error messages to avoid leaking token details

import Vapor
import JWT

// MARK: - Supabase JWT Payload

/// JWT payload structure for Supabase access tokens.
/// Conforms to JWTPayload for automatic verification.
struct SupabaseJWTPayload: JWTPayload {

    // MARK: Standard JWT Claims

    /// Subject claim - contains the user's UUID
    let sub: SubjectClaim

    /// Audience claim - should be "authenticated" for valid user tokens
    let aud: String

    /// Expiration claim - token validity end time
    let exp: ExpirationClaim

    /// Issued-at claim - when the token was created
    let iat: IssuedAtClaim

    // MARK: Supabase-Specific Claims

    /// User's email address (if available)
    let email: String?

    /// User's phone number (if available)
    let phone: String?

    /// User role: "authenticated", "anon", "service_role"
    let role: String?

    /// Authenticator Assurance Level (aal1 or aal2)
    let aal: String?

    /// Session identifier for token refresh
    let sessionId: String?

    // MARK: Coding Keys

    enum CodingKeys: String, CodingKey {
        case sub, aud, exp, iat, email, phone, role, aal
        case sessionId = "session_id"
    }

    // MARK: Verification

    /// Verifies the JWT payload claims.
    /// Called automatically by JWT library during token verification.
    ///
    /// - Parameter signer: The JWT signer used for verification
    /// - Throws: JWTError if claims are invalid
    func verify(using signer: JWTSigner) throws {
        // Verify token hasn't expired
        try exp.verifyNotExpired()

        // Verify audience is "authenticated" (logged-in user token)
        guard aud == "authenticated" else {
            throw JWTError.claimVerificationFailure(
                name: "aud",
                reason: "Invalid audience"
            )
        }
    }
}

// MARK: - Authenticated User

/// Represents an authenticated user extracted from a valid JWT.
/// Stored in the request's auth cache for use in route handlers.
struct AuthenticatedUser: Authenticatable, Sendable {

    /// User's UUID from Supabase auth.users table
    let id: UUID

    /// User's email address (may be nil for phone-only auth)
    let email: String?

    /// User's role: "authenticated", "anon", etc.
    let role: String

    /// Creates an authenticated user from a verified JWT payload.
    ///
    /// - Parameter payload: Verified Supabase JWT payload
    /// - Throws: Abort if user ID is not a valid UUID
    init(from payload: SupabaseJWTPayload) throws {
        guard let userID = UUID(uuidString: payload.sub.value) else {
            // SECURITY: Don't expose internal error details
            throw Abort(.unauthorized, reason: "Invalid or expired token")
        }
        self.id = userID
        self.email = payload.email
        self.role = payload.role ?? "authenticated"
    }
}

// MARK: - JWT Middleware

/// Middleware that validates Supabase JWT tokens and populates the auth cache.
///
/// Usage:
/// ```swift
/// let protected = routes.grouped(SupabaseJWTMiddleware())
/// ```
struct SupabaseJWTMiddleware: AsyncMiddleware {

    /// Validates the JWT and chains to the next responder.
    ///
    /// - Parameters:
    ///   - request: The incoming HTTP request
    ///   - next: The next responder in the chain
    /// - Returns: The response from downstream handlers
    /// - Throws: Abort(.unauthorized) if token is missing or invalid
    func respond(to request: Request, chainingTo next: any AsyncResponder) async throws -> Response {
        // Extract Bearer token from Authorization header
        guard request.headers.bearerAuthorization != nil else {
            throw Abort(.unauthorized, reason: "Missing authorization header")
        }

        do {
            // Verify and decode the JWT using configured signer
            let payload = try request.jwt.verify(as: SupabaseJWTPayload.self)

            // Create authenticated user and store in request auth cache
            let user = try AuthenticatedUser(from: payload)
            request.auth.login(user)

            return try await next.respond(to: request)

        } catch let error as JWTError {
            // SECURITY: Log the actual error for debugging, but return generic message
            // This prevents attackers from learning about token structure/validation
            request.logger.warning("JWT verification failed: \(error.localizedDescription)")
            throw Abort(.unauthorized, reason: "Invalid or expired token")

        } catch {
            // SECURITY: Generic error for all other failures
            request.logger.warning("Auth error: \(error.localizedDescription)")
            throw Abort(.unauthorized, reason: "Authentication failed")
        }
    }
}

// MARK: - Request Extension

extension Request {
    /// Convenience accessor for the authenticated user.
    /// Returns nil if no user is authenticated.
    ///
    /// Usage:
    /// ```swift
    /// guard let user = req.authenticatedUser else {
    ///     throw Abort(.unauthorized)
    /// }
    /// ```
    var authenticatedUser: AuthenticatedUser? {
        auth.get(AuthenticatedUser.self)
    }
}
