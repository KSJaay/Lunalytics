// import dependencies
import { useState } from 'react';

const useDropdown = (closeOnSelect, defaultValue = null) => {
  const [values, setValues] = useState({
    isOpen: false,
    selectedId: defaultValue,
  });

  const toggleDropdown = () => {
    return setValues((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const handleDropdownSelect = (id) => {
    if (closeOnSelect) {
      return setValues((prev) => ({
        selectedId: id,
        isOpen: !prev.isOpen,
      }));
    }

    return setValues((prev) => ({ ...prev, selectedId: id }));
  };

  return {
    dropdownIsOpen: values.isOpen,
    selectedId: values.selectedId,
    handleDropdownSelect,
    toggleDropdown,
  };
};

export default useDropdown;
