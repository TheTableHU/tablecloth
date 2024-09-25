// useDialog.js
import { useState } from 'react';

const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);

  const openDialog = (user) => {
    setData(user);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setData(null);
    setIsOpen(false);
  };

  return { isOpen, data, openDialog, closeDialog };
};

export default useDialog;
