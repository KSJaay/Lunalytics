import { jest } from '@jest/globals';
import SQLite from '../../../server/database/sqlite/setup.js';
import * as tokens from '../../../server/database/queries/tokens.js';
import { generateRandomAnimalName } from '../../../shared/utils/animal.js';
import { nanoid } from 'nanoid';

jest.mock('../../../server/database/sqlite/setup.js', () => ({
  client: jest.fn(),
}));

jest.mock('../../../shared/utils/animal.js', () => ({
  generateRandomAnimalName: jest.fn(() => 'random-animal'),
}));

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'unique-token'),
}));

describe('API Token Queries', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('apiTokenExists calls where().first()', async () => {
    const firstMock = jest.fn().mockResolvedValue({ token: 'unique-token' });
    const whereMock = jest.fn(() => ({ first: firstMock }));
    SQLite.client.mockReturnValue({ where: whereMock });

    const result = await tokens.apiTokenExists('unique-token');

    expect(SQLite.client).toHaveBeenCalledWith('api_token');
    expect(whereMock).toHaveBeenCalledWith({ token: 'unique-token' });
    expect(firstMock).toHaveBeenCalled();
    expect(result).toEqual({ token: 'unique-token' });
  });

  it('getAllApiTokens calls select()', async () => {
    const selectMock = jest.fn().mockResolvedValue([{ token: '1' }, { token: '2' }]);
    SQLite.client.mockReturnValue({ select: selectMock });

    const result = await tokens.getAllApiTokens();

    expect(SQLite.client).toHaveBeenCalledWith('api_token');
    expect(selectMock).toHaveBeenCalled();
    expect(result).toEqual([{ token: '1' }, { token: '2' }]);
  });

  it('apiTokenCreate inserts new token and returns it', async () => {
    // Mock getUniqueToken check loop
    const firstMockForCheck = jest.fn().mockResolvedValue(null); // token does not exist
    const whereMockForCheck = jest.fn(() => ({ first: firstMockForCheck }));

    // Mock insert().returning()
    const returningMock = jest.fn().mockImplementation(() => [{ token: 'unique-token', name: 'custom-name', permission: 'read', email: 'test@example.com' }]);
    const insertMock = jest.fn(() => ({ returning: returningMock }));

    SQLite.client
      .mockReturnValueOnce({ where: whereMockForCheck }) // check unique token
      .mockReturnValueOnce({ insert: insertMock }); // insert

    const result = await tokens.apiTokenCreate('test@example.com', 'read', 'custom-name');

    expect(nanoid).toHaveBeenCalled();
    expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({
      token: 'unique-token',
      name: 'custom-name',
      permission: 'read',
      email: 'test@example.com',
      createdAt: expect.any(String),
    }));
    expect(result).toEqual({
      token: 'unique-token',
      name: 'custom-name',
      permission: 'read',
      email: 'test@example.com',
    });
  });

  it('apiTokenUpdate updates token and returns updated object', async () => {
    const returningMock = jest.fn().mockImplementation(() => [{ token: 'unique-token', name: 'updated-name', permission: 'write' }]);
    const updateMock = jest.fn(() => ({ returning: returningMock }));
    const whereMock = jest.fn(() => ({ update: updateMock }));

    SQLite.client.mockReturnValue({ where: whereMock });

    const result = await tokens.apiTokenUpdate('unique-token', 'updated-name', 'write');

    expect(whereMock).toHaveBeenCalledWith({ token: 'unique-token' });
    expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({
      name: 'updated-name',
      permission: 'write',
    }));
    expect(result).toEqual({
      token: 'unique-token',
      name: 'updated-name',
      permission: 'write',
    });
  });

  it('apiTokenDelete calls where().delete()', async () => {
    const deleteMock = jest.fn();
    const whereMock = jest.fn(() => ({ delete: deleteMock }));
    SQLite.client.mockReturnValue({ where: whereMock });

    await tokens.apiTokenDelete('unique-token');

    expect(SQLite.client).toHaveBeenCalledWith('api_token');
    expect(whereMock).toHaveBeenCalledWith({ token: 'unique-token' });
    expect(deleteMock).toHaveBeenCalled();
  });
});
