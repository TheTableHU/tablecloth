import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';

// Styled components for the search bar
const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '30px',
  backgroundColor: '#F4F7FE',
  width: '350px', // Set the width to 350px
  boxShadow: '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  width: '100%',
  marginTop: '20px',
  marginBottom: '20px',
  [theme.breakpoints.up('md')]: {
    width: '40ch',
  },
}));

// Search component
export const Search = ({ placeholder, search, setSearch}) => (
  <SearchContainer>
    <SearchIconWrapper>
      <SearchIcon />
    </SearchIconWrapper>
    <StyledInputBase
      autoFocus
      placeholder={placeholder}
      inputProps={{ 'aria-label': 'search' }}
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
      }}
    />
  </SearchContainer>
);
