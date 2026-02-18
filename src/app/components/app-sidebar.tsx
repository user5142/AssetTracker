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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/track", icon: MapPin, label: "Track Pumps" },
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
        className={`shrink-0 flex flex-col border-r bg-white transition-[width] duration-200 ease-in-out ${
          sidebarCollapsed ? "w-14" : "w-56"
        }`}
      >
        <nav className="flex flex-1 flex-col py-4">
          {!sidebarCollapsed && (
            <h2 className="mb-3 px-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Quick Actions
            </h2>
          )}
          <div className="space-y-1 px-2">
            {navItems.map(({ to, icon: Icon, label }) => {
              const isActive = to === "/" ? location.pathname === "/" : (location.pathname === to || location.pathname.startsWith(to + "/"));
              return (
                <Tooltip key={to}>
                  <TooltipTrigger asChild>
                    <Link to={to}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full h-10 font-normal ${sidebarCollapsed ? "justify-center px-0" : "justify-start gap-2"}`}
                      >
                        <Icon className="size-4 shrink-0" />
                        {!sidebarCollapsed && <span>{label}</span>}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          <div className="mt-auto border-t pt-2 px-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-full ${sidebarCollapsed ? "" : "justify-start gap-2"}`}
                  onClick={() => setSidebarCollapsed((c) => !c)}
                  aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {sidebarCollapsed ? (
                    <PanelLeftOpen className="size-4 shrink-0" />
                  ) : (
                    <>
                      <PanelLeftClose className="size-4 shrink-0" />
                      <span>Collapse</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          </div>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
