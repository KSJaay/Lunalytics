import { renderHook, act } from '@testing-library/react';
import useDropdown from '../useDropdown';

describe('useDropdown Hook', () => {
  it('should initialize with default state when no defaultValue is provided', () => {
    const { result } = renderHook(() => useDropdown());
    expect(result.current.dropdownIsOpen).toBe(false);
    expect(result.current.selectedId).toBeNull();
  });

  it('should initialize with defaultValue if provided', () => {
    const { result } = renderHook(() => useDropdown(false, 'abc'));
    expect(result.current.dropdownIsOpen).toBe(false);
    expect(result.current.selectedId).toBe('abc');
  });

  it('should toggle dropdown open/close', () => {
    const { result } = renderHook(() => useDropdown());

    act(() => {
      result.current.toggleDropdown();
    });
    expect(result.current.dropdownIsOpen).toBe(true);

    act(() => {
      result.current.toggleDropdown();
    });
    expect(result.current.dropdownIsOpen).toBe(false);
  });

  it('should select item without closing dropdown if closeOnSelect is false', () => {
    const { result } = renderHook(() => useDropdown(false));

    act(() => {
      result.current.handleDropdownSelect('item1');
    });

    expect(result.current.selectedId).toBe('item1');
    expect(result.current.dropdownIsOpen).toBe(false); // dropdown stays the same
  });

  it('should select item and toggle dropdown if closeOnSelect is true', () => {
    const { result } = renderHook(() => useDropdown(true));

    // Initially closed
    expect(result.current.dropdownIsOpen).toBe(false);

    // Open the dropdown first
    act(() => {
      result.current.toggleDropdown();
    });
    expect(result.current.dropdownIsOpen).toBe(true);

    // Select an item
    act(() => {
      result.current.handleDropdownSelect('item2');
    });

    expect(result.current.selectedId).toBe('item2');
    expect(result.current.dropdownIsOpen).toBe(false); // dropdown closed
  });
});
