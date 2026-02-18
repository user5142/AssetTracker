import { cn } from "./ui/utils";
import { 
  CheckCircle, 
  Home, 
  Truck, 
  Wrench, 
  AlertTriangle,
  type LucideIcon 
} from "lucide-react";
import type { AssetStatus, PMStatus } from "../lib/types";

interface StatusBadgeProps {
  status: AssetStatus;
  className?: string;
}

const statusConfig: Record<AssetStatus, { 
  color: string; 
  bgColor: string; 
  Icon: LucideIcon;
}> = {
  'At Facility': {
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    Icon: CheckCircle,
  },
  'At Pharmacy': {
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    Icon: Home,
  },
  'In Transit': {
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    Icon: Truck,
  },
  'At PM': {
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    Icon: Wrench,
  },
  'Lost/Problem': {
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    Icon: AlertTriangle,
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.Icon;
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
        config.color,
        config.bgColor,
        className
      )}
    >
      <Icon className="size-4" />
      {status}
    </span>
  );
}

interface PMStatusBadgeProps {
  status: PMStatus;
  className?: string;
}

const pmStatusConfig: Record<PMStatus, {
  color: string;
  bgColor: string;
  label: string;
}> = {
  'Current': {
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    label: 'Current',
  },
  'Due Soon': {
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    label: 'Due Soon',
  },
  'Overdue': {
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    label: 'Overdue',
  },
};

export function PMStatusBadge({ status, className }: PMStatusBadgeProps) {
  const config = pmStatusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        config.color,
        config.bgColor,
        className
      )}
    >
      {config.label}
    </span>
  );
}

interface BatteryIndicatorProps {
  percent: number;
  className?: string;
}

export function BatteryIndicator({ percent, className }: BatteryIndicatorProps) {
  const getColor = () => {
    if (percent > 50) return 'text-green-600';
    if (percent > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative w-8 h-4 border-2 border-current rounded-sm">
        <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-1 h-2 bg-current rounded-r" />
        <div
          className={cn("h-full bg-current", getColor())}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className={cn("text-sm font-medium", getColor())}>
        {percent}%
      </span>
    </div>
  );
}

interface SignalStrengthProps {
  strength: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  className?: string;
}

export function SignalStrength({ strength, className }: SignalStrengthProps) {
  const bars = {
    'Excellent': 4,
    'Good': 3,
    'Fair': 2,
    'Poor': 1,
  }[strength];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-end gap-0.5 h-4">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={cn(
              "w-1 rounded-sm",
              bar <= bars ? "bg-green-600" : "bg-gray-300"
            )}
            style={{ height: `${bar * 25}%` }}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600">{strength}</span>
    </div>
  );
}
