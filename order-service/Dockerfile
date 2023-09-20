# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application's dependencies inside the container
RUN npm install

# Copy the content of the local src directory to the working directory
COPY . .

# Specify the command to run the app using Nest's CLI when the container starts
CMD ["npm", "start"]
