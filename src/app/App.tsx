import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { Header } from "./components/header";
import { AppSidebar } from "./components/app-sidebar";
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

const PageContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto px-6 py-8">{children}</div>
);

export default function App() {
  const unreadAlertCount = mockAlerts.filter(a => !a.isRead).length;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header unreadAlertCount={unreadAlertCount} />

        {/* Full-height row: sidebar + content (sidebar extends to bottom of page) */}
        <div className="flex flex-1 min-h-0 w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-h-0 min-w-0">
            <main className="flex-1 min-h-0 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/track" element={<PageContainer><TrackPumps /></PageContainer>} />
                <Route path="/track/:id" element={<PageContainer><PumpDetail /></PageContainer>} />
                <Route path="/map" element={<PageContainer><MapView /></PageContainer>} />
                <Route path="/reports" element={<PageContainer><ReportsLibrary /></PageContainer>} />
                <Route path="/reports/:reportId" element={<PageContainer><ReportParameters /></PageContainer>} />
                <Route path="/assign" element={<PageContainer><AssignAsset /></PageContainer>} />
                <Route path="/admin/tracker-config" element={<PageContainer><TrackerConfiguration /></PageContainer>} />
                <Route path="/admin/location-management" element={<PageContainer><LocationManagement /></PageContainer>} />
                <Route path="/alerts" element={<PageContainer><AlertsNotifications /></PageContainer>} />
                <Route path="/admin/alert-config" element={<PageContainer><AlertConfiguration /></PageContainer>} />
                <Route path="/guide" element={<PageContainer><SystemGuide /></PageContainer>} />
              </Routes>
            </main>
            <footer className="border-t bg-white py-6 shrink-0">
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
          </div>
        </div>

        <Toaster />
      </div>
    </BrowserRouter>
  );
}