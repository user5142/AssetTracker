import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Card, CardContent } from "../ui/card";
import { StatusBadge, PMStatusBadge, BatteryIndicator } from "../status-indicators";
import { mockAssets } from "../../lib/data";
import type { Asset, AssetStatus, AssetType, PMStatus } from "../../lib/types";
import { Download, Filter, MoreVertical, Search, ChevronLeft, ChevronRight, Radio } from "lucide-react";
import { Badge } from "../ui/badge";
import { formatDistanceToNow, format } from "date-fns";

export function TrackPumps() {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') as AssetStatus | null;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus || "all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [pmFilter, setPmFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof Asset | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 50;

  // Filter and search logic
  const filteredAssets = useMemo(() => {
    let filtered = [...mockAssets];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (asset) =>
          asset.serialNumber.toLowerCase().includes(query) ||
          asset.currentLocation.toLowerCase().includes(query) ||
          asset.assetType.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((asset) => asset.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((asset) => asset.assetType === typeFilter);
    }

    // PM filter
    if (pmFilter !== "all") {
      filtered = filtered.filter((asset) => asset.pmStatus === pmFilter);
    }

    // Sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal === undefined || bVal === undefined) return 0;
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchQuery, statusFilter, typeFilter, pmFilter, sortColumn, sortDirection]);

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: keyof Asset) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const activeFilters = [
    statusFilter !== "all" && { key: 'status', label: `Status: ${statusFilter}`, value: statusFilter },
    typeFilter !== "all" && { key: 'type', label: `Type: ${typeFilter}`, value: typeFilter },
    pmFilter !== "all" && { key: 'pm', label: `PM: ${pmFilter}`, value: pmFilter },
  ].filter(Boolean);

  const clearFilter = (key: string) => {
    if (key === 'status') setStatusFilter('all');
    if (key === 'type') setTypeFilter('all');
    if (key === 'pm') setPmFilter('all');
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
            <BreadcrumbPage>Track Pumps</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Track Pumps</h1>
          <p className="text-gray-600 mt-1">Monitor all assets in real-time</p>
        </div>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  placeholder="Search by serial #, location, facility..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="At Facility">At Facility</SelectItem>
                  <SelectItem value="At Pharmacy">At Pharmacy</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="At PM">At PM</SelectItem>
                  <SelectItem value="Lost/Problem">Lost/Problem</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Pump - GPS">Pump - GPS</SelectItem>
                  <SelectItem value="Pump - Rental">Pump - Rental</SelectItem>
                  <SelectItem value="E-kit">E-kit</SelectItem>
                </SelectContent>
              </Select>

              <Select value={pmFilter} onValueChange={setPmFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="PM Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All PM Status</SelectItem>
                  <SelectItem value="Current">Current</SelectItem>
                  <SelectItem value="Due Soon">Due Soon</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Download className="size-4" />
                Export
              </Button>
            </div>

            {/* Active filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter: any) => (
                  <Badge
                    key={filter.key}
                    variant="secondary"
                    className="gap-2"
                  >
                    {filter.label}
                    <button
                      type="button"
                      onClick={() => clearFilter(filter.key)}
                      className="hover:text-red-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead>Serial #</TableHead>
                  <TableHead>IMEI #</TableHead>
                  <TableHead>Asset Type</TableHead>
                  <TableHead>Assigned Pharmacy</TableHead>
                  <TableHead>Current Location</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Tracker Battery</TableHead>
                  <TableHead>PM Due</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAssets.map((asset) => {
                  const isProblem = asset.status === 'Lost/Problem';
                  const isDueSoon = asset.pmStatus === 'Due Soon';
                  
                  return (
                    <TableRow
                      key={asset.id}
                      className={
                        isProblem
                          ? "border-l-4 border-l-red-500 bg-red-50"
                          : isDueSoon
                          ? "border-l-4 border-l-yellow-500 bg-yellow-50"
                          : ""
                      }
                    >
                      <TableCell>
                        <StatusBadge status={asset.status} />
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/track/${asset.id}`}
                          className="text-blue-600 hover:underline font-medium cursor-pointer"
                        >
                          {asset.serialNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs">
                          {asset.imei || <span className="text-gray-400">N/A</span>}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {asset.assetType}
                          {asset.assetType === 'Pump - GPS' && (
                            <Radio className="size-3 text-blue-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {asset.assignedPharmacyId === '1' && 'Main Pharmacy'}
                          {asset.assignedPharmacyId === 'pharmacy-2' && 'East Side Pharmacy'}
                          {asset.assignedPharmacyId === 'pharmacy-3' && 'West Valley Pharmacy'}
                          {!asset.assignedPharmacyId && <span className="text-gray-400">Unassigned</span>}
                        </span>
                      </TableCell>
                      <TableCell>{asset.currentLocation}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDistanceToNow(asset.lastUpdated, { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-left">
                        {asset.batteryPercent !== undefined ? (
                          <BatteryIndicator percent={asset.batteryPercent} />
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {format(asset.pmDueDate, 'MMM d, yyyy')}
                          </div>
                          <PMStatusBadge status={asset.pmStatus} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/track/${asset.id}`} className="cursor-pointer">View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Change Pharmacy</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>Add Note</DropdownMenuItem>
                            {asset.assetType === 'Pump - GPS' && (
                              <DropdownMenuItem>Request Ping</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredAssets.length)} of{" "}
              {filteredAssets.length} assets
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}