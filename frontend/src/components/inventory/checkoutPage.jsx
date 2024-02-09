import React from 'react';
import { useEffect, useState } from 'react';
import config from '../../config.jsx';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { ToastWrapper, toast, ItemList, ItemForm } from '../../Wrappers.jsx';
import './checkoutPage.css';

export default function CheckoutPage() {
  const [receivedData, setReceivedData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(config.host + '/api/inventory/checkout');
        const data = await response.json();

        if (data.success) {
          setReceivedData(data.data);
        } else {
          console.error('Error fetching inventory:', data.error);
          // Set an empty array or handle the error accordingly
          setReceivedData([]);
        }
      } catch (error) {
        setReceivedData([]);
      }
    };

    fetchData();
  }, []);

  function addButton() {
    if (!selectedItem) {
      toast.warning('Please select an item.');
    } else if (quantity <= 0) {
      toast.warning('Please select a valid quantity.');
    } else {
      const selectedInventoryItem = receivedData.find((item) => item.item === selectedItem);

      if (selectedInventoryItem) {
        const newItem = {
          id: selectedInventoryItem.id,
          primaryText: selectedItem,
          secondaryText: `Quantity: ${quantity}`,
          checkoutQuantity: quantity,
        };

        setItems((prevItems) => [...prevItems, newItem]);
        setSelectedItem('');
        setQuantity(1);
      } else {
        console.error();
      }
    }
  }

  function deleteButton(itemId) {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }

  // Submit the items to the backend
  // If override is true, then the user has entered the correct password and the items will be submitted regardless of the limit
  // If override is false, items will be submitted only if they are within the limit
  async function handleSubmit(override) {
    if (items.length !== 0) {
      await fetch(config.host + '/api/inventory/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, override }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            toast.success('Successfully submitted data.');
            setItems([]);
            if (override) {
              toast.success('Override successful!');
            }
          } else if (data.category != null) {
            toast.error(
              <div>
                Uh oh! {data.category} is over the limit!
                <br />
                <br />
                <a href="#" onClick={handleOverride}>
                  Override
                </a>
              </div>,
            );
          }
        })
        .catch((error) => {
          console.error('Error submitting data:', error);
        });
    } else {
      toast.error('Please add items before submitting.');
    }
  }

  function handleOverride() {
    const password = prompt('Please enter the password to override.');
    // Correct password will be sent to local user but this is just a deterrence for now to non board members
    if (password === '0316') {
      handleSubmit(true);
    } else {
      toast.error('Incorrect password.');
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
            handleSubmit(false);
          }}
        >
          Submit
        </Button>
      </div>
    </>
  );
}
