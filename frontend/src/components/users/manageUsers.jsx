import React from 'react';
import { Box, Typography } from '@mui/material';
import { StyledHeading } from '../StyledComponents/styledComponents.jsx';
import { Search } from '../StyledComponents/SearchBar.jsx';
import { AddUserButton } from '../StyledComponents/AddUserButton.jsx';
import UsersTable from './usersTable.jsx'; 

const ManageUsers = () => {

  return (
    <Box sx={{ p: 3, backgroundColor: '#F4F7FE', minHeight: '100vh' }}>
      <StyledHeading>Manage Users</StyledHeading>

      <Box mt={3} sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor:
        '#FFFFFF', padding: '10px', borderRadius: '20px', width: '600px'
       }}>
        <Search placeholder="Search…" />
        <AddUserButton />
      </Box>
      
      <UsersTable /> {/* Correctly rendered */}
      
    </Box>
  
  );
};

export default ManageUsers;
