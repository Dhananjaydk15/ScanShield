export interface ScanRequest {
  target: string;
  port_range: string;
  quick_scan: boolean;
}

export interface Port {
  port: number;
  protocol: string;
  state: string;
  service: string;
  product?: string;
  version?: string;
  extrainfo?: string;
  conf?: string;
  cpe?: string;
  risk_level?: string;
  risk_data?: {
    description?: string;
    remediation?: string;
  };
  scripts?: {
    id: string;
    output: string;
  }[];
  parsed_headers?: Record<string, string>;
  security_headers_present?: {
    header: string;
    value: string;
    purpose: string;
  }[];
  security_headers_missing?: {
    header: string;
    purpose: string;
    recommended: string;
  }[];
}

export interface Protocol {
  protocol: string;
  ports: Port[];
}

export interface Host {
  host: string;
  hostname?: string;
  state?: string;
  ip?: string;
  protocols: Protocol[];
  total_open_ports?: number;
}

export interface ScanResult {
  hosts: Host[];
  timestamp?: string;
}

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
