import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { 
  CheckCircle, 
  Home, 
  Truck, 
  Wrench, 
  AlertTriangle,
  MapPin,
  Activity,
  FileText,
  Plus,
  Building2,
} from "lucide-react";
import { mockAssets, mockAlerts, mockLocations } from "../../lib/data";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export function Dashboard() {
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>("all");
  
  // Filter assets by selected pharmacy
  const filteredAssets = selectedPharmacy === "all" 
    ? mockAssets 
    : mockAssets.filter(a => a.assignedPharmacyId === selectedPharmacy);
  
  // Calculate status counts
  const statusCounts = {
    'At Facility': filteredAssets.filter(a => a.status === 'At Facility').length,
    'At Pharmacy': filteredAssets.filter(a => a.status === 'At Pharmacy').length,
    'In Transit': filteredAssets.filter(a => a.status === 'In Transit').length,
    'At PM': filteredAssets.filter(a => a.status === 'At PM').length,
    'Lost/Problem': filteredAssets.filter(a => a.status === 'Lost/Problem').length,
  };

  const recentAlerts = mockAlerts.filter(a => !a.isRead).slice(0, 5);
  const pharmacyLocations = mockLocations.filter(l => l.type === 'Pharmacy');

  const statusCards = [
    {
      label: 'At Facility',
      count: statusCounts['At Facility'],
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
      Icon: CheckCircle,
      link: '/track?status=At+Facility',
    },
    {
      label: 'At Pharmacy',
      count: statusCounts['At Pharmacy'],
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      Icon: Home,
      link: '/track?status=At+Pharmacy',
    },
    {
      label: 'In Transit',
      count: statusCounts['In Transit'],
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-700',
      Icon: Truck,
      link: '/track?status=In+Transit',
    },
    {
      label: 'At PM',
      count: statusCounts['At PM'],
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-700',
      Icon: Wrench,
      link: '/track?status=At+PM',
    },
    {
      label: 'Lost/Problem',
      count: statusCounts['Lost/Problem'],
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
      Icon: AlertTriangle,
      link: '/track?status=Lost%2FProblem',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's an overview of your asset tracking system.</p>
        </div>
        
        {/* Pharmacy Selector */}
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-gray-600" />
          <Select value={selectedPharmacy} onValueChange={setSelectedPharmacy}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select Pharmacy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pharmacies</SelectItem>
              {pharmacyLocations.map((pharmacy) => (
                <SelectItem key={pharmacy.id} value={pharmacy.id}>
                  {pharmacy.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statusCards.map((status) => {
              const Icon = status.Icon;
              return (
                <Link key={status.label} to={status.link}>
                  <div className={`p-4 rounded-lg border-2 hover:shadow-md transition-shadow cursor-pointer ${status.color}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`size-5 ${status.textColor}`} />
                      <span className={`text-sm font-medium ${status.textColor}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className={`text-3xl font-bold ${status.textColor}`}>
                      {status.count}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Alerts</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/alerts">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="size-12 mx-auto mb-2 text-green-500" />
                <p>No active alerts - your assets are in good shape!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAlerts.map((alert) => {
                  const severityColors = {
                    critical: 'border-l-red-500 bg-red-50',
                    warning: 'border-l-yellow-500 bg-yellow-50',
                    info: 'border-l-blue-500 bg-blue-50',
                  };

                  const IconMap = {
                    'Low Battery': Activity,
                    'PM Due': Wrench,
                    'PM Overdue': Wrench,
                    'Lost/Problem': AlertTriangle,
                    'Not Returned': AlertTriangle,
                    'Config Error': AlertTriangle,
                  };

                  const Icon = IconMap[alert.type] || AlertTriangle;

                  return (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${severityColors[alert.severity]}`}
                    >
                      <Icon className="size-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{alert.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>Serial: {alert.assetSerialNumber}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/track/${mockAssets.find(a => a.serialNumber === alert.assetSerialNumber)?.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Map Snapshot */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Map Snapshot</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/map">Open Map</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gray-100 rounded-lg relative overflow-hidden">
              {/* Simple map placeholder with markers */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
                {/* Simulated map markers */}
                <div className="absolute top-1/4 left-1/3 size-3 bg-red-500 rounded-full border-2 border-white shadow-lg" />
                <div className="absolute top-1/2 right-1/3 size-3 bg-yellow-500 rounded-full border-2 border-white shadow-lg" />
                <div className="absolute bottom-1/4 left-1/2 size-3 bg-green-500 rounded-full border-2 border-white shadow-lg" />
              </div>
              <div className="absolute bottom-2 right-2 bg-white p-2 rounded shadow text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="size-2 bg-red-500 rounded-full" />
                    <span>Lost/Problem</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 bg-yellow-500 rounded-full" />
                    <span>PM Due Soon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 bg-green-500 rounded-full" />
                    <span>At Facility</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/track">
              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <MapPin className="size-5 mr-2" />
                Track Pumps
              </Button>
            </Link>
            <Link to="/assign">
              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <Activity className="size-5 mr-2" />
                Assign Asset
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <FileText className="size-5 mr-2" />
                Generate Report
              </Button>
            </Link>
            <Link to="/admin/location-management">
              <Button variant="outline" className="w-full justify-start h-auto py-3">
                <Building2 className="size-5 mr-2" />
                Manage Locations
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}