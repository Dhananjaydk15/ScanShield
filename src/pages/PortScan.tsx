import { useState } from 'react';
import { ScanBuilder } from '@/components/scan/ScanBuilder';
import { ScanProgress } from '@/components/scan/ScanProgress';
import { SummaryCards } from '@/components/scan/SummaryCards';
import { HostCard } from '@/components/scan/HostCard';
import { HostDetailView } from '@/components/scan/HostDetailView';
import { PortsChart } from '@/components/scan/PortsChart';
import { startScan, mockScanResult } from '@/lib/api';
import { ScanResult, Host } from '@/types/scan';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PortScan = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [currentTarget, setCurrentTarget] = useState('');

  const handleStartScan = async (target: string, portRange: string, quickScan: boolean) => {
    setIsScanning(true);
    setScanProgress(true);
    setCurrentTarget(target);
    setScanResult(null);
    setSelectedHost(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const result = await startScan(
        { target, port_range: portRange, quick_scan: quickScan }
      ).catch(() => {
        console.log('API unavailable, using mock data');
        return mockScanResult;
      });

      setScanResult(result);
      toast({
        title: "Scan Complete",
        description: `Found ${result.hosts.length} host(s) with open ports`,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Scan cancelled') {
        toast({
          title: "Scan Cancelled",
          description: "The scan was cancelled by user",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Scan Failed",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
      }
    } finally {
      setIsScanning(false);
      setScanProgress(false);
    }
  };

  const handleCancelScan = () => {
    setIsScanning(false);
    setScanProgress(false);
    toast({
      title: "Scan Cancelled",
      description: "The scan was cancelled",
    });
  };

  if (selectedHost) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <HostDetailView
            host={selectedHost}
            onBack={() => setSelectedHost(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold tracking-tight">
            Port Scanner
          </h1>
          <p className="text-muted-foreground text-lg">
            Identify open ports, detect vulnerabilities, and secure your infrastructure
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ScanBuilder
              onStartScan={handleStartScan}
              isScanning={isScanning}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {scanResult ? (
              <>
                <SummaryCards scanResult={scanResult} />
                <PortsChart scanResult={scanResult} />
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Scan Results</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {scanResult.hosts.map((host, index) => (
                      <HostCard
                        key={index}
                        host={host}
                        onClick={() => setSelectedHost(host)}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-96 glass-card rounded-lg">
                <div className="text-center space-y-3">
                  <div className="text-6xl">🔒</div>
                  <h3 className="text-xl font-semibold">No Scan Results</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Configure your scan parameters and click "Start Scan" to begin analyzing your target
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ScanProgress
        open={scanProgress}
        onCancel={handleCancelScan}
        target={currentTarget}
      />
    </div>
  );
};

export default PortScan;
