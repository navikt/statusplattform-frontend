# --- Build stage ---
# Use the -dev variant: it includes a shell, npm and apk (the slim variant has
# none of these, so the npm steps below would fail there).
FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22-dev AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to utilize Docker cache.
# --chown lets the nonroot user write package-lock.json during npm install.
COPY --chown=node:node package*.json ./

RUN --mount=type=secret,id=NODE_AUTH_TOKEN sh -c \
    'npm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN)'
RUN npm config set @navikt:registry=https://npm.pkg.github.com

RUN npm install

# Copy the remaining files for the build process (owned by the nonroot user
# so next build can write into the working directory).
COPY --chown=node:node babel.config.json babel.config.json
COPY --chown=node:node tsconfig.json tsconfig.json
COPY --chown=node:node next-env.d.ts next-env.d.ts
COPY --chown=node:node src/ src/
COPY --chown=node:node public/ public/
COPY --chown=node:node next.config.js next.config.js

# Build the app
RUN npm run build

# --- Runtime stage ---
# Use the standard variant (not -slim): "npm start" (next start) needs npm,
# which the slim variant omits.
FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy the build output and required files from the builder stage
COPY --from=builder /usr/src/app/.next/ .next/
COPY --from=builder /usr/src/app/node_modules/ node_modules/
COPY --from=builder /usr/src/app/public/ public/
COPY --from=builder /usr/src/app/package.json package.json
COPY --from=builder /usr/src/app/next.config.js next.config.js

# Expose the listening port
EXPOSE 3000

# The Chainguard node image sets ENTRYPOINT to /usr/bin/node, so override it
# to run "npm start" (next start) instead of treating args as a script path.
ENTRYPOINT ["npm", "start"]
