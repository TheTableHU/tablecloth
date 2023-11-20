# Use an official Node.js runtime as a base image
FROM node:21

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Yarn
RUN command -v yarn >/dev/null 2>&1 || { npm install -g yarn; }

# Install application dependencies using Yarn
RUN yarn install
# Expose the port that your app runs on
EXPOSE 8080

# Command to run your application
CMD ["npm", "start"]j;