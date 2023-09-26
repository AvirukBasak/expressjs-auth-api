import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

let client;
let connection;

if (!process.env.MONGODB_URI)
    throw new Error('Add MONGODB_URI to .env.local');

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoConnection) {
        client = new MongoClient(uri, options);
        global._mongoConnection = await client.connect();
    }
    connection = global._mongoConnection;
} else {
    client = new MongoClient(uri, options);
    connection = await client.connect();
}

console.log(`Connected to MongoDB at '${uri}'`);

const conn = connection;
export default conn;
