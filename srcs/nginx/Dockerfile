# Use alpine linux as the base image
FROM alpine:3.18

# Update, upgrade and install Nginx package in the container
RUN	apk update && apk upgrade && apk add --no-cache nginx

# Copy your custom Nginx configuration file into the container
COPY ./default.conf /etc/nginx/nginx.conf

# Copy your SSL certificate and key into the container
COPY ./ssl/nginx-selfsigned.crt /etc/nginx/certs/
COPY ./ssl/nginx-selfsigned.key /etc/nginx/certs/

# Expose port 443 for SSL traffic
EXPOSE 443

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
