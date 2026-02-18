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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { mockTrackerConfigs, mockLocations, mockAssets } from "../../lib/data";
import { Upload, Download, Edit, Unlink, Trash2 } from "lucide-react";
import { BatteryIndicator } from "../status-indicators";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export function TrackerConfiguration() {
  const [trackers, setTrackers] = useState(mockTrackerConfigs);
  const [imei, setImei] = useState("");
  const [simId, setSimId] = useState("");
  const [assetSerial, setAssetSerial] = useState("");
  const [location, setLocation] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = () => {
    if (!imei || !simId || !assetSerial || !location) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Tracker configuration saved successfully!");
    
    // Reset form
    setImei("");
    setSimId("");
    setAssetSerial("");
    setLocation("");
  };

  const handleDelete = (id: string) => {
    setTrackers((prev) => prev.filter((t) => t.id !== id));
    setDeleteId(null);
    toast.success("Tracker configuration deleted");
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
            <BreadcrumbPage>Tracker Configuration</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold">Tracker Configuration</h1>
        <p className="text-gray-600 mt-1">Set up new trackers or update existing configurations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add/Edit Single Tracker */}
        <Card>
          <CardHeader>
            <CardTitle>Add/Edit Single Tracker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imei">IMEI</Label>
              <Input
                id="imei"
                placeholder="356938035643809"
                value={imei}
                onChange={(e) => setImei(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="simId">SIM ID</Label>
              <Input
                id="simId"
                placeholder="89011703278306543210"
                value={simId}
                onChange={(e) => setSimId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetSerial">Pump Serial #</Label>
              <Select value={assetSerial} onValueChange={setAssetSerial}>
                <SelectTrigger id="assetSerial">
                  <SelectValue placeholder="Select asset..." />
                </SelectTrigger>
                <SelectContent>
                  {mockAssets
                    .filter((a) => a.assetType === 'Pump - GPS')
                    .slice(0, 20)
                    .map((asset) => (
                      <SelectItem key={asset.id} value={asset.serialNumber}>
                        {asset.serialNumber}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location..." />
                </SelectTrigger>
                <SelectContent>
                  {mockLocations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.name}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* Bulk Import */}
        <Card>
          <CardHeader>
            <CardTitle>Bulk Import</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Upload an Excel file with columns: IMEI, SIM ID, Serial #, Location
              </p>

              <Button variant="outline" size="sm" className="w-full">
                <Download className="size-4 mr-2" />
                Download Template
              </Button>

              <div className="p-8 border-2 border-dashed rounded-lg text-center">
                <Upload className="size-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium mb-1">
                  Drag and drop your file here
                </p>
                <p className="text-xs text-gray-500 mb-3">or</p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>

              <Button className="w-full" disabled>
                Process Import
              </Button>
            </div>

            {/* Import Status (placeholder) */}
            <div className="pt-4 border-t">
              <h4 className="font-medium text-sm mb-2">Import Status</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>No import in progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Existing Configurations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Tracker Configurations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IMEI</TableHead>
                  <TableHead>SIM ID</TableHead>
                  <TableHead>Pump Serial #</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Battery</TableHead>
                  <TableHead>Last Ping</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trackers.map((tracker) => (
                  <TableRow key={tracker.id}>
                    <TableCell className="font-mono text-sm">
                      {tracker.imei}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {tracker.simId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {tracker.assetSerialNumber}
                    </TableCell>
                    <TableCell>{tracker.location}</TableCell>
                    <TableCell>
                      <BatteryIndicator percent={tracker.batteryPercent} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDistanceToNow(tracker.lastPing, { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Unlink className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(tracker.id)}
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tracker Configuration?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the tracker configuration. The tracker will stop reporting location data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
