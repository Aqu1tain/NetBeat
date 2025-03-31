// server/utils/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gns3App';

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

// On utilise une variable globale pour éviter de recréer plusieurs connexions lors du hot-reload en dev
let cached: any = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectToDatabase;
