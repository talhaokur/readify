# Use the official Node.js 18 image as a base
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Start the app with nodemon for auto-reloading
CMD ["node", "app.js"]