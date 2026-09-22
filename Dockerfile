# OmniFlow QA - Enterprise E-Commerce Test Automation Engine
# Multi-stage Dockerfile with Playwright Pre-installed

FROM mcr.microsoft.com/playwright:v1.43.0-jammy AS production

WORKDIR /app

# 1. Install dependencies for server
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# 2. Install dependencies and build client
COPY client/package*.json ./client/
RUN cd client && npm ci

COPY client/ ./client/
RUN cd client && npm run build

# 3. Copy server source code and data
COPY server/ ./server/

# 4. Set environment
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# 5. Persist data and screenshots
VOLUME ["/app/server/data", "/app/server/public/screenshots"]

# 6. Start command
WORKDIR /app/server
CMD ["node", "src/index.js"]
