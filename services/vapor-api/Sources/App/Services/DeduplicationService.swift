// MARK: - DeduplicationService.swift
// Content hash generation for job deduplication.
// Prevents duplicate job listings from being imported from multiple sources.
//
// Algorithm Overview:
// 1. Normalize text (lowercase, remove punctuation, collapse whitespace)
// 2. Combine title + company + description prefix
// 3. Generate SHA-256 hash
// 4. Store hash in `content_hash` column (unique constraint)
//
// Design Decisions:
// - Uses first 500 chars of description to catch variations in job postings
// - Normalizes aggressively to match jobs with minor text differences
// - SHA-256 chosen for collision resistance and speed
//
// Limitations:
// - May produce false positives for very similar legitimate jobs
// - Changes to job title/company will create new hash
// - Description changes beyond 500 chars won't affect hash

import Vapor
import Crypto

// MARK: - Constants

/// Configuration for deduplication algorithm
private enum DeduplicationConfig {
    /// Number of description characters to include in hash
    /// Balance between catching duplicates and allowing similar jobs
    static let descriptionPrefixLength = 500

    /// Similarity threshold for fuzzy matching (0.0 to 1.0)
    /// Higher = stricter matching
    static let fuzzyMatchThreshold = 0.85
}

// MARK: - DeduplicationService

/// Service for generating content hashes and detecting duplicate job postings.
/// Thread-safe (Sendable) for use across concurrent requests.
struct DeduplicationService: Sendable {

    // MARK: Hash Generation

    /// Generates a SHA-256 content hash for job deduplication.
    ///
    /// The hash is based on normalized title, company, and description,
    /// allowing detection of duplicates even with minor text variations.
    ///
    /// - Parameters:
    ///   - title: Job title
    ///   - company: Company name
    ///   - description: Job description (first 500 chars used)
    /// - Returns: 64-character hex string (SHA-256 hash)
    static func generateHash(title: String, company: String, description: String) -> String {
        // Normalize all inputs for consistent hashing
        let normalizedTitle = normalize(title)
        let normalizedCompany = normalize(company)
        let normalizedDescription = normalize(
            String(description.prefix(DeduplicationConfig.descriptionPrefixLength))
        )

        // Combine with delimiter that won't appear in normalized text
        let content = "\(normalizedTitle)|\(normalizedCompany)|\(normalizedDescription)"

        // Generate SHA-256 hash
        let data = Data(content.utf8)
        let hash = SHA256.hash(data: data)

        // Convert to lowercase hex string
        return hash.map { String(format: "%02x", $0) }.joined()
    }

    // MARK: Text Normalization

    /// Normalizes text for consistent hashing.
    ///
    /// Transformations applied:
    /// - Converts to lowercase
    /// - Removes all punctuation and special characters
    /// - Collapses multiple whitespace to single space
    /// - Trims leading/trailing whitespace
    ///
    /// - Parameter text: Raw input text
    /// - Returns: Normalized text suitable for hashing
    private static func normalize(_ text: String) -> String {
        text
            .lowercased()
            .components(separatedBy: .whitespacesAndNewlines)
            .filter { !$0.isEmpty }
            .joined(separator: " ")
            .filter { $0.isLetter || $0.isNumber || $0.isWhitespace }
    }

    // MARK: Fuzzy Matching

    /// Checks if two jobs are likely duplicates using hash and fuzzy matching.
    ///
    /// This method catches duplicates that exact hash matching might miss,
    /// such as jobs with slightly different titles from the same company.
    ///
    /// - Parameters:
    ///   - job1: First job's content (title, company, description)
    ///   - job2: Second job's content (title, company, description)
    /// - Returns: True if jobs are likely duplicates
    static func areLikelyDuplicates(
        job1: (title: String, company: String, description: String),
        job2: (title: String, company: String, description: String)
    ) -> Bool {
        // Check 1: Exact hash match
        let hash1 = generateHash(title: job1.title, company: job1.company, description: job1.description)
        let hash2 = generateHash(title: job2.title, company: job2.company, description: job2.description)

        if hash1 == hash2 {
            return true
        }

        // Check 2: Same company + similar title (fuzzy match)
        let normalizedCompany1 = normalize(job1.company)
        let normalizedCompany2 = normalize(job2.company)

        if normalizedCompany1 == normalizedCompany2 {
            let normalizedTitle1 = normalize(job1.title)
            let normalizedTitle2 = normalize(job2.title)

            // Use Levenshtein distance to check title similarity
            let similarity = calculateSimilarity(normalizedTitle1, normalizedTitle2)
            if similarity > DeduplicationConfig.fuzzyMatchThreshold {
                return true
            }
        }

        return false
    }

    // MARK: Similarity Calculation

    /// Calculates similarity ratio between two strings.
    ///
    /// Uses Levenshtein distance to measure edit distance, then converts
    /// to a ratio where 1.0 = identical and 0.0 = completely different.
    ///
    /// - Parameters:
    ///   - s1: First string
    ///   - s2: Second string
    /// - Returns: Similarity ratio from 0.0 to 1.0
    private static func calculateSimilarity(_ s1: String, _ s2: String) -> Double {
        let maxLength = max(s1.count, s2.count)
        guard maxLength > 0 else { return 1.0 } // Both empty = identical

        let distance = levenshteinDistance(s1, s2)
        return 1.0 - (Double(distance) / Double(maxLength))
    }

    /// Calculates Levenshtein distance (edit distance) between two strings.
    ///
    /// The Levenshtein distance is the minimum number of single-character
    /// edits (insertions, deletions, substitutions) needed to transform
    /// one string into the other.
    ///
    /// Algorithm: Dynamic programming with O(n*m) time and space complexity.
    ///
    /// - Parameters:
    ///   - s1: First string
    ///   - s2: Second string
    /// - Returns: Edit distance (0 = identical strings)
    private static func levenshteinDistance(_ s1: String, _ s2: String) -> Int {
        let s1Array = Array(s1)
        let s2Array = Array(s2)

        // Create matrix for dynamic programming
        var matrix = [[Int]](
            repeating: [Int](repeating: 0, count: s2Array.count + 1),
            count: s1Array.count + 1
        )

        // Initialize first column (deletions from s1)
        for i in 0...s1Array.count {
            matrix[i][0] = i
        }

        // Initialize first row (insertions into s1)
        for j in 0...s2Array.count {
            matrix[0][j] = j
        }

        // Fill in the rest of the matrix
        for i in 1...s1Array.count {
            for j in 1...s2Array.count {
                let cost = s1Array[i - 1] == s2Array[j - 1] ? 0 : 1
                matrix[i][j] = min(
                    matrix[i - 1][j] + 1,       // deletion
                    matrix[i][j - 1] + 1,       // insertion
                    matrix[i - 1][j - 1] + cost // substitution
                )
            }
        }

        return matrix[s1Array.count][s2Array.count]
    }
}
