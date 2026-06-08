# Stage 1: Build the Angular application
FROM node:20-alpine AS build
ARG FRONTEND_DIR=frontend

WORKDIR /app

COPY ${FRONTEND_DIR}/package.json ${FRONTEND_DIR}/package-lock.json ./
RUN npm ci

COPY ${FRONTEND_DIR}/ .
RUN npm run build -- --configuration production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY ${FRONTEND_DIR}/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entrypoint script
COPY ${FRONTEND_DIR}/entrypoint.sh /docker-entrypoint.d/40-envsubst.sh

# Make sure the script is executable
RUN chmod +x /docker-entrypoint.d/40-envsubst.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
