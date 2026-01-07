# Dockerfile for Vapor API
# Multi-stage build for smaller final image

# ================================
# Build Stage
# ================================
FROM swift:5.9-jammy AS build

WORKDIR /app

# Copy package files first for better caching
COPY Package.swift Package.resolved ./

# Resolve dependencies
RUN swift package resolve

# Copy source code
COPY Sources ./Sources
COPY Tests ./Tests

# Build release binary
RUN swift build -c release --static-swift-stdlib

# ================================
# Production Stage
# ================================
FROM ubuntu:jammy

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libcurl4 \
    libxml2 \
    tzdata \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd --user-group --create-home --system --skel /dev/null --home-dir /app vapor

WORKDIR /app

# Copy binary from build stage
COPY --from=build /app/.build/release/App ./

# Set ownership
RUN chown -R vapor:vapor /app
USER vapor

# Expose port
EXPOSE 8080

# Set environment
ENV SWIFT_LOG_LEVEL=info

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Run the app
ENTRYPOINT ["./App"]
CMD ["serve", "--hostname", "0.0.0.0", "--port", "8080"]
