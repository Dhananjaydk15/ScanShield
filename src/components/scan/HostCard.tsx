import { Server, Globe, Activity, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Host, RiskLevel } from '@/types/scan';
import { RiskBadge } from './RiskBadge';

interface HostCardProps {
  host: Host;
  onClick: () => void;
}

export function HostCard({ host, onClick }: HostCardProps) {
  const openPorts = host.total_open_ports || 0;
  const protocols = [...new Set(host.protocols.map(p => p.protocol))];
  
  // Get top 3 high-risk ports
  const highRiskPorts = host.protocols
    .flatMap(p => p.ports)
    .filter(p => p.risk_level === 'HIGH')
    .slice(0, 3);

  return (
    <Card className="glass-card hover:glow-effect transition-all duration-300 cursor-pointer group" onClick={onClick}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{host.hostname || host.host}</h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {host.ip && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    {host.ip}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  {host.state || 'up'}
                </div>
              </div>
            </div>
            <Badge variant={host.state === 'up' ? 'default' : 'secondary'}>
              {host.state || 'up'}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {protocols.map(proto => (
              <Badge key={proto} variant="outline" className="text-xs">
                {proto.toUpperCase()}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Open Ports: </span>
              <span className="font-semibold text-primary">{openPorts}</span>
            </div>
            {highRiskPorts.length > 0 && (
              <RiskBadge level="HIGH" />
            )}
          </div>

          {highRiskPorts.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">High Risk Ports:</div>
              <div className="flex gap-2">
                {highRiskPorts.map(port => (
                  <Badge key={port.port} variant="outline" className="text-xs">
                    {port.port}/{port.service}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button variant="ghost" className="w-full group-hover:bg-primary/10 transition-colors">
            View Details
            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
