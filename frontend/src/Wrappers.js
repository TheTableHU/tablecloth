// ToastWrapper.js

import { React, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { TextField, Typography } from '@mui/material'

const ToastWrapper = () => {
  return (
    <ToastContainer
      style={{ fontSize: '18px', top: '60px', right: '10px', width: '300px' }}
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
    />
  )
}

const HNumWrapper = ({ value, onChange }) => {
  return (
    <TextField
      required
      label="H Number"
      value={value}
      onChange={onChange}
      InputProps={{
        type: 'number',
        inputMode: 'numeric',
        style: {
          appearance: 'textfield',
        },
        startAdornment: (
          <Typography variant="body1" color="textSecondary">
            H
          </Typography>
        ),
      }}
    />
  );
};

export { ToastWrapper, toast, HNumWrapper }
