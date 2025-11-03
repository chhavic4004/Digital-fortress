// One-off script to delete a post by ID without changing server code.
import 'dotenv/config';
import mongoose from 'mongoose';
import Post from '../models/Post.js';

async function main() {
  const id = process.argv[2];
  if (!id) {
    console.error('Usage: node utils/delete-post-once.js <postId>');
    process.exit(1);
  }
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not set in environment');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    const _id = mongoose.Types.ObjectId.createFromHexString(id);
    const res = await Post.deleteOne({ _id });
    console.log(JSON.stringify({ deletedCount: res.deletedCount, id }, null, 2));
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

main();
