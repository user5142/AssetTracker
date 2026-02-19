// Mock data for the asset tracking platform
import type { 
  Asset, 
  Alert, 
  LocationHistory, 
  Note, 
  PMRecord, 
  TrackerConfig, 
  AlertConfig, 
  Location, 
  Report,
  SimCard,
  GpsTrackerDevice,
} from './types';

// Helper function to create dates relative to now
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000);

export const mockAssets: Asset[] = [
  {
    id: '1',
    serialNumber: 'PMP-12345',
    assetType: 'Pump - GPS',
    status: 'At Facility',
    currentLocation: 'St. Mary\'s Hospital - ICU',
    assignedPharmacyId: '1', // Assigned to Main Pharmacy
    lastUpdated: hoursAgo(2),
    batteryPercent: 87,
    pmDueDate: daysFromNow(45),
    pmStatus: 'Current',
    imei: '356938035643809',
    simId: '89011703278306543210',
    lastPing: hoursAgo(2),
    signalStrength: 'Good',
  },
  {
    id: '2',
    serialNumber: 'PMP-12346',
    assetType: 'Pump - GPS',
    status: 'Lost/Problem',
    currentLocation: 'Unknown - Last at Regional Medical Center',
    assignedPharmacyId: '1', // Assigned to Main Pharmacy
    lastUpdated: daysAgo(7),
    batteryPercent: 15,
    pmDueDate: daysFromNow(90),
    pmStatus: 'Current',
    imei: '356938035643810',
    simId: '89011703278306543211',
    lastPing: daysAgo(5),
    signalStrength: 'Poor',
  },
  {
    id: '3',
    serialNumber: 'PMP-12347',
    assetType: 'Pump - Rental',
    status: 'At Pharmacy',
    currentLocation: 'Main Pharmacy - Storage',
    assignedPharmacyId: '1', // Assigned to Main Pharmacy
    lastUpdated: daysAgo(1),
    pmDueDate: daysAgo(10),
    pmStatus: 'Overdue',
  },
  {
    id: '4',
    serialNumber: 'PMP-12348',
    assetType: 'Pump - GPS',
    status: 'In Transit',
    currentLocation: 'En route to Valley View Clinic',
    assignedPharmacyId: 'pharmacy-2', // Assigned to East Side Pharmacy
    lastUpdated: hoursAgo(1),
    batteryPercent: 92,
    pmDueDate: daysFromNow(20),
    pmStatus: 'Due Soon',
    imei: '356938035643811',
    simId: '89011703278306543212',
    lastPing: hoursAgo(1),
    signalStrength: 'Excellent',
  },
  {
    id: '5',
    serialNumber: 'PMP-12349',
    assetType: 'Pump - GPS',
    status: 'At PM',
    currentLocation: 'Equipment Services - PM Department',
    assignedPharmacyId: 'pharmacy-2', // Assigned to East Side Pharmacy
    lastUpdated: daysAgo(3),
    batteryPercent: 100,
    pmDueDate: daysAgo(5),
    pmStatus: 'Overdue',
    imei: '356938035643812',
    simId: '89011703278306543213',
    lastPing: daysAgo(3),
    signalStrength: 'Good',
  },
  {
    id: '6',
    serialNumber: 'EKT-00123',
    assetType: 'E-kit',
    status: 'At Facility',
    currentLocation: 'Memorial Hospital - Patient Room 204',
    assignedPharmacyId: 'pharmacy-3', // Assigned to West Valley Pharmacy
    lastUpdated: hoursAgo(6),
    pmDueDate: daysFromNow(60),
    pmStatus: 'Current',
  },
  {
    id: '7',
    serialNumber: 'PMP-12350',
    assetType: 'Pump - Rental',
    status: 'At Facility',
    currentLocation: 'Sunrise Care Center',
    assignedPharmacyId: 'pharmacy-3', // Assigned to West Valley Pharmacy
    lastUpdated: daysAgo(45),
    pmDueDate: daysFromNow(15),
    pmStatus: 'Due Soon',
  },
  {
    id: '8',
    serialNumber: 'PMP-12351',
    assetType: 'Pump - GPS',
    status: 'At Facility',
    currentLocation: 'City General Hospital - ER',
    assignedPharmacyId: '1', // Assigned to Main Pharmacy
    lastUpdated: hoursAgo(4),
    batteryPercent: 78,
    pmDueDate: daysFromNow(120),
    pmStatus: 'Current',
    imei: '356938035643813',
    simId: '89011703278306543214',
    lastPing: hoursAgo(4),
    signalStrength: 'Good',
  },
];

// Generate more assets for pagination demo
for (let i = 9; i <= 187; i++) {
  const statuses: Asset['status'][] = ['At Facility', 'At Pharmacy', 'In Transit', 'At PM'];
  const assetTypes: Asset['assetType'][] = ['Pump - GPS', 'Pump - Rental', 'E-kit'];
  const pharmacyIds = ['1', 'pharmacy-2', 'pharmacy-3'];
  const locations = [
    'St. Mary\'s Hospital',
    'Regional Medical Center',
    'Valley View Clinic',
    'Memorial Hospital',
    'City General Hospital',
    'Main Pharmacy - Storage',
  ];
  
  const status = statuses[i % statuses.length];
  const assetType = assetTypes[i % assetTypes.length];
  const isGPS = assetType === 'Pump - GPS';
  
  mockAssets.push({
    id: String(i),
    serialNumber: `${assetType.includes('E-kit') ? 'EKT' : 'PMP'}-${12344 + i}`,
    assetType,
    status,
    currentLocation: locations[i % locations.length],
    assignedPharmacyId: pharmacyIds[i % pharmacyIds.length], // Distribute across pharmacies
    lastUpdated: hoursAgo(Math.random() * 48),
    batteryPercent: isGPS ? Math.floor(Math.random() * 100) : undefined,
    pmDueDate: daysFromNow(Math.floor(Math.random() * 180) - 30),
    pmStatus: i % 10 === 0 ? 'Overdue' : i % 5 === 0 ? 'Due Soon' : 'Current',
    imei: isGPS ? `35693803564${3800 + i}` : undefined,
    simId: isGPS ? `8901170327830654${3200 + i}` : undefined,
    lastPing: isGPS ? hoursAgo(Math.random() * 24) : undefined,
    signalStrength: isGPS ? (['Excellent', 'Good', 'Fair'] as const)[i % 3] : undefined,
  });
}

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'PM Overdue',
    title: 'Preventive Maintenance Overdue',
    description: 'PM was due 10 days ago. Please schedule maintenance immediately.',
    assetSerialNumber: 'PMP-12347',
    timestamp: hoursAgo(12),
    severity: 'critical',
    isRead: false,
  },
  {
    id: '2',
    type: 'Lost/Problem',
    title: 'Asset Not Responding',
    description: 'Tracker has not reported location in 5 days. Last known location: Regional Medical Center.',
    assetSerialNumber: 'PMP-12346',
    timestamp: daysAgo(2),
    severity: 'critical',
    isRead: false,
  },
  {
    id: '3',
    type: 'Low Battery',
    title: 'Low Tracker Battery',
    description: 'GPS tracker battery is at 15%. Asset may stop reporting soon.',
    assetSerialNumber: 'PMP-12346',
    timestamp: daysAgo(1),
    severity: 'warning',
    isRead: false,
  },
  {
    id: '4',
    type: 'PM Due',
    title: 'PM Due in 20 Days',
    description: 'Preventive maintenance is due on March 9, 2026.',
    assetSerialNumber: 'PMP-12348',
    timestamp: daysAgo(1),
    severity: 'warning',
    isRead: true,
  },
  {
    id: '5',
    type: 'Not Returned',
    title: 'Asset Not Returned - 45 Days',
    description: 'Rental pump has been at facility for 45 days without return.',
    assetSerialNumber: 'PMP-12350',
    timestamp: hoursAgo(6),
    severity: 'warning',
    isRead: false,
  },
  {
    id: '6',
    type: 'PM Due',
    title: 'PM Due in 15 Days',
    description: 'Preventive maintenance is due on March 4, 2026.',
    assetSerialNumber: 'PMP-12350',
    timestamp: daysAgo(3),
    severity: 'warning',
    isRead: true,
  },
];

export const mockLocationHistory: LocationHistory[] = [
  {
    id: '1',
    assetId: '1',
    facility: 'St. Mary\'s Hospital - ICU',
    arrivalDate: daysAgo(15),
    status: 'At Facility',
  },
  {
    id: '2',
    assetId: '1',
    facility: 'Main Pharmacy - Storage',
    arrivalDate: daysAgo(45),
    departureDate: daysAgo(15),
    status: 'At Pharmacy',
  },
  {
    id: '3',
    assetId: '1',
    facility: 'Regional Medical Center - Ward 3',
    arrivalDate: daysAgo(90),
    departureDate: daysAgo(45),
    status: 'At Facility',
  },
];

export const mockNotes: Note[] = [
  {
    id: '1',
    assetId: '1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    content: 'Asset in good condition. Battery replaced during last PM.',
    timestamp: daysAgo(30),
  },
  {
    id: '2',
    assetId: '1',
    userId: 'user2',
    userName: 'Mike Chen',
    content: 'Assigned to ICU patient. Expected return in 2 weeks.',
    timestamp: daysAgo(15),
  },
];

export const mockPMRecords: PMRecord[] = [
  {
    id: '1',
    assetId: '1',
    date: daysAgo(90),
    notes: 'Full service completed. All components inspected and tested.',
    performedBy: 'Tech Services - John Doe',
  },
  {
    id: '2',
    assetId: '1',
    date: daysAgo(180),
    notes: 'Routine maintenance. Battery replaced.',
    performedBy: 'Tech Services - Jane Smith',
  },
];

export const mockTrackerConfigs: TrackerConfig[] = [
  {
    id: '1',
    imei: '356938035643809',
    simId: '89011703278306543210',
    assetSerialNumber: 'PMP-12345',
    location: 'St. Mary\'s Hospital - ICU',
    batteryPercent: 87,
    lastPing: hoursAgo(2),
  },
  {
    id: '2',
    imei: '356938035643810',
    simId: '89011703278306543211',
    assetSerialNumber: 'PMP-12346',
    location: 'Unknown',
    batteryPercent: 15,
    lastPing: daysAgo(5),
  },
  {
    id: '3',
    imei: '356938035643811',
    simId: '89011703278306543212',
    assetSerialNumber: 'PMP-12348',
    location: 'In Transit',
    batteryPercent: 92,
    lastPing: hoursAgo(1),
  },
];

export const mockSimCards: SimCard[] = [
  { id: 'sim-1', simId: '89011703278306543210', imei: '356938035643809' },
  { id: 'sim-2', simId: '89011703278306543211', imei: '356938035643810' },
  { id: 'sim-3', simId: '89011703278306543212', imei: '356938035643811' },
  { id: 'sim-4', simId: '89011703278306543213', imei: '356938035643812' },
  { id: 'sim-5', simId: '89011703278306543214', imei: '356938035643813' },
  { id: 'sim-6', simId: '89011703278306543299' },
  { id: 'sim-7', simId: '89011703278306543300' },
];

export const mockGpsTrackerDevices: GpsTrackerDevice[] = [
  { id: 'gps-1', imei: '356938035643809', simId: '89011703278306543210', pumpSerialNumber: 'PMP-12345', location: 'St. Mary\'s Hospital - ICU', batteryPercent: 87, lastPing: hoursAgo(2) },
  { id: 'gps-2', imei: '356938035643810', simId: '89011703278306543211', pumpSerialNumber: 'PMP-12346', location: 'Unknown', batteryPercent: 15, lastPing: daysAgo(5) },
  { id: 'gps-3', imei: '356938035643811', simId: '89011703278306543212', pumpSerialNumber: 'PMP-12348', location: 'In Transit', batteryPercent: 92, lastPing: hoursAgo(1) },
  { id: 'gps-4', imei: '356938035643999' },
  { id: 'gps-5', imei: '356938035644000', simId: '89011703278306543299' },
];

export const mockAlertConfigs: AlertConfig[] = [
  {
    id: '1',
    type: 'Low Tracker Battery',
    enabled: true,
    threshold: 20,
    recipients: ['pharmacy@example.com', 'admin@example.com'],
    frequency: 'Daily',
  },
  {
    id: '2',
    type: 'PM Due Warning',
    enabled: true,
    daysBefore: 30,
    recipients: ['maintenance@example.com', 'manager@example.com'],
    frequency: 'Weekly',
  },
  {
    id: '3',
    type: 'Lost/Problem Pump',
    enabled: true,
    recipients: ['admin@example.com', 'security@example.com'],
    frequency: 'Once',
  },
  {
    id: '4',
    type: 'Pump Not Returned',
    enabled: true,
    daysBefore: 30,
    recipients: ['pharmacy@example.com'],
    frequency: 'Weekly',
  },
  {
    id: '5',
    type: 'Configuration Error',
    enabled: false,
    recipients: ['tech@example.com'],
    frequency: 'Once',
  },
];

export const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Main Pharmacy - Storage',
    address: '123 Medical Plaza, Suite 100',
    type: 'Pharmacy',
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    id: 'pharmacy-2',
    name: 'East Side Pharmacy',
    address: '456 Healthcare Drive',
    type: 'Pharmacy',
    lat: 37.7849,
    lng: -122.4094,
  },
  {
    id: 'pharmacy-3',
    name: 'West Valley Pharmacy',
    address: '789 Medical Center Blvd',
    type: 'Pharmacy',
    lat: 37.7649,
    lng: -122.4294,
  },
  {
    id: '2',
    name: 'St. Mary\'s Hospital',
    address: '456 Health Ave',
    type: 'Facility',
    lat: 37.7849,
    lng: -122.4094,
  },
  {
    id: '3',
    name: 'Regional Medical Center',
    address: '789 Care Blvd',
    type: 'Facility',
    lat: 37.7649,
    lng: -122.4294,
  },
  {
    id: '4',
    name: 'Valley View Clinic',
    address: '321 Wellness Way',
    type: 'Facility',
    lat: 37.7549,
    lng: -122.4394,
  },
  {
    id: '5',
    name: 'Memorial Hospital',
    address: '654 Recovery Rd',
    type: 'Facility',
    lat: 37.7949,
    lng: -122.3994,
  },
];

export const mockReports: Report[] = [
  {
    id: '1',
    name: 'Pump Location History Report',
    description: 'View past and current locations with date ranges',
    category: 'Location & History',
    icon: 'MapPin',
  },
  {
    id: '2',
    name: 'Asset Activity Log Report',
    description: 'Combined GPS and non-GPS asset tracking',
    category: 'Location & History',
    icon: 'Activity',
  },
  {
    id: '3',
    name: 'Transit Time Analysis',
    description: 'Time spent in transit between locations',
    category: 'Location & History',
    icon: 'Clock',
  },
  {
    id: '4',
    name: 'Pumps with PM Due Report',
    description: 'Upcoming PM due dates in 30/60/90 day buckets',
    category: 'Maintenance & Compliance',
    icon: 'Wrench',
  },
  {
    id: '5',
    name: 'PM Compliance Report',
    description: 'On-time vs overdue maintenance statistics',
    category: 'Maintenance & Compliance',
    icon: 'CheckCircle',
  },
  {
    id: '6',
    name: 'Maintenance History Report',
    description: 'Complete PM records for all assets',
    category: 'Maintenance & Compliance',
    icon: 'FileText',
  },
  {
    id: '7',
    name: 'Asset Utilization Report',
    description: 'Time at facilities vs pharmacy by asset',
    category: 'Utilization & Operational',
    icon: 'BarChart3',
  },
  {
    id: '8',
    name: 'Rental Duration Report',
    description: 'Average and total days at customer locations',
    category: 'Utilization & Operational',
    icon: 'Calendar',
  },
  {
    id: '9',
    name: 'Fleet Status Summary',
    description: 'Current distribution across all locations',
    category: 'Utilization & Operational',
    icon: 'PieChart',
  },
];

export const getAssetById = (id: string) => mockAssets.find(a => a.id === id);
export const getLocationHistoryByAssetId = (assetId: string) => 
  mockLocationHistory.filter(h => h.assetId === assetId);
export const getNotesByAssetId = (assetId: string) => 
  mockNotes.filter(n => n.assetId === assetId);
export const getPMRecordsByAssetId = (assetId: string) => 
  mockPMRecords.filter(pm => pm.assetId === assetId);