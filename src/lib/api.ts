import { ScanRequest, ScanResult } from '@/types/scan';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export async function startScan(
  body: ScanRequest,
  signal?: AbortSignal
): Promise<ScanResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/scan_ports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });

    if (!res.ok) {
      throw new Error(`Scan API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Scan cancelled');
    }
    throw error;
  }
}

// Mock data for development when API is unavailable
export const mockScanResult: ScanResult = {
  hosts: [
    {
      host: "ivp.isea.in",
      hostname: "ivp.isea.in",
      state: "up",
      ip: "103.225.176.149",
      total_open_ports: 3,
      protocols: [
        {
          protocol: "tcp",
          ports: [
            {
              port: 80,
              protocol: "tcp",
              state: "open",
              service: "http",
              product: "nginx",
              version: "1.18.0",
              extrainfo: "(Ubuntu)",
              conf: "10",
              cpe: "cpe:/a:igor_sysoev:nginx:1.18.0",
              risk_level: "MEDIUM",
              risk_data: {
                description: "Unencrypted HTTP service detected",
                remediation: "Implement HTTPS with TLS 1.2+ and redirect HTTP to HTTPS"
              },
              scripts: [
                {
                  id: "http-headers",
                  output: "HTTP/1.1 301 Moved Permanently\\nServer: nginx/1.18.0 (Ubuntu)\\nDate: Sun, 19 Jan 2025 13:42:39 GMT"
                }
              ],
              parsed_headers: {
                "Server": "nginx/1.18.0 (Ubuntu)",
                "Date": "Sun, 19 Jan 2025 13:42:39 GMT",
                "Content-Type": "text/html"
              },
              security_headers_present: [
                {
                  header: "X-Frame-Options",
                  value: "SAMEORIGIN",
                  purpose: "Prevents clickjacking"
                }
              ],
              security_headers_missing: [
                {
                  header: "Strict-Transport-Security",
                  purpose: "Forces HTTPS",
                  recommended: "max-age=63072000; includeSubDomains"
                },
                {
                  header: "Content-Security-Policy",
                  purpose: "Prevents XSS",
                  recommended: "default-src 'self'"
                },
                {
                  header: "X-Content-Type-Options",
                  purpose: "Stops MIME sniffing",
                  recommended: "nosniff"
                }
              ]
            },
            {
              port: 443,
              protocol: "tcp",
              state: "open",
              service: "https",
              product: "nginx",
              version: "1.18.0",
              risk_level: "LOW",
              risk_data: {
                description: "HTTPS service with valid certificate",
                remediation: "Ensure TLS 1.2+ only and strong cipher suites"
              },
              security_headers_present: [
                {
                  header: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                  purpose: "Forces HTTPS"
                },
                {
                  header: "X-Frame-Options",
                  value: "DENY",
                  purpose: "Prevents clickjacking"
                }
              ],
              security_headers_missing: [
                {
                  header: "Content-Security-Policy",
                  purpose: "Prevents XSS",
                  recommended: "default-src 'self'; script-src 'self'"
                },
                {
                  header: "Permissions-Policy",
                  purpose: "Controls features",
                  recommended: "camera=(), microphone=(), geolocation=()"
                }
              ]
            },
            {
              port: 3306,
              protocol: "tcp",
              state: "open",
              service: "mysql",
              product: "MySQL",
              version: "8.0.35",
              risk_level: "HIGH",
              risk_data: {
                description: "Database service exposed to internet",
                remediation: "Restrict access with firewall rules, use VPN, enable authentication"
              }
            }
          ]
        }
      ]
    }
  ],
  timestamp: new Date().toISOString()
};
