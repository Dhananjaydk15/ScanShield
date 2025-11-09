import { useEffect, useState } from 'react';
import { X, Activity } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ScanProgressProps {
  open: boolean;
  onCancel: () => void;
  target: string;
}

export function ScanProgress({ open, onCancel, target }: ScanProgressProps) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      setElapsed(0);
      setLogs([]);
      return;
    }

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    // Track elapsed time
    const timeInterval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    // Simulate logs
    const logMessages = [
      `Initiating scan on ${target}...`,
      'Resolving hostname...',
      'Establishing connection...',
      'Probing ports...',
      'Analyzing services...',
      'Detecting vulnerabilities...',
      'Generating report...'
    ];

    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < logMessages.length) {
        setLogs((prev) => [...prev, logMessages[logIndex]]);
        logIndex++;
      }
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
      clearInterval(logInterval);
    };
  }, [open, target]);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="glass-card sm:max-w-[500px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            Scanning {target}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Elapsed Time</span>
            <span className="text-foreground font-mono">{elapsed}s</span>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Activity Log</div>
            <div className="bg-background/50 border border-border rounded-lg p-3 h-40 overflow-y-auto font-mono text-xs space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="text-foreground/80">
                  <span className="text-primary">[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel Scan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
