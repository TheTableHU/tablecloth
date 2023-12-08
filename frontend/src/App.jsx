import React from 'react';
import { Routes, Route, Outlet, useLocation, Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import './shared.css';

import LandingPage from './components/landing/landingPage.jsx';
import InventoryLandingPage from './components/landing/inventoryLandingPage.jsx';

import InventoryList from './components/inventory/inventoryList.jsx';
import Shipment from './components/inventory/shipmentPage.jsx';
import AddItem from './components/inventory/addItemPage.jsx';
import Checkout from './components/inventory/checkoutPage.jsx';
import Checkin from './components/shopper/checkinPage.jsx';

function App() {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== '/' && (
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link component={RouterLink} to="/" className="breadcrumbLink">
            Home
          </Link>
          {location.pathname.includes('/inventory') && (
            <Link component={RouterLink} to="/inventory" className="breadcrumbLink">
              Inventory
            </Link>
          )}
          {location.pathname.includes('/inventory/list') && (
            <Link component={RouterLink} to="/inventory/list" className="breadcrumbLink">
              List
            </Link>
          )}
          {location.pathname.includes('/inventory/shipment') && (
            <Link component={RouterLink} to="/inventory/shipment" className="breadcrumbLink">
              Shipment
            </Link>
          )}
          {location.pathname.includes('/inventory/add') && (
            <Link component={RouterLink} to="/inventory/add" className="breadcrumbLink">
              Add Item
            </Link>
          )}
          {location.pathname.includes('/checkout') && (
            <Link component={RouterLink} to="/checkout" className="breadcrumbLink">
              Check-out
            </Link>
          )}
          {location.pathname.includes('/checkin') && (
            <Link component={RouterLink} to="/checkin" className="breadcrumbLink">
              Check-in
            </Link>
          )}
        </Breadcrumbs>
      )}
      {/* Show the landing page only when no route is matched */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/inventory" element={<InventoryLandingPage />} />
        <Route path="/inventory/list" element={<InventoryList />} />
        <Route path="/inventory/shipment" element={<Shipment />} />
        <Route path="/inventory/add" element={<AddItem />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkin" element={<Checkin />} />
      </Routes>

      {/* The Outlet component renders the child components of the matched route */}
      <Outlet />
    </div>
  );
}

export default App;
