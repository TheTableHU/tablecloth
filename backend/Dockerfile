# Use an official Node.js runtime as a base image
FROM node:21

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install netcat
#RUN apt-get update && apt-get install -y netcat

# Install Yarn
RUN command -v yarn >/dev/null 2>&1 || { npm install -g yarn; }

# Install application dependencies using Yarn
RUN yarn install

# Copy the scripts to the working directory
COPY wait.sh /app/wait.sh
COPY nodemon.json /app/nodemon.json

#RUN groupadd -r -g 501 mygroup && useradd -r -u 501 -g mygroup user

# Set the user to your desired user ID
#USER user

# Expose the port that your app runs on
EXPOSE 8081

# Command to run your application
CMD ["./wait.sh", "database", "3306", "--", "npx", "nodemon", "-L", "src/index.js"]
