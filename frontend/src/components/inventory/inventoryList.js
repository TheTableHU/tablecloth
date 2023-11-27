import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import config from '../../config'

export default function InventoryList() {
  const [columns, setColumns] = useState([])
  const [rows, setRows] = useState([])

  console.log('Fetching inventory: ' + config.host + '/api/inventory')
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(config.host + '/api/inventory')
        const data = await response.json()

        if (data.success) {
          // Assuming the API response includes a 'columns' property
          const apiColumns = data.columns || []
          setColumns(apiColumns)

          setRows(data.data)
        } else {
          console.error('Error fetching inventory:', data.error)
          // Set an empty array or handle the error accordingly
          setRows([])
        }
      } catch (error) {
        console.error('Network error:', error)
        // Set an empty array or handle the error accordingly
        setRows([])
      }
    }

    fetchData()
  }, [])

  return (
    <Box sx={{ height: '55vw', width: '100vw' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} cellEditMode="cellClick" />
    </Box>
  )
}
