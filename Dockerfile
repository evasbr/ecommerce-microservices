# Stage 1: Build all apps
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy package descriptors
COPY package.json yarn.lock ./

# Install dependencies (including dev dependencies for build)
RUN yarn install --frozen-lockfile

# Copy configuration and source files
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY apps ./apps

# Build all microservices
RUN yarn build:all

# Stage 2: Production runner
FROM node:20-alpine
WORKDIR /usr/src/app

ARG APP_NAME
ENV APP_NAME_ENV=${APP_NAME}

# Copy package.json
COPY package.json ./

# Copy built code and dependencies from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

CMD node dist/apps/${APP_NAME_ENV}/main.js
