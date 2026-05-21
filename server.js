import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('🔍 Environment check:');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? 'FOUND' : 'MISSING');
console.log('   Current Dir:', __dirname);
console.log('   Full Path:', path.resolve(__dirname, '.env'));

import express from 'express';
import cors from 'cors';
import handler from './api/proposals.js';

const app = express();
app.use(cors());
app.use(express.json());

// Wrapper to bridge Express and Vercel-style handler
app.all('/api/proposals', async (req, res) => {
  try {
    // Vercel handlers expect req and res objects
    // We might need to adapt them slightly if the handler uses specific Vercel features
    await handler(req, res);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying /api/proposals to MongoDB Cloud\n`);
});
