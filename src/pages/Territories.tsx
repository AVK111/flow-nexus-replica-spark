
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

export default function Territories() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Territories</h1>
        <p className="text-muted-foreground mt-2">
          Manage franchise territories and regions
        </p>
      </div>
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Territory Management</CardTitle>
          <CardDescription>
            This section will contain territory management functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <Globe className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Territory Management</h3>
          <p className="text-muted-foreground max-w-md">
            This feature will allow you to create, edit, and manage territories for your franchise network,
            including geographic boundaries, assigned franchisees, and market potential analysis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
