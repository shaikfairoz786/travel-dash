# Use Node.js 18 as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN cd frontend && npm install && npm run build

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
