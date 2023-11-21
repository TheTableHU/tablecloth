import React from 'react'
import { Routes, Route, Outlet, useLocation, Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import './shared.css'

import LandingPage from './components/landing/landingPage.js'
import InventoryList from './components/inventory/inventoryList.js'
import Checkout from './components/inventory/checkoutPage.js'

function App() {
  const location = useLocation()

  return (
    <div>
      {location.pathname !== '/' && (
        <Button component={Link} to="/">
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
          Back
        </Button>
      )}
      {/* Show the landing page only when no route is matched */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>

      {/* The Outlet component renders the child components of the matched route */}
      <Outlet />
    </div>
  )
}

export default App
