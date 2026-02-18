import { Link } from "react-router";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { mockReports } from "../../lib/data";
import { 
  MapPin, 
  Activity, 
  Clock, 
  Wrench, 
  CheckCircle, 
  FileText, 
  BarChart3, 
  Calendar, 
  PieChart 
} from "lucide-react";

const iconMap = {
  MapPin,
  Activity,
  Clock,
  Wrench,
  CheckCircle,
  FileText,
  BarChart3,
  Calendar,
  PieChart,
};

export function ReportsLibrary() {
  const categories = [
    'Location & History',
    'Maintenance & Compliance',
    'Utilization & Operational',
  ] as const;

  const recentReports = [
    {
      name: 'Fleet Status Summary',
      generatedDate: '2/16/2026',
      type: 'PDF',
    },
    {
      name: 'PM Compliance Report',
      generatedDate: '2/15/2026',
      type: 'Excel',
    },
    {
      name: 'Asset Activity Log',
      generatedDate: '2/14/2026',
      type: 'Excel',
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Reports</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold">Reports Library</h1>
        <p className="text-gray-600 mt-1">Generate and access standard and custom reports</p>
      </div>

      {/* Recently Generated */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Generated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentReports.map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-600">
                      Generated on {report.generatedDate} • {report.type}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Download</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Categories */}
      <Tabs defaultValue="Location & History" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockReports
                .filter((report) => report.category === category)
                .map((report) => {
                  const Icon = iconMap[report.icon as keyof typeof iconMap];
                  return (
                    <Card key={report.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon className="size-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{report.name}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                          {report.description}
                        </p>
                        <Button className="w-full" asChild>
                          <Link to={`/reports/${report.id}`}>Generate Report</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}