import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { getAllFoodTrucks } from '../services/foodTruckService';
import './HomePage.css';

const mapContainerStyle = {
  width: '60%',
  height: '60vh',
  margin: '0 auto'
};

const defaultCenter = {
  lat: 37.7749, // Default center
  lng: -122.4194,
};

function HomePage() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [trucks, setTrucks] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedTruckId, setSelectedTruckId] = useState(null); // State to track selected truck

  useEffect(() => {
    const fetchTrucks = async () => {
      const data = await getAllFoodTrucks();
      setTrucks(data);
    };
    fetchTrucks();
  }, []);

  const handleTruckClick = (truck) => {
    setMapCenter({ lat: truck.location.lat, lng: truck.location.lng });
    setSelectedTruckId(truck._id); // Set the selected truck ID
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Welcome to GoFood!</h1>
        <p>Discover the best food trucks near you!</p>
      </header>
      
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={mapCenter}>
        {trucks.map((truck) => (
          <Marker 
            key={truck._id} 
            position={{ lat: truck.location.lat, lng: truck.location.lng }} 
            title={truck.name}
            icon={{
              url: truck._id === selectedTruckId 
                ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // Highlighted marker
                : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"   // Default marker
            }}
          />
        ))}
      </GoogleMap>
      
      <section className="truck-list">
        {trucks.map((truck) => (
          <button 
            key={truck._id} 
            className={`truck-card ${truck._id === selectedTruckId ? 'selected' : ''}`} 
            onClick={() => handleTruckClick(truck)}
          >
            <h3>{truck.name}</h3>
            <p>{truck.description}</p>
          </button>
        ))}
      </section>
    </div>
  );
}

export default HomePage;
