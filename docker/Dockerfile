# Stage 1: Base image
FROM node:20-alpine AS base

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Stage 2: Dependencies
FROM base AS deps

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies with frozen lockfile
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    else \
      pnpm install; \
    fi

# Stage 3: Build
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm build

# Stage 4: Production
FROM base AS production

# Copy built artifacts and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Create necessary directories
RUN mkdir -p session data

# Set production environment
ENV NODE_ENV=production

# Expose port if needed (default for most Node apps)
EXPOSE 3000

# Start command
CMD ["pnpm", "start"]