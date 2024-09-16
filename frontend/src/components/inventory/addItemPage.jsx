import React, { useEffect, useState } from 'react';
import config from '../../config.jsx';
import './addItemPage.css';
import './checkoutPage.css';
import Box from '@mui/material/Box';

import { TextField, Select, FormControl, MenuItem, InputLabel, Button } from '@mui/material';
import { ToastWrapper, toast } from '../../Wrappers.jsx';
import SearchIcon from '@mui/icons-material/Search';

export default function CheckoutPage() {
  const [categories, setCategories] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [maxItems, setMaxItems] = useState('');
  const [addedCat, setAddedCat] = useState(0);
  const [itemBarcode, setItemBarcode] = useState(null);
  const [itemImage, setItemImage] = useState(null);
  function handleItemNameChange(e) {
    setItemName(e.target.value);
  }

  const handleCloseModal = () => {
    setShowForm(false);
    setCategoryName('');
    setMaxItems('');
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    let response = await fetch(config.host + '/api/inventory/addCategory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: categoryName, maxQuantity: maxItems }),
    });

    let data = await response.json();

    if (data.success) {
      toast.success('Successfully added category.');
      setMaxItems(0);
      setCategoryName('');
      setAddedCat(addedCat + 1);
    } else {
      toast.error('Error submitting data.');
    }
    handleCloseModal();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(config.host + '/api/inventory/getCategories');
        const data = await response.json();

        if (data.success) {
          let uniqueCategories = [];

          data.data.forEach((item) => {
            const category = { id: item.id, name: item.name };
            uniqueCategories.push(category);
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
  }, [addedCat]);

  async function handleBarcodeLookup() {
    setItemImage(null);
    let response = await fetch(config.host + '/api/inventory/barcodeInfo/' + itemBarcode);
    let data = await response.json();
    let itemsAPI = data.items;
    let images;
    if (itemsAPI.length > 0) images = itemsAPI[0].images;
    if (images.length > 0) {
      setItemImage(images[0]);
      console.log(images[0]);
    }
    if (data.total > 0) {
      setItemName([itemsAPI[0].title]);
    }
  }

  async function handleSubmit() {
    let selectedCategoryId = categories.find((category) => category.name === selectedCategory).id;
    let response = await fetch(config.host + '/api/inventory/additem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        item: String(itemName),
        quantity: quantity,
        category: selectedCategoryId,
        barcode: String(itemBarcode),
        imageLink: String(itemImage),
      }),
    });

    let data = await response.json();
    if (data.success) {
      toast.success('Successfully submitted data.');
      setItemName('');
      setQuantity(1);
      setSelectedCategory('');
      setItemBarcode('');
      setItemImage(null);
    } else {
      let message = data.message || 'Error submitting form';
      toast.error(message);
      setItemName('');
      setQuantity(1);
      setSelectedCategory('');
      setItemBarcode('');
      setItemImage(null);
    }
  }
  async function handleKeypress(e) {
    if (e.key === 'Enter') {
      handleBarcodeLookup();
    }
  }

  return (
    <>
      {/*Middle section */}
      <div className="grid-container">
        <div className="grid-item item2">
          <div className="addItem">
            <ToastWrapper />
            <h1>Add New Item</h1>
            <div className="addItemFormContainer">
              <div className="formRow">
                <FormControl fullWidth>
                  <TextField
                    id="barcode"
                    className="barcodeInput"
                    value={itemBarcode}
                    onChange={(e) => {
                      setItemBarcode(e.target.value);
                    }}
                    onKeyDown={(e) => handleKeypress(e)}
                    label="Item Barcode"
                    autoFocus
                  />
                </FormControl>
                <Button className="buttonBarcode" variant="contained" onClick={handleBarcodeLookup}>
                  <SearchIcon></SearchIcon>
                </Button>
              </div>

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
                  <div className="category-row">
                    <Select
                      className="selectContainer"
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
                  </div>
                </FormControl>
                <Button variant="contained" onClick={() => setShowForm(true)}>
                  +
                </Button>
              </div>

              <div id="submitButtonContainer">
                <Button variant="contained" className="submitButton" onClick={handleSubmit}>
                  SUBMIT
                </Button>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="modal">
              <div className="modal-content">
                <form onSubmit={handleAddCategory}>
                  <div>
                    <TextField
                      type="text"
                      label="Category Name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <TextField
                      type="number"
                      value={maxItems}
                      label="Max Quantity"
                      onChange={(e) => setMaxItems(e.target.value)}
                      required
                    />
                  </div>
                  <div className="button-group">
                    <Button type="submit" variant="contained">
                      Add
                    </Button>
                    <Button type="button" variant="contained" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="grid-item item3">
          {itemImage && (<Box
            component="img"
            src={itemImage}
            sx={{
              justifyItems: 'center',
              width: '400px',
              height: '400px',
              objectFit: 'cover',
              marginRight: '10px',
              borderRadius: '4px'
            }}
          />)}
        </div>
      </div>
    </>
  );
}
