
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  Building,
  FileText,
  MessageSquare,
  Settings,
  Menu,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", path: "/" },
  { icon: Users, label: "Franchisees", path: "/franchisees" },
  { icon: Building, label: "Territories", path: "/territories" },
  { icon: FileText, label: "Leads", path: "/leads" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  return (
    <div className={cn(
      "bg-white shadow-sm h-screen flex flex-col border-r transition-all duration-300",
      collapsed ? "w-[70px]" : "w-[250px]"
    )}>
      <div className="p-4 flex justify-between items-center border-b">
        {!collapsed && (
          <div className="font-bold text-xl text-primary">FlowNexus</div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
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
              "sidebar-item",
              location.pathname === link.path && "active"
            )}
          >
            <link.icon size={20} />
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t mt-auto">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
