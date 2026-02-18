import { Bell, Search, User, Settings, Wrench, BookOpen, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router";
import pharmericaLogo from "@/assets/pharmerica_logo.jpg";

interface HeaderProps {
  unreadAlertCount?: number;
}

export function Header({ unreadAlertCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 w-full items-center justify-between gap-6 px-6 lg:px-8">
        {/* Logo/Brand - left */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img 
            src={pharmericaLogo} 
            alt="Pharmerica" 
            className="h-8 w-auto"
          />
          <span className="font-semibold text-lg">AssetTracker</span>
        </Link>

        {/* Global Search - centered */}
        <div className="hidden flex-1 md:flex md:justify-center md:px-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search by serial #, location, facility..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Right actions - right */}
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/alerts">
              <Bell className="size-5" />
              {unreadAlertCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadAlertCount}
                </Badge>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex items-center gap-2">
                <Settings className="size-4" />
                Admin
              </DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to="/admin/tracker-config" className="flex items-center">
                  <Wrench className="size-4 mr-2" />
                  Tracker Configuration
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/location-management" className="flex items-center">
                  <Building2 className="size-4 mr-2" />
                  Location Management
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/alert-config" className="flex items-center">
                  <Bell className="size-4 mr-2" />
                  Alert Configuration
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}