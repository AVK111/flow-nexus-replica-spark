
import { Building, DollarSign, TrendingUp, Users } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import RecentLeads from "@/components/dashboard/RecentLeads";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  const isSpecialUser = user?.email === "atharv.22311072@gmail.com";
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#3B1E77]">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! Here's an overview of your franchise network.
          </p>
        </div>
        <img 
          src="/lovable-uploads/de7301c9-7c27-49e7-935c-54594b245e59.png" 
          alt="FranchiGo Logo" 
          className="h-16 hidden md:block" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Franchisees" 
          value={42} 
          change="+3 this month" 
          trend="up" 
          icon={Building} 
        />
        <StatCard 
          title="Active Leads" 
          value={156} 
          change="+24 from last week" 
          trend="up" 
          icon={Users} 
        />
        <StatCard 
          title="Average Revenue" 
          value="$28.5k" 
          change="+12% YoY" 
          trend="up" 
          icon={DollarSign} 
        />
        <StatCard 
          title="Growth Rate" 
          value="18.2%" 
          change="+2.1% from Q1" 
          trend="up" 
          icon={TrendingUp} 
        />
      </div>
      
      {isSpecialUser ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Upcoming Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">East Region Territory Expansion</h3>
                    <p className="text-sm text-muted-foreground">New franchisee opportunity in developing market</p>
                  </div>
                  <Button size="sm">Review</Button>
                </div>
                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">West Coast Partnership</h3>
                    <p className="text-sm text-muted-foreground">High-value potential franchisee interested in multiple locations</p>
                  </div>
                  <Button size="sm">Review</Button>
                </div>
                <div className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Southern Market Analysis</h3>
                    <p className="text-sm text-muted-foreground">Demographic data review for new territory development</p>
                  </div>
                  <Button size="sm">Review</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <RevenueChart />
        </div>
      )}
      
      <RecentLeads />
    </div>
  );
}
