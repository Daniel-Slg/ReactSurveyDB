# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to take advantage of Docker cache
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY server/ .

# Expose the port the app will run on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
