
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, FileText, User, IndianRupee } from "lucide-react";

const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  businessExperience: z.string().min(10, "Please provide details about your business experience"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function UserProfile() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [businessExpFile, setBusinessExpFile] = useState<File | null>(null);
  const [aadhaarUrl, setAadhaarUrl] = useState<string | null>(null);
  const [businessExpUrl, setBusinessExpUrl] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      businessExperience: "",
      phone: "",
      address: "",
    },
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        if (profileData) {
          form.setValue('firstName', profileData.first_name || '');
          form.setValue('lastName', profileData.last_name || '');
          
          // Get document URLs if they exist
          const { data: storageData, error: storageError } = await supabase
            .from('user_documents')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (!storageError && storageData) {
            setAadhaarUrl(storageData.aadhaar_doc_url || null);
            setBusinessExpUrl(storageData.business_exp_doc_url || null);
            form.setValue('businessExperience', storageData.business_experience || '');
            form.setValue('phone', storageData.phone || '');
            form.setValue('address', storageData.address || '');
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, form, toast]);

  const handleAadhaarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    
    const file = event.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size exceeds 5MB limit",
        variant: "destructive",
      });
      return;
    }
    
    setAadhaarFile(file);
  };

  const handleBusinessDocUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    
    const file = event.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size exceeds 5MB limit",
        variant: "destructive",
      });
      return;
    }
    
    setBusinessExpFile(file);
  };

  const uploadDocumentToStorage = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${path}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('user_documents')
      .upload(filePath, file, {
        upsert: true,
      });
      
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('user_documents')
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setUploading(true);
      
      // Update profile information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Upload files if selected
      let aadhaarDocUrl = aadhaarUrl;
      let businessExpDocUrl = businessExpUrl;
      
      if (aadhaarFile) {
        aadhaarDocUrl = await uploadDocumentToStorage(aadhaarFile, `aadhaar_${user.id}`);
      }
      
      if (businessExpFile) {
        businessExpDocUrl = await uploadDocumentToStorage(businessExpFile, `business_exp_${user.id}`);
      }
      
      // Check if user_documents record exists
      const { data: existingDoc, error: checkError } = await supabase
        .from('user_documents')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      // Update or insert document records
      if (existingDoc) {
        const { error: docError } = await supabase
          .from('user_documents')
          .update({
            aadhaar_doc_url: aadhaarDocUrl,
            business_exp_doc_url: businessExpDocUrl,
            business_experience: values.businessExperience,
            phone: values.phone,
            address: values.address,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
          
        if (docError) throw docError;
      } else {
        const { error: docError } = await supabase
          .from('user_documents')
          .insert({
            user_id: user.id,
            aadhaar_doc_url: aadhaarDocUrl,
            business_exp_doc_url: businessExpDocUrl,
            business_experience: values.businessExperience,
            phone: values.phone,
            address: values.address,
          });
          
        if (docError) throw docError;
      }
      
      // Update state
      setAadhaarUrl(aadhaarDocUrl);
      setBusinessExpUrl(businessExpDocUrl);
      
      toast({
        title: "Success",
        description: "Profile and documents updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile data",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#3B1E77]">Profile & Documents</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile information and upload required documents
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Document Upload
              </CardTitle>
              <CardDescription>Upload your Aadhaar card and business experience documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Card</Label>
                  <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    {aadhaarUrl ? (
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-between bg-muted/50 p-2 rounded">
                          <span className="text-sm text-muted-foreground flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            Document Uploaded
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => window.open(aadhaarUrl, '_blank')}
                          >
                            View
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Upload new file to replace</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF, PNG, JPG (Max 5MB)</p>
                      </div>
                    )}
                    <Input
                      id="aadhaar"
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleAadhaarUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => document.getElementById('aadhaar')?.click()}
                    >
                      Select File
                    </Button>
                    {aadhaarFile && (
                      <p className="text-sm mt-2">{aadhaarFile.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="business-exp">Business Experience Document</Label>
                  <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    {businessExpUrl ? (
                      <div className="space-y-2 w-full">
                        <div className="flex items-center justify-between bg-muted/50 p-2 rounded">
                          <span className="text-sm text-muted-foreground flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            Document Uploaded
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => window.open(businessExpUrl, '_blank')}
                          >
                            View
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Upload new file to replace</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF, PNG, JPG (Max 5MB)</p>
                      </div>
                    )}
                    <Input
                      id="business-exp"
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleBusinessDocUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => document.getElementById('business-exp')?.click()}
                    >
                      Select File
                    </Button>
                    {businessExpFile && (
                      <p className="text-sm mt-2">{businessExpFile.name}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="businessExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Experience</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your business experience and qualifications..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include details about your previous entrepreneurial experience.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={uploading} className="w-full md:w-auto">
                {uploading ? "Saving..." : "Save Profile"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
