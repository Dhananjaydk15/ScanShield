import { Server, Activity, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScanResult } from '@/types/scan';

interface SummaryCardsProps {
  scanResult: ScanResult | null;
}

export function SummaryCards({ scanResult }: SummaryCardsProps) {
  const totalHosts = scanResult?.hosts.length || 0;
  const totalPorts = scanResult?.hosts.reduce((sum, host) => 
    sum + (host.total_open_ports || 0), 0
  ) || 0;
  
  const highRiskCount = scanResult?.hosts.reduce((sum, host) =>
    sum + host.protocols.reduce((pSum, protocol) =>
      pSum + protocol.ports.filter(p => p.risk_level === 'HIGH').length, 0
    ), 0
  ) || 0;

  const lastScanned = scanResult?.timestamp 
    ? new Date(scanResult.timestamp).toLocaleString()
    : 'Never';

  const cards = [
    {
      title: 'Total Hosts',
      value: totalHosts,
      icon: Server,
      description: 'Hosts scanned',
      color: 'text-primary'
    },
    {
      title: 'Open Ports',
      value: totalPorts,
      icon: Activity,
      description: 'Services detected',
      color: 'text-success'
    },
    {
      title: 'High Risk',
      value: highRiskCount,
      icon: AlertTriangle,
      description: 'Critical findings',
      color: 'text-destructive'
    },
    {
      title: 'Last Scan',
      value: lastScanned,
      icon: Clock,
      description: 'Most recent',
      color: 'text-muted-foreground',
      isTime: true
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="glass-card hover:glow-effect transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className={`text-2xl font-bold ${card.isTime ? 'text-sm' : ''} ${card.color}`}>
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
              <card.icon className={`h-8 w-8 ${card.color} opacity-50`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
