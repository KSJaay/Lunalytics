// db_tests/database/queries/provider.test.js
import SQLite from '../../../server/database/sqlite/setup.js';
import * as providerQueries from '../../../server/database/queries/provider.js';

describe('Provider Queries', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('createProvider inserts provider data', async () => {
    const insertMock = jest.fn().mockResolvedValue([1]);
    SQLite.client = jest.fn(() => ({ insert: insertMock }));

    const data = { provider: 'google', config: {} };
    await providerQueries.createProvider(data);

    expect(SQLite.client).toHaveBeenCalledWith('providers');
    expect(insertMock).toHaveBeenCalledWith(data);
  });

  it('updateProvider updates provider data', async () => {
    const updateMock = jest.fn().mockResolvedValue(1);
    const whereMock = jest.fn(() => ({ update: updateMock }));
    SQLite.client = jest.fn(() => ({ where: whereMock }));

    const provider = 'google';
    const data = { config: { key: 'value' } };
    await providerQueries.updateProvider(provider, data);

    expect(SQLite.client).toHaveBeenCalledWith('providers');
    expect(whereMock).toHaveBeenCalledWith({ provider });
    expect(updateMock).toHaveBeenCalledWith(data);
  });

  it('deleteProvider deletes provider', async () => {
    const delMock = jest.fn().mockResolvedValue(1);
    const whereMock = jest.fn(() => ({ delete: delMock }));
    SQLite.client = jest.fn(() => ({ where: whereMock }));

    const provider = 'google';
    await providerQueries.deleteProvider(provider);

    expect(SQLite.client).toHaveBeenCalledWith('providers');
    expect(whereMock).toHaveBeenCalledWith({ provider });
    expect(delMock).toHaveBeenCalled();
  });

  it('fetchProvider returns provider data', async () => {
    const mockProvider = { provider: 'google', config: {} };
    const firstMock = jest.fn().mockResolvedValue(mockProvider);
    const whereMock = jest.fn(() => ({ first: firstMock }));
    SQLite.client = jest.fn(() => ({ where: whereMock }));

    const result = await providerQueries.fetchProvider('google');

    expect(SQLite.client).toHaveBeenCalledWith('providers');
    expect(whereMock).toHaveBeenCalledWith({ provider: 'google' });
    expect(firstMock).toHaveBeenCalled();
    expect(result).toEqual(mockProvider);
  });

  it('fetchProviders returns list of providers', async () => {
    const mockProviders = [
      { provider: 'google', config: {} },
      { provider: 'github', config: {} },
    ];
    const selectMock = jest.fn().mockResolvedValue(mockProviders);
    SQLite.client = jest.fn(() => ({ select: selectMock }));

    const result = await providerQueries.fetchProviders();

    expect(SQLite.client).toHaveBeenCalledWith('providers');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(result).toEqual(mockProviders);
  });
});
