import React from 'react';
import { useEffect, useState } from 'react';
import config from '../../config.jsx';
import './addItemPage.css';
import { TextField, Select, FormControl, MenuItem, InputLabel, Button } from '@mui/material';
import { ToastWrapper, toast } from '../../Wrappers.jsx';
import './checkoutPage.css';

export default function CheckoutPage() {
  const [categories, setCategories] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  function handleItemNameChange(e) {
    setItemName(e.target.value);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(config.host + '/api/inventory/getCategories');
        const data = await response.json();

        if (data.success) {
          let uniqueCategories = [];

          data.data.forEach((item) => {
            const category = { id: item.categoryId, name: item.Category };

            if (!uniqueCategories.some((c) => c.id === category.id)) {
              uniqueCategories.push(category);
            }
          });

          setCategories(uniqueCategories);
        } else {
          console.error('Error fetching inventory:');
          setCategories([]);
        }
      } catch (error) {
        setCategories([]);
      }
    };

    fetchData();
  }, []);

  async function handleSubmit() {
    let selectedCategoryId = categories.find((category) => category.name === selectedCategory).id;

    let response = await fetch(config.host + '/api/inventory/additem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: itemName, quantity: quantity, category: selectedCategoryId }),
    });

    let data = await response.json();

    if (data.success) {
      toast.success('Successfully submitted data.');
      setItemName('');
      setQuantity(1);
      setSelectedCategory('');
    } else {
      toast.error('Error submitting data.');
    }
  }

  return (
    <div className="addItem">
      <ToastWrapper />
      <h1>Add New Item</h1>
      <div className="addItemFormContainer">
        <div className="formRow">
          <FormControl fullWidth>
            <TextField
              id="home"
              value={itemName}
              onChange={handleItemNameChange}
              label="Item Name"
              helperText="Please be specific"
            />
          </FormControl>
        </div>

        <div className="formRow">
          <FormControl fullWidth>
            <TextField
              className="quantityInput"
              id="quantity"
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </FormControl>
        </div>

        <div className="formRow">
          <FormControl fullWidth>
            <InputLabel htmlFor="Category">Category</InputLabel>
            <Select
              value={selectedCategory}
              labelId="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category, index) => (
                <MenuItem key={index} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div id="submitButtonContainer">
          <Button
            variant="contained"
            className="submitButton"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
