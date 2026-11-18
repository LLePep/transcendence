# Base image: official Nginx on lightweight Alpine Linux
FROM nginx:1.25-alpine

# Install openssl to generate the self-signed SSL certificate at startup
RUN apk add --no-cache openssl

# Replace the default Nginx configuration with ours
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy our custom startup script and make it executable
COPY entrypoint.sh /docker-entrypoint-custom.sh
RUN chmod +x /docker-entrypoint-custom.sh

# Document HTTP (80) and HTTPS (443) ports inside the container
EXPOSE 80 443

# Run our startup script (generates SSL cert, then starts Nginx)
ENTRYPOINT ["/docker-entrypoint-custom.sh"]
