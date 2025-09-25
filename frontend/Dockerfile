# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Accept build arguments
ARG REACT_APP_API_URL=https://api.avishjewels.com/api/v1
ARG REACT_APP_ENV=production

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Set environment variables from build args
ENV NODE_ENV=production
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_ENV=$REACT_APP_ENV

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage (Vite outputs to 'dist' directory)
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
