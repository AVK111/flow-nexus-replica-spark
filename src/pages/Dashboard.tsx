
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && userProfile) {
      if (userProfile.role === 'franchisor') {
        navigate('/franchisor/dashboard');
      } else {
        navigate('/franchisee/dashboard');
      }
    }
  }, [userProfile, loading, navigate]);
  
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-lg font-medium">Redirecting to your dashboard...</span>
    </div>
  );
}
