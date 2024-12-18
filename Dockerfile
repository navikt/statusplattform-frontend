# Base on official Node.js Alpine image
FROM node:16-alpine AS builder

# Run container as non-root (unprivileged) user
USER node

# Set working directory
WORKDIR /usr/src/app

# Pass the NPM token securely as a build argument
ARG NPM_AUTH_TOKEN

# Copy package.json and package-lock.json to utilize Docker cache
COPY package*.json ./

# Temporarily configure npm with the auth token
RUN --mount=type=secret,id=npmrc \
    echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" > .npmrc && \
    npm ci && \
    rm -f .npmrc

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
