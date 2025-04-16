
// This file provides a bridge between the existing Supabase RPC functions
// and the new MongoDB service. This helps maintain backward compatibility
// while migrating the database.

import { supabase } from "@/integrations/supabase/client";
import { franchiseService } from "@/services/mongodb/franchise-service";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

type SupabaseRpcFunction = typeof supabase.rpc;

// Monkey patch the RPC functions to use MongoDB instead
// This is a temporary solution during migration
export const setupMongoBridge = () => {
  // Store original rpc function
  const originalRpc = supabase.rpc;
  
  // Override rpc to intercept specific function calls
  // @ts-ignore - We're intentionally overriding the type here
  supabase.rpc = function(functionName: string, params?: any): any {
    console.log(`RPC call intercepted: ${functionName}`, params);
    
    // Intercept specific RPC calls
    if (functionName === 'check_application_exists') {
      return {
        then: (callback: any) => {
          franchiseService.checkApplicationExists(
            params.user_id_param,
            params.opportunity_id_param
          ).then(exists => {
            // Mimic Supabase response format
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
    
    if (functionName === 'get_user_documents') {
      return {
        then: (callback: any) => {
          franchiseService.getUserDocuments(params.user_id_param)
            .then(document => {
              // Mimic Supabase response format
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
            questions: params.questions_param
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
      return {
        then: (callback: any) => {
          franchiseService.upsertUserDocument({
            user_id: params.user_id_param,
            aadhaar_doc_url: params.aadhaar_doc_url_param,
            business_exp_doc_url: params.business_exp_doc_url_param,
            business_experience: params.business_experience_param,
            phone: params.phone_param,
            address: params.address_param
          }).then(success => {
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
