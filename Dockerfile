# Stage 1: Build Vite client
FROM node:18 AS client-build

# Set working directory to client project
WORKDIR /app/super-ttt-client

# Copy package.json and package-lock.json
COPY super-ttt-client/package*.json ./

# Install dependencies
RUN npm install

# Copy the client project files
COPY super-ttt-client/ .

# Build the Vite project
RUN npm run build

# Stage 2: Build Dart server
FROM dart:stable AS server-build

# Set working directory to server project
WORKDIR /app/super-ttt-server

# Copy pubspec.yaml and pubspec.lock
COPY super-ttt-server/pubspec*.yaml ./

# Get dependencies
RUN dart pub get

# Copy the server project files
COPY super-ttt-server/ .

# Compile the Dart server
RUN dart compile exe bin/super_ttt_server.dart -o /app/super_ttt_server

# Stage 3: Create the final image from Alpine
FROM debian:stable-slim

# Set working directory
WORKDIR /app

# Copy the compiled Dart server
COPY --from=server-build /app/super_ttt_server /app/super_ttt_server
COPY --from=server-build /app/super-ttt-server/res /app/res

# Copy the built Vite client
COPY --from=client-build /app/super-ttt-client/dist /app/static

# Set permissions (if necessary)
RUN chmod +x /app/super_ttt_server

# Expose the server port
EXPOSE 8080

# Command to run the Dart server
CMD ["./super_ttt_server"]
