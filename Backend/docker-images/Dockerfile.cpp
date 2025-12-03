# Lightweight Alpine image with GCC for C/C++ execution
FROM alpine:latest

# Set working directory
WORKDIR /app

# Install GCC, G++, and build essentials
RUN apk add --no-cache gcc g++ musl-dev

# Create non-root user for security
RUN addgroup -S coderunner && adduser -S coderunner -G coderunner

# Switch to non-root user
USER coderunner

# Default command (will be overridden)
CMD ["/bin/sh"]
