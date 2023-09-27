import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

if (!process.env.MONGODB_URI)
    throw new Error('Add MONGODB_URI to .env.local');

const client = new MongoClient(uri, options);
const conn = await client.connect();

console.log(`Connected to MongoDB at '${uri}'`);

export default conn;
