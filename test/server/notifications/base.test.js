import NotificationBase from '../../../server/notifications/base.js';

describe('NotificationBase', () => {
  let base;

  beforeEach(() => {
    base = new NotificationBase();
  });

  afterEach(() => {
    vi.clearAllMocks();
    base = null;
  });

  it('should have default name and success message', () => {
    expect(base.name).toBeUndefined();
    expect(base.success).toBe('Sent Successfully!');
  });

  it('should throw error when send is not overridden', async () => {
    await expect(base.send({}, {}, {})).rejects.toThrow(
      'Override this function dummy!'
    );
  });

  it('should throw error when sendRecovery is not overridden', async () => {
    await expect(base.sendRecovery({}, {}, {})).rejects.toThrow(
      'Override this function dummy!'
    );
  });

  it('should handle error with message', () => {
    const error = new Error('Test error');
    expect(() => base.handleError(error)).toThrow('Error: Test error');
  });

  it('should handle error with response data', () => {
    const error = { message: 'Test error', response: { data: { foo: 'bar' } } };
    expect(() => base.handleError(error)).toThrow(
      'Error: Test error\n{"foo":"bar"}'
    );
  });

  it('should handle string error', () => {
    expect(() => base.handleError('String error')).toThrow(
      'Error: String error'
    );
  });

  it('should handle unknown error', () => {
    expect(() => base.handleError({})).toThrow('Error: Unknown error');
  });
});
