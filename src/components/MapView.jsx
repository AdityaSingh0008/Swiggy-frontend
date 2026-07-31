import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Leaflet's default marker icons reference image files that don't resolve
// correctly under Vite bundling, so we rebuild them from the CDN.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#3ddc97;border:3px solid #0b0c10;box-shadow:0 0 0 4px rgba(61,220,151,0.25)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const cafeIcon = (isPremium) =>
  L.divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${
      isPremium ? '#e0ac5f' : '#22252f'
    };border:2px solid #0b0c10;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,0.4)">
      <span style="transform:rotate(45deg);font-size:13px;">☕</span>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });

// Recenters the map whenever the target coordinates change (e.g. after
// live geolocation resolves), giving a smooth animated pan/zoom.
const Recenter = ({ lat, lng, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], zoom || map.getZoom(), { duration: 1.1 });
  }, [lat, lng]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
};

const MapView = ({ userLocation, cafes = [], radiusKm = 5, height = '480px' }) => {
  const center = userLocation ? [userLocation.lat, userLocation.lng] : [26.9124, 75.7873];

  return (
    <div className="rounded-2xl overflow-hidden shadow-premium border border-white/5" style={{ height }}>
      <MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {userLocation && (
          <>
            <Recenter lat={userLocation.lat} lng={userLocation.lng} zoom={14} />
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={radiusKm * 1000}
              pathOptions={{ color: '#3ddc97', fillColor: '#3ddc97', fillOpacity: 0.06, weight: 1 }}
            />
          </>
        )}

        {cafes.map((cafe) => (
          <Marker
            key={cafe._id}
            position={[cafe.location.lat, cafe.location.lng]}
            icon={cafeIcon(cafe.isPremiumPartner)}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold mb-0.5">{cafe.name}</p>
                <p className="text-xs opacity-70 mb-1.5">
                  ★ {cafe.rating?.toFixed(1)} {typeof cafe.distanceKm === 'number' ? `· ${cafe.distanceKm} km away` : ''}
                </p>
                <Link to={`/cafe/${cafe._id}`} className="text-xs font-semibold text-gold-400 hover:underline">
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
