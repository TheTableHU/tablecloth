// UsersTable.jsx
import React from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../StyledComponents/confirmationDialogs/ConfirmationDialog';
import useDialog from '../StyledComponents/customHooks/useDialog';

const UsersTable = () => {
  const rows = [
    { username: 'user1', hNumber:'H924924', email: 'user1@example.com', role: 'Admin' },
    { username: 'user2', hNumber:'H924924', email: 'user2@example.com', role: 'User' },
    // Add more rows as needed
  ];

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

  const handleDelete = () => {
    console.log(`Deleting user: ${selectedUserForDelete.username}`);
    closeDeleteDialog();
  };

  const handleReset = () => {
    console.log(`Resetting PIN for user: ${selectedUserForReset.username}`);
    closeResetDialog();
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ width: '100%', mt: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell align="right">H#</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="center">PIN</TableCell>
              <TableCell align="center">Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.username}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                <TableCell align="right">{row.hNumber}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">{row.role}</TableCell>
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
        message={`Are you sure you want to delete ${selectedUserForDelete?.username}?`}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
      />

      {/* Reset PIN Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isResetOpen}
        title="Confirm Reset PIN"
        message={`Are you sure you want to reset the PIN for ${selectedUserForReset?.username}?`}
        onClose={closeResetDialog}
        onConfirm={handleReset}
      />
    </>
  );
};

export default UsersTable;
