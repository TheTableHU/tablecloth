import React from 'react';
import { Card, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './landingPage.css';
import { useApi } from '../../../api';
import { toast, ToastContainer } from 'react-toastify';

export default function LandingPage() {
  const api = useApi();
  return (
    <>
    
      <div id="landingImageContainer">
        <img src="/logo512.png" alt="The Table logo" id="landingLogo"></img>
      </div>
      <div id="app" className="cardDisplay">
        <Link to="/checkin" className="card-link">
          <Card className="MuiCard-root" variant="outlined">
            <Typography className="cardContent" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>New-Shopper</Typography>
          </Card>
        </Link>

        <Link to="/checkout" className="card-link">
          <Card className="MuiCard-root" variant="outlined">
            <Typography className="cardContent" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>Check-out</Typography>
          </Card>
        </Link>
        { ['admin', 'worker'].includes(api.role) && (<Link to="/inventory" className="card-link">
          <Card className="MuiCard-root" variant="outlined">
            <Typography className="cardContent"  sx={{ fontSize: '2rem', fontWeight: 'bold' }}>Inventory</Typography>
          </Card>
        </Link>)
}
{ ['admin'].includes(api.role) && (<Link to="/users" className="card-link">
          <Card className="MuiCard-root" variant="outlined">
            <Typography className="cardContent" sx={{ fontSize: '2rem', fontWeight: 'bold' }}>Manage-Users</Typography>
          </Card>
        </Link>)
}


      </div>
    </>
  );
}
