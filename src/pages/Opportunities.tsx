
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp, Building, IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface FranchiseOpportunity {
  id: string;
  title: string;
  description: string;
  investment_min: number;
  investment_max: number;
  roi_min: number;
  roi_max: number;
  category: string;
  location: string;
  franchisor_id: string;
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<FranchiseOpportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<FranchiseOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [investmentRange, setInvestmentRange] = useState<[number, number]>([0, 10000000]);
  const [roiRange, setRoiRange] = useState<[number, number]>([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const { data, error } = await supabase
          .from('franchise_opportunities')
          .select('*')
          .eq('is_active', true);

        if (error) {
          throw error;
        }

        setOpportunities(data as FranchiseOpportunity[]);
        setFilteredOpportunities(data as FranchiseOpportunity[]);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        toast({
          title: "Error",
          description: "Failed to load franchise opportunities",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [toast]);

  useEffect(() => {
    let result = [...opportunities];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (opp) =>
          opp.title.toLowerCase().includes(query) ||
          opp.description.toLowerCase().includes(query) ||
          opp.category.toLowerCase().includes(query) ||
          (opp.location && opp.location.toLowerCase().includes(query))
      );
    }

    if (categoryFilter) {
      result = result.filter((opp) => opp.category === categoryFilter);
    }

    result = result.filter(
      (opp) =>
        (opp.investment_min >= investmentRange[0] || opp.investment_max >= investmentRange[0]) &&
        (opp.investment_min <= investmentRange[1] || opp.investment_max <= investmentRange[1])
    );

    result = result.filter(
      (opp) =>
        (opp.roi_min >= roiRange[0] || opp.roi_max >= roiRange[0]) &&
        (opp.roi_min <= roiRange[1] || opp.roi_max <= roiRange[1])
    );

    setFilteredOpportunities(result);
  }, [searchQuery, categoryFilter, investmentRange, roiRange, opportunities]);

  const categories = Array.from(new Set(opportunities.map((opp) => opp.category)));
  
  const handleApply = (opportunityId: string) => {
    // Navigate to application page with opportunity ID
    navigate(`/application/${opportunityId}`);
    toast({
      title: "Application Started",
      description: "You've started the application process for this franchise opportunity.",
    });
  };

  // Format currency in Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#3B1E77]">Franchise Opportunities</h1>
          <p className="text-muted-foreground mt-2">
            Discover franchise opportunities that match your investment goals and interests
          </p>
        </div>
        <img 
          src="/lovable-uploads/de7301c9-7c27-49e7-935c-54594b245e59.png" 
          alt="FranchiGo Logo" 
          className="h-16 hidden md:block" 
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10 w-full"
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                <span>Filters</span>
              </Button>
            </div>
          </CardHeader>
          
          {showFilters && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={categoryFilter || ""} onValueChange={(value) => setCategoryFilter(value || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Investment Range (₹ lakhs)</Label>
                  <div className="pt-4 px-2">
                    <Slider
                      defaultValue={[0, 10000]}
                      min={0}
                      max={10000}
                      step={100}
                      value={[investmentRange[0] / 1000, investmentRange[1] / 1000]}
                      onValueChange={(values) => setInvestmentRange([values[0] * 1000, values[1] * 1000])}
                      className="mt-6"
                    />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>₹{investmentRange[0] / 100000}L</span>
                      <span>₹{investmentRange[1] / 100000}L</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>ROI Range (%)</Label>
                  <div className="pt-4 px-2">
                    <Slider
                      defaultValue={[0, 100]}
                      min={0}
                      max={100}
                      step={1}
                      value={roiRange}
                      onValueChange={(values) => {
                        if (values.length === 2) {
                          setRoiRange([values[0], values[1]]);
                        }
                      }}
                      className="mt-6"
                    />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>{roiRange[0]}%</span>
                      <span>{roiRange[1]}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin h-8 w-8 border-2 border-[#3B1E77] border-t-transparent rounded-full"></div>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No franchise opportunities match your criteria.</p>
            <Button onClick={() => {
              setSearchQuery("");
              setCategoryFilter(null);
              setInvestmentRange([0, 10000000]);
              setRoiRange([0, 100]);
            }}>Clear Filters</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-[#3B1E77]/5 pb-3">
                  <CardTitle className="text-xl text-[#3B1E77]">{opportunity.title}</CardTitle>
                  <Badge variant="outline" className="w-fit">{opportunity.category}</Badge>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {opportunity.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-[#3B1E77]" />
                      <div>
                        <p className="text-xs text-muted-foreground">Investment</p>
                        <p className="font-medium">₹{opportunity.investment_min/100000}L - ₹{opportunity.investment_max/100000}L</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[#3B1E77]" />
                      <div>
                        <p className="text-xs text-muted-foreground">ROI</p>
                        <p className="font-medium">{opportunity.roi_min}% - {opportunity.roi_max}%</p>
                      </div>
                    </div>
                  </div>
                  {opportunity.location && (
                    <div className="flex items-center gap-2 mt-4">
                      <Building className="h-4 w-4 text-[#3B1E77]" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-medium">{opportunity.location}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline">View Details</Button>
                  <Button onClick={() => handleApply(opportunity.id)}>Apply Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
