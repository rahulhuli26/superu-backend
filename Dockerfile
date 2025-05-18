# Use Node.js base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
