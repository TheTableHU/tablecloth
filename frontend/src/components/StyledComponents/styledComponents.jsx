import { styled } from '@mui/system';
import Button from '@mui/joy/Button';

// Styled components
export const BackgroundContainer = styled('div')({
    backgroundImage: `
      linear-gradient(
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.5)
      ), 
      url(/PageBkg.svg)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
  });
  
 export const StyledForm = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  });
  
 export const StyledImage = styled('img')({
    width: '60%',
    height: 'auto',
    marginBottom: '20px',
  });
  
 export const StyledButton = styled(Button)({
    marginTop: '10px',
  });

  export const StyledHeading = styled('h2')({
    color: '#2B3674',
    fontFamily: 'DM Sans, sans-serif', // Added sans-serif as a fallback
    fontSize: '34px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '42px', // 123.529%
    letterSpacing: '-0.68px',
  });