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
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { mockAlertConfigs } from "../../lib/data";
import type { AlertConfig } from "../../lib/types";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

export function AlertConfiguration() {
  const [configs, setConfigs] = useState(mockAlertConfigs);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleEnabled = (id: string) => {
    setConfigs((prev) =>
      prev.map((config) =>
        config.id === id ? { ...config, enabled: !config.enabled } : config
      )
    );
  };

  const updateConfig = (id: string, updates: Partial<AlertConfig>) => {
    setConfigs((prev) =>
      prev.map((config) =>
        config.id === id ? { ...config, ...updates } : config
      )
    );
  };

  const addRecipient = (id: string, email: string) => {
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    const config = configs.find((c) => c.id === id);
    if (config && !config.recipients.includes(email)) {
      updateConfig(id, {
        recipients: [...config.recipients, email],
      });
    }
  };

  const removeRecipient = (id: string, email: string) => {
    const config = configs.find((c) => c.id === id);
    if (config) {
      updateConfig(id, {
        recipients: config.recipients.filter((r) => r !== email),
      });
    }
  };

  const handleSave = (id: string) => {
    toast.success("Alert configuration saved successfully");
    setEditingId(null);
  };

  const handleTest = (config: AlertConfig) => {
    toast.success(`Test alert sent to ${config.recipients.length} recipient(s)`);
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
            <BreadcrumbPage>Alert Configuration</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold">Alert Configuration</h1>
        <p className="text-gray-600 mt-1">Set up notification rules and recipients</p>
      </div>

      <div className="space-y-4">
        {configs.map((config) => {
          const isEditing = editingId === config.id;

          return (
            <Card key={config.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle>{config.type}</CardTitle>
                    {config.enabled ? (
                      <Badge variant="default">Enabled</Badge>
                    ) : (
                      <Badge variant="secondary">Disabled</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`toggle-${config.id}`} className="text-sm">
                        {config.enabled ? 'Enabled' : 'Disabled'}
                      </Label>
                      <Switch
                        id={`toggle-${config.id}`}
                        checked={config.enabled}
                        onCheckedChange={() => toggleEnabled(config.id)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>

              {config.enabled && (
                <CardContent className="space-y-6">
                  {/* Threshold/Timing */}
                  {config.threshold !== undefined && (
                    <div className="space-y-2">
                      <Label htmlFor={`threshold-${config.id}`}>
                        Threshold
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`threshold-${config.id}`}
                          type="number"
                          value={config.threshold}
                          onChange={(e) =>
                            updateConfig(config.id, {
                              threshold: parseInt(e.target.value),
                            })
                          }
                          className="w-32"
                        />
                        <span className="text-sm text-gray-600">
                          % battery remaining
                        </span>
                      </div>
                    </div>
                  )}

                  {config.daysBefore !== undefined && (
                    <div className="space-y-2">
                      <Label htmlFor={`days-${config.id}`}>
                        Alert Timing
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Send alert</span>
                        <Input
                          id={`days-${config.id}`}
                          type="number"
                          value={config.daysBefore}
                          onChange={(e) =>
                            updateConfig(config.id, {
                              daysBefore: parseInt(e.target.value),
                            })
                          }
                          className="w-24"
                        />
                        <span className="text-sm text-gray-600">days before due</span>
                      </div>
                    </div>
                  )}

                  {/* Recipients */}
                  <div className="space-y-2">
                    <Label>Recipients</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {config.recipients.map((email) => (
                        <Badge key={email} variant="secondary" className="gap-2">
                          {email}
                          <button
                            type="button"
                            onClick={() => removeRecipient(config.id, email)}
                            className="hover:text-red-600 cursor-pointer"
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id={`new-email-${config.id}`}
                        type="email"
                        placeholder="email@example.com"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            addRecipient(config.id, input.value);
                            input.value = '';
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById(
                            `new-email-${config.id}`
                          ) as HTMLInputElement;
                          if (input) {
                            addRecipient(config.id, input.value);
                            input.value = '';
                          }
                        }}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Frequency */}
                  <div className="space-y-2">
                    <Label htmlFor={`frequency-${config.id}`}>
                      Notification Frequency
                    </Label>
                    <Select
                      value={config.frequency}
                      onValueChange={(value: AlertConfig['frequency']) =>
                        updateConfig(config.id, { frequency: value })
                      }
                    >
                      <SelectTrigger id={`frequency-${config.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Once">Once</SelectItem>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      {config.frequency === 'Once' &&
                        'Send notification only once when condition is met'}
                      {config.frequency === 'Daily' &&
                        'Send daily reminder while condition persists'}
                      {config.frequency === 'Weekly' &&
                        'Send weekly reminder while condition persists'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button onClick={() => handleSave(config.id)}>
                      Save Configuration
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleTest(config)}
                    >
                      Send Test Alert
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
