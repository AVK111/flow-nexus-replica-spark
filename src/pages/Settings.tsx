
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and system preferences
        </p>
      </div>
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Configure your franchise management system
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <SettingsIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Settings & Configuration</h3>
          <p className="text-muted-foreground max-w-md">
            This section will include user account management, notification preferences,
            system configuration, and integration settings for your franchise management platform.
          </p>
        </CardContent>
      </Card>
      
      <Separator />
      
      <div className="text-xs text-muted-foreground text-center">
        Franchise Flow Nexus • Version 1.0.0
      </div>
    </div>
  );
}
