import { describe, it, expect, vi } from 'vitest';

import { handleError } from '../../../server/utils/errors.js';
import {
  AuthorizationError,
  ConflictError,
  UnprocessableError,
  NotificationValidatorError,
} from '../../../shared/utils/errors.js';

const buildResponse = () => {
  const res: any = { headersSent: false };
  res.status = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
};

describe('server/utils/errors', () => {
  describe('handleError', () => {
    it('returns 401 for an AuthorizationError', () => {
      const res = buildResponse();
      handleError(new AuthorizationError('nope'), res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({ message: 'nope' });
    });

    it('returns 409 for a ConflictError', () => {
      const res = buildResponse();
      handleError(new ConflictError('dupe'), res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.send).toHaveBeenCalledWith({ message: 'dupe' });
    });

    it('returns 422 for an UnprocessableError', () => {
      const res = buildResponse();
      handleError(new UnprocessableError('bad input'), res);
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.send).toHaveBeenCalledWith({ message: 'bad input' });
    });

    it('returns 422 with key payload for NotificationValidatorError', () => {
      const res = buildResponse();
      handleError(new NotificationValidatorError('field', 'invalid'), res);
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.send).toHaveBeenCalledWith({ field: 'invalid' });
    });

    it('returns 500 for unrecognised errors', () => {
      const res = buildResponse();
      handleError(new Error('boom'), res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Something went wrong',
      });
    });

    it('does nothing when headers were already sent', () => {
      const res = buildResponse();
      res.headersSent = true;
      handleError(new Error('boom'), res);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  });
});
