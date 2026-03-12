// Core data types for the asset tracking platform

export type AssetStatus = 
  | 'At Facility'
  | 'Overdue'
  | 'At Pharmacy'
  | 'At PM'
  | 'Lost/Problem';

export type AssetType = 'Pump - GPS' | 'Pump - Rental' | 'E-kit';

export type PMStatus = 'Current' | 'Due Soon' | 'Overdue';

export interface Asset {
  id: string;
  serialNumber: string;
  assetType: AssetType;
  status: AssetStatus;
  currentLocation: string;
  assignedPharmacyId?: string; // Home pharmacy that owns/manages this pump
  assignedFacility?: string; // Assigned facility (e.g. primary facility for this asset)
  /** Current order number assignment */
  orderNumber?: string | null;
  lastUpdated: Date;
  /** Expected/actual return date; N/A for At Pharmacy, At PM; past for Overdue/Lost; future for At Facility */
  returnDate?: Date | null;
  batteryPercent?: number;
  pmDueDate: Date;
  pmStatus: PMStatus;
  imei?: string;
  simId?: string;
  lastPing?: Date;
  signalStrength?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

/** Historical record of order number assignments for an asset */
export interface OrderHistoryEntry {
  id: string;
  assetId: string;
  orderNumber: string;
  createdAt: Date;
}

/** Location stay record (not individual GPS pings). Includes both customer facilities and pharmacy locations. */
export interface LocationHistory {
  id: string;
  assetId: string;
  /** What the Assigned Location field was set to during this stay */
  assignedLocation: string;
  /** Actual location during this stay */
  actualLocation: string;
  arrivalDate: Date;
  departureDate?: Date;
  status?: AssetStatus;
}

export interface Alert {
  id: string;
  type: 'Low Battery' | 'PM Due' | 'PM Overdue' | 'Lost/Problem' | 'Not Returned' | 'Config Error';
  title: string;
  description: string;
  assetSerialNumber: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
  isRead: boolean;
}

export interface Note {
  id: string;
  assetId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

export interface PMRecord {
  id: string;
  assetId: string;
  date: Date;
  notes: string;
  performedBy: string;
}

export interface TrackerConfig {
  id: string;
  imei: string;
  simId: string;
  assetSerialNumber: string;
  location: string;
  batteryPercent: number;
  lastPing: Date;
}

/** GPS tracker device (by IMEI); SIM and pump link optional until configured */
export interface GpsTrackerDevice {
  id: string;
  imei: string;
  simId?: string;
  pumpSerialNumber?: string;
  location?: string;
  batteryPercent?: number;
  lastPing?: Date;
}

/** SIM card entity; can be associated with a tracker (IMEI) later */
export interface SimCard {
  id: string;
  simId: string;
  imei?: string;
}

export interface AlertConfig {
  id: string;
  type: string;
  enabled: boolean;
  threshold?: number;
  daysBefore?: number;
  recipients: string[];
  frequency: 'Once' | 'Daily' | 'Weekly';
}

export interface Location {
  id: string;
  name: string;
  address: string;
  type: 'Pharmacy' | 'Facility';
  lat: number;
  lng: number;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  category: 'Location & History' | 'Maintenance & Compliance' | 'Utilization & Operational';
  icon: string;
}