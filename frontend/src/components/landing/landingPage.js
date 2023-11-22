import { Card, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import './landingPage.css'

export default function LandingPage() {
  return (
    <>
    <div id="landingImageContainer">
      <img src='/logo512.png' alt="The Table logo" id="landingLogo"></img>
    </div>
    <div id="app" className="cardDisplay">
      <Link to="/checkin" className="card-link">
        <Card className="MuiCard-root" variant="outlined">
          <Typography className="cardContent">Check-in</Typography>
        </Card>
      </Link>

      <Link to="/checkout" className="card-link">
        <Card className="MuiCard-root" variant="outlined">
          <Typography className="cardContent">Check-out</Typography>
        </Card>
      </Link>
      <Link to="/inventory" className="card-link">
        <Card className="MuiCard-root" variant="outlined">
          <Typography className="cardContent">Inventory</Typography>
        </Card>
      </Link>
    </div>
    </>
  )
}
