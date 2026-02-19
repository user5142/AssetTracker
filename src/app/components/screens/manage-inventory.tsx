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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
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
import {
  mockAssets,
  mockLocations,
  mockSimCards as initialSimCards,
  mockGpsTrackerDevices as initialGpsDevices,
  mockTrackerConfigs as initialTrackerConfigs,
} from "../../lib/data";
import type { Asset, AssetType, SimCard, GpsTrackerDevice, TrackerConfig } from "../../lib/types";
import { Package, Radio, Smartphone, Link2, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const assetTypes: AssetType[] = ["Pump - GPS", "Pump - Rental", "E-kit"];

export function ManageInventory() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [simCards, setSimCards] = useState<SimCard[]>(initialSimCards);
  const [gpsDevices, setGpsDevices] = useState<GpsTrackerDevice[]>(initialGpsDevices);
  const [trackerConfigs, setTrackerConfigs] = useState<TrackerConfig[]>(initialTrackerConfigs);

  // Serialized Assets state
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    serialNumber: "",
    assetType: "Pump - GPS" as AssetType,
    assignedPharmacyId: "",
  });

  // GPS Trackers state
  const [trackerDialogOpen, setTrackerDialogOpen] = useState(false);
  const [editingTrackerId, setEditingTrackerId] = useState<string | null>(null);
  const [trackerForm, setTrackerForm] = useState({ imei: "", simId: "" });
  const [deleteTrackerId, setDeleteTrackerId] = useState<string | null>(null);

  // SIM Cards state
  const [simDialogOpen, setSimDialogOpen] = useState(false);
  const [newSimId, setNewSimId] = useState("");
  const [associateSimDialogOpen, setAssociateSimDialogOpen] = useState(false);
  const [associateSimId, setAssociateSimId] = useState("");
  const [associateImei, setAssociateImei] = useState("");
  const [deleteSimId, setDeleteSimId] = useState<string | null>(null);

  // Tracker–Pump link state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkImei, setLinkImei] = useState("");
  const [linkPumpSerial, setLinkPumpSerial] = useState("");
  const [unlinkTrackerId, setUnlinkTrackerId] = useState<string | null>(null);

  const handleAddAsset = () => {
    if (!newAsset.serialNumber.trim() || !newAsset.assignedPharmacyId) {
      toast.error("Serial number and assigned pharmacy are required.");
      return;
    }
    if (assets.some((a) => a.serialNumber === newAsset.serialNumber.trim())) {
      toast.error("An asset with this serial number already exists.");
      return;
    }
    const now = new Date();
    const pmDue = new Date(now);
    pmDue.setDate(pmDue.getDate() + 90);
    const asset: Asset = {
      id: `asset-${Date.now()}`,
      serialNumber: newAsset.serialNumber.trim(),
      assetType: newAsset.assetType,
      status: "At Pharmacy",
      currentLocation: mockLocations.find((l) => l.id === newAsset.assignedPharmacyId)?.name ?? "Storage",
      assignedPharmacyId: newAsset.assignedPharmacyId,
      lastUpdated: now,
      pmDueDate: pmDue,
      pmStatus: "Current",
    };
    if (newAsset.assetType === "Pump - GPS") {
      asset.imei = undefined;
      asset.simId = undefined;
    }
    setAssets([...assets, asset]);
    setNewAsset({ serialNumber: "", assetType: "Pump - GPS", assignedPharmacyId: "" });
    setAssetDialogOpen(false);
    toast.success("Serialized asset added.");
  };

  const handleAddTracker = () => {
    if (!trackerForm.imei.trim()) {
      toast.error("IMEI is required.");
      return;
    }
    if (gpsDevices.some((d) => d.imei === trackerForm.imei.trim())) {
      toast.error("A tracker with this IMEI already exists.");
      return;
    }
    const device: GpsTrackerDevice = {
      id: `gps-${Date.now()}`,
      imei: trackerForm.imei.trim(),
      simId: trackerForm.simId || undefined,
    };
    setGpsDevices([...gpsDevices, device]);
    if (trackerForm.simId && trackerConfigs.every((t) => t.simId !== trackerForm.simId)) {
      setTrackerConfigs([
        ...trackerConfigs,
        {
          id: device.id,
          imei: device.imei,
          simId: trackerForm.simId,
          assetSerialNumber: "",
          location: "",
          batteryPercent: 0,
          lastPing: new Date(),
        },
      ]);
    }
    setTrackerForm({ imei: "", simId: "" });
    setEditingTrackerId(null);
    setTrackerDialogOpen(false);
    toast.success("GPS tracker device added.");
  };

  const handleUpdateTracker = (id: string) => {
    const d = gpsDevices.find((x) => x.id === id);
    if (!d) return;
    setTrackerForm({ imei: d.imei, simId: d.simId ?? "" });
    setEditingTrackerId(id);
    setTrackerDialogOpen(true);
  };

  const handleSaveEditTracker = () => {
    if (!editingTrackerId || !trackerForm.imei.trim()) return;
    setGpsDevices((prev) =>
      prev.map((d) =>
        d.id === editingTrackerId
          ? { ...d, imei: trackerForm.imei.trim(), simId: trackerForm.simId || undefined }
          : d
      )
    );
    setTrackerConfigs((prev) =>
      prev.map((t) =>
        t.imei === gpsDevices.find((x) => x.id === editingTrackerId)?.imei
          ? { ...t, imei: trackerForm.imei.trim(), simId: trackerForm.simId || t.simId }
          : t
      )
    );
    setTrackerForm({ imei: "", simId: "" });
    setEditingTrackerId(null);
    setTrackerDialogOpen(false);
    toast.success("Tracker updated.");
  };

  const handleDeleteTracker = (id: string) => {
    const d = gpsDevices.find((x) => x.id === id);
    setGpsDevices((prev) => prev.filter((x) => x.id !== id));
    if (d) {
      setTrackerConfigs((prev) => prev.filter((t) => t.imei !== d.imei));
    }
    setDeleteTrackerId(null);
    toast.success("Tracker removed.");
  };

  const handleAddSim = () => {
    if (!newSimId.trim()) {
      toast.error("SIM ID is required.");
      return;
    }
    if (simCards.some((s) => s.simId === newSimId.trim())) {
      toast.error("This SIM ID already exists.");
      return;
    }
    setSimCards([...simCards, { id: `sim-${Date.now()}`, simId: newSimId.trim() }]);
    setNewSimId("");
    setSimDialogOpen(false);
    toast.success("SIM card added.");
  };

  const handleAssociateSimWithImei = () => {
    if (!associateSimId || !associateImei.trim()) {
      toast.error("Select a SIM and enter an IMEI.");
      return;
    }
    const imeiVal = associateImei.trim();
    setSimCards((prev) =>
      prev.map((s) => (s.simId === associateSimId ? { ...s, imei: imeiVal } : s))
    );
    const deviceExists = gpsDevices.some((d) => d.imei === imeiVal);
    setGpsDevices((prev) => {
      if (deviceExists) {
        return prev.map((d) => (d.imei === imeiVal ? { ...d, simId: associateSimId } : d));
      }
      return [...prev, { id: `gps-${Date.now()}`, imei: imeiVal, simId: associateSimId }];
    });
    const existing = trackerConfigs.find((t) => t.imei === imeiVal);
    if (existing) {
      setTrackerConfigs((prev) =>
        prev.map((t) => (t.imei === imeiVal ? { ...t, simId: associateSimId } : t))
      );
    } else {
      setTrackerConfigs((prev) => [
        ...prev,
        {
          id: `gps-${Date.now()}`,
          imei: imeiVal,
          simId: associateSimId,
          assetSerialNumber: "",
          location: "",
          batteryPercent: 0,
          lastPing: new Date(),
        },
      ]);
    }
    setAssociateSimId("");
    setAssociateImei("");
    setAssociateSimDialogOpen(false);
    toast.success("SIM card associated with IMEI.");
  };

  const handleDeleteSim = (id: string) => {
    const sim = simCards.find((s) => s.id === id);
    setSimCards((prev) => prev.filter((s) => s.id !== id));
    if (sim?.imei) {
      setGpsDevices((prev) =>
        prev.map((d) => (d.imei === sim.imei ? { ...d, simId: undefined } : d))
      );
      setTrackerConfigs((prev) =>
        prev.map((t) => (t.imei === sim.imei ? { ...t, simId: "" } : t))
      );
    }
    setDeleteSimId(null);
    toast.success("SIM card removed.");
  };

  const handleLinkTrackerToPump = () => {
    if (!linkImei || !linkPumpSerial) {
      toast.error("Select both tracker (IMEI) and pump serial number.");
      return;
    }
    const pump = assets.find((a) => a.serialNumber === linkPumpSerial && a.assetType === "Pump - GPS");
    setGpsDevices((prev) =>
      prev.map((d) =>
        d.imei === linkImei ? { ...d, pumpSerialNumber: linkPumpSerial } : d
      )
    );
    setTrackerConfigs((prev) =>
      prev.map((t) =>
        t.imei === linkImei
          ? { ...t, assetSerialNumber: linkPumpSerial, location: pump?.currentLocation ?? t.location }
          : t
      )
    );
    if (pump) {
      setAssets((prev) =>
        prev.map((a) =>
          a.id === pump.id ? { ...a, imei: linkImei, simId: gpsDevices.find((d) => d.imei === linkImei)?.simId } : a
        )
      );
    }
    setLinkImei("");
    setLinkPumpSerial("");
    setLinkDialogOpen(false);
    toast.success("Tracker linked to pump.");
  };

  const handleUnlinkTracker = (id: string) => {
    const cfg = trackerConfigs.find((t) => t.id === id);
    if (!cfg) return;
    setGpsDevices((prev) =>
      prev.map((d) =>
        d.imei === cfg.imei ? { ...d, pumpSerialNumber: undefined } : d
      )
    );
    setTrackerConfigs((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, assetSerialNumber: "", location: "" } : t
      )
    );
    setAssets((prev) =>
      prev.map((a) =>
        a.imei === cfg.imei ? { ...a, imei: undefined, simId: undefined } : a
      )
    );
    setUnlinkTrackerId(null);
    toast.success("Tracker unlinked from pump.");
  };

  const gpsPumpSerials = assets
    .filter((a) => a.assetType === "Pump - GPS")
    .map((a) => a.serialNumber);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Manage Inventory</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold">Manage Inventory</h1>
        <p className="text-gray-600 mt-1">
          Add serialized assets, GPS trackers, SIM cards, and manage tracker–pump associations (REQ-009).
        </p>
      </div>

      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="assets" className="gap-2">
            <Package className="size-4" />
            Serialized Assets
          </TabsTrigger>
          <TabsTrigger value="trackers" className="gap-2">
            <Radio className="size-4" />
            GPS Trackers
          </TabsTrigger>
          <TabsTrigger value="sims" className="gap-2">
            <Smartphone className="size-4" />
            SIM Cards
          </TabsTrigger>
          <TabsTrigger value="associations" className="gap-2">
            <Link2 className="size-4" />
            Associations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Serialized Assets</CardTitle>
              <Dialog open={assetDialogOpen} onOpenChange={setAssetDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="size-4 mr-2" />
                    Add Asset
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Serialized Asset</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Serial Number</Label>
                      <Input
                        placeholder="e.g. PMP-12399"
                        value={newAsset.serialNumber}
                        onChange={(e) => setNewAsset((a) => ({ ...a, serialNumber: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Asset Type</Label>
                      <Select
                        value={newAsset.assetType}
                        onValueChange={(v) => setNewAsset((a) => ({ ...a, assetType: v as AssetType }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {assetTypes.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Assigned Pharmacy</Label>
                      <Select
                        value={newAsset.assignedPharmacyId}
                        onValueChange={(v) => setNewAsset((a) => ({ ...a, assignedPharmacyId: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select pharmacy..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockLocations
                            .filter((l) => l.type === "Pharmacy")
                            .map((l) => (
                              <SelectItem key={l.id} value={l.id}>
                                {l.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAssetDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAsset}>Add Asset</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serial #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Assigned Pharmacy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.slice(0, 20).map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.serialNumber}</TableCell>
                        <TableCell>{a.assetType}</TableCell>
                        <TableCell>{a.status}</TableCell>
                        <TableCell>{a.currentLocation}</TableCell>
                        <TableCell>
                          {mockLocations.find((l) => l.id === a.assignedPharmacyId)?.name ?? "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {assets.length > 20 && (
                <p className="px-4 py-2 text-sm text-gray-500">
                  Showing 20 of {assets.length} assets.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trackers" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>GPS Tracker Devices</CardTitle>
              <Dialog
                open={trackerDialogOpen}
                onOpenChange={(open) => {
                  setTrackerDialogOpen(open);
                  if (!open) {
                    setEditingTrackerId(null);
                    setTrackerForm({ imei: "", simId: "" });
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="size-4 mr-2" />
                    Add Tracker
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingTrackerId ? "Update GPS Tracker" : "Add New GPS Tracker"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>IMEI</Label>
                      <Input
                        placeholder="356938035643809"
                        value={trackerForm.imei}
                        onChange={(e) => setTrackerForm((f) => ({ ...f, imei: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SIM ID (optional)</Label>
                      <Select
                        value={trackerForm.simId || "_none"}
                        onValueChange={(v) => setTrackerForm((f) => ({ ...f, simId: v === "_none" ? "" : v }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select SIM..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">None</SelectItem>
                          {simCards.map((s) => (
                            <SelectItem key={s.id} value={s.simId}>
                              {s.simId} {s.imei ? `(→ ${s.imei})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setTrackerDialogOpen(false)}>
                      Cancel
                    </Button>
                    {editingTrackerId ? (
                      <Button onClick={handleSaveEditTracker}>Update</Button>
                    ) : (
                      <Button onClick={handleAddTracker}>Add Tracker</Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IMEI</TableHead>
                      <TableHead>SIM ID</TableHead>
                      <TableHead>Linked Pump</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gpsDevices.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-mono text-sm">{d.imei}</TableCell>
                        <TableCell className="font-mono text-sm">{d.simId ?? "—"}</TableCell>
                        <TableCell>{d.pumpSerialNumber ?? "—"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleUpdateTracker(d.id)}>
                              <Edit className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteTrackerId(d.id)}>
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
        </TabsContent>

        <TabsContent value="sims" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>SIM Cards</CardTitle>
              <div className="flex gap-2">
                <Dialog open={associateSimDialogOpen} onOpenChange={setAssociateSimDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Associate SIM with IMEI</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Associate SIM Card with IMEI</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>SIM Card</Label>
                        <Select value={associateSimId} onValueChange={setAssociateSimId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select SIM..." />
                          </SelectTrigger>
                          <SelectContent>
                            {simCards.map((s) => (
                              <SelectItem key={s.id} value={s.simId}>
                                {s.simId} {s.imei ? `(→ ${s.imei})` : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>IMEI</Label>
                        <Input
                          placeholder="e.g. 356938035643809"
                          value={associateImei}
                          onChange={(e) => setAssociateImei(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                          Enter IMEI of the tracker. If the tracker is not in the list yet, add it under GPS Trackers first or type the IMEI here to associate.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAssociateSimDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAssociateSimWithImei}>Associate</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={simDialogOpen} onOpenChange={setSimDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="size-4 mr-2" />
                      Add SIM Card
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New SIM Card</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>SIM ID (ICCID)</Label>
                        <Input
                          placeholder="89011703278306543210"
                          value={newSimId}
                          onChange={(e) => setNewSimId(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSimDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddSim}>Add SIM</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SIM ID</TableHead>
                      <TableHead>Associated IMEI</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {simCards.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono text-sm">{s.simId}</TableCell>
                        <TableCell className="font-mono text-sm">{s.imei ?? "—"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteSimId(s.id)}>
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="associations" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tracker–Pump Associations</CardTitle>
              <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Link2 className="size-4 mr-2" />
                    Link Tracker to Pump
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Link Tracker to Pump Serial Number</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Tracker (IMEI)</Label>
                      <Select value={linkImei} onValueChange={setLinkImei}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select IMEI..." />
                        </SelectTrigger>
                        <SelectContent>
                          {gpsDevices.map((d) => (
                            <SelectItem key={d.id} value={d.imei}>
                              {d.imei} {d.pumpSerialNumber ? `(→ ${d.pumpSerialNumber})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Pump Serial Number</Label>
                      <Select value={linkPumpSerial} onValueChange={setLinkPumpSerial}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pump..." />
                        </SelectTrigger>
                        <SelectContent>
                          {gpsPumpSerials.map((sn) => (
                            <SelectItem key={sn} value={sn}>
                              {sn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleLinkTrackerToPump}>Link</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trackerConfigs.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-mono text-sm">{t.imei}</TableCell>
                        <TableCell className="font-mono text-sm">{t.simId}</TableCell>
                        <TableCell className="font-medium">{t.assetSerialNumber || "—"}</TableCell>
                        <TableCell>{t.location || "—"}</TableCell>
                        <TableCell>
                          {t.assetSerialNumber ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setUnlinkTrackerId(t.id)}
                            >
                              Unlink
                            </Button>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete tracker confirmation */}
      <AlertDialog open={deleteTrackerId !== null} onOpenChange={() => setDeleteTrackerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove GPS tracker?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the tracker device from inventory. Any link to a pump will be cleared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTrackerId && handleDeleteTracker(deleteTrackerId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete SIM confirmation */}
      <AlertDialog open={deleteSimId !== null} onOpenChange={() => setDeleteSimId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove SIM card?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the SIM from inventory. Association with IMEI will be cleared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteSimId && handleDeleteSim(deleteSimId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unlink tracker confirmation */}
      <AlertDialog open={unlinkTrackerId !== null} onOpenChange={() => setUnlinkTrackerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink tracker from pump?</AlertDialogTitle>
            <AlertDialogDescription>
              The tracker will no longer be associated with this pump. The pump will stop receiving GPS data from this tracker.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => unlinkTrackerId && handleUnlinkTracker(unlinkTrackerId)}
            >
              Unlink
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
