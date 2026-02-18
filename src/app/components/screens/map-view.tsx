import { useState } from "react";
import { Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { StatusBadge } from "../status-indicators";
import { mockAssets, mockLocations } from "../../lib/data";
import type { AssetStatus } from "../../lib/types";
import { MapPin, Navigation, Maximize2 } from "lucide-react";

export function MapView() {
  const [selectedStatuses, setSelectedStatuses] = useState<AssetStatus[]>([
    'At Facility',
    'At Pharmacy',
    'In Transit',
    'At PM',
    'Lost/Problem',
  ]);
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const filteredAssets = mockAssets.filter((asset) => {
    const statusMatch = selectedStatuses.includes(asset.status);
    const locationMatch =
      locationFilter === "all" || asset.currentLocation.includes(locationFilter);
    return statusMatch && locationMatch && asset.assetType === 'Pump - GPS';
  });

  const toggleStatus = (status: AssetStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const statusColors = {
    'At Facility': '#34C759',
    'At Pharmacy': '#007AFF',
    'In Transit': '#FFCC00',
    'At PM': '#FF9500',
    'Lost/Problem': '#FF3B30',
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Map View</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold">Map View</h1>
        <p className="text-gray-600 mt-1">Visual representation of asset locations</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Filters */}
            <div>
              <h3 className="font-medium mb-3">Status</h3>
              <div className="space-y-2">
                {(['At Facility', 'At Pharmacy', 'In Transit', 'At PM', 'Lost/Problem'] as AssetStatus[]).map(
                  (status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={status}
                        checked={selectedStatuses.includes(status)}
                        onCheckedChange={() => toggleStatus(status)}
                      />
                      <Label
                        htmlFor={status}
                        className="text-sm cursor-pointer flex items-center gap-2"
                      >
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: statusColors[status] }}
                        />
                        {status}
                      </Label>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <h3 className="font-medium mb-3">Location</h3>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {mockLocations.map((location) => (
                    <SelectItem key={location.id} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Asset List */}
            <div>
              <h3 className="font-medium mb-3">
                Assets ({filteredAssets.length})
              </h3>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {filteredAssets.map((asset) => (
                    <button
                      type="button"
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                        selectedAsset === asset.id
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="size-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: statusColors[asset.status] }}
                        />
                        <p className="font-medium text-sm truncate">
                          {asset.serialNumber}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {asset.currentLocation}
                      </p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Map Area */}
        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-16rem)]">
            <CardContent className="p-0 h-full relative">
              {/* Map Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
                {/* Simulated street grid */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                  <defs>
                    <pattern
                      id="grid"
                      width="100"
                      height="100"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 100 0 L 0 0 0 100"
                        fill="none"
                        stroke="gray"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Simulated markers */}
                {filteredAssets.slice(0, 20).map((asset, index) => {
                  const x = 15 + (index % 5) * 18;
                  const y = 15 + Math.floor(index / 5) * 20;
                  const isSelected = selectedAsset === asset.id;

                  return (
                    <div
                      key={asset.id}
                      className="absolute transition-transform hover:scale-125 cursor-pointer"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onClick={() => setSelectedAsset(asset.id)}
                    >
                      <div className="relative">
                        <MapPin
                          className="size-8"
                          style={{ color: statusColors[asset.status] }}
                          fill="currentColor"
                        />
                        {isSelected && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white p-2 rounded-lg shadow-lg border z-10 whitespace-nowrap">
                            <p className="font-medium text-sm">{asset.serialNumber}</p>
                            <p className="text-xs text-gray-600">{asset.currentLocation}</p>
                            <Button size="sm" className="w-full mt-2" asChild>
                              <Link to={`/track/${asset.id}`} className="cursor-pointer">View Details</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="bg-white shadow-md">
                  <Navigation className="size-4" />
                </Button>
                <Button size="icon" variant="secondary" className="bg-white shadow-md">
                  <Maximize2 className="size-4" />
                </Button>
              </div>

              {/* Legend */}
              <Card className="absolute bottom-4 right-4 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Legend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(statusColors).map(([status, color]) => (
                    <div key={status} className="flex items-center gap-2 text-sm">
                      <MapPin
                        className="size-4"
                        style={{ color }}
                        fill={color}
                      />
                      <span>{status}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}