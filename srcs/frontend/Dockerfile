# Use Node.js 16 LTS version
FROM node:16

# Copy application files
COPY . .

# Set working directory
WORKDIR /transcendence

# Expose port 3000
EXPOSE 3000

# Install dependencies
RUN npm install

# Command to run the application
CMD ["node", "server.js"]
