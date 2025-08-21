// import dependencies
import { useState } from 'react';

const useDropdown = (
  closeOnSelect?: boolean,
  defaultValue?: string | null | undefined
) => {
  const [values, setValues] = useState({
    isOpen: false,
    selectedId: defaultValue || null,
  });

  const toggleDropdown = () => {
    return setValues((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const handleDropdownSelect = (id: string) => {
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
