import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { StyledHeading } from '../StyledComponents/styledComponents.jsx';
import { Search } from '../StyledComponents/SearchBar.jsx';
import { AddUserButton } from '../StyledComponents/AddUserButton.jsx';
import UsersTable from './usersTable.jsx';

const ManageUsers = () => {
  const [search, setSearch] = useState('');
  const [actions, setActions] = useState(0);

  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      <StyledHeading>Manage Users</StyledHeading>
      <Box
        mt={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: '#FFFFFF',
          padding: '10px',
          borderRadius: '20px',
          width: '600px',
        }}
      >
        <Search placeholder="Search…" search={search} setSearch={setSearch} />
        <AddUserButton actions={actions} setActions={setActions} />
      </Box>
      <UsersTable search={search} setSearch={setSearch} actions={actions} setActions={setActions} />{' '}
      {/* Correctly rendered */}
    </Box>
  );
};

export default ManageUsers;
