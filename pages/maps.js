import React, { useState, useEffect } from "react";
import css from '../styles/Maps.module.css'



const API_KEY = "AIzaSyC1Gr4wjiAL76cn7vLLQNrF1piib_6l0-o";


const DistanceMatrixExample = () => {
  const [distance, setDistance] = useState(null);
  const [destination, setDestination] = useState("");
  const [destinationLatLng, setDestinationLatLng] = useState(null);
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  useEffect(() => {
    let googleMapsScript = document.createElement("script");
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    document.head.appendChild(googleMapsScript);

    googleMapsScript.addEventListener("load", () => {
      const origin = new window.google.maps.LatLng(-29.682486, -53.814110);
      const radius = 20000; // meters

      // Create bounds for the autocomplete suggestions
      const bounds = new window.google.maps.Circle({
        center: origin,
        radius: radius
      }).getBounds();

      const input = document.getElementById("destination-input");
      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        bounds: bounds
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setDestinationLatLng(place.geometry.location);
        setDestination(place.formatted_address);
        localStorage.setItem("address", place.formatted_address);
      });
    });
  }, []);

  const calculateDistance = () => {
    const origin = new window.google.maps.LatLng(-29.682486, -53.814110);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: destination }, function (results, status) {
      if (status === "OK") {
        const latLng = results[0].geometry.location;

        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [latLng],
            travelMode: "DRIVING"
          },
          (response, status) => {
            if (status === "OK") {
              const distanceInMeters = response.rows[0].elements[0].distance.value;
              const distanceInKilometers = distanceInMeters / 1000;
              setDistance(distanceInKilometers.toFixed(2));
              const deliveryPrice = distanceInKilometers * 1.5;
              setDeliveryPrice(deliveryPrice.toFixed(2));
              localStorage.setItem("deliveryPrice", Math.ceil(deliveryPrice));
            }
          }
        );
      }
    });
  };

  return (
    <div>
      <h1>Distance:</h1>
      <input  
        type="text"
        id="destination-input"
        value={destination}
        onChange={e => {
          setDestination(e.target.value);
          localStorage.setItem("address", e.target.value);
        }}
      />
      <div className={css.buttons}>
      <button className="btn" onClick={() => {
            calculateDistance();
          }}>Calculate Distance</button>
      </div>
      <p>Distance: {distance} km</p>
      <p>Delivery Price: {deliveryPrice} R$</p>
    </div>
  );
};

export default DistanceMatrixExample;
