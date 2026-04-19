import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ onLocationSelect }) => {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
        },
    });
    return null;
};

const MapView = ({ journals, onLocationSelect, selectedPos, zoom = 3 }) => {
    const center = selectedPos || [20, 0];

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full rounded-2xl">
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {journals && journals.map((journal) => (
                journal.coordinates && (
                    <Marker key={journal._id} position={[journal.coordinates.lat, journal.coordinates.lng]}>
                        <Popup>
                            <div className="text-navy">
                                <h4 className="font-bold">{journal.title}</h4>
                                <p className="text-sm">{journal.location}</p>
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}
            {selectedPos && (
                <Marker position={selectedPos} />
            )}
            {onLocationSelect && <LocationPicker onLocationSelect={onLocationSelect} />}
        </MapContainer>
    );
};

export default MapView;
