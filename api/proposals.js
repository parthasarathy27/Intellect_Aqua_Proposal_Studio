import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const options = {};

let client;
let clientPromise;

const getClientPromise = () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is missing. Please add it in Vercel settings.');
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
};

export default async function handler(req, res) {
  try {
    const client = await getClientPromise();
    // Connect to the specific database
    const db = client.db("intellect_aqua_db");
    const collection = db.collection("proposals");
    
    // Check connection
    if (req.method === 'GET' && req.query.ping) {
      await db.command({ ping: 1 });
      return res.status(200).json({ success: true, message: 'Database connected' });
    }

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

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: 'ID required' });
      await collection.deleteOne({ _id: id });
      return res.status(200).json({ success: true, message: 'Proposal deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (e) {
    console.error('MongoDB Error:', e);
    return res.status(500).json({ 
      message: 'Internal Server Error', 
      error: e.message,
      stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
    });
  }
}
