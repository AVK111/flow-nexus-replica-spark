
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface FranchisorRouteProps {
  children: React.ReactNode;
}

const FranchisorRoute = ({ children }: FranchisorRouteProps) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect franchisees to their dashboard
  if (userProfile?.role !== 'franchisor') {
    return <Navigate to="/franchisee/dashboard" />;
  }

  return <>{children}</>;
};

export default FranchisorRoute;
