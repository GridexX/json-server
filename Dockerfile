# Use the official Node.js runtime as the base image
FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the source code first (needed for prepublish script)
COPY . .

# Install all dependencies (skip scripts to avoid prepublish issues)
RUN npm ci --ignore-scripts

# Build the application using Babel manually
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Create a directory for the database and copy example data
RUN mkdir -p /data

# Copy example database file
COPY src/cli/example.json /data/db.json

# Copy routes configuration
COPY routes.json /data/routes.json

# Expose the port that the app runs on
EXPOSE 3000

# Define environment variables with defaults
ENV NODE_ENV=production
ENV JSON_SERVER_HOST=0.0.0.0
ENV JSON_SERVER_PORT=3000
ENV JSON_SERVER_OPTIONS=""

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs && \
    adduser -S jsonserver -u 1001

# Change ownership of the app directory
RUN chown -R jsonserver:nodejs /app /data

# Switch to the non-root user
USER jsonserver

# Define the command to run the application
CMD ["sh", "-c", "node ./lib/cli/bin.js /data/db.json --host ${JSON_SERVER_HOST} --port ${JSON_SERVER_PORT} --routes /data/routes.json ${JSON_SERVER_OPTIONS}"]
