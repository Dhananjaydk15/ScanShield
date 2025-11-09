import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanResult } from '@/types/scan';

interface PortsChartProps {
  scanResult: ScanResult | null;
}

export function PortsChart({ scanResult }: PortsChartProps) {
  if (!scanResult) return null;

  // Count ports by state
  const stateCounts = scanResult.hosts.reduce((acc, host) => {
    host.protocols.forEach(protocol => {
      protocol.ports.forEach(port => {
        acc[port.state] = (acc[port.state] || 0) + 1;
      });
    });
    return acc;
  }, {} as Record<string, number>);

  const stateData = Object.entries(stateCounts).map(([state, count]) => ({
    name: state.charAt(0).toUpperCase() + state.slice(1),
    value: count
  }));

  // Count by risk level
  const riskCounts = scanResult.hosts.reduce((acc, host) => {
    host.protocols.forEach(protocol => {
      protocol.ports.forEach(port => {
        const risk = port.risk_level || 'INFO';
        acc[risk] = (acc[risk] || 0) + 1;
      });
    });
    return acc;
  }, {} as Record<string, number>);

  const riskData = Object.entries(riskCounts).map(([risk, count]) => ({
    name: risk,
    value: count
  }));

  const STATE_COLORS = {
    Open: 'hsl(var(--success))',
    Closed: 'hsl(var(--muted))',
    Filtered: 'hsl(var(--warning))'
  };

  const RISK_COLORS = {
    HIGH: 'hsl(var(--destructive))',
    MEDIUM: 'hsl(var(--warning))',
    LOW: 'hsl(var(--success))',
    INFO: 'hsl(var(--muted))'
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Port State Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATE_COLORS[entry.name as keyof typeof STATE_COLORS] || 'hsl(var(--muted))'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Risk Level Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS] || 'hsl(var(--muted))'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
