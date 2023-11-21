// ToastWrapper.js

import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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

export { ToastWrapper, toast }
