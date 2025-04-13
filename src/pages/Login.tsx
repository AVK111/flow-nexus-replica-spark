
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Search } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would authenticate with a backend
    // For now, just navigate to the dashboard
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#46b1e6] to-[#84d1f5] flex flex-col">
      {/* Header/Navigation */}
      <header className="w-full bg-[#1a1a2e] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/12497af1-e61d-4455-b45d-61f98851c409.png" 
              alt="FranchiGo Logo" 
              className="h-12" 
            />
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-blue-200 transition-colors">Explore</a>
            <a href="#" className="text-white hover:text-blue-200 transition-colors">About</a>
            <a href="#" className="text-white hover:text-blue-200 transition-colors">For Franchisors</a>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#1a1a2e]">
              Log in
            </Button>
            <Button className="bg-[#9c80f6] hover:bg-[#8a6df3] text-white">
              Sign up
            </Button>
          </nav>
          <div className="md:hidden">
            {/* Mobile menu button would go here */}
            <Button variant="ghost" className="text-white">
              Menu
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row container mx-auto px-4 py-12">
        {/* Left side - Hero text */}
        <div className="md:w-2/3 flex flex-col justify-center mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1a1a2e] mb-6">
            Find Your Perfect Franchise Opportunity
          </h1>
          <p className="text-lg md:text-xl text-[#1a1a2e] mb-8 max-w-2xl">
            Connect with top franchise brands, explore investment opportunities, and 
            build your business empire with the leading franchise marketplace platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-[#32a8df] hover:bg-[#2994c6] text-white px-8 py-6 rounded-md text-lg">
              Explore Franchises <span className="ml-2">→</span>
            </Button>
            <Button variant="outline" className="bg-white text-[#1a1a2e] border-white px-8 py-6 rounded-md text-lg">
              List Your Franchise
            </Button>
          </div>
        </div>

        {/* Right side - Featured franchise card */}
        <div className="md:w-1/3">
          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Latest Opportunity</CardTitle>
              <div className="flex items-start justify-between">
                <CardDescription className="text-base mt-1">Featured franchise</CardDescription>
                <div className="bg-[#627eea] text-white px-4 py-2 rounded-full text-sm">
                  Food & Beverage
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <div className="bg-gray-100 h-48 w-full rounded-md flex items-center justify-center text-gray-400 mb-4">
                Restaurant Brand Image
              </div>
              <h3 className="text-xl font-bold mb-2">Urban Café Franchise</h3>
              <div className="flex justify-between">
                <span>Investment: ₹12L - ₹25L</span>
                <span className="text-green-600">ROI: 22-30%</span>
              </div>
            </CardContent>
            <CardFooter className="px-6 pb-6">
              <Button className="w-full bg-[#32a8df] hover:bg-[#2994c6]">
                View Details
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
