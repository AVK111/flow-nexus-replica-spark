import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { franchiseService } from "@/services/mongodb/franchise-service";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

const FranchiseApplication = () => {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [investmentCapacity, setInvestmentCapacity] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [motivation, setMotivation] = useState('');
  const [questions, setQuestions] = useState('');
  const [aadhaarDoc, setAadhaarDoc] = useState<File | null>(null);
  const [businessExpDoc, setBusinessExpDoc] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationExists, setApplicationExists] = useState(false);
  const [businessExperience, setBusinessExperience] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  useEffect(() => {
    if (!user?.id || !opportunityId) return;
    
    const checkApplication = async () => {
      const exists = await franchiseService.checkApplicationExists(user.id, opportunityId);
      setApplicationExists(exists);
      
      if (exists) {
        toast({
          title: "Application already submitted",
          description: "You have already submitted an application for this opportunity.",
        });
      }
    };
    
    checkApplication();
  }, [user?.id, opportunityId]);
  
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchUserDocuments = async () => {
      const documents = await franchiseService.getUserDocuments(user.id);
      if (documents) {
        setBusinessExperience(documents.business_experience || '');
        setPhone(documents.phone || '');
        setAddress(documents.address || '');
      }
    };
    
    fetchUserDocuments();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !opportunityId) {
      toast({
        title: "Error",
        description: "User ID or Opportunity ID is missing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('franchisor_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error(`Failed to fetch franchisor ID: ${profileError.message}`);
      }

      if (!profile?.franchisor_id) {
        throw new Error('Franchisor ID is missing in user profile.');
      }

      const success = await franchiseService.submitApplication({
        user_id: user.id,
        opportunity_id: opportunityId,
        franchisor_id: profile.franchisor_id,
        investment_capacity,
        preferred_location,
        timeframe,
        motivation,
        questions,
      });

      if (success) {
        toast({
          title: "Application submitted",
          description: "Your application has been submitted successfully.",
        });
        navigate('/opportunities');
      } else {
        toast({
          title: "Error",
          description: "Failed to submit application. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Application submission error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBusinessExpDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files as FileList;
      if (files && files.length > 0) {
        const file = files[0];
        setBusinessExpDoc(file);
        await uploadFile(file, 'business_exp_doc_url');
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload business experience document.",
        variant: "destructive",
      });
    }
  };
  
  const handleAadhaarDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files as FileList;
      if (files && files.length > 0) {
        const file = files[0];
        setAadhaarDoc(file);
        await uploadFile(file, 'aadhaar_doc_url');
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload Aadhaar document.",
        variant: "destructive",
      });
    }
  };
  
  const uploadFile = async (file: File, fieldName: string) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User ID is missing.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const filePath = `user-documents/${user.id}/${fieldName}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('lovable-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw new Error(`Failed to upload file: ${error.message}`);
      }
      
      const publicURL = `https://your-supabase-url.supabase.co/storage/v1/object/public/${data.Key}`;
      
      // Update user_documents in MongoDB
      await franchiseService.upsertUserDocument({
        user_id: user.id,
        [fieldName]: publicURL,
        business_experience: businessExperience,
        phone: phone,
        address: address
      });
      
      toast({
        title: "File uploaded",
        description: `Your ${fieldName.replace(/_/g, ' ')} has been uploaded successfully.`,
      });
    } catch (error: any) {
      console.error("File upload error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload file.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateInfo = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User ID is missing.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await franchiseService.upsertUserDocument({
        user_id: user.id,
        business_experience: businessExperience,
        phone: phone,
        address: address
      });
      
      toast({
        title: "Information updated",
        description: "Your information has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Update info error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update information.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Franchise Application</CardTitle>
        </CardHeader>
        <CardContent>
          {applicationExists ? (
            <p>You have already submitted an application for this opportunity.</p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <Label htmlFor="investmentCapacity">Investment Capacity</Label>
                <Input
                  type="text"
                  id="investmentCapacity"
                  value={investmentCapacity}
                  onChange={(e) => setInvestmentCapacity(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="preferredLocation">Preferred Location</Label>
                <Input
                  type="text"
                  id="preferredLocation"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select onValueChange={setTimeframe}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-6 months">0-6 months</SelectItem>
                    <SelectItem value="6-12 months">6-12 months</SelectItem>
                    <SelectItem value="12+ months">12+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="motivation">Motivation</Label>
                <Textarea
                  id="motivation"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="questions">Questions</Label>
                <Textarea
                  id="questions"
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="businessExperience">Business Experience</Label>
                <Textarea
                  id="businessExperience"
                  value={businessExperience}
                  onChange={(e) => setBusinessExperience(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="aadhaarDoc">Aadhaar Document</Label>
                <Input
                  type="file"
                  id="aadhaarDoc"
                  onChange={handleAadhaarDocUpload}
                />
              </div>
              
              <div>
                <Label htmlFor="businessExpDoc">Business Experience Document</Label>
                <Input
                  type="file"
                  id="businessExpDoc"
                  onChange={handleBusinessExpDocUpload}
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
              
              <Button type="button" variant="secondary" onClick={handleUpdateInfo}>
                Update Information
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FranchiseApplication;
