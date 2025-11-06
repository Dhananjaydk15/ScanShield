import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";

export const ScannerModeSwitcher = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isPortScan = location.pathname.includes("port-scan");
  const isHeaderScan = location.pathname.includes("headers-scan");

  return (
    <div className="flex gap-3 items-center border p-2 rounded-xl bg-background/40 backdrop-blur-md shadow-sm">
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        <Radio className="h-4 w-4 text-blue-500" />
        Mode:
      </span>
      <Button
        variant={isPortScan ? "default" : "outline"}
        size="sm"
        onClick={() => navigate("/port-scan")}
      >
        Port Scanner
      </Button>
      <Button
        variant={isHeaderScan ? "default" : "outline"}
        size="sm"
        onClick={() => navigate("/headers-scan")}
      >
        Headers Scanner
      </Button>
    </div>
  );
};
