mongod --bind_ip_all --dbpath /mongodb/db > /logs/app/mongodb.log   2> /logs/app/mongodb.err.log   &
npm start                                 > /logs/app/npm.start.log 2> /logs/app/npm.start.err.log &
