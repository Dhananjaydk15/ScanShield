# Stage 1: Build the frontend
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build the app (generates dist folder)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: remove default nginx config if you want custom routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
