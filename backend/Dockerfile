# Base image: Node.js 20 on lightweight Alpine Linux
FROM node:20-alpine

# Working directory inside the container
WORKDIR /app

# Install netcat (for entrypoint DB check) and openssl (required by Prisma on Alpine)
RUN apk add --no-cache netcat-openbsd openssl

# Copy dependency manifests first to leverage Docker build cache
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Install Node.js dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Ensure the startup script is executable
RUN chmod +x ./entrypoint.sh

# Document that the backend listens on port 3000 internally
EXPOSE 3000

# Run the startup script when the container starts
ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]
