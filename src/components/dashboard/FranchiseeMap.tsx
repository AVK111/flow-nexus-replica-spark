
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FranchiseeMap() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Franchise Locations</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] bg-gray-100 relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <p className="text-muted-foreground text-sm">Map visualization would appear here</p>
          </div>
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-96.7969,39.0902,3,0/800x300?access_token=placeholder')] bg-cover opacity-30"></div>
          
          {/* Map markers */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary rounded-full animate-pulse-slow"></div>
          <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-primary rounded-full animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-primary rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-primary rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-primary rounded-full animate-pulse-slow"></div>
        </div>
      </CardContent>
    </Card>
  );
}
