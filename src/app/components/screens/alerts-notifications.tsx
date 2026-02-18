import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { mockAlerts, mockAssets } from "../../lib/data";
import type { Alert } from "../../lib/types";
import { 
  Battery, 
  Wrench, 
  AlertTriangle, 
  Clock,
  CheckCircle 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function AlertsNotifications() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("unread");

  const filteredAlerts = alerts.filter((alert) => {
    const typeMatch = typeFilter === "all" || alert.type === typeFilter;
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "unread" && !alert.isRead) ||
      (statusFilter === "read" && alert.isRead);
    return typeMatch && statusMatch;
  });

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    );
  };

  const markAllAsRead = () => {
    setAlerts((prev) =>
      prev.map((alert) => ({ ...alert, isRead: true }))
    );
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const getAlertIcon = (type: Alert['type']) => {
    const iconMap = {
      'Low Battery': Battery,
      'PM Due': Wrench,
      'PM Overdue': Wrench,
      'Lost/Problem': AlertTriangle,
      'Not Returned': Clock,
      'Config Error': AlertTriangle,
    };
    return iconMap[type] || AlertTriangle;
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    const colors = {
      critical: 'border-l-red-500 bg-red-50',
      warning: 'border-l-yellow-500 bg-yellow-50',
      info: 'border-l-blue-500 bg-blue-50',
    };
    return colors[severity];
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
            <BreadcrumbPage>Alerts & Notifications</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
          <p className="text-gray-600 mt-1">View and manage all system alerts</p>
        </div>
        <Button onClick={markAllAsRead} variant="outline">
          Mark All as Read
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Alert Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Low Battery">Low Battery</SelectItem>
                <SelectItem value="PM Due">PM Due</SelectItem>
                <SelectItem value="PM Overdue">PM Overdue</SelectItem>
                <SelectItem value="Lost/Problem">Lost/Problem</SelectItem>
                <SelectItem value="Not Returned">Not Returned</SelectItem>
                <SelectItem value="Config Error">Config Error</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1" />

            <Badge variant="secondary" className="self-center">
              {filteredAlerts.filter((a) => !a.isRead).length} Unread
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <CheckCircle className="size-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No active alerts</h3>
              <p className="text-gray-600">Your assets are in good shape!</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            const asset = mockAssets.find(
              (a) => a.serialNumber === alert.assetSerialNumber
            );

            return (
              <Card
                key={alert.id}
                className={`border-l-4 ${getSeverityColor(alert.severity)} ${
                  !alert.isRead ? 'shadow-md' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        alert.severity === 'critical'
                          ? 'bg-red-100'
                          : alert.severity === 'warning'
                          ? 'bg-yellow-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      <Icon
                        className={`size-6 ${
                          alert.severity === 'critical'
                            ? 'text-red-600'
                            : alert.severity === 'warning'
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            {alert.title}
                          </h3>
                          <p className="text-gray-700">{alert.description}</p>
                        </div>
                        {!alert.isRead && (
                          <Badge variant="default" className="flex-shrink-0">
                            New
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <strong>Serial:</strong> {alert.assetSerialNumber}
                        </span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                        </span>
                        <span>•</span>
                        <Badge
                          variant={
                            alert.severity === 'critical'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        {asset && (
                          <Button size="sm" asChild>
                            <Link to={`/track/${asset.id}`}>View Asset</Link>
                          </Button>
                        )}
                        {!alert.isRead && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(alert.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => dismissAlert(alert.id)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}