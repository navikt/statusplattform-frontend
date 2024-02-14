# Base on offical Node.js Alpine image
FROM node:16-alpine

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node

ARG NPM_AUTH_TOKEN
ENV NPM_AUTH_TOKEN=${NPM_AUTH_TOKEN}

# Set working directory
WORKDIR /usr/src/app

COPY .npmrc .npmrc

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package*.json ./

# Install dependencies
COPY babel.config.json babel.config.json
RUN npm ci

# Build app
COPY src/ src/
COPY public/ public/
COPY next.config.js next.config.js
RUN npm run build

# Expose the listening port
EXPOSE 3000

# Run npm start script when container starts
CMD [ "npm", "start" ]
