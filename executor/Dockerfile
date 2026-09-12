# Isolated Code Execution Environment for CodeArena
FROM node:20-alpine

# Install GCC, G++, Python3, make, and bash
RUN apk update && apk add --no-cache \
    g++ \
    gcc \
    python3 \
    make \
    bash

WORKDIR /sandbox

# Create unprivileged runner user
RUN addgroup -S runner && adduser -S runner -G runner
USER runner

# Keep container alive or ready for runner invocation
CMD ["tail", "-f", "/dev/null"]
