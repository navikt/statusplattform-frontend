# Base on official Node.js Alpine image
FROM node:18-alpine 
# AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to utilize Docker cache
COPY package*.json ./

RUN --mount=type=secret,id=NODE_AUTH_TOKEN sh -c \
    'npm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN)'
RUN npm config set @navikt:registry=https://npm.pkg.github.com

RUN npm install

# Copy the remaining files for the build process
COPY babel.config.json babel.config.json
COPY tsconfig.json tsconfig.json
COPY next-env.d.ts next-env.d.ts
COPY src/ src/
COPY public/ public/
COPY next.config.js next.config.js

# Build the app
RUN npm run build

# --- Runtime image ---
#FROM node:18-alpine

# Set working directory
# WORKDIR /usr/src/app

# Copy the build output and required files from the builder stage
# COPY --from=builder /usr/src/app/.next/ .next/
# COPY --from=builder /usr/src/app/node_modules/ node_modules/
# COPY --from=builder /usr/src/app/package*.json ./

# Expose the listening port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
