import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { Header } from "./components/header";
import { Dashboard } from "./components/screens/dashboard";
import { TrackPumps } from "./components/screens/track-pumps";
import { PumpDetail } from "./components/screens/pump-detail";
import { MapView } from "./components/screens/map-view";
import { ReportsLibrary } from "./components/screens/reports-library";
import { ReportParameters } from "./components/screens/report-parameters";
import { AssignAsset } from "./components/screens/assign-asset";
import { TrackerConfiguration } from "./components/screens/tracker-configuration";
import { AlertsNotifications } from "./components/screens/alerts-notifications";
import { AlertConfiguration } from "./components/screens/alert-configuration";
import { LocationManagement } from "./components/screens/location-management";
import { SystemGuide } from "./components/screens/system-guide";
import { mockAlerts } from "./lib/data";

export default function App() {
  const unreadAlertCount = mockAlerts.filter(a => !a.isRead).length;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header unreadAlertCount={unreadAlertCount} />
        
        <main className="container mx-auto px-6 py-8 flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/track" element={<TrackPumps />} />
            <Route path="/track/:id" element={<PumpDetail />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/reports" element={<ReportsLibrary />} />
            <Route path="/reports/:reportId" element={<ReportParameters />} />
            <Route path="/assign" element={<AssignAsset />} />
            <Route path="/admin/tracker-config" element={<TrackerConfiguration />} />
            <Route path="/admin/location-management" element={<LocationManagement />} />
            <Route path="/alerts" element={<AlertsNotifications />} />
            <Route path="/admin/alert-config" element={<AlertConfiguration />} />
            <Route path="/guide" element={<SystemGuide />} />
          </Routes>
        </main>

        <footer className="border-t bg-white py-6 mt-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Asset Tracker</span> - Medical Device Tracking Platform
              </div>
              <div className="flex items-center gap-4">
                <span>© 2026 Asset Tracker. All rights reserved.</span>
              </div>
            </div>
          </div>
        </footer>

        <Toaster />
      </div>
    </BrowserRouter>
  );
}