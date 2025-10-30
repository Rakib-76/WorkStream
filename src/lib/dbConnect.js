import { MongoClient, ServerApiVersion } from 'mongodb';
export 
const collectionNameObj = 
{
  servicesCollection: "tools",
  userCollection: "workStream_user",
  testimonialsCollection: "testimonials",
  taskCollection: "tasks",
  blogCollection: "blogs",
  fileCollection: "projectFiles",
  notificationsCollection:"notifications",
   projectsCollection: "projects",
}

export default function dbConnect(collectionName) {

  const uri = process.env.NEXT_PUBLIC_MONGODB_URI
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  return client.db(process.env.DB_NAME).collection(collectionName)
}




// app/lib/dbConnect.js

// import { MongoClient, ServerApiVersion } from 'mongodb';

// // 1. COLLECTION NAMES (Remains the same)
// export const collectionNameObj = {
//     servicesCollection: "tools",
//     userCollection: "workStream_user",
//     testimonialsCollection: "testimonials",
//     taskCollection: "tasks",
//     blogCollection: "blogs",
//     fileCollection: "projectFiles",
//     notificationsCollection: "notifications",
// };

// // 2. GLOBAL CACHE SETUP (THE FIX)
// // Use a global variable to cache the connection. 
// // This prevents Next.js hot-reloads and serverless function cold starts from creating new connections.
// let cached = global.mongo;

// if (!cached) {
//     cached = global.mongo = { conn: null, promise: null };
// }

// // 3. CACHED DB CONNECT FUNCTION

// export default async function dbConnect(collectionName) {
//     const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
//     const dbName = process.env.DB_NAME;

//     if (!uri) {
//         throw new Error('MONGODB_URI is not defined.');
//     }
//     if (!dbName) {
//         throw new Error('DB_NAME is not defined.');
//     }

//     // A.  RETURN CACHED CONNECTION (Fastest check)
//     if (cached.conn) {
//         // Connection already established, reuse it!
//         return cached.conn.db(dbName).collection(collectionName);
//     }

//     // B.  CREATE CONNECTION PROMISE (If no connection exists)
//     if (!cached.promise) {
//         const client = new MongoClient(uri, {
//             serverApi: {
//                 version: ServerApiVersion.v1,
//                 strict: true,
//                 deprecationErrors: true,
//             },
//             // Recommended options for better serverless stability:
//             serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
//             maxPoolSize: 1, // Crucial: Limit the pool size to 1 in serverless env
//         });
        
//         // Store the connection promise for caching and concurrency handling
//         cached.promise = client.connect(); 
//     }

//     // C.  AWAIT AND CACHE CONNECTION
//     try {
//         const client = await cached.promise;
//         cached.conn = client; // Store the successful connection object
        
//         // Return the specific collection from the reused client
//         return client.db(dbName).collection(collectionName);
//     } catch (e) {
//         // If connection fails, clear the promise so it can retry later
//         cached.promise = null;
//         throw e;
//     }
// }