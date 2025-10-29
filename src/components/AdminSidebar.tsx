import { 
  Package, 
  Users, 
  ShoppingBag, 
  Settings, 
  BarChart3,
  Grid3X3,
  Images,
  LogOut,
  Mail
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const adminItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: BarChart3 },
  { title: "Products", url: "/admin/dashboard/products", icon: Package },
  { title: "Categories", url: "/admin/dashboard/categories", icon: Grid3X3 },
  { title: "Gallery", url: "/admin/dashboard/gallery", icon: Images },
  { title: "Orders", url: "/admin/dashboard/orders", icon: ShoppingBag },
  { title: "Users", url: "/admin/dashboard/users", icon: Users },
  { title: "Contact Leads", url: "/admin/dashboard/contacts", icon: Mail },
  { title: "Settings", url: "/admin/dashboard/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path || 
    (path === "/admin/dashboard" && currentPath === "/admin/dashboard");
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"}>
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">Admin Panel</h2>
            <p className="text-sm text-sidebar-foreground/70">Neem Furnitech</p>
          </div>
        )}
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="w-full justify-start hover:bg-sidebar-accent text-sidebar-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span className="ml-2">Logout</span>}
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}