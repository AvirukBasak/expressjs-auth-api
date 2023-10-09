mongod --bind_ip_all --dbpath /mongodb/db > /logs/app/mongodb.log   2> /logs/app/mongodb.err.log   &
npm start
