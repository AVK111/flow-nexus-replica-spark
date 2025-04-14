
import { useState } from "react";
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
import { LogIn, Loader2, Building, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [franchiseName, setFranchiseName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState<"franchisor" | "franchisee">("franchisee");
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(
          email, 
          password,
          userType,
          userType === "franchisor" ? franchiseName : undefined
        );
        
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
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
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3B1E77] to-[#7E69AB] p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/de7301c9-7c27-49e7-935c-54594b245e59.png" 
            alt="FranchiGo Logo" 
            className="h-20" 
          />
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#3B1E77]">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp 
                ? "Sign up to start managing your franchise network" 
                : "Login to your FranchiGo dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <Tabs defaultValue="franchisee" onValueChange={(value) => setUserType(value as "franchisor" | "franchisee")}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="franchisee" className="flex items-center gap-2">
                      <User size={16} />
                      <span>Franchisee</span>
                    </TabsTrigger>
                    <TabsTrigger value="franchisor" className="flex items-center gap-2">
                      <Building size={16} />
                      <span>Franchisor</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="franchisor" className="mt-0">
                    <div className="space-y-2 mb-4">
                      <label htmlFor="franchise-name" className="text-sm font-medium">
                        Franchise Name
                      </label>
                      <Input
                        id="franchise-name"
                        type="text"
                        placeholder="Enter your franchise business name"
                        value={franchiseName}
                        onChange={(e) => setFranchiseName(e.target.value)}
                        required={userType === "franchisor"}
                        className="w-full"
                        disabled={isLoading}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              {!isSignUp && (
                <div className="text-right">
                  <a href="#" className="text-sm text-[#3B1E77] hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-[#3B1E77] hover:bg-[#210F42]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                  </span>
                ) : isSignUp ? (
                  'Create Account'
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" /> Login
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center w-full">
              <Button
                variant="link"
                className="text-[#3B1E77]"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign up"}
              </Button>
            </div>
            <div className="text-xs text-center text-muted-foreground">
              By continuing, you agree to FranchiGo's Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
