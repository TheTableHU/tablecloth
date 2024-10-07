import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useApi } from '../../../api';
import { toast } from 'react-toastify';
import { ToastWrapper } from '../../Wrappers';

// Example roles data for the Autocomplete
const roles = ['admin', 'worker', 'user'];

export const AddUserButton = ({ actions, setActions }) => {
  const api = useApi();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [hNumber, setHNumber] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCloseModal = () => {
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setHNumber('');
    setEmail('');
    setRole(null);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!name || !hNumber || !email || !role) {
      return;
    }
    setLoading(true);
    let response = await api.addUser(name, hNumber, role, email);

    if (response.status == 409) {
      toast.error('User already exists');
    } else if (response.status == 200) {
      toast.success('Account created and credentials sent to ' + email);
      setActions(actions + 1);
    } else {
      toast.error('Error while creating user');
    }
    setLoading(false);
    handleCloseModal();
  };

  // Ensure H# only contains numbers
  const handleHNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    setHNumber(value);
  };

  // Disable Add button if any field is empty or role is not selected
  const isFormValid = name && hNumber && email && role;

  return (
    <>
      <ToastWrapper />
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#4318FF',
          borderRadius: '20px',
          padding: '10px 20px',
          width: '200px',
          '&:hover': {
            backgroundColor: '#3a16e6',
          },
        }}
        startIcon={<AddCircleIcon />}
        onClick={() => setShowForm(true)}

      >
        Add User
      </Button>

      {/* Modal dialog */}
      <Dialog open={showForm} onClose={handleCloseModal}>
        <DialogTitle>Add a New User</DialogTitle>
        <form onSubmit={handleAddUser}>
          <DialogContent>
            <TextField
              required
              autoFocus
              id="nameRequired"
              label="Name"
              fullWidth
              margin="dense"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              required
              id="hNumberRequired"
              label="H#"
              fullWidth
              margin="dense"
              value={hNumber}
              onChange={handleHNumberChange}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Only allow numeric input
            />
            <TextField
              required
              id="emailRequired"
              label="Email"
              fullWidth
              type="email"
              margin="dense"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Autocomplete
              disablePortal
              options={roles}
              fullWidth
              value={role}
              onChange={(event, newValue) => setRole(newValue)}
              renderInput={(params) => <TextField {...params} label="Role" />}
              sx={{ marginTop: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" disabled={!isFormValid || loading}>
              {loading? 'Creating account...' : 'Add'}
            </Button>
            <Button onClick={handleCloseModal} variant="outlined">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
