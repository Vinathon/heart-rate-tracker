# Use the official Node.js 14 image as the base image
FROM node:14-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the application code
COPY . .

# Copy the certificate for connecting with postgres
COPY certs/ ./certs/

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

