import { Card, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import './landingPage.css'

export default function LandingPage() {
  return (
    <div id="app" className="cardDisplay">
      <Link to="/checkout" className="card-link">
        <Card className="MuiCard-root" variant="outlined">
          <Typography className="cardContent">Checkout</Typography>
        </Card>
      </Link>
      <Link to="/inventory" className="card-link">
        <Card className="MuiCard-root" variant="outlined">
          <Typography className="cardContent">Inventory</Typography>
        </Card>
      </Link>
    </div>
  )
}
