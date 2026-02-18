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
        
        <main className="flex-1 flex flex-col min-h-0">
          <Routes>
            <Route path="/" element={<div className="flex flex-1 min-h-0 w-full"><Dashboard /></div>} />
            <Route path="/track" element={<div className="container mx-auto px-6 py-8"><TrackPumps /></div>} />
            <Route path="/track/:id" element={<div className="container mx-auto px-6 py-8"><PumpDetail /></div>} />
            <Route path="/map" element={<div className="container mx-auto px-6 py-8"><MapView /></div>} />
            <Route path="/reports" element={<div className="container mx-auto px-6 py-8"><ReportsLibrary /></div>} />
            <Route path="/reports/:reportId" element={<div className="container mx-auto px-6 py-8"><ReportParameters /></div>} />
            <Route path="/assign" element={<div className="container mx-auto px-6 py-8"><AssignAsset /></div>} />
            <Route path="/admin/tracker-config" element={<div className="container mx-auto px-6 py-8"><TrackerConfiguration /></div>} />
            <Route path="/admin/location-management" element={<div className="container mx-auto px-6 py-8"><LocationManagement /></div>} />
            <Route path="/alerts" element={<div className="container mx-auto px-6 py-8"><AlertsNotifications /></div>} />
            <Route path="/admin/alert-config" element={<div className="container mx-auto px-6 py-8"><AlertConfiguration /></div>} />
            <Route path="/guide" element={<div className="container mx-auto px-6 py-8"><SystemGuide /></div>} />
          </Routes>
        </main>

        <footer className="border-t bg-white py-6 mt-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
              <div>
                <span className="font-semibold">AssetTracker</span> - Medical Device Tracking Platform
              </div>
              <div className="flex items-center gap-4">
                <span>© 2026 AssetTracker. All rights reserved.</span>
              </div>
            </div>
          </div>
        </footer>

        <Toaster />
      </div>
    </BrowserRouter>
  );
}