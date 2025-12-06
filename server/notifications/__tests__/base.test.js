import NotificationBase from '../base.js';

describe('NotificationBase', () => {
  let base;

  beforeEach(() => {
    base = new NotificationBase();
  });

  it('should have default name as undefined', () => {
    expect(base.name).toBeUndefined();
  });

  it('should have default success message', () => {
    expect(base.success).toBe('Sent Successfully!');
  });

  it('send method should throw override error', async () => {
    await expect(base.send({}, {}, {})).rejects.toThrow(
      'Override this function dummy!'
    );
  });

  it('sendRecovery method should throw override error', async () => {
    await expect(base.sendRecovery({}, {}, {})).rejects.toThrow(
      'Override this function dummy!'
    );
  });

  describe('handleError', () => {
    it('should throw with message for simple Error object', () => {
      const error = new Error('Something went wrong');
      expect(() => base.handleError(error)).toThrow('Error: Something went wrong\n');
    });

    it('should throw with message for string error', () => {
      expect(() => base.handleError('String error')).toThrow('Error: String error\n');
    });

    it('should throw with Unknown error if error is undefined', () => {
      expect(() => base.handleError(undefined)).toThrow('Error: Unknown error\n');
    });

    it('should include parsed response data if available', () => {
      const error = {
        message: 'API failed',
        response: { data: { code: 500, detail: 'Server Error' } },
      };
      expect(() => base.handleError(error)).toThrow(
        'Error: [object Object]\n{"code":500,"detail":"Server Error"}'
      );
    });

    it('should handle non-JSON response data gracefully', () => {
      const circular = {};
      circular.self = circular; // circular reference
      const error = {
        message: 'Bad data',
        response: { data: circular },
      };
      expect(() => base.handleError(error)).toThrow(
        'Error: [object Object]\n[object Object]'
      );
    });
  });
});
