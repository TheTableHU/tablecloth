import React from 'react';
import { Card, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './landingPage.css';

export default function LandingPage() {
  return (
    <>
      <div id="landingImageContainer">
        <img src="/logo512.png" alt="The Table logo" id="landingLogo"></img>
      </div>
      <div id="app" className="cardDisplay">
        <Link to="/inventory/shipment" className="card-link">
          <Card className="MuiCard-root" variant="outlined">
            <Typography className="cardContent">Shipment</Typography>
          </Card>
        </Link>

        <Link to="/inventory/add" className="card-link">
          <Card className="MuiCard-root" variant="outlined">
            <Typography className="cardContent">Add Item</Typography>
          </Card>
        </Link>

        <Link to="/inventory/list" className="card-link">
          <Card className="MuiCard-root" variant="outlined">
            <Typography className="cardContent">List</Typography>
          </Card>
        </Link>
      </div>
    </>
  );
}
