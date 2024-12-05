#syntax=docker/dockerfile:1.4

# Versions
FROM node:20-alpine AS node_upstream

# Base stage for development and build
FROM node_upstream AS base

# Install necessary dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /srv/app

RUN corepack enable && \
	corepack prepare --activate pnpm@latest && \
	pnpm config -g set store-dir /.pnpm-store

# Disable telemetry during build and runtime
ENV NEXT_TELEMETRY_DISABLED 1

# Development Image
FROM base as dev

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME localhost

CMD ["sh", "-c", "pnpm install; pnpm dev"]

# Builder Image
FROM base AS builder

COPY --link pnpm-lock.yaml ./
# Copy only lock file first for caching
RUN pnpm fetch --prod

COPY --link . .
# Copy application source code

RUN pnpm install --frozen-lockfile --offline --prod && \
	pnpm run build

# Production Image
FROM node:20-alpine AS prod

WORKDIR /srv/app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs && \
	adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder --link /srv/app/public ./public
COPY --from=builder --link /srv/app/.next/standalone ./
# Standalone build
COPY --from=builder --link /srv/app/.next/static ./.next/static

# Set correct permissions for runtime
RUN mkdir .next && \
	chown nextjs:nodejs .next

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
