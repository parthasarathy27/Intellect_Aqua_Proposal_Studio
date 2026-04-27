import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("intellect_aqua_db");
    const collection = db.collection("proposals");

    if (req.method === 'POST') {
      const proposal = req.body;
      proposal.updatedAt = new Date();
      
      // If we have an ID, update, otherwise insert
      if (proposal._id) {
        const { _id, ...updateData } = proposal;
        await collection.updateOne({ _id }, { $set: updateData }, { upsert: true });
        return res.status(200).json({ success: true, message: 'Proposal updated' });
      } else {
        const result = await collection.insertOne(proposal);
        return res.status(201).json({ success: true, id: result.insertedId });
      }
    }

    if (req.method === 'GET') {
      const proposals = await collection.find({}).sort({ updatedAt: -1 }).limit(20).toArray();
      return res.status(200).json(proposals);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Internal Server Error', error: e.message });
  }
}
