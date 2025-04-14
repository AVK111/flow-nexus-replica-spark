
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface FranchiseeRouteProps {
  children: React.ReactNode;
}

const FranchiseeRoute = ({ children }: FranchiseeRouteProps) => {
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

  // Redirect franchisors to their dashboard
  if (userProfile?.role !== 'franchisee') {
    return <Navigate to="/franchisor/dashboard" />;
  }

  return <>{children}</>;
};

export default FranchiseeRoute;
