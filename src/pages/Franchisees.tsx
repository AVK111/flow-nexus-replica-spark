
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Filter, MoreHorizontal, Plus, Search } from "lucide-react";

const franchisees = [
  {
    id: 1,
    name: "Metro City Franchise",
    owner: "Richard Wilson",
    location: "New York, NY",
    territory: "East Region",
    established: "Jan 15, 2020",
    status: "Active",
    revenue: "$125,000",
  },
  {
    id: 2,
    name: "Westside Solutions",
    owner: "Sarah Johnson",
    location: "Los Angeles, CA",
    territory: "West Region",
    established: "Mar 22, 2020",
    status: "Active",
    revenue: "$98,500",
  },
  {
    id: 3,
    name: "Sunshine Franchise",
    owner: "Michael Brown",
    location: "Miami, FL",
    territory: "South Region",
    established: "Jun 10, 2021",
    status: "Active",
    revenue: "$87,200",
  },
  {
    id: 4,
    name: "Midwest Partners",
    owner: "Jennifer Davis",
    location: "Chicago, IL",
    territory: "Midwest Region",
    established: "Sep 5, 2021",
    status: "Probation",
    revenue: "$65,800",
  },
  {
    id: 5,
    name: "Northern Lights",
    owner: "Robert Taylor",
    location: "Seattle, WA",
    territory: "Northwest Region",
    established: "Nov 18, 2021",
    status: "Active",
    revenue: "$110,500",
  },
  {
    id: 6,
    name: "Golden State Franchise",
    owner: "Lisa Garcia",
    location: "San Francisco, CA",
    territory: "West Region",
    established: "Feb 28, 2022",
    status: "Active",
    revenue: "$92,300",
  },
  {
    id: 7,
    name: "Lone Star Business",
    owner: "James Rodriguez",
    location: "Dallas, TX",
    territory: "Southwest Region",
    established: "May 12, 2022",
    status: "Suspended",
    revenue: "$45,600",
  },
];

export default function Franchisees() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFranchisees = franchisees.filter(
    (franchisee) =>
      franchisee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      franchisee.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      franchisee.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Franchisees</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your franchise network
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Franchisee</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Franchise Network</CardTitle>
              <CardDescription>
                A complete list of your franchisees
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search franchisees..."
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
                <TableHead>Franchise</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Territory</TableHead>
                <TableHead>Established</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFranchisees.map((franchisee) => (
                <TableRow key={franchisee.id}>
                  <TableCell className="font-medium">
                    {franchisee.name}
                  </TableCell>
                  <TableCell>{franchisee.owner}</TableCell>
                  <TableCell>{franchisee.location}</TableCell>
                  <TableCell>{franchisee.territory}</TableCell>
                  <TableCell>{franchisee.established}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        franchisee.status === "Active"
                          ? "success"
                          : franchisee.status === "Probation"
                          ? "warning"
                          : "destructive"
                      }
                      className={
                        franchisee.status === "Active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : franchisee.status === "Probation"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {franchisee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{franchisee.revenue}</TableCell>
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
                        <DropdownMenuItem>Edit Franchisee</DropdownMenuItem>
                        <DropdownMenuItem>Performance Report</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Suspend Franchisee
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
