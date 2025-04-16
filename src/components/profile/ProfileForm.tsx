
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileFormProps = {
  firstName: string;
  lastName: string;
  email: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  firstName, 
  lastName, 
  email, 
  onInputChange, 
  disabled 
}) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={onInputChange}
          disabled={disabled}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={onInputChange}
          disabled={disabled}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={onInputChange}
          disabled={true}
        />
      </div>
    </>
  );
};

export default ProfileForm;
