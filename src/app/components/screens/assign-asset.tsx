import { useState } from "react";
import { useNavigate } from "react-router";
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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { mockAssets, mockLocations } from "../../lib/data";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

export function AssignAsset() {
  const navigate = useNavigate();
  
  const [selectedAsset, setSelectedAsset] = useState("");
  const [destinationFacility, setDestinationFacility] = useState("");
  const [assignmentDate, setAssignmentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [returnDate, setReturnDate] = useState("");
  const [patientId, setPatientId] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAsset || !destinationFacility) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate assignment
    toast.success("Asset assigned successfully!");
    
    setTimeout(() => {
      navigate('/track');
    }, 1000);
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
            <BreadcrumbPage>Assign Asset</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold">Assign Asset to Facility</h1>
        <p className="text-gray-600 mt-1">Log assignment of asset to a facility or location</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Asset Selection */}
            <div className="space-y-2">
              <Label htmlFor="asset">
                Asset <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger id="asset">
                  <SelectValue placeholder="Select asset by serial number..." />
                </SelectTrigger>
                <SelectContent>
                  {mockAssets
                    .filter((a) => a.status === 'At Pharmacy')
                    .slice(0, 20)
                    .map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.serialNumber} - {asset.assetType}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Only showing assets currently at pharmacy
              </p>
            </div>

            {/* Destination Facility */}
            <div className="space-y-2">
              <Label htmlFor="facility">
                Destination Facility <span className="text-red-500">*</span>
              </Label>
              <Select
                value={destinationFacility}
                onValueChange={setDestinationFacility}
              >
                <SelectTrigger id="facility">
                  <SelectValue placeholder="Select facility..." />
                </SelectTrigger>
                <SelectContent>
                  {mockLocations
                    .filter((l) => l.type === 'Facility')
                    .map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assignment Date */}
            <div className="space-y-2">
              <Label htmlFor="assignmentDate">
                Assignment Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="assignmentDate"
                  type="date"
                  value={assignmentDate}
                  onChange={(e) => setAssignmentDate(e.target.value)}
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Expected Return Date */}
            <div className="space-y-2">
              <Label htmlFor="returnDate">Expected Return Date (Optional)</Label>
              <div className="relative">
                <Input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Patient ID */}
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID (Optional)</Label>
              <Input
                id="patientId"
                placeholder="Enter patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Patient identifiers are encrypted and stored securely
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this assignment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Assign Asset
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
