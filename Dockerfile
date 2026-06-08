# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Serve the application from the Node.js backend
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --only=production
COPY backend/ ./
# Copy built frontend assets into backend's public directory
COPY --from=frontend-builder /frontend/dist ./public

EXPOSE 3031
ENV PORT=3031
ENV NODE_ENV=production

CMD ["node", "server.js"]
