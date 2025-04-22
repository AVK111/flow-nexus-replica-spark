import { supabase } from "@/integrations/supabase/client";
import { franchiseService } from "@/services/mongodb/franchise-service";
import type { FranchiseApplication, UserDocument } from "@/services/mongodb/franchise-service";

// Define a type for RPC function responses
interface RpcResponse<T> {
  data: T[] | null;
  error: Error | null;
}

// Setup MongoDB bridge to intercept Supabase RPC functions
export const setupMongoBridge = () => {
  const originalRpc = supabase.rpc;
  
  // @ts-ignore - We're intentionally overriding the type here
  supabase.rpc = function(functionName: string, params?: any): any {
    console.log(`RPC call intercepted: ${functionName}`, params);
    
    // Intercept specific RPC calls
    if (functionName === 'check_application_exists') {
      return {
        then: (callback: (response: RpcResponse<{ exists: boolean }>) => void) => {
          franchiseService.checkApplicationExists(
            params.user_id_param,
            params.opportunity_id_param
          ).then(exists => {
            callback({
              data: exists ? [{ exists: true }] : [],
              error: null
            });
          }).catch(error => {
            callback({
              data: null,
              error
            });
          });
          
          return {
            catch: (errorCallback: (error: Error) => void) => {
              return { then: () => {} };
            }
          };
        }
      };
    }
    
    if (functionName === 'get_user_documents') {
      return {
        then: (callback: (response: RpcResponse<UserDocument>) => void) => {
          franchiseService.getUserDocuments(params.user_id_param)
            .then(document => {
              callback({
                data: document ? [document] : [],
                error: null
              });
            }).catch(error => {
              callback({
                data: null,
                error
              });
            });
          
          return {
            catch: (errorCallback: (error: Error) => void) => {
              return { then: () => {} };
            }
          };
        }
      };
    }
    
    if (functionName === 'submit_franchise_application') {
      return {
        then: (callback: any) => {
          franchiseService.submitApplication({
            user_id: params.user_id_param,
            opportunity_id: params.opportunity_id_param,
            franchisor_id: params.franchisor_id_param,
            investment_capacity: params.investment_capacity_param,
            preferred_location: params.preferred_location_param,
            timeframe: params.timeframe_param,
            motivation: params.motivation_param,
            questions: params.questions_param,
            status: 'pending' // Adding status field to match FranchiseApplication interface
          }).then(success => {
            // Mimic Supabase response format
            callback({
              data: success ? {} : null,
              error: success ? null : new Error('Failed to submit application')
            });
          }).catch(error => {
            callback({
              data: null,
              error
            });
          });
          
          // For chainable promises
          return {
            catch: (errorCallback: any) => {
              // Handle errors
              return { then: () => {} };
            }
          };
        }
      };
    }
    
    if (functionName === 'upsert_user_document') {
      // Define the parameter type to fix the TypeScript error
      interface UserDocumentParams {
        user_id: string;
        aadhaar_doc_url: string;
        business_exp_doc_url: string;
        business_experience: string;
        phone: string;
        address: string;
      }
      
      return {
        then: (callback: any) => {
          // Type cast to fix TS error
          const typedParams: UserDocumentParams = {
            user_id: params.user_id_param,
            aadhaar_doc_url: params.aadhaar_doc_url_param,
            business_exp_doc_url: params.business_exp_doc_url_param,
            business_experience: params.business_experience_param,
            phone: params.phone_param,
            address: params.address_param
          };
          
          franchiseService.upsertUserDocument(typedParams)
            .then(success => {
              // Mimic Supabase response format
              callback({
                data: success ? {} : null,
                error: success ? null : new Error('Failed to upsert user document')
              });
            }).catch(error => {
              callback({
                data: null,
                error
              });
            });
          
          // For chainable promises
          return {
            catch: (errorCallback: any) => {
              // Handle errors
              return { then: () => {} };
            }
          };
        }
      };
    }
    
    // Fall back to original RPC for non-intercepted functions
    return originalRpc(functionName, params);
  };
};
