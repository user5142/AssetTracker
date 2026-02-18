import { useState } from "react";
import { useParams, useNavigate } from "react-router";
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
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { mockReports, mockLocations } from "../../lib/data";
import { Calendar as CalendarIcon, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ReportParameters() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const report = mockReports.find((r) => r.id === reportId);

  const [isGenerating, setIsGenerating] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [assetSelection, setAssetSelection] = useState("all");
  const [locationSelection, setLocationSelection] = useState("all");
  const [includePharmacy, setIncludePharmacy] = useState(true);

  if (!report) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <Button onClick={() => navigate('/reports')}>Back to Reports</Button>
        </div>
      </div>
    );
  }

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Report generated successfully! Download will start shortly.");
      
      setTimeout(() => {
        navigate('/reports');
      }, 1500);
    }, 2000);
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
            <BreadcrumbLink href="/reports">Reports</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{report.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold">{report.name}</h1>
        <p className="text-gray-600 mt-1">{report.description}</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Range */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <div className="relative">
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <div className="relative">
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Asset Selection */}
          <div className="space-y-2">
            <Label>Asset Selection</Label>
            <Select value={assetSelection} onValueChange={setAssetSelection}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pumps</SelectItem>
                <SelectItem value="single">Single Serial Number</SelectItem>
                <SelectItem value="list">Upload Pump List</SelectItem>
                <SelectItem value="gps-only">GPS Pumps Only</SelectItem>
                <SelectItem value="rental-only">Rental Pumps Only</SelectItem>
              </SelectContent>
            </Select>
            {assetSelection === "single" && (
              <Input placeholder="Enter serial number..." className="mt-2" />
            )}
            {assetSelection === "list" && (
              <div className="mt-2 p-4 border-2 border-dashed rounded-lg text-center">
                <FileSpreadsheet className="size-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload Excel file with serial numbers
                </p>
                <Button variant="outline" size="sm">Choose File</Button>
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <Label>Location Filter</Label>
            <Select value={locationSelection} onValueChange={setLocationSelection}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {mockLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Include Pharmacy Locations */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includePharmacy"
              checked={includePharmacy}
              onCheckedChange={(checked) => setIncludePharmacy(checked as boolean)}
            />
            <Label
              htmlFor="includePharmacy"
              className="cursor-pointer"
            >
              Include pharmacy locations in report
            </Label>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label>Report Format</Label>
            <Select defaultValue="excel">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                "Generate Report"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/reports')}
              disabled={isGenerating}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
