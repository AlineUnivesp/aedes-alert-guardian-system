
import { useEffect, useRef, useState } from "react";
import { Report } from "@/contexts/ReportContext";
import { Card } from "@/components/ui/card";
import ReportDetail from "./ReportDetail";
import { Loader2 } from "lucide-react";

// Using Leaflet for map functionality
// We need to add Leaflet dependencies
interface MapViewProps {
  reports: Report[];
}

declare global {
  interface Window {
    L: any;
  }
}

const MapView = ({ reports }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Load Leaflet scripts dynamically
  useEffect(() => {
    if (isScriptLoaded) return;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
      });
    };

    const loadStylesheet = (href: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => resolve();
        link.onerror = (e) => reject(e);
        document.head.appendChild(link);
      });
    };

    const loadResources = async () => {
      try {
        // Load CSS first
        await loadStylesheet('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        // Then load JS
        await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
        setIsScriptLoaded(true);
      } catch (error) {
        console.error("Failed to load Leaflet resources", error);
      }
    };

    loadResources();
  }, [isScriptLoaded]);

  // Initialize map once Leaflet is loaded
  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current || leafletMapRef.current) return;

    // Center around São Paulo by default if no reports
    const defaultCenter = [-23.5505, -46.6333];
    const defaultZoom = 10;
    
    try {
      const L = window.L;
      
      // Create map
      const map = L.map(mapRef.current).setView(defaultCenter, defaultZoom);
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Store map reference
      leafletMapRef.current = map;
      setIsLoaded(true);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [isScriptLoaded]);

  // Add markers for reports
  useEffect(() => {
    if (!isLoaded || !leafletMapRef.current) return;

    const L = window.L;
    const map = leafletMapRef.current;
    
    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    if (reports.length === 0) return;

    // Add markers for each report
    const markers = reports.map(report => {
      const marker = L.marker([report.location.latitude, report.location.longitude])
        .addTo(map)
        .bindPopup(`<b>${report.title}</b><br>${report.location.address}`);
        
      marker.on('click', () => {
        setSelectedReport(report);
        setIsDetailOpen(true);
      });
        
      return marker;
    });

    // Create bounds to fit all markers
    const bounds = L.featureGroup(markers).getBounds();
    
    // Only adjust view if we have markers and bounds are valid
    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });
    }
  }, [reports, isLoaded]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <Card className="absolute inset-0 overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Loading map...</p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </Card>
      
      <ReportDetail
        report={selectedReport}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

export default MapView;
