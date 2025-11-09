import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, ArrowLeft, Globe, Lock, Unlock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScannerModeSwitcher } from "@/components/shared/ScannerModeSwitcher";
import { ScanProgress } from "@/components/scan/ScanProgress";
import { Progress } from "@/components/ui/progress";

export default function HeadersScan() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanOpen, setScanOpen] = useState(false);

  const navigate = useNavigate();

  const handleScan = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setError(null);
    setResult(null);
    setScanOpen(true);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/scan/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: url }),
      });

      if (!response.ok) throw new Error("Failed to scan headers");

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while scanning headers");
    } finally {
      setLoading(false);
      setTimeout(() => setScanOpen(false), 1500);
    }
  };

  const getColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <ScannerModeSwitcher />
          </div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-400" />
            Security Headers Scanner
          </h1>
          <p className="text-muted-foreground text-lg">
            Scan ports and analyze HTTP security headers with real-time vulnerability scores.
          </p>
        </header>

        {/* Scan Form */}
        <Card className="bg-slate-800/60 backdrop-blur-md border-slate-700">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Globe className="text-blue-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Enter target (e.g., ivp.isea.in)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-slate-900/40 border-slate-700 text-white"
              />
              <Button onClick={handleScan} disabled={loading}>
                {loading ? "Scanning..." : "Start Scan"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="bg-red-950 border-red-800">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Scan Results */}
        {result && result.ports && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-300">
              Scan Report for {result.target}
            </h2>

            {Object.entries(result.ports).map(([port, details]: any) => (
              <Card
                key={port}
                className="bg-slate-800/70 border border-slate-700 hover:bg-slate-800 transition"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      {details.analysis.security_score === 100 ? (
                        <Lock className="text-green-400 h-5 w-5" />
                      ) : (
                        <Unlock className="text-red-400 h-5 w-5" />
                      )}
                      Port {port}
                    </h3>
                    <span className={`font-bold ${getColor(details.analysis.security_score)}`}>
                      Security Score: {details.analysis.security_score}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <Progress
                    value={details.analysis.security_score}
                    className="h-2 bg-slate-700"
                  />

                  {/* Headers Found */}
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-2">
                      Headers Found
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      {Object.entries(details.headers_found).map(([key, value]: any) => (
                        <div
                          key={key}
                          className="p-2 rounded-lg bg-slate-900/40 border border-slate-700"
                        >
                          <span className="block font-medium text-gray-300">
                            {key}
                          </span>
                          <span className="text-gray-400 break-words text-xs">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missing Headers */}
                  {details.analysis.missing_headers.length > 0 && (
                    <div>
                      <h4 className="text-red-400 font-semibold mb-2">
                        Missing Security Headers
                      </h4>
                      <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                        {details.analysis.missing_headers.map((h: string, idx: number) => (
                          <li key={idx}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Vulnerability Summary */}
                  <div className="text-sm text-muted-foreground">
                    Vulnerability Level:{" "}
                    <span className={getColor(100 - details.analysis.security_score)}>
                      {details.analysis.vulnerability_percentage}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Scan Progress Modal */}
      <ScanProgress
        open={scanOpen}
        onCancel={() => setScanOpen(false)}
        target={url || "Target"}
      />
    </main>
  );
}
