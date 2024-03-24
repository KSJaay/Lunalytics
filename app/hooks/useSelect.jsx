// import dependencies
import { useState } from 'react';

const useSelect = (closeOnSelect, defaultValue = []) => {
  const [values, setValues] = useState({
    isOpen: false,
    selectedIds: defaultValue,
    search: '',
  });

  const toggleSelect = () => {
    return setValues((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const handleSearch = (e) => {
    return setValues((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleItemSelect = (id) => {
    if (closeOnSelect) {
      return setValues((prev) => ({
        ...prev,
        selectedIds: prev.selectedIds.push(id),
        isOpen: !prev.isOpen,
      }));
    }

    return setValues((prev) => ({
      ...prev,
      selectedIds: prev.selectedIds.push(id),
    }));
  };

  return {
    selectIsOpen: values.isOpen,
    selectedIds: values.selectedIds,
    selectSearch: values.search,
    handleSearch,
    handleItemSelect,
    toggleSelect,
  };
};

export default useSelect;
