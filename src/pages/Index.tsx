import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Network, Shield, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4 py-12">
          <h1 className="text-5xl font-bold tracking-tight">
            Network Security Scanner BY DK
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Comprehensive security analysis tools to identify vulnerabilities and secure your infrastructure
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-card border-accent/20 hover:border-accent/40 transition-all cursor-pointer group" onClick={() => navigate('/port-scan')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Network className="h-12 w-12 text-accent" />
                <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <CardTitle className="text-2xl mt-4">Port Scanner</CardTitle>
              <CardDescription className="text-base">
                Identify open ports, detect services, and analyze network vulnerabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Quick and full scan modes</li>
                <li>• Service detection and versioning</li>
                <li>• Risk assessment and remediation</li>
                <li>• Port distribution visualization</li>
              </ul>
              <Button className="w-full mt-6" onClick={() => navigate('/port-scan')}>
                Start Port Scan
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-accent/20 hover:border-accent/40 transition-all cursor-pointer group" onClick={() => navigate('/headers-scan')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Shield className="h-12 w-12 text-accent" />
                <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <CardTitle className="text-2xl mt-4">Security Headers Scanner</CardTitle>
              <CardDescription className="text-base">
                Analyze HTTP security headers and get recommendations to improve web security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Security header detection</li>
                <li>• Missing header identification</li>
                <li>• Security score assessment</li>
                <li>• Copy-paste remediation values</li>
              </ul>
              <Button className="w-full mt-6" onClick={() => navigate('/headers-scan')}>
                Start Headers Scan
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="glass-card p-8 text-center space-y-4 border-accent/10">
          <h2 className="text-2xl font-semibold">Why Use Security Scanners?</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Regular security scanning helps identify vulnerabilities before attackers do. Our tools provide 
            actionable insights and remediation guidance to keep your infrastructure secure and compliant 
            with industry best practices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
