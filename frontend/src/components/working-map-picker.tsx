'use client';

import { useEffect, useState, useRef } from 'react';

// Mozelos coordinates and operational area
const MOZELOS_CENTER = { lat: 40.999, lng: -8.556 };
const MOZELOS_RADIUS_KM = 1.5;

interface WorkingMapPickerProps {
  onLocationSelect: (location: { lat: number; lng: number } | null) => void;
  selectedLocation: { lat: number; lng: number } | null;
  readonly?: boolean;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function WorkingMapPicker({ onLocationSelect, selectedLocation, readonly = false }: WorkingMapPickerProps) {
  const [isClient, setIsClient] = useState(false);
  const [MapComponents, setMapComponents] = useState<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    const loadMapComponents = async () => {
      try {
        // Import all components at once
        const reactLeaflet = await import('react-leaflet');
        
        // Import Leaflet CSS
        await import('leaflet/dist/leaflet.css');
        
        // Fix icons
        const L = await import('leaflet');
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        
        setMapComponents(reactLeaflet);
        
      } catch (error) {
        console.error('Error loading map components:', error);
      }
    };
    
    loadMapComponents();
  }, []);

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    
    // Calculate distance from Mozelos center using Haversine formula
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat - MOZELOS_CENTER.lat);
    const dLng = toRadians(lng - MOZELOS_CENTER.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(MOZELOS_CENTER.lat)) * Math.cos(toRadians(lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    if (distance <= MOZELOS_RADIUS_KM) {
      onLocationSelect({ lat, lng });
    } else {
      alert(`Localização fora da área operacional de Mozelos (máximo ${MOZELOS_RADIUS_KM}km do centro)`);
      onLocationSelect(null);
    }
  };

  // Show loading while components are loading
  if (!isClient || !MapComponents) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">A carregar mapa...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Circle, Marker, Popup } = MapComponents;

  // Direct map event handler component
  function MapEventHandler() {
    if (!MapComponents) {
      return null;
    }

    const { useMapEvents } = MapComponents;
    
    const map = useMapEvents({
      // Primary method: mouseup (works when click doesn't)
      mouseup: (e) => {
        handleMapClick(e);
      },
      
      // Backup methods
      click: (e) => {
        handleMapClick(e);
      },
      
      dblclick: (e) => {
        handleMapClick(e);
      }
    });
    
    // Store map reference
    if (map && !mapRef.current) {
      mapRef.current = map;
    }
    
    return null;
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[MOZELOS_CENTER.lat, MOZELOS_CENTER.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%', cursor: readonly ? 'default' : 'crosshair' }}
        className="z-0"
        whenReady={(map) => {
          if (!readonly) {
            map.target.on('click', (e: any) => {
              handleMapClick(e);
            });
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Operational area circle */}
        <Circle
          center={[MOZELOS_CENTER.lat, MOZELOS_CENTER.lng]}
          radius={MOZELOS_RADIUS_KM * 1000} // Convert to meters
          fillColor="blue"
          fillOpacity={0.1}
          color="blue"
          weight={2}
          opacity={0.5}
        >
          <Popup>
            <div className="text-center">
              <strong>Área Operacional de Mozelos</strong>
              <br />
              Raio: {MOZELOS_RADIUS_KM}km
            </div>
          </Popup>
        </Circle>
        
        {/* Center marker */}
        <Marker position={[MOZELOS_CENTER.lat, MOZELOS_CENTER.lng]}>
          <Popup>
            <div className="text-center">
              <strong>Centro de Mozelos</strong>
            </div>
          </Popup>
        </Marker>
        
        {/* Selected location marker */}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <div className="text-center">
                <strong>Localização Selecionada</strong>
                <br />
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Map event handler (only if not readonly) */}
        {!readonly && <MapEventHandler />}
      </MapContainer>
    </div>
  );
}