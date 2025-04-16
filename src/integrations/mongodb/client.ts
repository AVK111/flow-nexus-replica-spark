
// MongoDB client integration
// Note: This is a client-side implementation that will eventually connect to a serverless function

const MONGODB_API_URL = "/api/mongodb"; // Will be implemented as a serverless function

export type MongoDBCollections = 
  | "franchise_applications" 
  | "user_documents" 
  | "franchise_opportunities" 
  | "franchisees"
  | "franchisors";

export interface MongoDBQuery {
  filter?: Record<string, any>;
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}

// Client-side MongoDB API wrapper
export const mongoClient = {
  // Find documents
  async find<T>(collection: MongoDBCollections, query: MongoDBQuery = {}): Promise<T[]> {
    try {
      const response = await fetch(`${MONGODB_API_URL}/${collection}/find`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
      });
      
      if (!response.ok) {
        throw new Error(`MongoDB API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('MongoDB find error:', error);
      return [];
    }
  },
  
  // Find a single document
  async findOne<T>(collection: MongoDBCollections, filter: Record<string, any>): Promise<T | null> {
    try {
      const response = await fetch(`${MONGODB_API_URL}/${collection}/findOne`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filter })
      });
      
      if (!response.ok) {
        throw new Error(`MongoDB API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('MongoDB findOne error:', error);
      return null;
    }
  },
  
  // Insert a document
  async insertOne<T>(collection: MongoDBCollections, document: Partial<T>): Promise<{ id: string } | null> {
    try {
      const response = await fetch(`${MONGODB_API_URL}/${collection}/insertOne`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(document)
      });
      
      if (!response.ok) {
        throw new Error(`MongoDB API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('MongoDB insertOne error:', error);
      return null;
    }
  },
  
  // Update a document
  async updateOne<T>(
    collection: MongoDBCollections, 
    filter: Record<string, any>, 
    update: Partial<T>
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${MONGODB_API_URL}/${collection}/updateOne`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filter, update })
      });
      
      if (!response.ok) {
        throw new Error(`MongoDB API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('MongoDB updateOne error:', error);
      return { success: false };
    }
  },
  
  // Delete a document
  async deleteOne(
    collection: MongoDBCollections, 
    filter: Record<string, any>
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${MONGODB_API_URL}/${collection}/deleteOne`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filter })
      });
      
      if (!response.ok) {
        throw new Error(`MongoDB API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('MongoDB deleteOne error:', error);
      return { success: false };
    }
  }
};
