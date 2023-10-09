FROM node:18.18.0

RUN mkdir -p /mongodb/db
RUN mkdir -p /logs/app

# Working directory for your project
WORKDIR /app

# Install system-level dependencies
RUN apt-get update
RUN apt-get install -y gnupg curl wget

RUN curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

RUN echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ]" \
    "http://repo.mongodb.org/apt/debian bullseye/mongodb-org/7.0 main" | \
    tee /etc/apt/sources.list.d/mongodb-org-7.0.list

RUN echo "deb http://ftp.de.debian.org/debian bullseye main" | \
    tee /etc/apt/sources.list.d/bullseye.list

# Update cache
RUN apt-get -y update

# Install libraries
RUN apt-get install -y libssl1.1

# Install services
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN apt-get install -y mongodb-org

RUN rm -rf /var/lib/apt/lists/*

# Copy your project files into the container
COPY . .

# Install Node.js dependencies
RUN npm run install
RUN npm run build

# Expose the application port
EXPOSE 3000

CMD sh -c ./start.sh
