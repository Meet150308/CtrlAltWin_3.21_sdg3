import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useAirQualityList } from "@/hooks/use-air-quality";
import L from "leaflet";
import { Loader2 } from "lucide-react";

// Fix Leaflet icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function getMarkerColor(aqi: number) {
  if (aqi <= 50) return "#22c55e"; // Green
  if (aqi <= 100) return "#eab308"; // Yellow
  if (aqi <= 150) return "#f97316"; // Orange
  if (aqi <= 200) return "#ef4444"; // Red
  if (aqi <= 300) return "#a855f7"; // Purple
  return "#7f1d1d"; // Maroon
}

function CustomMarker({ reading }: { reading: any }) {
  const color = getMarkerColor(reading.aqi);
  
  const customIcon = L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="background-color: ${color}" class="marker-pin"></div>
      <div class="marker-value" style="color: ${color}">${reading.aqi}</div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });

  return (
    <Marker position={[reading.lat, reading.lng]} icon={customIcon}>
      <Popup className="rounded-xl overflow-hidden shadow-xl border-none p-0">
        <div className="p-4 min-w-[200px]">
          <h3 className="font-bold text-lg mb-1">{reading.locationName}</h3>
          <div className="flex items-center gap-2 mb-3">
            <span 
              className="text-white text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: color }}
            >
              AQI {reading.aqi}
            </span>
            <span className="text-muted-foreground text-xs">Updated just now</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-secondary/50 p-2 rounded-lg">
              <span className="block text-xs text-muted-foreground">PM2.5</span>
              <span className="font-mono font-semibold">{reading.pm25}</span>
            </div>
            <div className="bg-secondary/50 p-2 rounded-lg">
              <span className="block text-xs text-muted-foreground">PM10</span>
              <span className="font-mono font-semibold">{reading.pm10}</span>
            </div>
            <div className="bg-secondary/50 p-2 rounded-lg">
              <span className="block text-xs text-muted-foreground">NO2</span>
              <span className="font-mono font-semibold">{reading.no2}</span>
            </div>
            <div className="bg-secondary/50 p-2 rounded-lg">
              <span className="block text-xs text-muted-foreground">O3</span>
              <span className="font-mono font-semibold">{reading.o3}</span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

// Center component to handle map movement
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function MapPage() {
  const { data: readings, isLoading } = useAirQualityList();
  const nagpurCenter: [number, number] = [21.1458, 79.0882];

  return (
    <div className="relative h-screen w-full bg-secondary/20">
      <div className="absolute top-6 left-6 z-[400] bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-border/50 max-w-xs">
        <h2 className="font-display font-bold text-xl mb-1">Pollution Map</h2>
        <p className="text-sm text-muted-foreground">Real-time visualization of air quality across Nagpur.</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Good (0-50)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Moderate (51-100)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Unhealthy (101-150)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Unhealthy+ (151+)</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-[1000]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <MapContainer 
          center={nagpurCenter} 
          zoom={13} 
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapUpdater center={nagpurCenter} />
          {readings?.map((reading) => (
            <CustomMarker key={reading.id} reading={reading} />
          ))}
        </MapContainer>
      )}
    </div>
  );
}
