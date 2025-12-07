// __tests__/monitor.test.ts
import handleMonitor from '../monitor';
import { toast } from 'react-toastify';

// Mock axios service
jest.mock('../../services/axios', () => ({
  createPostRequest: jest.fn(),
}));

import { createPostRequest } from '../../services/axios';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('handleMonitor', () => {
  const closeModal = jest.fn();
  const setMonitor = jest.fn();

  const form = {
    monitorId: '1',
    name: 'Test Monitor',
    url: 'http://example.com',
    retry: 3,
    interval: 30,
    retryInterval: 60,
    requestTimeout: 120,
    method: 'GET',
    headers: '{}',
    body: '{}',
    valid_status_codes: ['200'],
    type: 'http',
    notificationId: 'notif1',
    notificationType: 'All',
    ignoreTls: false,
    icon: { id: '1', name: 'Test', url: 'http://icon.com' },
  };

  // Suppress parseJson console.log
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call createPostRequest and show success toast on successful add', async () => {
    (createPostRequest as jest.Mock).mockResolvedValue({ data: { id: 1 } });

    await handleMonitor(form, false, closeModal, setMonitor);

    expect(createPostRequest).toHaveBeenCalledWith('/api/monitor/add', {
      ...form,
      headers: {},
      body: {},
    });

    expect(setMonitor).toHaveBeenCalledWith({ id: 1 });
    expect(toast.success).toHaveBeenCalledWith('Monitor been edited successfully');
    expect(closeModal).toHaveBeenCalled();
  });

  it('should call createPostRequest and show success toast on edit', async () => {
    (createPostRequest as jest.Mock).mockResolvedValue({ data: { id: 1 } });

    await handleMonitor(form, true, closeModal, setMonitor);

    expect(createPostRequest).toHaveBeenCalledWith('/api/monitor/edit', {
      ...form,
      headers: {},
      body: {},
    });

    expect(toast.success).toHaveBeenCalledWith('Monitor been added successfully');
    expect(closeModal).toHaveBeenCalled();
  });

  it('should call toast.error with 422 error message', async () => {
    (createPostRequest as jest.Mock).mockRejectedValue({
      response: { status: 422, data: 'Validation Error' },
    });

    await handleMonitor(form, false, closeModal, setMonitor);

    expect(toast.error).toHaveBeenCalledWith('Validation Error');
    expect(setMonitor).not.toHaveBeenCalled();
    expect(closeModal).not.toHaveBeenCalled();
  });

  it('should call toast.error on unknown error', async () => {
    (createPostRequest as jest.Mock).mockRejectedValue({});

    await handleMonitor(form, false, closeModal, setMonitor);

    expect(toast.error).toHaveBeenCalledWith(
      'Something went wrong, please try again later.'
    );
    expect(setMonitor).not.toHaveBeenCalled();
    expect(closeModal).not.toHaveBeenCalled();
  });

  it('should parse string headers and body into objects', async () => {
    (createPostRequest as jest.Mock).mockResolvedValue({ data: { id: 1 } });

    const formWithStrings = {
      ...form,
      headers: '{"Authorization":"Bearer token"}',
      body: '{"foo":"bar"}',
    };

    await handleMonitor(formWithStrings, false, closeModal, setMonitor);

    expect(createPostRequest).toHaveBeenCalledWith('/api/monitor/add', {
      ...form,
      headers: { Authorization: 'Bearer token' },
      body: { foo: 'bar' },
    });
  });

  it('should return empty object if headers/body JSON parsing fails', async () => {
    (createPostRequest as jest.Mock).mockResolvedValue({ data: { id: 1 } });

    const formWithInvalidJson = {
      ...form,
      headers: '{invalid}',
      body: '{invalid}',
    };

    await handleMonitor(formWithInvalidJson, false, closeModal, setMonitor);

    expect(createPostRequest).toHaveBeenCalledWith('/api/monitor/add', {
      ...form,
      headers: {},
      body: {},
    });
  });
});
