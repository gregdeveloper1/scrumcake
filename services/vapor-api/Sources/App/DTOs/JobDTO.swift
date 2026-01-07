// JobDTO.swift - Data Transfer Objects for API responses
// Transforms Fluent models to clean JSON responses

import Vapor

// MARK: - Job Response DTO

struct JobDTO: Content {
    let id: UUID
    let title: String
    let slug: String
    let description: String
    let requirements: [String]
    let benefits: [String]
    let skills: [String]
    let location: String?
    let locationType: String
    let employmentType: String
    let experienceLevel: String
    let salary: SalaryDTO?
    let applyURL: String?
    let isEasyApply: Bool
    let isFeatured: Bool
    let source: String?
    let postedAt: Date?
    let company: CompanyDTO

    init(from job: Job) throws {
        self.id = try job.requireID()
        self.title = job.title
        self.slug = job.slug
        self.description = job.description
        self.requirements = job.requirements
        self.benefits = job.benefits
        self.skills = job.skills
        self.location = job.location
        self.locationType = job.locationType.rawValue
        self.employmentType = job.employmentType.rawValue
        self.experienceLevel = job.experienceLevel.rawValue
        self.applyURL = job.applyURL
        self.isEasyApply = job.isEasyApply
        self.isFeatured = job.isFeatured
        self.source = job.source
        self.postedAt = job.postedAt

        // Salary
        if let min = job.salaryMin, let max = job.salaryMax {
            self.salary = SalaryDTO(
                min: min,
                max: max,
                currency: job.salaryCurrency ?? "USD"
            )
        } else {
            self.salary = nil
        }

        // Company (eager loaded)
        self.company = CompanyDTO(from: job.company)
    }
}

// MARK: - Company Response DTO

struct CompanyDTO: Content {
    let id: UUID
    let name: String
    let slug: String
    let logoURL: String?
    let website: String?
    let location: String?
    let industry: String?
    let isVerified: Bool

    init(from company: Company) {
        self.id = company.id ?? UUID()
        self.name = company.name
        self.slug = company.slug
        self.logoURL = company.logoURL
        self.website = company.website
        self.location = company.location
        self.industry = company.industry
        self.isVerified = company.isVerified
    }
}

// MARK: - Salary DTO

struct SalaryDTO: Content {
    let min: Int
    let max: Int
    let currency: String
}

// MARK: - Job Filters

struct JobFilters: Content {
    let locationType: LocationType?
    let employmentType: EmploymentType?
    let experienceLevel: ExperienceLevel?
    let skills: [String]?
    let companyID: UUID?
    let search: String?
    let page: Int?
    let perPage: Int?

    var pageNumber: Int { page ?? 1 }
    var itemsPerPage: Int { min(perPage ?? 20, 100) }
}

// MARK: - Bulk Import DTOs

struct JobImportDTO: Content {
    let title: String
    let companyName: String
    let companySlug: String?
    let description: String
    let requirements: [String]?
    let benefits: [String]?
    let skills: [String]?
    let location: String?
    let locationType: String?
    let employmentType: String?
    let experienceLevel: String?
    let salaryMin: Int?
    let salaryMax: Int?
    let salaryCurrency: String?
    let applyURL: String?
    let source: String?
    let sourceURL: String?
}

struct BulkImportResult: Content {
    let total: Int
    let inserted: Int
    let deduplicated: Int
    let errors: [String]
}

// MARK: - Paginated Response

struct PaginatedResponse<T: Content>: Content {
    let items: [T]
    let metadata: PageMetadata

    struct PageMetadata: Content {
        let page: Int
        let perPage: Int
        let total: Int
        let totalPages: Int
    }
}
