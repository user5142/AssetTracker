import { useState } from "react";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { mockLocations } from "../../lib/data";
import type { Location } from "../../lib/types";
import { MapPin, Plus, Edit, Trash2, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { toast } from "sonner";

export function LocationManagement() {
  const [locations, setLocations] = useState(mockLocations);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    type: "Pharmacy" as "Pharmacy" | "Facility",
  });

  const pharmacies = locations.filter((l) => l.type === "Pharmacy");
  const facilities = locations.filter((l) => l.type === "Facility");

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    const location: Location = {
      id: `location-${Date.now()}`,
      name: newLocation.name,
      address: newLocation.address,
      type: newLocation.type,
      lat: 37.7749 + Math.random() * 0.1,
      lng: -122.4194 + Math.random() * 0.1,
    };

    setLocations([...locations, location]);
    toast.success(`${location.type} "${location.name}" created successfully`);
    
    setNewLocation({ name: "", address: "", type: "Pharmacy" });
    setIsAddDialogOpen(false);
  };

  const handleDeleteLocation = (id: string) => {
    const location = locations.find((l) => l.id === id);
    setLocations(locations.filter((l) => l.id !== id));
    toast.success(`Location "${location?.name}" deleted`);
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
            <BreadcrumbPage>Location Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Location Management</h1>
          <p className="text-gray-600 mt-1">
            Manage pharmacy locations and customer facilities
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">Location Type</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={newLocation.type === "Pharmacy" ? "default" : "outline"}
                    onClick={() => setNewLocation({ ...newLocation, type: "Pharmacy" })}
                    className="flex-1"
                  >
                    <Building2 className="size-4 mr-2" />
                    Pharmacy
                  </Button>
                  <Button
                    type="button"
                    variant={newLocation.type === "Facility" ? "default" : "outline"}
                    onClick={() => setNewLocation({ ...newLocation, type: "Facility" })}
                    className="flex-1"
                  >
                    <MapPin className="size-4 mr-2" />
                    Customer Facility
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  {newLocation.type} Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder={
                    newLocation.type === "Pharmacy"
                      ? "e.g., Downtown Pharmacy"
                      : "e.g., General Hospital"
                  }
                  value={newLocation.name}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="address"
                  placeholder="123 Medical Drive, City, ST 12345"
                  value={newLocation.address}
                  onChange={(e) =>
                    setNewLocation({ ...newLocation, address: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddLocation}>Create Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pharmacy Locations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="size-5" />
            <CardTitle>Pharmacy Locations ({pharmacies.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Assets Assigned</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pharmacies.map((location) => {
                // Count assets assigned to this pharmacy
                const assetCount = mockLocations.length * 3; // Simplified for demo
                
                return (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {location.address}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{assetCount} assets</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLocation(location.id)}
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Facilities */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="size-5" />
            <CardTitle>Customer Facilities ({facilities.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Current Assets</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.map((location) => {
                const currentAssets = Math.floor(Math.random() * 10);
                
                return (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {location.address}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{currentAssets} on-site</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLocation(location.id)}
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
