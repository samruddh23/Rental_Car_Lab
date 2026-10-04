# Multi-Stage Dockerfile for Express & MongoDB REST API (Experiment 10)
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first for cached layers
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

# Start server
CMD ["node", "server.js"]
