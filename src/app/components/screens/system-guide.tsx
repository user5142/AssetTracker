import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  LayoutDashboard, 
  MapPin, 
  Map, 
  FileText, 
  Activity, 
  Settings,
  Bell,
  Wrench
} from "lucide-react";

export function SystemGuide() {
  const screens = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      description: "At-a-glance system overview with status counts, recent alerts, map snapshot, and quick actions",
      path: "/",
    },
    {
      name: "Track Pumps",
      icon: MapPin,
      description: "Searchable, filterable table of all assets with real-time status and PM information",
      path: "/track",
    },
    {
      name: "Map View",
      icon: Map,
      description: "Visual spatial representation of GPS-enabled asset locations with interactive markers",
      path: "/map",
    },
    {
      name: "Reports Library",
      icon: FileText,
      description: "Access to standard and custom reports for location history, maintenance, and utilization",
      path: "/reports",
    },
    {
      name: "Assign Asset",
      icon: Activity,
      description: "Log assignment of assets to facilities with patient tracking and expected return dates",
      path: "/assign",
    },
    {
      name: "Alerts & Notifications",
      icon: Bell,
      description: "View and manage all system alerts including battery warnings, PM due, and lost assets",
      path: "/alerts",
    },
    {
      name: "Tracker Configuration",
      icon: Wrench,
      description: "Admin tool to set up new GPS trackers or update existing configurations",
      path: "/admin/tracker-config",
    },
    {
      name: "Alert Configuration",
      icon: Settings,
      description: "Admin tool to configure notification rules, thresholds, and recipients",
      path: "/admin/alert-config",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Asset Tracking Platform Guide</h1>
        <p className="text-gray-600">
          Comprehensive wireframes for a medical device tracking system designed for pharmacy staff,
          IV technicians, managers, and system administrators.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This platform tracks GPS-enabled infusion pumps, rental equipment, and accessories (E-kits)
            across pharmacy locations and customer facilities. The system provides real-time location
            tracking, maintenance scheduling, and comprehensive reporting capabilities.
          </p>
          <div className="grid md:grid-cols-2 gap-4 pt-4">
            <div>
              <h4 className="font-semibold mb-2">Key Features</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Real-time GPS tracking for equipped pumps</li>
                <li>• Preventive maintenance scheduling & alerts</li>
                <li>• Multi-location asset management</li>
                <li>• Customizable alert notifications</li>
                <li>• Comprehensive reporting suite</li>
                <li>• HIPAA-compliant patient tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">User Roles</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Pharmacy Staff - Asset assignment & tracking</li>
                <li>• IV Technicians - Field operations & status updates</li>
                <li>• Managers - Reporting & analytics</li>
                <li>• System Administrators - Configuration & setup</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Core Screens</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {screens.map((screen) => {
            const Icon = screen.icon;
            return (
              <Card key={screen.path} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="size-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{screen.name}</h3>
                      <p className="text-sm text-gray-600">{screen.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Design Principles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Information Hierarchy</h4>
              <p className="text-sm text-gray-600">
                Critical data like location, status, and alerts are always prominently visible
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Actionable</h4>
              <p className="text-sm text-gray-600">
                Every screen enables quick actions - update status, generate reports, add notes
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Scannable</h4>
              <p className="text-sm text-gray-600">
                Tables and lists use visual indicators and color coding, not just text
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
