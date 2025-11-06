import { Copy, ExternalLink, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Port } from '@/types/scan';
import { RiskBadge } from './RiskBadge';

interface PortDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  port: Port | null;
  hostIp: string;
}

export function PortDetailsDialog({ open, onOpenChange, port, hostIp }: PortDetailsDialogProps) {
  if (!port) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const isHttpService = port.service?.toLowerCase().includes('http');
  const url = `${port.service === 'https' ? 'https' : 'http'}://${hostIp}:${port.port}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-6 w-6 text-primary" />
            Port {port.port} Details
          </DialogTitle>
          <DialogDescription>
            {port.service} service on {port.protocol}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Service</div>
              <div className="font-medium">{port.service || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">State</div>
              <Badge variant={port.state === 'open' ? 'default' : 'secondary'}>
                {port.state}
              </Badge>
            </div>
            {port.product && (
              <div>
                <div className="text-sm text-muted-foreground">Product</div>
                <div className="font-medium">{port.product}</div>
              </div>
            )}
            {port.version && (
              <div>
                <div className="text-sm text-muted-foreground">Version</div>
                <div className="font-medium">{port.version}</div>
              </div>
            )}
          </div>

          {/* Risk Info */}
          {port.risk_level && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Risk Assessment</h3>
                  <RiskBadge level={port.risk_level as any} />
                </div>
                {port.risk_data?.description && (
                  <div>
                    <div className="text-sm text-muted-foreground">Description</div>
                    <p className="text-sm mt-1">{port.risk_data.description}</p>
                  </div>
                )}
                {port.risk_data?.remediation && (
                  <div className="bg-muted/30 border border-border rounded-lg p-4">
                    <div className="text-sm font-medium text-primary mb-2">Remediation</div>
                    <p className="text-sm">{port.risk_data.remediation}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => copyToClipboard(port.risk_data!.remediation!, 'Remediation')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Remediation
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Headers */}
          {port.parsed_headers && Object.keys(port.parsed_headers).length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">HTTP Headers</h3>
                <div className="bg-background/50 border border-border rounded-lg p-4 space-y-2 font-mono text-xs">
                  {Object.entries(port.parsed_headers).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="text-primary font-semibold">{key}:</span>
                      <span className="text-foreground/80">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Present Security Headers */}
          {port.security_headers_present && port.security_headers_present.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-success">Security Headers Present</h3>
                <div className="space-y-3">
                  {port.security_headers_present.map((header, idx) => (
                    <div key={idx} className="bg-success/10 border border-success/30 rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-success">{header.header}</span>
                          <Badge variant="outline" className="border-success/50 text-success">
                            {header.purpose}
                          </Badge>
                        </div>
                        <div className="bg-background/50 border border-border rounded p-2">
                          <code className="text-xs break-all">{header.value}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Missing Security Headers - Vulnerabilities */}
          {port.security_headers_missing && port.security_headers_missing.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-danger">Security Header Vulnerabilities</h3>
                <div className="space-y-3">
                  {port.security_headers_missing.map((header, idx) => (
                    <div key={idx} className="bg-danger/10 border border-danger/30 rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-danger">{header.header}</span>
                          <Badge variant="outline" className="border-danger/50 text-danger">
                            Missing
                          </Badge>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Security Impact</div>
                          <p className="text-sm">{header.purpose}</p>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Recommended Value</div>
                          <div className="bg-background/50 border border-border rounded p-2 flex items-center justify-between gap-2">
                            <code className="text-xs break-all flex-1">{header.recommended}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`${header.header}: ${header.recommended}`, 'Header configuration')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Scripts Output */}
          {port.scripts && port.scripts.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Script Output</h3>
                {port.scripts.map((script, i) => (
                  <div key={i} className="space-y-2">
                    <div className="text-sm text-muted-foreground">{script.id}</div>
                    <div className="bg-background/50 border border-border rounded-lg p-4">
                      <pre className="text-xs whitespace-pre-wrap font-mono">{script.output}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Actions */}
          <Separator />
          <div className="flex gap-2">
            {isHttpService && (
              <Button
                variant="outline"
                onClick={() => window.open(url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Browser
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => copyToClipboard(`curl -I ${url}`, 'Curl command')}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Curl Command
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
