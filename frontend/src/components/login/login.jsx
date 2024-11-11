import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Button from '@mui/joy/Button';
import ColoredLogo from './Assets/ColoredLogo.png';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  BackgroundContainer,
  StyledForm,
  StyledImage,
} from '../StyledComponents/styledComponents.jsx';
import { useApi } from '../../../api.js';
import InputAdornment from '@mui/material/InputAdornment';
import { Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastWrapper } from '../../Wrappers.jsx';
import TrainingModules from '../users/training.jsx';
import UserSidebar from './sidebar.jsx';
import { Route, Routes } from 'react-router-dom';
import Logout from './logout.jsx';

const ContentWrapper = styled('div')({
  marginLeft: '100px',
  maxHeight: '100vh',
});

export default function RequireLogin({ children, isTrained, setIsTrained, counter, setCounter }) {
  const api = useApi();
  const [lastTrainingDate, setLastTrainingDate] = useState(() => new Date(sessionStorage.getItem('lastTrainingDate')));

  useEffect(() => {
    const checkTraining = () => {
      const currentDate = new Date();
      const fourMonthsAgo = new Date();
      const trainingD = sessionStorage.getItem('lastTrainingDate');
      fourMonthsAgo.setMonth(currentDate.getMonth() - 4);
      if (trainingD === 'null' || trainingD === null || new Date(trainingD) < fourMonthsAgo) {
        setIsTrained(false);
      } else {
        setIsTrained(true);
      }
    };

    checkTraining();
    
    const handleStorageChange = () => {
      const newTrainingDate = new Date(sessionStorage.getItem('lastTrainingDate'));
      setLastTrainingDate(newTrainingDate);
      checkTraining(); // Check training status when storage changes
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setIsTrained, counter]);

  useEffect(() => {
    if (!api.loggedIn || api.isTokenExpired) {
      // api.setToken(null);
    } else {
      // Check training again after login state changes
      const trainingD = sessionStorage.getItem('lastTrainingDate');
      if (trainingD !== 'null' && trainingD !== null) {
        const trainingDate = new Date(trainingD);
        const fourMonthsAgo = new Date();
        fourMonthsAgo.setMonth(new Date().getMonth() - 4);
        if (trainingDate >= fourMonthsAgo) {
          setIsTrained(true);
        } else {
          setIsTrained(false);
        }
      } else {
        setIsTrained(false);
      }
    }
  }, [api.loggedIn, api.isTokenExpired, setIsTrained]);
  useEffect(() => {
    if (!api.loggedIn || api.isTokenExpired) {
      // api.setToken(null); 
    }
  }, [api]);

  if (api.loggedIn && api.isTokenExpired == false) {
    if (!isTrained) {

      return (
        <>
          <ToastWrapper />
          <ContentWrapper>
            <UserSidebar userName={api.name} />
            <TrainingModules isTrained={isTrained} setIsTrained={setIsTrained} counter={counter} setCounter={setCounter}/>
            <Routes>
              <Route path="/logout" element={<Logout  isTrained={isTrained} setIsTrained={setIsTrained} counter={counter} setCounter={setCounter}/>} />
            </Routes>
          </ContentWrapper>
        </>
      );
    } else {
      return <>{children}</>;
    }
  } else {
    return (
      <>
        <div className="background"></div>
        <Login />
      </>
    );
  }
}

export function Login() {
  const api = useApi();
  const [hNumber, setHNumber] = useState('');
  const [PIN, setPIN] = useState(Array(4).fill(''));
  const [showPINInput, setShowPINInput] = useState(false);

  useEffect(() => {
    if (showPINInput) {
      document.getElementById(`pin-0`).focus();
    }
  }, [showPINInput]);
  const handleHNumberSubmit = async (e) => {
    e.preventDefault();
    if (hNumber != '') setShowPINInput(true);
  };

  const handlePINChange = (e, index) => {
    const { value } = e.target;

    if (/^\d$/.test(value)) {
      const newPIN = [...PIN];
      newPIN[index] = value;
      setPIN(newPIN);

      if (index < 3) {
        document.getElementById(`pin-${index + 1}`).focus();
      }

      if (index === 3) {
        handlePINSubmit(newPIN.join(''));
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      const newPIN = [...PIN];
      newPIN[index] = '';
      setPIN(newPIN);

      if (index > 0) {
        document.getElementById(`pin-${index - 1}`).focus();
      }
    }
  };

  const handlePINSubmit = async (finalPIN) => {
    try {
      setHNumber(hNumber.substring(0, 8));
      let response = await api.login(hNumber, finalPIN);
      if (response.status == 401) {
        setPIN(Array(4).fill(''));
        document.getElementById(`pin-${0}`).focus();
        toast.error('Incorrect PIN, try again');
      } else if (response.status == 404) {
        setPIN(Array(4).fill(''));
        document.getElementById(`pin-${0}`).focus();
        setHNumber('');
        setShowPINInput(false);
        toast.error('H# Not Found, please try again');
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
                autoComplete="off"
                id="outlined-start-adornment"
                value={hNumber}
                onChange={(e) => {
                  if (/^\d+$|^$/.test(e.target.value)) {
                    // Only accept digits, allow clearing input
                    setHNumber(e.target.value);
                  }
                }}
                sx={{
                  m: 1,
                  width: '40ch', // Bigger input width
                }}
                InputProps={{
                  type: 'text',
                  inputMode: 'numeric',
                  style: {
                    fontSize: '1.5rem', // Bigger font for H#
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 500 }}>H</Typography>
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
