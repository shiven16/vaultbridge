# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install openssl for Prisma query engine
RUN apk add --no-cache openssl

# Install dependencies and prisma CLI
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies including dev dependencies for building
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client and build typescript
RUN npx prisma generate
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install openssl for Prisma engine in production
RUN apk add --no-cache openssl

# Set environment to production
ENV NODE_ENV=production

# Copy package files and prisma directory
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --omit=dev

# Generate Prisma client for production using --yes to install the CLI without prompt
RUN npx --yes prisma generate

# Copy built code from builder stage
COPY --from=builder /app/dist ./dist

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
