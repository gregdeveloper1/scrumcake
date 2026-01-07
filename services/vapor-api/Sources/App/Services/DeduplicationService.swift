// DeduplicationService.swift - Content hash generation for job deduplication
// Prevents duplicate job listings from being imported

import Vapor
import Crypto

struct DeduplicationService: Sendable {
    /// Generate a content hash for job deduplication
    /// Uses title, company, and first 500 chars of description
    static func generateHash(title: String, company: String, description: String) -> String {
        // Normalize inputs
        let normalizedTitle = normalize(title)
        let normalizedCompany = normalize(company)
        let normalizedDescription = normalize(String(description.prefix(500)))

        // Combine into single string
        let content = "\(normalizedTitle)|\(normalizedCompany)|\(normalizedDescription)"

        // Generate SHA-256 hash
        let data = Data(content.utf8)
        let hash = SHA256.hash(data: data)

        // Convert to hex string
        return hash.map { String(format: "%02x", $0) }.joined()
    }

    /// Normalize text for consistent hashing
    /// - Lowercases
    /// - Removes extra whitespace
    /// - Removes common variations (punctuation, special chars)
    private static func normalize(_ text: String) -> String {
        text
            .lowercased()
            .components(separatedBy: .whitespacesAndNewlines)
            .filter { !$0.isEmpty }
            .joined(separator: " ")
            .filter { $0.isLetter || $0.isNumber || $0.isWhitespace }
    }

    /// Check if two jobs are likely duplicates based on similarity
    /// Uses fuzzy matching for edge cases hash might miss
    static func areLikelyDuplicates(
        job1: (title: String, company: String, description: String),
        job2: (title: String, company: String, description: String)
    ) -> Bool {
        // Exact hash match
        let hash1 = generateHash(title: job1.title, company: job1.company, description: job1.description)
        let hash2 = generateHash(title: job2.title, company: job2.company, description: job2.description)

        if hash1 == hash2 {
            return true
        }

        // Fuzzy match: same company + very similar title
        let normalizedCompany1 = normalize(job1.company)
        let normalizedCompany2 = normalize(job2.company)

        if normalizedCompany1 == normalizedCompany2 {
            let normalizedTitle1 = normalize(job1.title)
            let normalizedTitle2 = normalize(job2.title)

            // Levenshtein distance check (simple implementation)
            let similarity = calculateSimilarity(normalizedTitle1, normalizedTitle2)
            if similarity > 0.85 {
                return true
            }
        }

        return false
    }

    /// Calculate similarity ratio between two strings (0.0 to 1.0)
    private static func calculateSimilarity(_ s1: String, _ s2: String) -> Double {
        let maxLength = max(s1.count, s2.count)
        guard maxLength > 0 else { return 1.0 }

        let distance = levenshteinDistance(s1, s2)
        return 1.0 - (Double(distance) / Double(maxLength))
    }

    /// Levenshtein distance between two strings
    private static func levenshteinDistance(_ s1: String, _ s2: String) -> Int {
        let s1Array = Array(s1)
        let s2Array = Array(s2)

        var matrix = [[Int]](
            repeating: [Int](repeating: 0, count: s2Array.count + 1),
            count: s1Array.count + 1
        )

        for i in 0...s1Array.count {
            matrix[i][0] = i
        }
        for j in 0...s2Array.count {
            matrix[0][j] = j
        }

        for i in 1...s1Array.count {
            for j in 1...s2Array.count {
                let cost = s1Array[i - 1] == s2Array[j - 1] ? 0 : 1
                matrix[i][j] = min(
                    matrix[i - 1][j] + 1,      // deletion
                    matrix[i][j - 1] + 1,      // insertion
                    matrix[i - 1][j - 1] + cost // substitution
                )
            }
        }

        return matrix[s1Array.count][s2Array.count]
    }
}
