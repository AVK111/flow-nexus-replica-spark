
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Building, Filter, Search, DollarSign, TrendingUp, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Interface for franchise opportunities
interface Opportunity {
  id: string;
  franchisor_id: string;
  title: string;
  description: string;
  investment_min: number | null;
  investment_max: number | null;
  roi_min: number | null;
  roi_max: number | null;
  category: string;
  location: string | null;
  franchisor_name?: string;
  franchisor_logo?: string;
}

// Categories for filtering
const categories = [
  "Food & Beverage",
  "Retail",
  "Services",
  "Healthcare",
  "Education",
  "Fitness",
  "Technology",
  "Automotive",
  "Cleaning",
  "Home Services",
];

export default function Opportunities() {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [investmentRange, setInvestmentRange] = useState<[number, number]>([0, 1000000]);
  const [roiRange, setRoiRange] = useState<[number, number]>([0, 100]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);

  // Fetch all opportunities with franchisor information
  const { data: opportunities, isLoading, error } = useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      // First fetch opportunities
      const { data: opportunitiesData, error: opportunitiesError } = await supabase
        .from('franchise_opportunities')
        .select('*')
        .eq('is_active', true);

      if (opportunitiesError) {
        throw opportunitiesError;
      }

      // Fetch all franchisors to get their names
      const { data: franchisorsData, error: franchisorsError } = await supabase
        .from('franchisors')
        .select('id, name, logo_url');

      if (franchisorsError) {
        throw franchisorsError;
      }

      // Map franchisors to opportunities
      const opportunitiesWithFranchisorInfo = opportunitiesData.map((opportunity) => {
        const franchisor = franchisorsData.find(f => f.id === opportunity.franchisor_id);
        return {
          ...opportunity,
          franchisor_name: franchisor?.name || 'Unknown Franchise',
          franchisor_logo: franchisor?.logo_url || null,
        };
      });

      return opportunitiesWithFranchisorInfo as Opportunity[];
    }
  });

  // Apply filters when data or filters change
  useEffect(() => {
    if (!opportunities) return;

    let filtered = [...opportunities];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        opportunity => 
          opportunity.title.toLowerCase().includes(term) || 
          opportunity.description.toLowerCase().includes(term) ||
          (opportunity.franchisor_name && opportunity.franchisor_name.toLowerCase().includes(term))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        opportunity => opportunity.category === selectedCategory
      );
    }

    // Apply investment range filter
    filtered = filtered.filter(opportunity => {
      // Handle null values
      const min = opportunity.investment_min || 0;
      // If max is null, use min as a rough estimate
      const max = opportunity.investment_max || min * 1.5;
      
      return (
        (min >= investmentRange[0] || max >= investmentRange[0]) && 
        (min <= investmentRange[1] || max <= investmentRange[1])
      );
    });

    // Apply ROI range filter
    filtered = filtered.filter(opportunity => {
      // Handle null values
      const min = opportunity.roi_min || 0;
      // If max is null, use min as a rough estimate
      const max = opportunity.roi_max || min * 1.5;
      
      return (
        (min >= roiRange[0] || max >= roiRange[0]) && 
        (min <= roiRange[1] || max <= roiRange[1])
      );
    });

    setFilteredOpportunities(filtered);
  }, [opportunities, searchTerm, selectedCategory, investmentRange, roiRange]);

  // Format currency
  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format ROI percentage
  const formatROI = (value: number | null) => {
    if (value === null) return 'N/A';
    return `${value}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Franchise Opportunities</h1>
          <p className="text-muted-foreground mt-2">
            Find the perfect franchise opportunity for your business goals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter size={18} /> Filters
            </CardTitle>
            <CardDescription>Refine your search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Investment range filter */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Investment Range</label>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatCurrency(investmentRange[0])}</span>
                  <span>{formatCurrency(investmentRange[1])}</span>
                </div>
              </div>
              <Slider
                value={[investmentRange[0], investmentRange[1]]}
                min={0}
                max={1000000}
                step={10000}
                onValueChange={(value) => setInvestmentRange([value[0], value[1]])}
              />
            </div>
            
            {/* ROI range filter */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">ROI Range (%)</label>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{roiRange[0]}%</span>
                  <span>{roiRange[1]}%</span>
                </div>
              </div>
              <Slider
                value={[roiRange[0], roiRange[1]]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setRoiRange([value[0], value[1]])}
              />
            </div>
            
            <Separator />
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSelectedCategory("");
                setInvestmentRange([0, 1000000]);
                setRoiRange([0, 100]);
                setSearchTerm("");
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
        
        {/* Opportunities listing */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search franchise opportunities..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredOpportunities.length} {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'}
          </div>
          
          {/* Opportunities grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="opacity-50 animate-pulse">
                  <CardHeader className="pb-2">
                    <CardTitle className="h-7 bg-gray-200 rounded-md"></CardTitle>
                    <CardDescription className="h-5 bg-gray-100 rounded-md mt-2"></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-24 bg-gray-100 rounded-md"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="p-6 text-center bg-red-50">
              <p className="text-red-600">Failed to load opportunities. Please try again later.</p>
            </Card>
          ) : filteredOpportunities.length === 0 ? (
            <Card className="p-6 text-center">
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-lg font-medium">No opportunities found</p>
              <p className="text-muted-foreground mt-1">Try adjusting your filters or search term</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2">{opportunity.category}</Badge>
                        <CardTitle>{opportunity.title}</CardTitle>
                        <CardDescription className="mt-1">
                          By {opportunity.franchisor_name}
                        </CardDescription>
                      </div>
                      {opportunity.franchisor_logo && (
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <img 
                            src={opportunity.franchisor_logo} 
                            alt={opportunity.franchisor_name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3 mb-4">{opportunity.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign size={16} className="text-muted-foreground" />
                        <span>
                          {opportunity.investment_min ? (
                            <>
                              {formatCurrency(opportunity.investment_min)}
                              {opportunity.investment_max ? ` - ${formatCurrency(opportunity.investment_max)}` : '+'}
                            </>
                          ) : 'Investment N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={16} className="text-muted-foreground" />
                        <span>
                          {opportunity.roi_min ? (
                            <>
                              {formatROI(opportunity.roi_min)}
                              {opportunity.roi_max ? ` - ${formatROI(opportunity.roi_max)}` : '+'}
                            </>
                          ) : 'ROI N/A'}
                        </span>
                      </div>
                      {opportunity.location && (
                        <div className="flex items-center gap-1 col-span-2">
                          <MapPin size={16} className="text-muted-foreground" />
                          <span>{opportunity.location}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
