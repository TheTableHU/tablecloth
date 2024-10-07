import React, { useEffect, useState } from 'react';
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
import RequireLogin from './components/login/login.jsx';
import { ApiContext, useNewApi } from '../api.js';
import Logout from './components/login/logout.jsx';
import ProtectedRoute from './ProtectedRoutes.jsx';
import UserSidebar from './components/login/sidebar.jsx';
import { styled } from '@mui/system';
import ManageUsers from './components/users/manageUsers.jsx';
import TrainingModules from './components/users/training.jsx';

const ContentWrapper = styled('div')({
  marginLeft: '100px', 
});

function App() {
  const location = useLocation();
  const api = useNewApi(); 
  const [isTrained, setIsTrained] = useState(false);
  const [counter, setCounter] = useState(0);

  return (
    <ApiContext.Provider value={api}>
      <RequireLogin isTrained={isTrained} setIsTrained={setIsTrained} counter={counter} setCounter={setCounter}>
          {location.pathname !== '/login' && <UserSidebar userName={api.name} />}
          <div>
          <ContentWrapper>
            {location.pathname !== '/' && (
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
              >
                <Link component={RouterLink} to="/" className="breadcrumbLink">
                  Home
                </Link>

                {location.pathname.includes('/inventory') && (
                  <ProtectedRoute allowedRoles={['admin', 'worker']}>
                    <Link component={RouterLink} to="/inventory" className="breadcrumbLink">
                      Inventory
                    </Link>
                  </ProtectedRoute>
                )}
                {location.pathname.includes('/inventory/list') && (
                  <ProtectedRoute allowedRoles={['admin', 'worker']}>
                    <Link component={RouterLink} to="/inventory/list" className="breadcrumbLink">
                      List
                    </Link>
                  </ProtectedRoute>
                )}
                {location.pathname.includes('/inventory/shipment') && (
                  <ProtectedRoute allowedRoles={['admin', 'worker']}>
                    <Link
                      component={RouterLink}
                      to="/inventory/shipment"
                      className="breadcrumbLink"
                    >
                      Shipment
                    </Link>
                  </ProtectedRoute>
                )}
                {location.pathname.includes('/inventory/add') && (
                  <ProtectedRoute allowedRoles={['admin', 'worker']}>
                    <Link component={RouterLink} to="/inventory/add" className="breadcrumbLink">
                      Add Item
                    </Link>
                  </ProtectedRoute>
                )}
                {location.pathname.includes('/checkout') && (
                  <Link component={RouterLink} to="/checkout" className="breadcrumbLink">
                    Check-out
                  </Link>
                )}
                {/* MANAGE USERS PATH  */}
                {location.pathname.includes('/users') && (
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Link component={RouterLink} to="/users" className="breadcrumbLink">
                      Manage-Users
                    </Link>
                  </ProtectedRoute>
                )}
                {location.pathname.includes('/checkin') && (
                  <Link component={RouterLink} to="/checkin" className="breadcrumbLink">
                    Check-in
                  </Link>
                )}

                {location.pathname.includes('/logout') && (
                  <Link component={RouterLink} to="/logout" className="breadcrumbLink">
                    Logout
                  </Link>
                )}
              </Breadcrumbs>
            )}

            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/inventory" element={<InventoryLandingPage />} />
              <Route path="/inventory/list" element={<InventoryList />} />
              <Route path="/inventory/shipment" element={<Shipment />} />
              <Route path="/inventory/add" element={<AddItem />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkin" element={<Checkin />} />
              <Route path="/logout" element={<Logout  isTrained={isTrained} setIsTrained={setIsTrained} counter={counter} setCounter={setCounter}/>} />
              <Route path="/users" element={<ManageUsers />} />


            </Routes>

            <Outlet />
          </ContentWrapper>
        </div>
      </RequireLogin>
    </ApiContext.Provider>
  )
}

export default App;
