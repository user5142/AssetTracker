// Core data types for the asset tracking platform

export type AssetStatus = 
  | 'At Facility'
  | 'At Pharmacy'
  | 'In Transit'
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
  assignedPharmacyId?: string; // NEW: Which pharmacy owns/manages this pump
  lastUpdated: Date;
  batteryPercent?: number;
  pmDueDate: Date;
  pmStatus: PMStatus;
  imei?: string;
  simId?: string;
  lastPing?: Date;
  signalStrength?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface LocationHistory {
  id: string;
  assetId: string;
  facility: string;
  arrivalDate: Date;
  departureDate?: Date;
  status: AssetStatus;
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