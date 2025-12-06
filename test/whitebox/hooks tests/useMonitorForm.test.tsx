import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import useMonitorForm from '../../../app/hooks/useMonitorForm';
import handleMonitor from '../../../app/handlers/monitor';
import monitorValidators from '../../../shared/validators/monitor';

// Mock handleMonitor
jest.mock('../../../app/handlers/monitor', () => jest.fn());

// Mock monitorValidators
jest.mock('../../../shared/validators/monitor', () => ({
  http: jest.fn(() => false),
  ping: jest.fn(() => false),
}));

// Test wrapper component
const HookWrapper = ({
  values = {},
  isEdit = false,
  closeModal = jest.fn(),
  setMonitor = jest.fn(),
  setPageId = jest.fn(),
}) => {
  const hook = useMonitorForm(values, isEdit, closeModal, setMonitor, setPageId);
  return (
    <div data-testid="hook-values">{JSON.stringify(hook.inputs)}</div>
  );
};

describe('useMonitorForm hook', () => {
  const closeModalMock = jest.fn();
  const setMonitorMock = jest.fn();
  const setPageIdMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. initializes with default inputs', () => {
    render(
      <HookWrapper
        closeModal={closeModalMock}
        setMonitor={setMonitorMock}
        setPageId={setPageIdMock}
      />
    );
    expect(screen.getByTestId('hook-values').textContent).toContain('"type":"http"');
    expect(screen.getByTestId('hook-values').textContent).toContain('"method":"HEAD"');
  });

  test('2. initializes with provided values', () => {
    render(
      <HookWrapper
        values={{ type: 'ping', method: 'GET' }}
        closeModal={closeModalMock}
        setMonitor={setMonitorMock}
        setPageId={setPageIdMock}
      />
    );
    expect(screen.getByTestId('hook-values').textContent).toContain('"type":"ping"');
    expect(screen.getByTestId('hook-values').textContent).toContain('"method":"GET"');
  });

  test('3. handleInput updates input state', () => {
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({}, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.handleInput('method', 'POST');
    expect(hookRef.inputs.method).toBe('POST');
  });

  test('4. handleActionButtons "Cancel" calls closeModal', () => {
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({}, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.handleActionButtons('Cancel')();
    expect(closeModalMock).toHaveBeenCalled();
  });

  test('5. handleActionButtons "Create" with valid input calls handleMonitor', () => {
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({}, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.handleActionButtons('Create')();
    expect(handleMonitor).toHaveBeenCalled();
  });

  test('6. handleActionButtons sets errors for invalid input', () => {
    monitorValidators.http.mockReturnValue({ name: 'Required' });
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({ type: 'http' }, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.handleActionButtons('Create')();
    expect(hookRef.errors).toEqual({ name: 'Required' });
    expect(hookRef.errorPages.has('basic')).toBe(true);
  });

  test('7. getPagesWithErrors maps errors to pages correctly', () => {
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({}, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    const pages = hookRef.getPagesWithErrors({ interval: 'Invalid' });
    expect(pages.has('interval')).toBe(true);
  });

  test('8. handleActionButtons does nothing for unknown action', () => {
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({}, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    expect(() => hookRef.handleActionButtons('Unknown')()).not.toThrow();
  });

  test('9. handleActionButtons clears errors when input is valid', () => {
    monitorValidators.http.mockReturnValue(false);
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({ type: 'http' }, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.errors = { name: 'Required' };
    hookRef.handleActionButtons('Create')();
    expect(hookRef.errors).toEqual({});
    expect(hookRef.errorPages.size).toBe(0);
  });

  test('10. handleInput does not remove other inputs', () => {
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({ type: 'ping', method: 'GET' }, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.handleInput('retry', 5);
    expect(hookRef.inputs.type).toBe('ping');
    expect(hookRef.inputs.retry).toBe(5);
  });

  test('11. errorPages tracks multiple errors', () => {
    monitorValidators.http.mockReturnValue({ name: 'Required', method: 'Invalid' });
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({ type: 'http' }, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.handleActionButtons('Create')();
    expect(hookRef.errorPages.has('basic')).toBe(true);
  });

  test('12. handleActionButtons sets first pageId from errors', () => {
    monitorValidators.http.mockReturnValue({ name: 'Required', interval: 'Invalid' });
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({ type: 'http' }, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.handleActionButtons('Create')();
    expect(setPageIdMock).toHaveBeenCalledWith('basic');
  });

  test('13. handleInput works with undefined initial values', () => {
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm(undefined, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.handleInput('interval', 120);
    expect(hookRef.inputs.interval).toBe(120);
  });

  test('14. handleActionButtons works with isEdit = true', () => {
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({}, true, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.handleActionButtons('Create')();
    expect(handleMonitor).toHaveBeenCalledWith(hookRef.inputs, true, closeModalMock, setMonitorMock);
  });

  test('15. handleInput allows empty string values', () => {
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({}, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.handleInput('name', '');
    expect(hookRef.inputs.name).toBe('');
  });

  test('16. errorPages does not include unknown keys', () => {
    monitorValidators.http.mockReturnValue({ unknown: 'Invalid' });
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({}, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.handleActionButtons('Create')();
    expect(hookRef.errorPages.has('unknown')).toBe(false);
  });

  test('17. handleActionButtons logs when validator missing', () => {
    monitorValidators.ping = undefined;
    console.log = jest.fn();
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({ type: 'ping' }, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.handleActionButtons('Create')();
    expect(console.log).toHaveBeenCalledWith("Validator doesn't exist");
  });

  test('18. handleActionButtons does not call handleMonitor if errors exist', () => {
    monitorValidators.http.mockReturnValue({ name: 'Required' });
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({ type: 'http' }, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.handleActionButtons('Create')();
    expect(handleMonitor).not.toHaveBeenCalled();
  });

  test('19. handleInput updates complex objects', () => {
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({}, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    const newIcon = { id: 'icon2', name: 'Icon2', url: 'url2' };
    hookRef.handleInput('icon', newIcon);
    expect(hookRef.inputs.icon).toEqual(newIcon);
  });

  test('20. handleActionButtons clears previous errorPages on valid input', () => {
    monitorValidators.http.mockReturnValue(false);
    let hookRef: any;
    const Test = () => {
      hookRef = useMonitorForm({}, false, closeModalMock, setMonitorMock, setPageIdMock);
      return null;
    };
    render(<Test />);
    hookRef.errorPages = new Set(['basic']);
    hookRef.handleActionButtons('Create')();
    expect(hookRef.errorPages.size).toBe(0);
  });
});
