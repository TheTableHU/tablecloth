import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../StyledComponents/confirmationDialogs/ConfirmationDialog';
import useDialog from '../StyledComponents/customHooks/useDialog';
import { useApi } from '../../../api';
import { toast } from 'react-toastify';
import { ToastWrapper } from '../../Wrappers';

const UsersTable = ({ search, setSearch, actions, setActions}) => {
  const api = useApi();
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      const data = await response.json();
      if (response.status === 200) {
        setUsersList(data);
        setFilteredUsers(data); // Show all users initially
      } else {
        console.error('Error fetching users:', data.error);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [actions]);

  // Filter users based on the search query
  useEffect(() => {
    if (search) {
      const filtered = usersList.filter(user => {
        const searchLower = search.toLowerCase();
        return (
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.hNumber.toLowerCase().includes(searchLower) ||
          user.role.toLowerCase().includes(searchLower)
        );
      });
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(usersList); // Show all users when search is empty
    }
  }, [search, usersList]);

  // Handle role change and update user data in backend
  const handleRoleChange = async (user, newRole) => {
    try {
      // Update the local state
      const updatedUser = { ...user, role: newRole };

      // Call the backend to update the user's role
      const response = await api.updateUser(updatedUser.name, updatedUser.hNumber, updatedUser.role, updatedUser.email);
      if (response.status === 200) {
        toast.success(`Role updated successfully for ${user.name}`);
        setActions(actions + 1); // Refresh the users list
      } else {
        toast.error('Error updating role');
      }
    } catch (error) {
      toast.error('Network error while updating role');
      console.error('Error updating role:', error);
    }
  };

  // Dialog state management
  const {
    isOpen: isDeleteOpen,
    data: selectedUserForDelete,
    openDialog: openDeleteDialog,
    closeDialog: closeDeleteDialog,
  } = useDialog();

  const {
    isOpen: isResetOpen,
    data: selectedUserForReset,
    openDialog: openResetDialog,
    closeDialog: closeResetDialog,
  } = useDialog();

  const handleDelete = async () => {
    let response = await api.deleteUser(selectedUserForDelete.hNumber);
    if (response.status === 200) {
      toast.success('User ' + selectedUserForDelete.name + ' has been deleted successfully');
    } else {
      toast.error('Error while trying to delete user');
    }
    closeDeleteDialog();
    setActions(actions + 1);
  };

  const handleReset = async () => {
    closeResetDialog();

    let response = await api.resetPIN(selectedUserForReset.hNumber);
    if (response.status === 200) {
      toast.success('New PIN has been sent to ' + selectedUserForReset.name);
    } else {
      toast.error('Error while trying to reset PIN');
    }
  };

  return (
    <>
      <ToastWrapper />
      <TableContainer component={Paper} sx={{ width: '100%', mt: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">H#</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="center">PIN</TableCell>
              <TableCell align="center">Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map(row => (
              <TableRow
                key={row.hNumber}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.hNumber}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">
                  <Select
                    value={row.role}
                    onChange={(e) => handleRoleChange(row, e.target.value)}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="worker">Worker</MenuItem>
                  </Select>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => openResetDialog(row)}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#FFCE20',
                        color: '#FFFFF',
                        borderRadius: '20px',
                        padding: '5px 10px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      Reset
                    </Button>
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => openDeleteDialog(row)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${selectedUserForDelete?.name}?`}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
      />

      {/* Reset PIN Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isResetOpen}
        title="Confirm Reset PIN"
        message={`Are you sure you want to reset the PIN for ${selectedUserForReset?.name}?`}
        onClose={closeResetDialog}
        onConfirm={handleReset}
      />
    </>
  );
};

export default UsersTable;
