
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, MoreHorizontal, Plus, Search, Loader2 } from "lucide-react";

// Interface for franchisee data
interface Franchisee {
  id: string;
  name: string;
  owner: string;
  location: string;
  territory: string;
  established: string;
  status: string;
  revenue: string;
}

// Interface for new franchisee form
interface FranchiseeForm {
  name: string;
  owner: string;
  location: string;
  territory: string;
  established: string;
  status: string;
  revenue: string;
}

export default function Franchisees() {
  const { userProfile, user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFranchisee, setEditingFranchisee] = useState<Franchisee | null>(null);
  
  // Form state for adding/editing franchisees
  const [franchiseeForm, setFranchiseeForm] = useState<FranchiseeForm>({
    name: "",
    owner: "",
    location: "",
    territory: "",
    established: new Date().toISOString().split('T')[0],
    status: "Active",
    revenue: "$0",
  });

  // Query to fetch franchisees
  const { data: franchisees = [], isLoading } = useQuery({
    queryKey: ['franchisees'],
    queryFn: async () => {
      if (!user || !userProfile) {
        return [];
      }

      // If user is franchisee, show only the franchises they are part of
      if (userProfile.role === 'franchisee') {
        const { data: franchiseeData, error } = await supabase
          .from('franchisees')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching franchisee data:', error);
          return [];
        }
        return franchiseeData || [];
      }
      
      // If user is franchisor, find their franchise first
      const { data: franchisorData, error: franchisorError } = await supabase
        .from('franchisors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (franchisorError) {
        console.error('Error fetching franchisor data:', franchisorError);
        return [];
      }

      // Then get all franchisees for this franchisor
      const { data: franchiseesData, error: franchiseesError } = await supabase
        .from('franchisees')
        .select('*')
        .eq('franchisor_id', franchisorData.id);

      if (franchiseesError) {
        console.error('Error fetching franchisees:', franchiseesError);
        return [];
      }

      return franchiseesData || [];
    },
    enabled: !!user && !!userProfile,
  });

  // Mutation to add a new franchisee
  const addFranchiseeMutation = useMutation({
    mutationFn: async (newFranchisee: FranchiseeForm) => {
      if (!user || !userProfile || userProfile.role !== 'franchisor') {
        throw new Error('Only franchisors can add franchisees');
      }

      // Get franchisor ID
      const { data: franchisorData, error: franchisorError } = await supabase
        .from('franchisors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (franchisorError) {
        throw franchisorError;
      }

      // Add the franchisee
      const { data, error } = await supabase
        .from('franchisees')
        .insert([
          {
            ...newFranchisee,
            franchisor_id: franchisorData.id,
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    },
    onSuccess: () => {
      toast({
        title: "Franchisee Added",
        description: "The franchisee has been added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['franchisees'] });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add franchisee: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation to update a franchisee
  const updateFranchiseeMutation = useMutation({
    mutationFn: async ({ id, franchisee }: { id: string; franchisee: FranchiseeForm }) => {
      const { data, error } = await supabase
        .from('franchisees')
        .update(franchisee)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    },
    onSuccess: () => {
      toast({
        title: "Franchisee Updated",
        description: "The franchisee has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['franchisees'] });
      setIsEditDialogOpen(false);
      setEditingFranchisee(null);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update franchisee: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mutation to delete a franchisee
  const deleteFranchiseeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('franchisees')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Franchisee Deleted",
        description: "The franchisee has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['franchisees'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete franchisee: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFranchiseeForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setFranchiseeForm(prev => ({ ...prev, [name]: value }));
  };

  // Reset form to default values
  const resetForm = () => {
    setFranchiseeForm({
      name: "",
      owner: "",
      location: "",
      territory: "",
      established: new Date().toISOString().split('T')[0],
      status: "Active",
      revenue: "$0",
    });
  };

  // Open edit dialog and populate form
  const handleEdit = (franchisee: Franchisee) => {
    setEditingFranchisee(franchisee);
    setFranchiseeForm({
      name: franchisee.name,
      owner: franchisee.owner,
      location: franchisee.location,
      territory: franchisee.territory,
      established: franchisee.established,
      status: franchisee.status,
      revenue: franchisee.revenue,
    });
    setIsEditDialogOpen(true);
  };

  // Handle add franchisee form submission
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFranchiseeMutation.mutate(franchiseeForm);
  };

  // Handle edit franchisee form submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFranchisee) {
      updateFranchiseeMutation.mutate({
        id: editingFranchisee.id,
        franchisee: franchiseeForm,
      });
    }
  };

  // Filter franchisees based on search term
  const filteredFranchisees = franchisees.filter(
    (franchisee) =>
      franchisee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      franchisee.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      franchisee.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user is a franchisor
  const isFranchisor = userProfile?.role === 'franchisor';
  const isSubmitting = addFranchiseeMutation.isPending || updateFranchiseeMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Franchisees</h1>
          <p className="text-muted-foreground mt-2">
            {isFranchisor 
              ? "Manage and monitor your franchise network" 
              : "View your franchise information"}
          </p>
        </div>
        {isFranchisor && (
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus size={16} />
            <span>Add Franchisee</span>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Franchise Network</CardTitle>
              <CardDescription>
                {isFranchisor 
                  ? "A complete list of your franchisees" 
                  : "Your franchise details"}
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
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg font-medium">Loading...</span>
            </div>
          ) : franchisees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium">No franchisees found</p>
              {isFranchisor && (
                <p className="text-muted-foreground mt-1">
                  Add your first franchisee to get started
                </p>
              )}
            </div>
          ) : (
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
                  {isFranchisor && <TableHead></TableHead>}
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
                    {isFranchisor && (
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
                            <DropdownMenuItem onClick={() => handleEdit(franchisee)}>
                              Edit Franchisee
                            </DropdownMenuItem>
                            <DropdownMenuItem>Performance Report</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this franchisee?")) {
                                  deleteFranchiseeMutation.mutate(franchisee.id);
                                }
                              }}
                            >
                              Delete Franchisee
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Franchisee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Franchisee</DialogTitle>
            <DialogDescription>
              Add a new franchisee to your network. Fill out the form with the franchisee's details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label htmlFor="name" className="text-sm font-medium mb-1 block">
                    Franchise Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={franchiseeForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="owner" className="text-sm font-medium mb-1 block">
                    Owner
                  </label>
                  <Input
                    id="owner"
                    name="owner"
                    value={franchiseeForm.owner}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="location" className="text-sm font-medium mb-1 block">
                    Location
                  </label>
                  <Input
                    id="location"
                    name="location"
                    value={franchiseeForm.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="territory" className="text-sm font-medium mb-1 block">
                    Territory
                  </label>
                  <Input
                    id="territory"
                    name="territory"
                    value={franchiseeForm.territory}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="established" className="text-sm font-medium mb-1 block">
                    Established
                  </label>
                  <Input
                    id="established"
                    name="established"
                    type="date"
                    value={franchiseeForm.established}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="status" className="text-sm font-medium mb-1 block">
                    Status
                  </label>
                  <Select
                    value={franchiseeForm.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Probation">Probation</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="revenue" className="text-sm font-medium mb-1 block">
                    Revenue
                  </label>
                  <Input
                    id="revenue"
                    name="revenue"
                    value={franchiseeForm.revenue}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Add Franchisee'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Franchisee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Franchisee</DialogTitle>
            <DialogDescription>
              Update the franchisee's information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label htmlFor="edit-name" className="text-sm font-medium mb-1 block">
                    Franchise Name
                  </label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={franchiseeForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-owner" className="text-sm font-medium mb-1 block">
                    Owner
                  </label>
                  <Input
                    id="edit-owner"
                    name="owner"
                    value={franchiseeForm.owner}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-location" className="text-sm font-medium mb-1 block">
                    Location
                  </label>
                  <Input
                    id="edit-location"
                    name="location"
                    value={franchiseeForm.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-territory" className="text-sm font-medium mb-1 block">
                    Territory
                  </label>
                  <Input
                    id="edit-territory"
                    name="territory"
                    value={franchiseeForm.territory}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-established" className="text-sm font-medium mb-1 block">
                    Established
                  </label>
                  <Input
                    id="edit-established"
                    name="established"
                    type="date"
                    value={franchiseeForm.established}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-status" className="text-sm font-medium mb-1 block">
                    Status
                  </label>
                  <Select
                    value={franchiseeForm.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Probation">Probation</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="edit-revenue" className="text-sm font-medium mb-1 block">
                    Revenue
                  </label>
                  <Input
                    id="edit-revenue"
                    name="revenue"
                    value={franchiseeForm.revenue}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingFranchisee(null);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
