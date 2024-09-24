import React from 'react';
import { Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { styled } from '@mui/material/styles';

// Hidden input field for file uploads
const VisuallyHiddenInput = styled('input')({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  clipPath: 'inset(50%)',
  border: 0,
});

export const AddUserButton = () => {
  const handleFileChange = (event) => {
    const files = event.target.files;
    console.log(files);
  };

  return (
    <Button
      component="label"
      variant="contained"
      sx={{
        backgroundColor: '#4318FF', // Use backgroundColor for hex values
        borderRadius: '20px',
        padding: '10px 20px',
        width: '200px',
        '&:hover': {
          backgroundColor: '#3a16e6', // Optional: Add a hover effect
        },
      }}
      startIcon={<AddCircleIcon />}
    >
      Add User
      <VisuallyHiddenInput
        type="file"
        multiple
        onChange={handleFileChange}
      />
    </Button>
  );
};
