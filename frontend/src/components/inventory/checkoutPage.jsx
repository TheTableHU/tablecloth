import { useEffect, useState } from 'react'
import config from '../../config.jsx'

import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

import { ToastWrapper, toast, ItemList, ItemForm } from '../../Wrappers.jsx'
import './checkoutPage.css'

export default function CheckoutPage() {
  const [receivedData, setReceivedData] = useState([])
  const [selectedItem, setSelectedItem] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [items, setItems] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(config.host + '/api/inventory/checkout')
        const data = await response.json()

        if (data.success) {
          setReceivedData(data.data)
        } else {
          console.error('Error fetching inventory:', data.error)
          // Set an empty array or handle the error accordingly
          setReceivedData([])
        }
      } catch (error) {
        setReceivedData([])
      }
    }

    fetchData()
  }, [])

  function addButton() {
    if (!selectedItem) {
      toast.warning('Please select an item.')
    } else if (quantity <= 0) {
      toast.warning('Please select a valid quantity.')
    } else {
      const selectedInventoryItem = receivedData.find(item => item.item === selectedItem)

      if (selectedInventoryItem) {
        const newItem = {
          id: selectedInventoryItem.id, // Adjust based on your item structure
          primaryText: selectedItem,
          secondaryText: `Quantity: ${quantity}`,
          checkoutQuantity: quantity,
        }

        setItems(prevItems => [...prevItems, newItem])
        setSelectedItem('')
        setQuantity(1)
      } else {
        console.error()
      }
    }
  }

  function deleteButton(itemId) {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }

  async function handleSubmit() {
    if (items.length !== 0) {
      await fetch(config.host + '/api/inventory/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }), // Simplify the object notation
      })
        .then(response => response.json())
        .then(data => {
          // Handle the response if needed
          toast.success('Successfully submitted data.')
          setItems([])
        })
        .catch(error => {
          console.error('Error submitting data:', error)
        })
    } else {
      toast.error('Please add items before submitting.')
    }
  }

  return (
    <>
      <ToastWrapper />
      <ItemForm
        receivedData={receivedData}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        quantity={quantity}
        setQuantity={setQuantity}
        addButton={addButton}
      />
      <Box className="listContainer">
        <Grid item xs={12} md={6}>
          <ItemList items={items} deleteButton={deleteButton} />
        </Grid>
      </Box>
      <div id="submitButtonContainer">
        <Button
          variant="contained"
          className="submitButton"
          onClick={() => {
            handleSubmit()
          }}
        >
          Submit
        </Button>
      </div>
    </>
  )
}
