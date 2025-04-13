
import { Building, DollarSign, TrendingUp, Users } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import RecentLeads from "@/components/dashboard/RecentLeads";
import FranchiseeMap from "@/components/dashboard/FranchiseeMap";
import RevenueChart from "@/components/dashboard/RevenueChart";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your franchise network.
        </p>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <FranchiseeMap />
      </div>
      
      <RecentLeads />
    </div>
  );
}
