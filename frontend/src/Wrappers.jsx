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
      autoClose={3000}
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
      label="H Number"
      value={value}
      onChange={onChange}
      InputProps={{
        type: 'number',
        inputMode: 'numeric',
        style: {
          appearance: 'textfield',
        },
        startAdornment: (
          <Typography variant="body1" color="textSecondary">
            H
          </Typography>
        ),
      }}
    />
  );
};

HNumWrapper.propTypes = {
  value: PropTypes.any.isRequired,
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

const ItemList = ({ items, deleteButton }) => {
  return (
    <List>
      {items.map(
        (item) =>
          item.id && (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => deleteButton(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={item.primaryText} secondary={item.secondaryText} />
            </ListItem>
          ),
      )}
    </List>
  );
};

ItemList.propTypes = {
  items: PropTypes.array.isRequired,
  deleteButton: PropTypes.func.isRequired,
};

export { ToastWrapper, toast, HNumWrapper, ItemForm, ItemList };
