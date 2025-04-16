
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AvatarUpload from '@/components/profile/AvatarUpload';
import ProfileForm from '@/components/profile/ProfileForm';
import { useProfileUpdate } from '@/hooks/useProfileUpdate';

const UserProfile = () => {
  const { user, userProfile } = useAuth();
  
  const {
    profileData,
    uploading,
    handleChange,
    handleSubmit,
    updateAvatarUrl
  } = useProfileUpdate(user?.id, {
    firstName: userProfile?.first_name || '',
    lastName: userProfile?.last_name || '',
    email: user?.email || '',
    avatarUrl: user?.user_metadata.avatar_url || '',
  });

  // Update profile data when user data changes
  useEffect(() => {
    if (userProfile) {
      updateAvatarUrl(user?.user_metadata.avatar_url || '');
    }
  }, [user, userProfile]);

  // Create user initials for avatar fallback
  const userInitials = `${profileData.firstName ? profileData.firstName[0] : 'U'}${profileData.lastName ? profileData.lastName[0] : 'P'}`;

  return (
    <div className="container h-full mx-auto flex-col flex">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Update your profile information here.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <AvatarUpload 
            avatarUrl={profileData.avatarUrl}
            userInitials={userInitials}
            userId={user?.id}
            onAvatarChange={updateAvatarUrl}
            disabled={uploading}
          />
          <ProfileForm
            firstName={profileData.firstName}
            lastName={profileData.lastName}
            email={profileData.email}
            onInputChange={handleChange}
            disabled={uploading}
          />
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
