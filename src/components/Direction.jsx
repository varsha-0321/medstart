import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Typography } from "@mui/material";

const Direction = () => {
  const location = useLocation();
  const { userLatLng, userAddress, hospital } = location.state;
  const [directions, setDirections] = useState([]);

  useEffect(() => {
    const directionApi = `https://api.geoapify.com/v1/routing?waypoints=${userLatLng.lat},${userLatLng.lng}|${hospital.lat},${hospital.lng}&mode=drive&details=instruction_details,route_details,elevation&apiKey=c5ce692b856547569af71085c9664018`;

    axios.get(directionApi)
      .then((res) => {
        const directionArray = res.data.features[0]?.properties?.legs[0]?.steps || [];
        setDirections(directionArray);
        
      })
      
  }, [userLatLng, hospital]);

  return (
    <div style={{ padding: "20px", display: "flex" }}>
      <Col style={{ width: "45rem", paddingLeft: "3rem", paddingRight: "3rem" }}>
        <Row>
          <Card style={{ border: "2px solid grey", paddingLeft: "3rem", paddingRight: "2.5rem", fontSize: '1.3rem', height: '100%' }}>
            <h1 style={{ borderBottom: "3px solid grey", padding: "1rem" }}>{hospital?.name}</h1>
            <Card.Text as="div" style={{ borderBottom: "3px solid grey", padding: "1rem" }}>
              <div><strong>User Latitude:</strong> {userLatLng?.lat}</div>
              <div><strong>User Longitude:</strong> {userLatLng?.lng}</div>
              <div><strong>User Address:</strong> {userAddress}</div>
            </Card.Text>
            <Card.Text as="div" style={{ borderBottom: "3px solid grey", padding: "1rem" }}>
              <div><strong>Hospital Latitude:</strong> {hospital?.lat}</div>
              <div><strong>Hospital Longitude:</strong> {hospital?.lng}</div>
              <div><strong>Hospital Formatted Address:</strong> {hospital?.address}</div>
            </Card.Text>
            <Card.Text as="div" style={{ padding: "1rem" }}>
              <div><strong>Hospital Website:</strong> <a href={hospital?.url} target="_blank" rel="noopener noreferrer">{hospital?.url}</a></div>
              <div><strong>Hospital Email:</strong> {hospital?.email}</div>
              <div><strong>State:</strong> {hospital?.state}</div>
              <div><strong>City:</strong> {hospital?.city}</div>
            </Card.Text>
          </Card>
        </Row>
      </Col>
      <Col style={{ width: "45rem", paddingLeft: "3rem", paddingRight: "3rem" }}>
        <Card style={{ border: "2px solid grey", paddingLeft: "3rem", paddingRight: "2.5rem", height: '100%', fontSize: '1.5rem' }}>
          <h2>Directions to Hospital</h2>
          <Timeline sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}>
            {directions.filter(direction => {
      return (
        direction.instruction &&
        (direction.instruction.post_transition_instruction ||
          direction.instruction.transition_instruction ||
          direction.instruction.text)
      );
    }).map((direction, index) => (
      <TimelineItem key={index}>
        <TimelineSeparator>
          <TimelineDot style={{ backgroundColor: 'orange' }} />
          {index < directions.length - 1 && <TimelineConnector />}
        </TimelineSeparator>
        <TimelineContent>
          <Typography style={{ fontSize: '2rem' }}>
            {direction.instruction.post_transition_instruction || ''}
            {direction.instruction.transition_instruction || direction.instruction.text || ''}
          </Typography>
        </TimelineContent>
      </TimelineItem>
    ))}
</Timeline>
        </Card>
      </Col>
    </div>
  );
};

export default Direction;
