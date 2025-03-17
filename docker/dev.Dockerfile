FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose port for Vite dev server
EXPOSE 5173

# Start development server with host set to allow external connections
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
