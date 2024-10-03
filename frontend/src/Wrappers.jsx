// Wrappers.jsx

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

const ToastWrapper = () => {
  return (
    <ToastContainer
      style={{ fontSize: '18px', top: '60px', right: '10px', width: '300px' }}
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
    />
  );
};

ToastWrapper.propTypes = {};

const HNumWrapper = ({ value, onChange }) => {
  return (
    <TextField
      required
      autoFocus
      label="H Number"
      value={value}
      onChange={onChange}
      InputProps={{
        type: 'text',
        inputMode: 'numeric',
        style: {
          appearance: 'textfield',
        },
        startAdornment: (
          <Typography variant="body1" color="textSecondary">
            H
          </Typography>
        ),
        inputProps: {
          pattern: '^[0-9]{8}$',
        },
      }}
    />
  );
};

HNumWrapper.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const ItemForm = ({
  receivedData,
  selectedItem,
  setSelectedItem,
  quantity,
  setQuantity,
  addButton,
}) => {
  return (
    <Box component="form" className="formContainer" noValidate autoComplete="off">
      <Autocomplete
        id="itemSelect"
        className="itemSelect"
        options={receivedData}
        getOptionLabel={(option) => option.item}
        value={receivedData.find((option) => option.item === selectedItem) || null}
        onChange={(_, newValue) => setSelectedItem(newValue?.item || '')}
        renderInput={(params) => <TextField {...params} label="Select Item" />}
        isOptionEqualToValue={(option, value) => option.item === value.item}
      />

      <TextField
        className="quantityInput"
        id="quantity"
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <Button variant="contained" className="addButton" onClick={() => addButton()}>
        Add Item
      </Button>
    </Box>
  );
};

ItemForm.propTypes = {
  receivedData: PropTypes.array.isRequired,
  selectedItem: PropTypes.string.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
  addButton: PropTypes.func.isRequired,
};

const ItemList = ({ items, deleteButton, updateQuantity }) => {
  return (
    <List className="itemListContainer">
      {items.map((item) => (
        <ListItem key={item.id} className="listItem">
          {/* Display image if imageLink exists */}
          {item.imageLink && item.imageLink !== 'null' && item.imageLink !== null && (
            <Box
              component="img"
              src={item.imageLink}
              sx={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
                marginRight: '10px',
                borderRadius: '4px',
              }}
            />
          )}

          {/* Item details (name, quantity) */}
          <Box display="flex" flexDirection="column" flexGrow={1}>
            <ListItemText primary={item.primaryText} />
            
            {/* Quantity input field */}
            <TextField
              size="small"
              type="number"
              value={item.checkoutQuantity}
              label="Quantity"
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
              inputProps={{ min: 1 }}
              sx={{ width: '80px', marginTop: '8px' }}
            />
          </Box>

          {/* Delete item button */}
          <IconButton edge="end" aria-label="delete" onClick={() => deleteButton(item.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

ItemList.propTypes = {
  items: PropTypes.array.isRequired,
  deleteButton: PropTypes.func.isRequired,
  updateQuantity: PropTypes.func.isRequired,
};
export { ToastWrapper, toast, HNumWrapper, ItemForm, ItemList };
