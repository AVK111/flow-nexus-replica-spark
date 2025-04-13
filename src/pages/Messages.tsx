
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function Messages() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground mt-2">
          Communicate with your franchise network
        </p>
      </div>
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Messaging Center</CardTitle>
          <CardDescription>
            This section will contain franchise communication tools
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Messaging Center</h3>
          <p className="text-muted-foreground max-w-md">
            This feature will provide a centralized communication system for announcements,
            updates, and direct messaging between franchise headquarters and individual franchisees.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
