
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

const recentLeads = [
  { 
    id: 1, 
    name: "Jane Cooper", 
    email: "jane.cooper@example.com", 
    phone: "(555) 123-4567", 
    territory: "East Region", 
    status: "New"
  },
  { 
    id: 2, 
    name: "Robert Johnson", 
    email: "robert.j@example.com", 
    phone: "(555) 234-5678", 
    territory: "West Region", 
    status: "Contacted" 
  },
  { 
    id: 3, 
    name: "Emily Davis", 
    email: "emily.d@example.com", 
    phone: "(555) 345-6789", 
    territory: "North Region", 
    status: "Qualified" 
  },
  { 
    id: 4, 
    name: "Michael Smith", 
    email: "michaels@example.com", 
    phone: "(555) 456-7890", 
    territory: "South Region", 
    status: "New" 
  },
  { 
    id: 5, 
    name: "Sarah Williams", 
    email: "sarahw@example.com", 
    phone: "(555) 567-8901", 
    territory: "Central Region", 
    status: "Not Interested" 
  }
];

export default function RecentLeads() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>Latest franchise inquiries received</CardDescription>
        </div>
        <Button variant="outline" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Territory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{lead.email}</span>
                    <span className="text-xs text-muted-foreground">{lead.phone}</span>
                  </div>
                </TableCell>
                <TableCell>{lead.territory}</TableCell>
                <TableCell>
                  <Badge variant={
                    lead.status === "New" ? "default" :
                    lead.status === "Contacted" ? "secondary" :
                    lead.status === "Qualified" ? "success" : "destructive"
                  } className={
                    lead.status === "New" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                    lead.status === "Contacted" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                    lead.status === "Qualified" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                    "bg-red-100 text-red-800 hover:bg-red-100"
                  }>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
