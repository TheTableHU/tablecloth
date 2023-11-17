import './App.css'
import { Card } from '@mui/material'
import { Link } from 'react-router-dom'

function App() {
  return (
    <div id="app" className="cardDisplay">
      <Link to="/inventory" className="card-link">
        <Card variant="outlined">Inventory</Card>
      </Link>
      {/* Add more cards for other pages */}
    </div>
  )
}

export default App
