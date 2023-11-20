import React from 'react'
import { Routes, Route, Outlet, useLocation, Link } from 'react-router-dom'

import LandingPage from './components/landing/landingPage.js'
import InventoryList from './components/inventory/inventoryList.js'
import Button from '@mui/material/Button' // Import your Inventory component

function App() {
  const location = useLocation()

  return (
    <div>
      {location.pathname !== '/' && (
        <Button component={Link} to="/">
          Back
        </Button>
      )}
      {/* Show the landing page only when no route is matched */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/inventory" element={<InventoryList />} />
      </Routes>

      {/* The Outlet component renders the child components of the matched route */}
      <Outlet />
    </div>
  )
}

export default App
