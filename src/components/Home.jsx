
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const [latLng, setLatLng] = useState({});
  const [hospitals, setHospitals] = useState([]);
  const[userAddress,setUserAddress]=useState([])
  const navigate = useNavigate();

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLatLng({
            lat: latitude,
            lng: longitude,
          });

          const USER_ADDRESS_API = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=c5ce692b856547569af71085c9664018`;
          axios.get(USER_ADDRESS_API).then((res) => {
            if (res.data && res.data.features && res.data.features.length > 0) {
              setUserAddress(res.data.features[0].properties.formatted);
            }
          });
        })    
    }
  }, []);

  useEffect(() => {
    console.log("Current latLng:", latLng);
    if (latLng.lat && latLng.lng) {
      const HOSPITAL_API = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${latLng.lng},${latLng.lat},5000&bias=proximity:${latLng.lng},${latLng.lat}&limit=20&apiKey=c5ce692b856547569af71085c9664018`;

      axios.get(HOSPITAL_API).then((res) => {
        const featuresArr = res.data.features;
        console.log("Features Array:", featuresArr);
        const hospitalsData = featuresArr.map((feature) => {
          const addressParts = [
            feature.properties.datasource.raw['addr:street']||"",feature.properties.street||"",
            feature.properties.datasource.raw['addr:full'] ||feature.properties.formatted|| "",
            feature.properties.datasource.raw['addr:district'] ||feature.properties.district || "",
            feature.properties.datasource.raw['addr:state'] ||feature.properties.state|| "",
            feature.properties.datasource.raw['addr:postcode'] ||feature.properties.postcode|| "",
            feature.properties.datasource.url || "",
          ];

          const filteredAddressParts = addressParts.filter(part => part !== "");
          const formattedAddress = filteredAddressParts.join(', ');
          return {
            name: feature.properties.name,
            address: formattedAddress,
            url: feature.properties.datasource.url || "",
            email: feature.properties.datasource.raw['contact:email'] ||feature.properties.email||feature.properties.datasource.raw['email'] || "",
            state: feature.properties.datasource.raw['addr:state'] ||feature.properties.details.state|| "",
            city: feature.properties.datasource.raw['addr:city'] || feature.properties['city']||"",
            lat: feature.properties.lat,
            lng: feature.properties.lon,
          };
        });
        setHospitals(hospitalsData);
      })
    }
  }, [latLng]);

  const handleCardClick = (hospital) => {
    navigate('/direction', { state: { userLatLng: latLng,userAddress, hospital } });
  };

  return (
    <div style={{display: "flex",justifyContent: "center",alignItems: "center",flexWrap: 'wrap',
      flexDirection: 'row'}}>
      {hospitals.map((hospital, index) => (
        <div key={index} onClick={() => handleCardClick(hospital)}>
          <Card style={{
            width: '40rem',
            margin: 15,
            border: '1px solid black'
          }}>
          <Card.Title style={{padding: 20,font: 'roboto',height: '30%',
          margin: '0 10px 10px 10px', borderBottom: '3px solid grey'}}>{hospital.name}</Card.Title>
          <Card.Text style={{ overflow: "hidden", padding: 20}}>{hospital.address}</Card.Text>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default Home;
