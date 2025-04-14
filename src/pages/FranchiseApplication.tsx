
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IndianRupee, CheckCircle2, Loader2 } from "lucide-react";

interface FranchiseOpportunity {
  id: string;
  title: string;
  description: string;
  investment_min: number;
  investment_max: number;
  roi_min: number;
  roi_max: number;
  category: string;
  location: string;
  franchisor_id: string;
}

const applicationFormSchema = z.object({
  investmentCapacity: z.string().min(1, "Investment capacity is required"),
  preferredLocation: z.string().min(1, "Preferred location is required"),
  timeframe: z.string().min(1, "Timeframe is required"),
  motivation: z.string().min(10, "Please provide your motivation for applying"),
  questions: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export default function FranchiseApplication() {
  const { opportunityId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [opportunity, setOpportunity] = useState<FranchiseOpportunity | null>(null);
  const [documentsUploaded, setDocumentsUploaded] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      investmentCapacity: "",
      preferredLocation: "",
      timeframe: "",
      motivation: "",
      questions: "",
    },
  });

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!opportunityId) return;
      
      try {
        setLoading(true);
        
        // Fetch opportunity details
        const { data, error } = await supabase
          .from('franchise_opportunities')
          .select('*')
          .eq('id', opportunityId)
          .single();
          
        if (error) throw error;
        
        setOpportunity(data as FranchiseOpportunity);
        
        // Check if user has uploaded documents
        if (user) {
          const { data: docData, error: docError } = await supabase
            .from('user_documents')
            .select('aadhaar_doc_url, business_exp_doc_url')
            .eq('user_id', user.id)
            .single();
            
          if (!docError && docData) {
            setDocumentsUploaded(
              !!docData.aadhaar_doc_url && !!docData.business_exp_doc_url
            );
          }
          
          // Check if application already submitted
          const { data: appData, error: appError } = await supabase
            .from('franchise_applications')
            .select('id')
            .eq('user_id', user.id)
            .eq('opportunity_id', opportunityId)
            .single();
            
          if (!appError && appData) {
            setApplicationSubmitted(true);
          }
        }
      } catch (error) {
        console.error('Error fetching opportunity:', error);
        toast({
          title: "Error",
          description: "Failed to load opportunity details",
          variant: "destructive",
        });
        navigate("/opportunities");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOpportunity();
  }, [opportunityId, user, toast, navigate]);

  const onSubmit = async (values: ApplicationFormValues) => {
    if (!user || !opportunity) return;
    
    try {
      setSubmitting(true);
      
      // Submit application
      const { error } = await supabase
        .from('franchise_applications')
        .insert({
          user_id: user.id,
          opportunity_id: opportunity.id,
          franchisor_id: opportunity.franchisor_id,
          investment_capacity: values.investmentCapacity,
          preferred_location: values.preferredLocation,
          timeframe: values.timeframe,
          motivation: values.motivation,
          questions: values.questions || null,
          status: 'pending',
        });
        
      if (error) throw error;
      
      setApplicationSubmitted(true);
      
      toast({
        title: "Application Submitted",
        description: "Your franchise application has been successfully submitted!",
      });
      
      // Redirect after a delay
      setTimeout(() => {
        navigate("/opportunities");
      }, 3000);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin h-8 w-8 border-2 border-[#3B1E77] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Opportunity not found or no longer available.</p>
        <Button onClick={() => navigate("/opportunities")}>Back to Opportunities</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#3B1E77]">Franchise Application</h1>
        <p className="text-muted-foreground mt-2">
          Apply for the {opportunity.title} franchise opportunity
        </p>
      </div>
      
      {applicationSubmitted ? (
        <Card className="text-center p-8">
          <div className="flex flex-col items-center justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Your application for {opportunity.title} has been successfully submitted. The franchisor will review your application and contact you soon.
            </p>
            <Button onClick={() => navigate("/opportunities")}>Back to Opportunities</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Franchise Application Form</CardTitle>
              <CardDescription>
                Complete the form below to apply for this franchise opportunity
              </CardDescription>
            </CardHeader>
            
            {!documentsUploaded ? (
              <CardContent className="p-8 text-center">
                <div className="mb-4 text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Documents Required</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  You need to upload your Aadhaar card and business experience documents before applying.
                </p>
                <Button onClick={() => navigate("/profile")}>
                  Upload Documents
                </Button>
              </CardContent>
            ) : (
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="investmentCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Investment Capacity (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter amount in INR" {...field} />
                          </FormControl>
                          <FormDescription>
                            How much are you willing to invest in this franchise opportunity?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="preferredLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter city or region" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="timeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Timeframe</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 3-6 months, 1 year" {...field} />
                          </FormControl>
                          <FormDescription>
                            When do you plan to start this franchise?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="motivation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Motivation</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Why are you interested in this franchise opportunity?" 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="questions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Questions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any questions for the franchisor?" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? (
                        <span className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting Application...
                        </span>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            )}
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{opportunity.title}</CardTitle>
              <CardDescription>
                <Badge variant="outline" className="mt-1">{opportunity.category}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{opportunity.description}</p>
              
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Investment Required:</span>
                  <span className="font-medium">
                    ₹{opportunity.investment_min/100000}L - ₹{opportunity.investment_max/100000}L
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Expected ROI:</span>
                  <span className="font-medium">{opportunity.roi_min}% - {opportunity.roi_max}%</span>
                </div>
                
                {opportunity.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Location:</span>
                    <span className="font-medium">{opportunity.location}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
