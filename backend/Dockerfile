# Use an official Node.js runtime as a base image
FROM node:21

# Set the working directory in the container
WORKDIR /app

# Copy important files to the working directory
COPY package*.json ./
COPY wait.sh ./
COPY nodemon.json ./
COPY config ./config
COPY .sequelizerc ./

# Install Yarn
RUN apt-get update && apt-get install -y yarn

# Install dependencies using Yarn
RUN yarn

COPY src ./src

# Expose the port that your app runs on
EXPOSE 8081

# Command to run your application
CMD if [ "${NODE_ENV}" = "production" ]; then \
    ./wait.sh database 3306 -- npm start; \
    else \
    ./wait.sh database 3306 -- npx nodemon -L src/index.js; \
fi
