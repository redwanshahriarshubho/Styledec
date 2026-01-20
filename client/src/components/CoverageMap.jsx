import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const locations = [
    { id: 1, pos: [23.8103, 90.4125], name: "Dhaka HQ - Full Service" },
    { id: 2, pos: [22.3569, 91.7832], name: "Chittagong - Consultation Only" },
    { id: 3, pos: [24.3636, 88.6241], name: "Rajshahi - Smart Home Hub" }
];

const CoverageMap = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-4">Our Service Coverage</h2>
                <p className="text-center text-gray-500 mb-10">Find our experts in your city</p>
                <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl border-8 border-base-200">
                    <MapContainer center={[23.8103, 90.4125]} zoom={7} scrollWheelZoom={false} className="h-full w-full">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {locations.map(loc => (
                            <Marker key={loc.id} position={loc.pos}>
                                <Popup>{loc.name}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </section>
    );
};

export default CoverageMap;