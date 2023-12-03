import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import config from '../../config'
import { ToastWrapper, toast } from '../../Wrappers.js'

export default function InventoryList() {
  const [columns, setColumns] = useState([])
  const [rows, setRows] = useState([])

  const fetchInventory = async () => {
    try {
      const response = await fetch(config.host + '/api/inventory')
      const data = await response.json()

      if (data.success) {
        const apiColumns = data.columns || []
        setColumns(apiColumns)
        setRows(data.data)
      } else {
        console.error('Error fetching inventory:', data.error)
        setRows([])
      }
    } catch (error) {
      console.error('Network error:', error)
      setRows([])
    }
  }

  useEffect(() => {
    fetchInventory()

    // Update every hour
    const intervalId = setInterval(fetchInventory, 3600000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const sendUpdatedRow = async row => {
    try {
      const response = await fetch(`${config.host}/api/inventory`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ row }),
      })

      if (response.ok) {
        toast.success('Your changes were saved successfully!')
      } else {
        toast.error('Something went wrong saving your changes')
      }
    } catch (error) {
      toast.error('Error saving your changes')
    }
  }

  const handleRowUpdate = async (newRow, oldRow) => {
    if (!areObjectsEqual(newRow, oldRow)) {
      sendUpdatedRow(newRow)
      newRow.updatedAt = 'Today'
      return newRow
    } else {
      return oldRow
    }
  }

  const handleRowUpdateError = params => {
    toast.error('There was an error saving your changes.')
  }

  function areObjectsEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) {
      return false
    }

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false
      }
    }

    return true
  }

  return (
    <>
      <ToastWrapper />
      <Box sx={{ height: '96vh', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          cellEditMode="cellClick"
          processRowUpdate={handleRowUpdate}
          onProcessRowUpdateError={handleRowUpdateError}
        />
      </Box>
    </>
  )
}
