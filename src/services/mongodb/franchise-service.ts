import { mongoClient } from "@/integrations/mongodb/client";
import { supabase } from "@/integrations/supabase/client";

export interface FranchiseApplication {
  id?: string;
  user_id: string;
  opportunity_id: string;
  franchisor_id: string;
  investment_capacity: string;
  preferred_location: string;
  timeframe: string;
  motivation: string;
  questions?: string | null;
  status: string;
  created_at?: string;
}

export interface UserDocument {
  id?: string;
  user_id: string;
  aadhaar_doc_url?: string;
  business_exp_doc_url?: string;
  business_experience?: string;
  phone?: string;
  address?: string;
  updated_at?: string;
}

// This service will handle both Supabase (for auth) and MongoDB (for data)
export const franchiseService = {
  // Submit franchise application (using MongoDB instead of Supabase RPC)
  async submitApplication(application: Omit<FranchiseApplication, 'id' | 'created_at'>): Promise<boolean> {
    try {
      // Check if user is authenticated with Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('User is not authenticated');
        return false;
      }
      
      // Submit application to MongoDB
      const result = await mongoClient.insertOne<FranchiseApplication>(
        'franchise_applications', 
        {
          ...application,
          status: application.status || 'pending',
          created_at: new Date().toISOString(),
        }
      );
      
      return !!result?.id;
    } catch (error) {
      console.error('Error submitting application:', error);
      return false;
    }
  },
  
  // Check if application exists
  async checkApplicationExists(userId: string, opportunityId: string): Promise<boolean> {
    try {
      const application = await mongoClient.findOne<FranchiseApplication>(
        'franchise_applications',
        { user_id: userId, opportunity_id: opportunityId }
      );
      
      return !!application;
    } catch (error) {
      console.error('Error checking application:', error);
      return false;
    }
  },
  
  // Get user documents
  async getUserDocuments(userId: string): Promise<UserDocument | null> {
    try {
      return await mongoClient.findOne<UserDocument>(
        'user_documents',
        { user_id: userId }
      );
    } catch (error) {
      console.error('Error getting user documents:', error);
      return null;
    }
  },
  
  // Upsert user document
  async upsertUserDocument(document: UserDocument): Promise<boolean> {
    try {
      // Check if document exists
      const existingDoc = await mongoClient.findOne<UserDocument>(
        'user_documents',
        { user_id: document.user_id }
      );
      
      if (existingDoc) {
        // Update existing document
        const result = await mongoClient.updateOne<UserDocument>(
          'user_documents',
          { user_id: document.user_id },
          {
            ...document,
            updated_at: new Date().toISOString()
          }
        );
        return result.success;
      } else {
        // Insert new document
        const result = await mongoClient.insertOne<UserDocument>(
          'user_documents',
          {
            ...document,
            updated_at: new Date().toISOString()
          }
        );
        return !!result?.id;
      }
    } catch (error) {
      console.error('Error upserting user document:', error);
      return false;
    }
  }
};
