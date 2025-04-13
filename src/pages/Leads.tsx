
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, MoreHorizontal, Plus, Search } from "lucide-react";

const leads = [
  {
    id: 1,
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    phone: "(555) 123-4567",
    territory: "East Region",
    source: "Website",
    date: "Apr 23, 2023",
    status: "New",
  },
  {
    id: 2,
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "(555) 234-5678",
    territory: "West Region",
    source: "Referral",
    date: "Apr 22, 2023",
    status: "Contacted",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "(555) 345-6789",
    territory: "North Region",
    source: "Trade Show",
    date: "Apr 21, 2023",
    status: "Qualified",
  },
  {
    id: 4,
    name: "Michael Smith",
    email: "michaels@example.com",
    phone: "(555) 456-7890",
    territory: "South Region",
    source: "Social Media",
    date: "Apr 20, 2023",
    status: "New",
  },
  {
    id: 5,
    name: "Sarah Williams",
    email: "sarahw@example.com",
    phone: "(555) 567-8901",
    territory: "Central Region",
    source: "Website",
    date: "Apr 19, 2023",
    status: "Not Interested",
  },
  {
    id: 6,
    name: "David Brown",
    email: "davidb@example.com",
    phone: "(555) 678-9012",
    territory: "East Region",
    source: "Email Campaign",
    date: "Apr 18, 2023",
    status: "Qualified",
  },
  {
    id: 7,
    name: "Lisa Rodriguez",
    email: "lisar@example.com",
    phone: "(555) 789-0123",
    territory: "West Region",
    source: "Website",
    date: "Apr 17, 2023",
    status: "Contacted",
  },
  {
    id: 8,
    name: "James Wilson",
    email: "jamesw@example.com",
    phone: "(555) 890-1234",
    territory: "North Region",
    source: "Referral",
    date: "Apr 16, 2023",
    status: "New",
  },
];

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.territory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track potential franchisees
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Lead</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Leads</CardTitle>
              <CardDescription>
                Track and manage franchise inquiries
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search leads..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Territory</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{lead.email}</span>
                      <span className="text-xs text-muted-foreground">
                        {lead.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{lead.territory}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{lead.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        lead.status === "New"
                          ? "default"
                          : lead.status === "Contacted"
                          ? "secondary"
                          : lead.status === "Qualified"
                          ? "success"
                          : "destructive"
                      }
                      className={
                        lead.status === "New"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          : lead.status === "Contacted"
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                          : lead.status === "Qualified"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                        <DropdownMenuItem>Assign Territory</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Mark as Contacted</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Qualified</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Mark as Not Interested
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
