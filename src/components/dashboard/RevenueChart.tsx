
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const data = [
  { month: "Jan", revenue: 5000 },
  { month: "Feb", revenue: 7000 },
  { month: "Mar", revenue: 6500 },
  { month: "Apr", revenue: 8200 },
  { month: "May", revenue: 9500 },
  { month: "Jun", revenue: 10500 },
  { month: "Jul", revenue: 11200 },
  { month: "Aug", revenue: 12500 },
  { month: "Sep", revenue: 13000 },
  { month: "Oct", revenue: 14000 },
  { month: "Nov", revenue: 15500 },
  { month: "Dec", revenue: 16800 },
];

export default function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Franchise Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `$${value / 1000}k`} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Revenue']} 
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(221, 83%, 53%)" 
                fill="hsl(221, 83%, 95%)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
