
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Initialize MongoDB client with environment variables
const MONGODB_URI = Deno.env.get("MONGODB_URI");
const MONGODB_DB = Deno.env.get("MONGODB_DB") || "franchigo";

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI environment variable");
}

// Connect to MongoDB
let mongoClient: MongoClient | null = null;
let db: any = null;

async function connectToMongoDB() {
  if (!mongoClient) {
    mongoClient = new MongoClient();
    try {
      await mongoClient.connect(MONGODB_URI!);
      db = mongoClient.database(MONGODB_DB);
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Failed to connect to MongoDB:", err);
      mongoClient = null;
    }
  }
  return db;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Check for valid MongoDB connection
    const database = await connectToMongoDB();
    if (!database) {
      return new Response(
        JSON.stringify({ error: "Could not connect to MongoDB" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse URL to determine collection and operation
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    
    // Expects: /mongodb-api/{collection}/{operation}
    if (pathParts.length < 3) {
      return new Response(
        JSON.stringify({ error: "Invalid API endpoint" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const collectionName = pathParts[1];
    const operation = pathParts[2];
    const collection = database.collection(collectionName);

    // Parse request body
    const body = req.method !== "GET" ? await req.json() : {};

    // Perform operation based on the endpoint
    let result;
    switch (operation) {
      case "find":
        const { filter = {}, limit = 100, skip = 0, sort = {} } = body;
        result = await collection.find(filter).limit(limit).skip(skip).sort(sort).toArray();
        break;
        
      case "findOne":
        result = await collection.findOne(body.filter || {});
        break;
        
      case "insertOne":
        result = await collection.insertOne(body);
        break;
        
      case "updateOne":
        result = await collection.updateOne(body.filter, { $set: body.update });
        result = { success: result.modifiedCount > 0 };
        break;
        
      case "deleteOne":
        result = await collection.deleteOne(body.filter);
        result = { success: result.deletedCount > 0 };
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: "Invalid operation" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("MongoDB API error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
