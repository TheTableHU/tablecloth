import { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import config from '../config'

export default function InventoryList() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'Item',
      headerName: 'Item',
      width: 150,
      editable: false,
    },
    {
      field: 'Quantity',
      headerName: 'Quantity',
      width: 200,
      editable: true,
    },
  ]

  const [rows, setRows] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(config.host + '/api/inventory')
        const data = await response.json()

        if (data.success) {
          const transformedRows = Object.keys(data.data).map((item, index) => ({
            id: index + 1,
            Item: item,
            Quantity: data.data[item],
          }))

          setRows(transformedRows)
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
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} cellEditMode="cellClick" />
    </Box>
  )
}
