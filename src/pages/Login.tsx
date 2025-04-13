
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Navigate } from "react-router-dom";
import { LogIn, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign Up Successful",
            description: "Please check your email for verification if required.",
          });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/" />;
  }

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
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" className="text-white">
              Menu
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isSignUp ? 'Create an account' : 'Login to your account'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp 
                ? 'Enter your email and password to create an account' 
                : 'Enter your email and password to login to your account'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAuth}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-[#32a8df] hover:bg-[#2994c6]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Loading...</span>
                ) : isSignUp ? (
                  'Create Account'
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </>
                )}
              </Button>
              <div className="text-center">
                <Button 
                  variant="link" 
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
