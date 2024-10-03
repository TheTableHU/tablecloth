import React, { useEffect, useState } from 'react';
import config from '../../config.jsx';
import Grid from '@mui/material/Grid'; 
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { ToastWrapper, toast, ItemList, ItemForm } from '../../Wrappers.jsx';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import './checkoutPage.css';
import { useNewApi } from '../../../api.js';

export default function CheckoutPage() {
  const api = useNewApi();
  const [receivedData, setReceivedData] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getCheckoutItems();
        const data = await response.json();

        if (data.success) {
          setReceivedData(data.data);
        } else {
          console.error('Error fetching inventory:', data.error);
          setReceivedData([]);
        }
      } catch (error) {
        setReceivedData([]);
      }
    };

    fetchData();
  }, []);
  function updateQuantity(itemId, newQuantity) {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, checkoutQuantity: newQuantity, secondaryText: `Quantity: ${newQuantity}` }
          : item,
      ),
    );
  }

  function addItem(itemId, itemName, quantityToAdd = 1) {
    const existingItem = items.find((item) => item.id === itemId);

    if (existingItem) {
      
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                checkoutQuantity: item.checkoutQuantity + quantityToAdd,
                secondaryText: `Quantity: ${item.checkoutQuantity + quantityToAdd}`,
              }
            : item,
        ),
      );
    } else {
      const newItemData = receivedData.find((item) => item.id === itemId);

      const newItem = {
        id: itemId,
        primaryText: itemName,
        secondaryText: `Quantity: ${quantityToAdd}`,
        checkoutQuantity: quantityToAdd,
        imageLink: newItemData?.imageLink || null
      };
      setItems((prevItems) => [...prevItems, newItem]);
    }
  }

  function addButton() {
    if (!selectedItem) {
      toast.warning('Please select an item.');
    } else if (quantity <= 0) {
      toast.warning('Please select a valid quantity.');
    } else {
      const selectedInventoryItem = receivedData.find((item) => item.item === selectedItem);

      if (selectedInventoryItem) {
        addItem(selectedInventoryItem.id, selectedItem, quantity);
        setSelectedItem('');
        setQuantity(1);
      } else {
        console.error('Selected item not found in inventory.');
        
      }
    }
  }

  function handleBarcodeSubmit() {
    if (barcode) {
      const scannedItem = receivedData.find((item) => item.barcode == barcode);

      if (scannedItem) {
        addItem(scannedItem.id, scannedItem.item);
        setBarcode('');
      } else {
        toast.error('Item with this barcode not found.');
        setBarcode('');
      }
    }
  }

  function deleteButton(itemId) {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }

  async function handleSubmit(override) {
    setLoading(true);
    try{
    if (items.length !== 0) {
      await api.submitCheckout(items, override)
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
  }catch(err){
    logger.err("Error when checking out: " + err.message)
  }finally{
    setLoading(false)
  }
  }

  function handleOverride() {
    const password = prompt('Please enter the password to override.');
    if (password === '0316') {
      handleSubmit(true);
    } else {
      toast.error('Incorrect password.');
    }
  }

  return (
    <>
      <ToastWrapper />
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            style={{
              left: '10px'
            }}
            id="barcodeInput"
            label="Scan Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBarcodeSubmit()}
            autoFocus
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <ItemForm
            receivedData={receivedData}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            quantity={quantity}
            setQuantity={setQuantity}
            addButton={addButton}
          />
        </Grid>
      </Grid>
      <Box>
        <ItemList items={items} deleteButton={deleteButton} updateQuantity={updateQuantity} />
      </Box>
      <Fab
        color="secondary"
        variant="extended"
        aria-label="checkout"
        disabled={loading}
        onClick={() => handleSubmit(false)}
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          fontSize: '20px',
          padding: '16px 32px',
          minWidth: '160px',
        }}
      >
        <ShoppingCartCheckoutIcon sx={{ mr: 1, fontSize: '30px' }} />
        {loading? 'Submitting items...' : "Checkout"}
      </Fab>
    </>
  );
}
