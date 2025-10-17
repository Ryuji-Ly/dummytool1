# Build stage
FROM node:20 AS builder
WORKDIR /app

# Copy only package files and install dependencies first (cache friendly)
COPY package*.json ./
RUN npm ci

# Copy config files needed for Next.js and TypeScript
COPY tsconfig.json next.config.ts ./

# Copy source and public folders
COPY src ./src
COPY public ./public

# Build the Next.js app
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only the built app and necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/tsconfig.json ./  

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

