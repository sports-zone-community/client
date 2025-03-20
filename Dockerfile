# Use Nginx as the base image
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default static files
RUN rm -rf ./*

# Copy the React build files to Nginx
COPY dist /usr/share/nginx/html

# Copy Nginx config (without storing SSL in Git)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose only port 443 (HTTPS)
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]