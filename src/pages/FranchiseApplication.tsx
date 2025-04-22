import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type InvestmentCapacity = '< $100k' | '$100k-$250k' | '$250k-$500k' | '$500k-$1M' | '> $1M';
type Timeframe = 'Immediate' | '3-6 months' | '6-12 months' | '1-2 years' | '2+ years';

const FranchiseApplication = () => {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [franchisorId, setFranchisorId] = useState<string>('');
  const [investmentCapacity, setInvestmentCapacity] = useState<InvestmentCapacity>('< $100k');
  const [preferredLocation, setPreferredLocation] = useState<string>('');
  const [timeframe, setTimeframe] = useState<Timeframe>('3-6 months');
  const [motivation, setMotivation] = useState<string>('');
  const [questions, setQuestions] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState<boolean>(false);

  useEffect(() => {
    const checkExistingApplication = async () => {
      try {
        if (!user || !opportunityId) return;
        
        setIsLoading(true);
        const { data, error } = await supabase.rpc('check_application_exists', {
          user_id_param: user.id,
          opportunity_id_param: opportunityId
        }) as { data: Array<{ exists: boolean }> | null, error: Error | null };
        
        if (error) throw error;
        
        setHasSubmittedBefore(Boolean(data && data.length > 0));
      } catch (error) {
        console.error('Error checking existing application:', error);
        toast({
          title: "Error",
          description: "Could not check if you've already applied.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkExistingApplication();
  }, [user, opportunityId]);

  useEffect(() => {
    const getFranchisorId = async () => {
      try {
        if (!opportunityId) return;
        
        setIsLoading(true);
        const { data, error } = await supabase
          .from('franchise_opportunities')
          .select('franchisor_id')
          .eq('id', opportunityId)
          .single();
        
        if (error) throw error;
        
        if (data && data.franchisor_id) {
          setFranchisorId(data.franchisor_id);
        }
      } catch (error) {
        console.error('Error fetching franchisor ID:', error);
        toast({
          title: "Error",
          description: "Could not load opportunity details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    getFranchisorId();
  }, [opportunityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !opportunityId || !franchisorId) {
      toast({
        title: "Error",
        description: "Missing required information.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase.rpc('submit_franchise_application', {
        user_id_param: user.id,
        opportunity_id_param: opportunityId,
        franchisor_id_param: franchisorId,
        investment_capacity_param: investmentCapacity,
        preferred_location_param: preferredLocation,
        timeframe_param: timeframe,
        motivation_param: motivation,
        questions_param: questions
      });
      
      if (error) throw error;
      
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
      });
      
      navigate('/opportunities');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your application.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    try {
      const files = e.target.files;
      if (!files || files.length === 0 || !user) return;
      
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${docType}_${Date.now()}.${fileExt}`;
      const filePath = `franchise_docs/${fileName}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${filePath}`;
      
      toast({
        title: "Document Uploaded",
        description: `${docType} document has been uploaded.`,
      });
      
      return fileUrl;
    } catch (error) {
      console.error(`Error uploading ${docType} document:`, error);
      toast({
        title: "Upload Error",
        description: `Failed to upload ${docType} document.`,
        variant: "destructive",
      });
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (hasSubmittedBefore) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Application Already Submitted</CardTitle>
          <CardDescription>
            You have already submitted an application for this franchise opportunity.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate('/opportunities')}>
            Back to Opportunities
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Franchise Application</CardTitle>
        <CardDescription>
          Please fill out the following information to apply for this franchise opportunity.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="investmentCapacity">Investment Capacity</Label>
            <Select 
              value={investmentCapacity} 
              onValueChange={(value) => setInvestmentCapacity(value as InvestmentCapacity)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select investment capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="< $100k">Less than $100,000</SelectItem>
                <SelectItem value="$100k-$250k">$100,000 - $250,000</SelectItem>
                <SelectItem value="$250k-$500k">$250,000 - $500,000</SelectItem>
                <SelectItem value="$500k-$1M">$500,000 - $1,000,000</SelectItem>
                <SelectItem value="> $1M">More than $1,000,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferredLocation">Preferred Location</Label>
            <Input
              id="preferredLocation"
              value={preferredLocation}
              onChange={(e) => setPreferredLocation(e.target.value)}
              placeholder="e.g., New York, Los Angeles, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe for Opening</Label>
            <Select 
              value={timeframe} 
              onValueChange={(value) => setTimeframe(value as Timeframe)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Immediate">Immediate</SelectItem>
                <SelectItem value="3-6 months">3-6 months</SelectItem>
                <SelectItem value="6-12 months">6-12 months</SelectItem>
                <SelectItem value="1-2 years">1-2 years</SelectItem>
                <SelectItem value="2+ years">2+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motivation">Motivation</Label>
            <Textarea
              id="motivation"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Why are you interested in this franchise opportunity?"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="questions">Questions or Comments</Label>
            <Textarea
              id="questions"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="Do you have any specific questions about this franchise?"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/opportunities')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FranchiseApplication;
