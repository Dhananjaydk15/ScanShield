import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RiskLevel } from '@/types/scan';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const config = {
    HIGH: {
      icon: AlertTriangle,
      className: 'risk-badge-high',
      label: 'High Risk'
    },
    MEDIUM: {
      icon: AlertCircle,
      className: 'risk-badge-medium',
      label: 'Medium Risk'
    },
    LOW: {
      icon: CheckCircle,
      className: 'risk-badge-low',
      label: 'Low Risk'
    },
    INFO: {
      icon: Info,
      className: 'risk-badge-info',
      label: 'Info'
    }
  };

  const { icon: Icon, className: badgeClass, label } = config[level];

  return (
    <Badge className={`${badgeClass} ${className} flex items-center gap-1 px-2 py-1`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
