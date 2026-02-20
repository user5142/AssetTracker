import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";
import {
  Home,
  MapPin,
  Activity,
  FileText,
  Building2,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
import intuvieLogo from "@/assets/intuvie_logo.jpg";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/track", icon: MapPin, label: "Track Devices" },
  { to: "/admin/manage-inventory", icon: Package, label: "Manage Inventory" },
  { to: "/assign", icon: Activity, label: "Assign Asset" },
  { to: "/reports", icon: FileText, label: "Generate Report" },
  { to: "/admin/location-management", icon: Building2, label: "Manage Locations" },
];

export function AppSidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <TooltipProvider>
      <aside
        className={`shrink-0 flex flex-col border-r border-gray-200 bg-gray-50 transition-[width] duration-200 ease-in-out ${
          sidebarCollapsed ? "w-14" : "w-56"
        }`}
      >
        <nav className="flex flex-1 flex-col min-h-0">
          {/* Top row: logo + Asset Tracker (hidden when collapsed), collapse at top-right */}
          <div className={`flex items-center shrink-0 py-3 ${sidebarCollapsed ? "justify-center px-0" : "justify-between gap-2 px-3"}`}>
            {!sidebarCollapsed && (
              <Link to="/" className="flex shrink-0 items-center gap-3 min-w-0 cursor-pointer">
                <img
                  src={intuvieLogo}
                  alt="Intuvie"
                  className="h-8 w-auto shrink-0"
                />
                <span className="font-semibold text-lg truncate">AssetTracker</span>
              </Link>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  onClick={() => setSidebarCollapsed((c) => !c)}
                  aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {sidebarCollapsed ? (
                    <PanelLeftOpen className="size-4" />
                  ) : (
                    <PanelLeftClose className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 px-2 pt-3 pb-4">
            {navItems.map(({ to, icon: Icon, label }) => {
              const isActive = to === "/" ? location.pathname === "/" : (location.pathname === to || location.pathname.startsWith(to + "/"));
              return (
                <Link key={to} to={to} className="cursor-pointer">
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full h-10 font-normal ${sidebarCollapsed ? "justify-center px-0" : "justify-start gap-2"}`}
                  >
                    <Icon className="size-4 shrink-0" />
                    {!sidebarCollapsed && <span>{label}</span>}
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
