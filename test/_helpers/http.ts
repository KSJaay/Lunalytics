import {
  createRequest,
  createResponse,
  type RequestOptions,
  type ResponseOptions,
} from 'node-mocks-http';
import { vi } from 'vitest';

export const mockReq = (options: RequestOptions = {}) =>
  createRequest({
    method: 'GET',
    url: '/',
    cookies: {},
    headers: {},
    ...options,
  });

export const mockRes = (options: ResponseOptions = {}) => {
  const res = createResponse(options);
  return res;
};

export const mockReqResNext = (options: RequestOptions = {}) => {
  const req = mockReq(options);
  const res = mockRes();
  const next = vi.fn();
  return { req, res, next };
};
