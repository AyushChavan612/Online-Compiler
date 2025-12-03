# Lightweight Java image for code execution
FROM eclipse-temurin:21-jdk-alpine

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -S coderunner && adduser -S coderunner -G coderunner

# Switch to non-root user
USER coderunner

# Default command (will be overridden)
CMD ["java"]
