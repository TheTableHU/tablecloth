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

const HNumWrapper = () => {
  const [inputHNum, setHNum] = useState('')

  const handleHNumChange = event => {
    const value = event.target.value.slice(0, 8) // Limit to one character
    setHNum(value)
  }

  return (
    <TextField
      required
      label="H Number"
      value={inputHNum}
      onChange={handleHNumChange}
      InputProps={{
        type: 'number',
        inputMode: 'numeric',
        style: {
          appearance: 'textfield', // For Chrome
        },
        startAdornment: (
          <Typography variant="body1" color="textSecondary">
            H
          </Typography>
        ),
      }}
    />
  )
}

export { ToastWrapper, toast, HNumWrapper }
