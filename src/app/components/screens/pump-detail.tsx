import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { StatusBadge, BatteryIndicator, SignalStrength } from "../status-indicators";
import {
  getAssetById,
  getLocationHistoryByAssetId,
  getNotesByAssetId,
  getPMRecordsByAssetId,
} from "../../lib/data";
import { Edit, Radio, Clock, Calendar } from "lucide-react";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";

export function PumpDetail() {
  const { id } = useParams();
  const asset = getAssetById(id!);
  const locationHistory = getLocationHistoryByAssetId(id!);
  const notes = getNotesByAssetId(id!);
  const pmRecords = getPMRecordsByAssetId(id!);

  const [newNote, setNewNote] = useState("");

  if (!asset) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Asset Not Found</h2>
          <p className="text-gray-600 mb-4">The asset you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/track">Back to Track Devices</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isGPS = asset.assetType === 'Pump - GPS';

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/track">Track Devices</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{asset.serialNumber}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{asset.serialNumber}</h1>
                <Badge variant="outline">{asset.assetType}</Badge>
                {isGPS && <Radio className="size-5 text-blue-600" />}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>ID: {asset.id}</span>
                <span>•</span>
                <span>Last updated {formatDistanceToNow(asset.lastUpdated, { addSuffix: true })}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="size-4 mr-2" />
                Update Status
              </Button>
              {isGPS && (
                <Button variant="outline">
                  <Radio className="size-4 mr-2" />
                  Request Ping
                </Button>
              )}
              <Button>
                <Edit className="size-4 mr-2" />
                Edit Asset
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Current Status</h3>
              <StatusBadge status={asset.status} className="text-base px-4 py-2" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Current Location</h3>
              <p className="font-medium">{asset.currentLocation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Location History</TabsTrigger>
          {isGPS && <TabsTrigger value="tracker">Tracker Details</TabsTrigger>}
          <TabsTrigger value="pm">PM Schedule</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Location History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Location History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facility</TableHead>
                    <TableHead>Arrival Date</TableHead>
                    <TableHead>Departure Date</TableHead>
                    <TableHead>Duration (days)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locationHistory.map((history) => {
                    const duration = history.departureDate
                      ? differenceInDays(history.departureDate, history.arrivalDate)
                      : differenceInDays(new Date(), history.arrivalDate);

                    return (
                      <TableRow key={history.id}>
                        <TableCell className="font-medium">{history.facility}</TableCell>
                        <TableCell>{format(history.arrivalDate, 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          {history.departureDate
                            ? format(history.departureDate, 'MMM d, yyyy')
                            : <Badge variant="secondary">Current</Badge>}
                        </TableCell>
                        <TableCell>{duration}</TableCell>
                        <TableCell>
                          <StatusBadge status={history.status} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tracker Details Tab */}
        {isGPS && (
          <TabsContent value="tracker">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tracker Details</CardTitle>
                  <Button variant="outline" size="sm">Reconfigure Tracker</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">IMEI</h3>
                    <p className="font-mono text-lg">{asset.imei}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">SIM ID</h3>
                    <p className="font-mono text-lg">{asset.simId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Battery Level</h3>
                    <BatteryIndicator percent={asset.batteryPercent || 0} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Last Ping</h3>
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-gray-400" />
                      <p>{asset.lastPing ? formatDistanceToNow(asset.lastPing, { addSuffix: true }) : 'Never'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Signal Strength</h3>
                    {asset.signalStrength && <SignalStrength strength={asset.signalStrength} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Location Accuracy</h3>
                    <p>± 10 meters</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* PM Schedule Tab */}
        <TabsContent value="pm">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>PM Schedule</CardTitle>
                <Button variant="outline" size="sm">Update PM Schedule</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Last PM Date</h3>
                  <p className="text-lg font-semibold">
                    {pmRecords.length > 0
                      ? format(pmRecords[0].date, 'MMM d, yyyy')
                      : 'Never'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Next PM Due</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-5 text-gray-400" />
                    <p className="text-lg font-semibold">
                      {format(asset.pmDueDate, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {asset.pmDueDate > new Date()
                      ? `Due in ${differenceInDays(asset.pmDueDate, new Date())} days`
                      : `Overdue by ${differenceInDays(new Date(), asset.pmDueDate)} days`}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">PM Status</h3>
                  <Badge
                    variant={
                      asset.pmStatus === 'Overdue'
                        ? 'destructive'
                        : asset.pmStatus === 'Due Soon'
                        ? 'default'
                        : 'secondary'
                    }
                    className="text-base"
                  >
                    {asset.pmStatus}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">PM History</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Performed By</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pmRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{format(record.date, 'MMM d, yyyy')}</TableCell>
                        <TableCell>{record.performedBy}</TableCell>
                        <TableCell>{record.notes}</TableCell>
                      </TableRow>
                    ))}
                    {pmRecords.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500">
                          No PM records available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  placeholder="Add a note about this asset..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="mb-2"
                />
                <Button>Post Note</Button>
              </div>

              <div className="space-y-3 pt-4 border-t">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{note.userName}</p>
                        <p className="text-xs text-gray-500">
                          {format(note.timestamp, 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No notes yet. Add the first note above.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}