import { useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Host, Port } from '@/types/scan';
import { RiskBadge } from './RiskBadge';
import { PortDetailsDialog } from './PortDetailsDialog';
import { toast } from '@/hooks/use-toast';

interface HostDetailViewProps {
  host: Host;
  onBack: () => void;
}

export function HostDetailView({ host, onBack }: HostDetailViewProps) {
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const allPorts = host.protocols.flatMap(p => 
    p.ports.map(port => ({ ...port, protocol: p.protocol }))
  );

  const handleExport = () => {
    const csv = [
      ['Port', 'Protocol', 'Service', 'Product', 'Version', 'State', 'Risk Level'].join(','),
      ...allPorts.map(port => [
        port.port,
        port.protocol,
        port.service || '',
        port.product || '',
        port.version || '',
        port.state,
        port.risk_level || 'INFO'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${host.hostname || host.host}_ports.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Port data exported to CSV",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Results
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl">
            {host.hostname || host.host}
          </CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground">
            {host.ip && <span>IP: {host.ip}</span>}
            <span>State: {host.state || 'up'}</span>
            <span>Open Ports: {host.total_open_ports || 0}</span>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Port</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allPorts.map((port, index) => (
                <TableRow 
                  key={`${port.port}-${index}`}
                  className="hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedPort(port);
                    setDetailsOpen(true);
                  }}
                >
                  <TableCell className="font-mono font-medium">{port.port}</TableCell>
                  <TableCell className="uppercase text-xs">{port.protocol}</TableCell>
                  <TableCell>{port.service || '-'}</TableCell>
                  <TableCell>{port.product || '-'}</TableCell>
                  <TableCell className="text-sm">{port.version || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      port.state === 'open' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                    }`}>
                      {port.state}
                    </span>
                  </TableCell>
                  <TableCell>
                    {port.risk_level && <RiskBadge level={port.risk_level as any} />}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPort(port);
                        setDetailsOpen(true);
                      }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PortDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        port={selectedPort}
        hostIp={host.ip || host.host}
      />
    </div>
  );
}
