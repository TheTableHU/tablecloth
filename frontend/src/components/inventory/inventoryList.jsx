import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import config from '../../config';
import { ToastWrapper, toast } from '../../Wrappers.jsx';
import { useNewApi } from '../../../api.js';
import { Search } from '../StyledComponents/SearchBar.jsx';


export default function InventoryList() {
  const api = useNewApi();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [search, setSearch] = useState('');

  const fetchInventory = async () => {
    try {
      const response = await api.fetchInventory();
      const data = await response.json();

      if (data.success) {
        const apiColumns = (data.columns || []).map(col => ({
          ...col,
        }));
        setColumns(apiColumns);
        setRows(data.data);
        setFilteredRows(data.data);
      } else {
        console.error('Error fetching inventory:', data.error);
        setRows([]);
      }
    } catch (error) {
      console.error('Network error:', error);
      setRows([]);
    }
  };

  useEffect(() => {
    fetchInventory();

    // Update every hour
    const intervalId = setInterval(fetchInventory, 450000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  useEffect(() => {
    if (search) {
      const filtered = rows.filter(row => {
        const searchLower = search.toLowerCase();
        console.log(row);
        return (
          row.barcode.toLowerCase().includes(searchLower) ||
          row.item.toLowerCase().includes(searchLower) ||
          row.Category.toLowerCase().includes(searchLower)
        );
      });
      setFilteredRows(filtered);
    } else {
      setFilteredRows(rows); // Show all users when search is empty
    }
  }, [search, rows]);

  // Send updated row to the server
  // Return true if successful, false otherwise
  const sendUpdatedRow = async (row) => {
    try {
      const response = await api.updateInventory(row);
      const data = await response.json();

      if (data.success) {
        toast.success('Your changes were saved successfully!');
        return true;
      } else {
        toast.error('Something went wrong saving your changes');
        return false;
      }
    } catch (error) {
      toast.error('Error saving your changes');
      return false;
    }
  };

  const handleRowUpdate = async (newRow, oldRow) => {
    if (!areObjectsEqual(newRow, oldRow)) {
      const result = await sendUpdatedRow(newRow);

      if (result) {
        newRow.updatedAt = 'Today';

        return newRow;
      } else {
        return oldRow;
      }
    } else {
      return oldRow;
    }
  };

  const handleRowUpdateError = () => {
    toast.error('There was an error saving your changes.');
  };

  function areObjectsEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  return (
    <>
      <ToastWrapper />
      <Search placeholder="Search an item" search={search} setSearch={setSearch}></Search>
      <Box sx={{ height: '96vh', width: '100%' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={5}
          cellEditMode="cellClick"
          processRowUpdate={handleRowUpdate}
          onProcessRowUpdateError={handleRowUpdateError}
        />
      </Box>
    </>
  );
}
