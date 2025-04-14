
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  Building,
  FileText,
  MessageSquare,
  Settings,
  Menu,
  LogOut,
  LayoutDashboard,
  Store,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { signOut, userProfile } = useAuth();
  
  // Define different sidebar links based on user role
  const getFranchiseeSidebarLinks = () => [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Store, label: "Franchisors", path: "/opportunities" },
    { icon: Building, label: "My Franchise", path: "/franchisees" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];
  
  const getFranchisorSidebarLinks = () => [
    { icon: BarChart3, label: "Dashboard", path: "/" },
    { icon: Users, label: "Franchisees", path: "/franchisees" },
    { icon: Building, label: "Territories", path: "/territories" },
    { icon: FileText, label: "Leads", path: "/leads" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];
  
  // Determine which links to show based on user role
  const sidebarLinks = userProfile?.role === 'franchisee' 
    ? getFranchiseeSidebarLinks() 
    : getFranchisorSidebarLinks();
  
  return (
    <div className={cn(
      "bg-gradient-to-b from-[#3B1E77] to-[#210F42] text-white shadow-sm h-screen flex flex-col border-r transition-all duration-300",
      collapsed ? "w-[70px]" : "w-[250px]"
    )}>
      <div className="p-4 flex justify-between items-center border-b border-white/10">
        {!collapsed && (
          <div className="font-bold text-xl text-white">FranchiGo</div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-white hover:bg-white/10"
        >
          <Menu size={20} />
        </Button>
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-2 px-2">
        {sidebarLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "sidebar-item text-white/80 hover:text-white",
              location.pathname === link.path && "active bg-white/20 hover:bg-white/20 text-white"
            )}
          >
            <link.icon size={20} />
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t border-white/10 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-white/80 hover:text-white hover:bg-white/10"
          onClick={() => signOut()}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
