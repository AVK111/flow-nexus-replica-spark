
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

export type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
};

export const useProfileUpdate = (userId: string | undefined, initialData: ProfileData) => {
  const [profileData, setProfileData] = useState<ProfileData>(initialData);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateAvatarUrl = (url: string) => {
    setProfileData(prevData => ({
      ...prevData,
      avatarUrl: url,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Update failed",
        description: "User ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Update user metadata with new avatar URL
      const { error } = await supabase.auth.updateUser({
        data: {
          avatar_url: profileData.avatarUrl,
        },
      });

      if (error) {
        throw error;
      }

      // Update user profile with new names
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
        })
        .eq('id', userId);

      if (profileUpdateError) {
        throw profileUpdateError;
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      // Redirect back to profile page
      navigate('/profile');
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return {
    profileData,
    uploading,
    handleChange,
    handleSubmit,
    updateAvatarUrl
  };
};
