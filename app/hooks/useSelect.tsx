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

  const handleItemSelect = (id, remove = false) => {
    if (remove) {
      return setValues((prev) => {
        const selectedIds = prev.selectedIds.filter(
          (selectedId) => selectedId !== id
        );

        return {
          ...prev,
          selectedIds,
          isOpen: closeOnSelect ? !prev.isOpen : prev.isOpen,
        };
      });
    }

    return setValues((prev) => {
      const selectedIds = [...prev.selectedIds, id];

      return {
        ...prev,
        selectedIds,
        isOpen: closeOnSelect ? !prev.isOpen : prev.isOpen,
      };
    });
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
