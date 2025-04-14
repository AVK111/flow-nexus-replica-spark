import { Store, FileText, CreditCard, Clock, User, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Franchisee {
  id: string;
  name: string;
  owner: string;
  location: string;
  territory: string;
  status: string;
  established: string;
  revenue: string;
}

export default function FranchiseeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [franchiseeData, setFranchiseeData] = useState<Franchisee | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFranchiseeData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('franchisees')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "not found" - this is expected for new users
          console.error('Error fetching franchisee data:', error);
        }
        
        setFranchiseeData(data || null);
      } catch (err) {
        console.error('Error in franchisee data fetch:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFranchiseeData();
  }, [user]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#3B1E77] border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // New franchisee view
  if (!franchiseeData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#3B1E77]">Welcome to FranchiGo!</h1>
            <p className="text-muted-foreground mt-2">
              Get started with your franchisee journey
            </p>
          </div>
          <img 
            src="/lovable-uploads/de7301c9-7c27-49e7-935c-54594b245e59.png" 
            alt="FranchiGo Logo" 
            className="h-16 hidden md:block" 
          />
        </div>
        
        <Card className="bg-gradient-to-br from-[#3B1E77]/10 to-[#7E69AB]/10">
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription>Set up your franchisee profile to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Profile Completion</span>
                <span>0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="p-4">
                  <User className="h-5 w-5 text-[#3B1E77]" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <h3 className="font-semibold">Personal Details</h3>
                  <p className="text-sm text-muted-foreground">Complete your personal information</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Badge variant="outline">Not Started</Badge>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="p-4">
                  <Building className="h-5 w-5 text-[#3B1E77]" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <h3 className="font-semibold">Business Information</h3>
                  <p className="text-sm text-muted-foreground">Add your business details</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Badge variant="outline">Not Started</Badge>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="p-4">
                  <FileText className="h-5 w-5 text-[#3B1E77]" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <h3 className="font-semibold">Legal Documents</h3>
                  <p className="text-sm text-muted-foreground">Upload required documentation</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Badge variant="outline">Not Started</Badge>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full md:w-auto" onClick={() => navigate('/opportunities')}>
              Explore Franchise Opportunities
            </Button>
          </CardFooter>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Your Perfect Franchise</CardTitle>
              <CardDescription>Browse opportunities that match your interests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Store className="h-8 w-8 text-[#3B1E77]" />
                <div>
                  <h3 className="font-medium">Explore Franchise Categories</h3>
                  <p className="text-sm text-muted-foreground">Find opportunities in food, retail, services, and more</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <CreditCard className="h-8 w-8 text-[#3B1E77]" />
                <div>
                  <h3 className="font-medium">Filter by Investment Range</h3>
                  <p className="text-sm text-muted-foreground">Find opportunities that match your budget</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Clock className="h-8 w-8 text-[#3B1E77]" />
                <div>
                  <h3 className="font-medium">Latest Opportunities</h3>
                  <p className="text-sm text-muted-foreground">Discover recently added franchise listings</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/opportunities')}>
                Browse Opportunities
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Franchisee Resources</CardTitle>
              <CardDescription>Helpful resources for new franchisees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Franchise Success Guide</h3>
                <p className="text-sm text-muted-foreground mt-1">Essential tips for new franchisees</p>
                <Button variant="link" className="px-0 text-[#3B1E77]">Read More</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Financing Options</h3>
                <p className="text-sm text-muted-foreground mt-1">Learn about franchise financing solutions</p>
                <Button variant="link" className="px-0 text-[#3B1E77]">Read More</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Legal Considerations</h3>
                <p className="text-sm text-muted-foreground mt-1">Important legal aspects of franchise ownership</p>
                <Button variant="link" className="px-0 text-[#3B1E77]">Read More</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Resources</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  // Existing franchisee view
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#3B1E77]">Franchisee Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {franchiseeData.owner}! Here's an overview of your franchise business.
          </p>
        </div>
        <img 
          src="/lovable-uploads/de7301c9-7c27-49e7-935c-54594b245e59.png" 
          alt="FranchiGo Logo" 
          className="h-16 hidden md:block" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{franchiseeData.name}</CardTitle>
            <Badge className="w-fit" variant={franchiseeData.status === "Active" ? "default" : "outline"}>
              {franchiseeData.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Location:</div>
              <div>{franchiseeData.location}</div>
              <div className="text-muted-foreground">Territory:</div>
              <div>{franchiseeData.territory}</div>
              <div className="text-muted-foreground">Established:</div>
              <div>{franchiseeData.established}</div>
              <div className="text-muted-foreground">Revenue:</div>
              <div>{franchiseeData.revenue}</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Update Business Details</Button>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px] flex items-center justify-center text-muted-foreground">
            Performance metrics and charts will appear here
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Quarterly Report Submitted</h4>
                  <p className="text-sm text-muted-foreground">Your Q2 performance report was submitted successfully</p>
                  <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Staff Training Completed</h4>
                  <p className="text-sm text-muted-foreground">5 staff members completed online training</p>
                  <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Building className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Annual Inspection Scheduled</h4>
                  <p className="text-sm text-muted-foreground">Your annual franchise compliance inspection is scheduled</p>
                  <p className="text-xs text-muted-foreground mt-1">2 weeks ago</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Activity</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Submit Monthly Sales Report</h4>
                  <p className="text-sm text-muted-foreground">Due in 5 days</p>
                </div>
                <Badge>High Priority</Badge>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Renew Business License</h4>
                  <p className="text-sm text-muted-foreground">Due in 2 weeks</p>
                </div>
                <Badge variant="outline">Medium</Badge>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Schedule Staff Training</h4>
                  <p className="text-sm text-muted-foreground">Due in 3 weeks</p>
                </div>
                <Badge variant="outline">Low</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Tasks</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
