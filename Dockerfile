# ----------------------
# Build stage
# ----------------------
FROM node:20 AS builder
WORKDIR /app

# Accept build arguments
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Copy package files and install all dependencies (including dev for TS/Tailwind)
COPY package*.json ./
RUN npm ci

# Copy config files needed for Next.js, Tailwind, PostCSS, and TypeScript
COPY tsconfig.json next.config.ts postcss.config.mjs ./

# Copy source and public folders
COPY src ./src
COPY public ./public

# Build the Next.js app
RUN npm run build

# ----------------------
# Production stage
# ----------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files and install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci

# Copy the built app and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

