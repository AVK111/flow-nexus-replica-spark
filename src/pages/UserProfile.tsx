import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from 'react-router-dom';
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

const UserProfile = () => {
  const { user, userProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: userProfile?.first_name || '',
    lastName: userProfile?.last_name || '',
    email: user?.email || '',
    avatarUrl: user?.user_metadata.avatar_url || '',
  });
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast()

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile.first_name || '',
        lastName: userProfile.last_name || '',
        email: user?.email || '',
        avatarUrl: user?.user_metadata.avatar_url || '',
      });
    }
  }, [user, userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files as FileList;
      if (files && files.length > 0) {
        const file = files[0];
        setNewAvatar(file);
        setProfileData(prevData => ({
          ...prevData,
          avatarUrl: URL.createObjectURL(file),
        }));
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your avatar.",
        variant: "destructive",
      })
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      if (!user) {
        throw new Error("User not authenticated");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const avatarURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${filePath}`;
      return avatarURL;
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your avatar.",
        variant: "destructive",
      })
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      let avatarURL = profileData.avatarUrl;

      if (newAvatar) {
        const uploadedURL = await uploadFile(newAvatar);
        if (uploadedURL) {
          avatarURL = uploadedURL;
        } else {
          throw new Error("Failed to upload new avatar");
        }
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          avatar_url: avatarURL,
        },
      });

      if (error) {
        throw error;
      }

      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
        })
        .eq('id', user?.id);

      if (profileUpdateError) {
        throw profileUpdateError;
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      navigate('/profile');
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      })
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container h-full mx-auto flex-col flex">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Update your profile information here.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-center space-x-4">
            <Avatar className="w-24 h-24">
              {profileData.avatarUrl ? (
                <AvatarImage src={profileData.avatarUrl} alt="Avatar" />
              ) : (
                <AvatarFallback>{profileData.firstName ? profileData.firstName[0] : 'U'}{profileData.lastName ? profileData.lastName[0] : 'P'}</AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="avatar">Avatar</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleChange}
              disabled={uploading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={handleChange}
              disabled={uploading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleChange}
              disabled
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={uploading} onClick={handleSubmit}>
            {uploading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 4V2m0 16v2m8-8h2M4 12H2M6.343 6.343l-1.414-1.414M17.657 17.657l1.414 1.414M6.343 17.657l-1.414 1.414M17.657 6.343l1.414-1.414" opacity=".5" /><path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16Z" />
                </svg>
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProfile;
