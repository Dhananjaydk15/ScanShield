import { useState } from 'react';
import { Shield, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface ScanBuilderProps {
  onStartScan: (target: string, portRange: string, quickScan: boolean) => void;
  isScanning: boolean;
}

const PRESET_PORTS = {
  common: '21-23,25,53,80,110,143,443,445,3306,3389,5432,8080',
  all: '1-65535',
  web: '80,443,8080,8443,3000,5000',
  database: '1433,3306,5432,5984,6379,9200,27017',
  remote: '22,23,3389,5900,5901'
};

export function ScanBuilder({ onStartScan, isScanning }: ScanBuilderProps) {
  const [target, setTarget] = useState('');
  const [portRange, setPortRange] = useState(PRESET_PORTS.common);
  const [quickScan, setQuickScan] = useState(true);

  const validateTarget = (value: string): boolean => {
    // Basic hostname/IP validation
    const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return hostnameRegex.test(value) || ipRegex.test(value);
  };

  const validatePortRange = (value: string): boolean => {
    // Validate port syntax: single ports, ranges, or comma-separated
    const portRegex = /^(\d+(-\d+)?)(,\d+(-\d+)?)*$/;
    return portRegex.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateTarget(target)) {
      toast({
        title: "Invalid Target",
        description: "Please enter a valid hostname or IP address",
        variant: "destructive"
      });
      return;
    }

    if (!validatePortRange(portRange)) {
      toast({
        title: "Invalid Port Range",
        description: "Please enter valid port numbers (e.g., 80,443 or 1-1000)",
        variant: "destructive"
      });
      return;
    }

    onStartScan(target, portRange, quickScan);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Shield className="h-6 w-6 text-primary" />
          Port Scanner
        </CardTitle>
        <CardDescription>
          Scan network ports to identify open services and potential vulnerabilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="target">Target Host</Label>
            <Input
              id="target"
              placeholder="example.com or 192.168.1.1"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={isScanning}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-4">
            <Label>Port Range</Label>
            <Tabs defaultValue="common" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-secondary">
                <TabsTrigger value="common" onClick={() => setPortRange(PRESET_PORTS.common)}>
                  Common
                </TabsTrigger>
                <TabsTrigger value="web" onClick={() => setPortRange(PRESET_PORTS.web)}>
                  Web
                </TabsTrigger>
                <TabsTrigger value="database" onClick={() => setPortRange(PRESET_PORTS.database)}>
                  Database
                </TabsTrigger>
                <TabsTrigger value="remote" onClick={() => setPortRange(PRESET_PORTS.remote)}>
                  Remote
                </TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
              <TabsContent value="common" className="space-y-2">
                <Input
                  value={portRange}
                  onChange={(e) => setPortRange(e.target.value)}
                  disabled={isScanning}
                  className="bg-input"
                />
              </TabsContent>
              <TabsContent value="web" className="space-y-2">
                <Input
                  value={portRange}
                  onChange={(e) => setPortRange(e.target.value)}
                  disabled={isScanning}
                  className="bg-input"
                />
              </TabsContent>
              <TabsContent value="database" className="space-y-2">
                <Input
                  value={portRange}
                  onChange={(e) => setPortRange(e.target.value)}
                  disabled={isScanning}
                  className="bg-input"
                />
              </TabsContent>
              <TabsContent value="remote" className="space-y-2">
                <Input
                  value={portRange}
                  onChange={(e) => setPortRange(e.target.value)}
                  disabled={isScanning}
                  className="bg-input"
                />
              </TabsContent>
              <TabsContent value="custom" className="space-y-2">
                <Input
                  placeholder="e.g., 80,443,8080 or 1-1000"
                  value={portRange}
                  onChange={(e) => setPortRange(e.target.value)}
                  disabled={isScanning}
                  className="bg-input"
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={quickScan ? "default" : "outline"}
                size="sm"
                onClick={() => setQuickScan(true)}
                disabled={isScanning}
              >
                <Zap className="h-4 w-4 mr-2" />
                Quick Scan
              </Button>
              <Button
                type="button"
                variant={!quickScan ? "default" : "outline"}
                size="sm"
                onClick={() => setQuickScan(false)}
                disabled={isScanning}
              >
                <Settings className="h-4 w-4 mr-2" />
                Full Scan
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full glow-effect"
            size="lg"
            disabled={isScanning || !target}
          >
            {isScanning ? (
              <>
                <span className="animate-pulse">Scanning...</span>
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                Start Scan
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
