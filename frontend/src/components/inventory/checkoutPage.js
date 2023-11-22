import { useEffect, useState } from 'react'
import config from '../../config'

import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'

import { ToastWrapper, toast } from '../../Wrappers.js'
import './checkoutPage.css'

export default function CheckoutPage() {
  const [receivedData, setReceivedData] = useState([])
  const [selectedItem, setSelectedItem] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [items, setItems] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(config.host + '/api/checkout')
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

  function handleSubmit() {
    if (items.length !== 0) {
      fetch(config.host + '/api/checkout', {
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
      <Box component="form" className="formContainer" noValidate autoComplete="off">
        <Autocomplete
          id="itemSelect"
          className="itemSelect"
          options={receivedData}
          getOptionLabel={option => option.item}
          value={receivedData.find(option => option.item === selectedItem) || null}
          onChange={(_, newValue) => setSelectedItem(newValue?.item || '')}
          renderInput={params => <TextField {...params} label="Select Item" />}
          isOptionEqualToValue={(option, value) => option.item === value.item}
        />

        <TextField
          className="quantityInput"
          id="quantity"
          label="Quantity"
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
        />

        <Button variant="contained" className="addButton" onClick={() => addButton()}>
          Add Item
        </Button>
      </Box>
      <Box className="listContainer">
        <Grid item xs={12} md={6}>
          <div>
            <List>
              {items.map(
                item =>
                  item.id && (
                    <ListItem
                      key={item.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => deleteButton(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={item.primaryText} secondary={item.secondaryText} />
                    </ListItem>
                  )
              )}
            </List>
          </div>
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
