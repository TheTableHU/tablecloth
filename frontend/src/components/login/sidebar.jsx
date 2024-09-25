import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import LogoutIcon from '@mui/icons-material/Logout';

// Sidebar container, fixed on top-left, over everything else
const SidebarContainer = styled('div')(({ expanded }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  height: 'auto',
  width: expanded ? '200px' : '50px',
  backgroundColor: '#1d516f',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  transition: 'width 0.3s ease',
  borderRadius: '0px 20px 20px 0px',
  paddingTop: '30px',
  paddingBottom: '30px',
  zIndex: 1000, // Make sure it stays on top of other components
}));

// Username styling, showing full name or initials depending on sidebar state
const UserName = styled('div')({
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '20px',
  textAlign: 'center',
  color: '#fff', // White font color
});

// Logout button style
const StyledLink = styled(Link)({
  padding: '10px',
  width: '80%',
  backgroundColor: '#feba12',
  color: '#fff',
  border: 'none',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#ffb84d',
  },
});

const UserSidebar = ({ userName }) => {
  const userInitials = userName
    .split(' ')
    .map((name) => name[0])
    .join('');
  const [expanded, setExpanded] = useState(false);

  return (
    <SidebarContainer
      expanded={expanded}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <UserName>{expanded ? userName : userInitials}</UserName>
      <StyledLink to="/logout">
        <LogoutIcon />
        {expanded && 'Logout'}
      </StyledLink>
    </SidebarContainer>
  );
};

export default UserSidebar;
