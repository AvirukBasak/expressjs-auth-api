FROM node:18.18.0

RUN mkdir -p /mongodb/db
RUN mkdir -p /logs/app

# Working directory for your project
WORKDIR /app

# Install system-level dependencies
RUN apt-get update
RUN apt-get install -y gnupg curl wget

# Install mongodb
RUN wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-6.0.gpg --dearmor

RUN echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-6.0.gpg ]" \
    "https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | \
    tee /etc/apt/sources.list.d/mongodb-org-6.0.list

RUN apt-get update
RUN apt-get install -y mongodb-org

# Install node
RUN apt-get install -y nodejs
RUN apt-get install -y npm

# Clear apt cache
RUN rm -rf /var/lib/apt/lists/*

# Copy your project files into the container
COPY . .

# Install Node.js dependencies
RUN npm run install
RUN npm run build

# Expose the application port
EXPOSE 3000

RUN chmod +x ./start.sh
CMD sh -c ./start.sh
