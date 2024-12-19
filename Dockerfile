# Base on official Node.js Alpine image
FROM node:16-alpine AS builder

# Run container as non-root (unprivileged) user
USER node

# Set working directory
WORKDIR /usr/src/app

# Use secret for NPM authentication
RUN --mount=type=secret,id=NODE_AUTH_TOKEN sh -c \
    'echo "//npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN)" > .npmrc && \
     npm config set @navikt:registry=https://npm.pkg.github.com'

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the remaining files for the build process
COPY babel.config.json babel.config.json
COPY src/ src/
COPY public/ public/
COPY next.config.js next.config.js

# Build the app
RUN npm run build

# --- Runtime image ---
FROM node:16-alpine

# Run container as non-root user
USER node

# Set working directory
WORKDIR /usr/src/app

# Copy the build output and required files from the builder stage
COPY --from=builder /usr/src/app/.next/ .next/
COPY --from=builder /usr/src/app/node_modules/ node_modules/
COPY --from=builder /usr/src/app/package*.json ./

# Expose the listening port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
