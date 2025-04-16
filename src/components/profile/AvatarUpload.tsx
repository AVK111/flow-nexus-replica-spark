
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type AvatarUploadProps = {
  avatarUrl: string;
  userInitials: string;
  userId: string | undefined;
  onAvatarChange: (url: string) => void;
  disabled: boolean;
};

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  avatarUrl, 
  userInitials, 
  userId, 
  onAvatarChange, 
  disabled 
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files as FileList;
      if (files && files.length > 0) {
        const file = files[0];
        
        // Create a temporary URL for immediate preview
        onAvatarChange(URL.createObjectURL(file));
        
        // Start the upload process if needed immediately
        if (userId) {
          uploadFile(file, userId);
        }
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your avatar.",
        variant: "destructive",
      });
    }
  };

  const uploadFile = async (file: File, userId: string) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
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
      onAvatarChange(avatarURL);
      
      toast({
        title: "Avatar uploaded",
        description: "Your avatar has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your avatar.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center space-x-4">
        <Avatar className="w-24 h-24">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="Avatar" />
          ) : (
            <AvatarFallback>{userInitials}</AvatarFallback>
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
          disabled={disabled || uploading}
        />
      </div>
    </>
  );
};

export default AvatarUpload;
