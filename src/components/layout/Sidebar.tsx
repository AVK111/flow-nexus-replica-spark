
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useMediaQuery } from "@/hooks/use-mobile";
import { 
  Home, 
  Users, 
  Map, 
  User, 
  MessageSquare, 
  Settings, 
  Building, 
  Store,
  FileQuestion
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  collapse?: boolean;
}

export default function Sidebar({ className, collapse = false }: SidebarNavProps) {
  const { pathname } = useLocation();
  const { userProfile } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const isFranchisor = userProfile?.role === "franchisor";
  const isFranchisee = userProfile?.role === "franchisee";

  return (
    <div className={cn("border-r bg-background h-screen", className)}>
      <div className="flex flex-col h-full">
        <div className="h-14 flex items-center px-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/de7301c9-7c27-49e7-935c-54594b245e59.png" 
              alt="Logo" 
              className="h-8" 
            />
            <span className={cn("font-bold text-xl text-[#3B1E77]", (isMobile || collapse) && "hidden")}>
              FranchiGo
            </span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-2">
          <nav className="flex flex-col gap-1 py-4">
            {isFranchisor && (
              <>
                <NavItem
                  to="/franchisor/dashboard"
                  icon={<Home size={18} />}
                  label="Dashboard"
                  active={pathname === "/franchisor/dashboard"}
                  collapse={isMobile || collapse}
                />
                <NavItem
                  to="/franchisees"
                  icon={<Store size={18} />}
                  label="Franchisees"
                  active={pathname === "/franchisees"}
                  collapse={isMobile || collapse}
                />
                <NavItem
                  to="/territories"
                  icon={<Map size={18} />}
                  label="Territories"
                  active={pathname === "/territories"}
                  collapse={isMobile || collapse}
                />
                <NavItem
                  to="/leads"
                  icon={<Users size={18} />}
                  label="Leads"
                  active={pathname === "/leads"}
                  collapse={isMobile || collapse}
                />
              </>
            )}
            
            {isFranchisee && (
              <>
                <NavItem
                  to="/franchisee/dashboard"
                  icon={<Home size={18} />}
                  label="Dashboard"
                  active={pathname === "/franchisee/dashboard"}
                  collapse={isMobile || collapse}
                />
                <NavItem
                  to="/opportunities"
                  icon={<Building size={18} />}
                  label="Opportunities"
                  active={pathname === "/opportunities" || pathname.startsWith("/application/")}
                  collapse={isMobile || collapse}
                />
              </>
            )}
            
            <Separator className="my-3" />
            
            <NavItem
              to="/profile"
              icon={<User size={18} />}
              label="Profile"
              active={pathname === "/profile"}
              collapse={isMobile || collapse}
            />
            
            <NavItem
              to="/messages"
              icon={<MessageSquare size={18} />}
              label="Messages"
              active={pathname === "/messages"}
              collapse={isMobile || collapse}
            />
            
            <NavItem
              to="/settings"
              icon={<Settings size={18} />}
              label="Settings"
              active={pathname === "/settings"}
              collapse={isMobile || collapse}
            />
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapse?: boolean;
}

function NavItem({ to, icon, label, active, collapse }: NavItemProps) {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "justify-start h-9",
        active && "bg-muted font-medium",
        collapse && "px-2"
      )}
    >
      <Link to={to} className="flex items-center">
        <span className={cn("mr-2", collapse && "mr-0")}>{icon}</span>
        {!collapse && <span>{label}</span>}
      </Link>
    </Button>
  );
}
