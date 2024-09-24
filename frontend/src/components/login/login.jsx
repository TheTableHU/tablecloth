import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Button from '@mui/joy/Button';
import ColoredLogo from './Assets/ColoredLogo.png'; // Adjust the path as needed
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BackgroundContainer, StyledForm, StyledImage } from '../StyledComponents/styledComponents.jsx';
import { useApi } from '../../../api.js';
import InputAdornment from '@mui/material/InputAdornment';
import { Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

export function Login() {
  const api = useApi();
  const [hNumber, setHNumber] = useState('');
  const [PIN, setPIN] = useState(Array(4).fill('')); // Array to store PIN digits
  const [showPINInput, setShowPINInput] = useState(false);

  // Autofocus the first PIN input when the PIN input shows up
  useEffect(() => {
    if (showPINInput) {
      document.getElementById(`pin-0`).focus();
    }
  }, [showPINInput]);
  const handleHNumberSubmit = async (e) => {
    e.preventDefault();
    setShowPINInput(true); // Show PIN input after valid H-Number
  };

  const handlePINChange = (e, index) => {
    const { value } = e.target;

    if (/^\d$/.test(value)) { // Only accept digits
      const newPIN = [...PIN];
      newPIN[index] = value;
      setPIN(newPIN);

      // Move focus to the next input box if not the last
      if (index < 3) {
        document.getElementById(`pin-${index + 1}`).focus();
      }

      // Automatically log in after the 4th digit
      if (index === 3) {
        handlePINSubmit(newPIN.join(''));
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') { // Allow deletion
      const newPIN = [...PIN];
      newPIN[index] = '';
      setPIN(newPIN);

      // Move focus to the previous input box if not the first
      if (index > 0) {
        document.getElementById(`pin-${index - 1}`).focus();
      }
    }
  };

  const handlePINSubmit = async (finalPIN) => {
    try {
      let response = await api.login(hNumber, finalPIN);
      if (response.status == 401) {
        setPIN(Array(4).fill(''));
        document.getElementById(`pin-${0}`).focus();
        toast.error("Incorrect PIN, try again");
      } else if (response.status == 404) {
        setPIN(Array(4).fill(''));
        document.getElementById(`pin-${0}`).focus();
        setHNumber('');
        setShowPINInput(false);
        toast.error("H# Not Found, please try again");
        setTimeout(() => document.getElementById('outlined-start-adornment').focus(), 0);
      } else {
        let responseJSON = await response.json();
        await api.setToken(responseJSON);
      }
    } catch (error) {
      console.error('Error during login', error);
    }
  };

  return (
    <>
      <CssBaseline />
      <ToastContainer />
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

          {!showPINInput ? (
            <StyledForm onSubmit={handleHNumberSubmit}>
              <TextField
                autoFocus
                label="Scan your Harding ID"
                id="outlined-start-adornment"
                value={hNumber}
                onChange={(e) => {
                  if (/^\d+$|^$/.test(e.target.value)) { // Only accept digits, allow clearing input
                    setHNumber(e.target.value);
                  }
                }}
                sx={{
                  m: 1,
                  width: '40ch'  // Bigger input width
                }}
                InputProps={{
                  type: 'text',
                  inputMode: 'numeric',
                  style: {
                    fontSize: '1.5rem', // Bigger font for H#
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 500 }}>
                        H
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />

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
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {PIN.map((digit, index) => (
                <TextField
                  key={index}
                  id={`pin-${index}`}
                  value={digit ? '*' : ''}
                  onChange={(e) => handlePINChange(e, index)}
                  onKeyDown={(e) => handlePINChange(e, index)} // Handle backspace
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      fontSize: '3rem', // Adjust this for larger asterisks
                    },
                  }}
                  sx={{
                    width: 90, // Bigger boxes
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
              ))}
            </Box>


          )}
        </Sheet>
      </BackgroundContainer>
    </>
  );
}
