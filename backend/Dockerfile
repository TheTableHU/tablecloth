# Use an official Node.js runtime as a base image
FROM node:21

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Yarn
RUN command -v yarn >/dev/null 2>&1 || { npm install -g yarn; }

# Install dependencies based on the environment
RUN if [ "${NODE_ENV}" = "production" ]; then \
    COPY . . ; \
fi

RUN yarn install

COPY wait.sh /app/wait.sh
COPY nodemon.json /app/nodemon.json

# Expose the port that your app runs on
EXPOSE 8081

# Command to run your application
CMD if [ "${NODE_ENV}" = "production" ]; then \
    npm start; \
    else \
    ./wait.sh database 3306 -- npx nodemon -L src/index.js; \
fi
