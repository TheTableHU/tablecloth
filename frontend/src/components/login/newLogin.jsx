import React, { useState, useCallback } from 'react';
import { styled } from '@mui/system';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Button from '@mui/joy/Button';
import ColoredLogo from './Assets/ColoredLogo.png'; // Adjust the path as needed
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BackgroundContainer, StyledForm, StyledImage, StyledButton } from '../StyledComponents/styledComponents.jsx'; 
import { useApi } from '../../../api.js';


export default function RequireLogin({ children }) {
    const api = useApi();
    if (api.loggedIn && api.isTokenExpired == false) {
      return <>{children}</>
    }
    else {
      api.setToken(null);
      return <><div className="background"></div><Login /></>
    }
  }



export default function Login() {
  const api = useApi();
  const [hNumber, setHNumber] = useState('');
  const [PIN, setPIN] = useState("");


  async function handleSubmit(){
    e.preventDefault();
    console.log('H-Number submitted:', hNumber);
    let response = await api.login(hNumber, PIN);
    if (response !== 401 && response !== 404) {
      await api.setToken(response);
    } else {
      setPIN('');
      setHNumber('');
    }
  };

  return (
    <>
      <CssBaseline />
      <BackgroundContainer>
        <Sheet
          sx={{
            width: { xs: '90%', sm: 500 },
            height: 600,
            mx: 'auto',
            py: 2,
            px: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 2,
            boxShadow: 'lg',
            borderRadius: 'md',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent for cool effect!
          }}
          variant="outlined"
        >
          <StyledImage src={ColoredLogo} alt="Logo" />
          <StyledForm onSubmit={handleSubmit}>
            <Box
              sx={{ '& .MuiTextField-root': { m: 1 } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                label="Enter H-Number"
                variant="outlined"
                value={hNumber}
                onChange={(e) => setHNumber(e.target.value)}
                required
                 // Add {error} VAR here <---
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: '#fff',
                  },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0288d1',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0288d1',
                  },
                }}
              />
            </Box>
            <Button
              variant="solid"
              color="primary"
              type="submit"
              endIcon={<NavigateNextIcon />}
              sx={{
                mt: 2,
                width: '100%',
                backgroundColor: '#0288d1',
                '&:hover': {
                  backgroundColor: '#0277bd',
                },
              }}
            >
              NEXT
            </Button>
          </StyledForm>
        </Sheet>
      </BackgroundContainer>
    </>
  );
}
