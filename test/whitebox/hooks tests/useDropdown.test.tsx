import { renderHook, act } from '@testing-library/react';
import useDropdown from '../../../app/hooks/useDropdown';

describe('useDropdown', () => {
  test('should initialize with default state (isOpen false, selectedId null)', () => {
    const { result } = renderHook(() => useDropdown());
    expect(result.current.dropdownIsOpen).toBe(false);
    expect(result.current.selectedId).toBeNull();
  });

  test('should initialize with a default selectedId if provided', () => {
    const { result } = renderHook(() => useDropdown(false, 'default-id'));
    expect(result.current.dropdownIsOpen).toBe(false);
    expect(result.current.selectedId).toBe('default-id');
  });

  test('toggleDropdown should toggle isOpen state', () => {
    const { result } = renderHook(() => useDropdown());

    // Initially false
    expect(result.current.dropdownIsOpen).toBe(false);

    act(() => result.current.toggleDropdown());
    expect(result.current.dropdownIsOpen).toBe(true);

    act(() => result.current.toggleDropdown());
    expect(result.current.dropdownIsOpen).toBe(false);
  });

  describe('handleDropdownSelect', () => {
    test('should set selectedId without closing when closeOnSelect is false', () => {
      const { result } = renderHook(() => useDropdown(false));

      expect(result.current.dropdownIsOpen).toBe(false);
      expect(result.current.selectedId).toBeNull();

      act(() => result.current.handleDropdownSelect('item1'));
      expect(result.current.selectedId).toBe('item1');
      expect(result.current.dropdownIsOpen).toBe(false); // should not toggle
    });

    test('should set selectedId and toggle isOpen when closeOnSelect is true', () => {
      const { result } = renderHook(() => useDropdown(true));

      expect(result.current.dropdownIsOpen).toBe(false);
      expect(result.current.selectedId).toBeNull();

      act(() => result.current.handleDropdownSelect('item2'));
      expect(result.current.selectedId).toBe('item2');
      expect(result.current.dropdownIsOpen).toBe(true); // toggled

      act(() => result.current.handleDropdownSelect('item3'));
      expect(result.current.selectedId).toBe('item3');
      expect(result.current.dropdownIsOpen).toBe(false); // toggled again
    });
  });

  test('should maintain state consistency with multiple toggles and selects', () => {
    const { result } = renderHook(() => useDropdown(true, 'start'));

    expect(result.current.dropdownIsOpen).toBe(false);
    expect(result.current.selectedId).toBe('start');

    act(() => result.current.toggleDropdown());
    expect(result.current.dropdownIsOpen).toBe(true);

    act(() => result.current.handleDropdownSelect('item1'));
    expect(result.current.selectedId).toBe('item1');
    expect(result.current.dropdownIsOpen).toBe(false);

    act(() => result.current.toggleDropdown());
    expect(result.current.dropdownIsOpen).toBe(true);
  });
});
