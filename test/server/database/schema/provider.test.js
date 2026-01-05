import { providersTable } from '../../../../server/database/sqlite/tables/provider.js';

describe('providersTable()', () => {
  let mockClient;
  let mockSchema;

  beforeEach(() => {
    mockSchema = {
      hasTable: vi.fn(),
      createTable: vi.fn((tableName, callback) => {}),
    };
    mockClient = { schema: mockSchema };
  });

  it('should NOT create the table if it already exists', async () => {
    mockSchema.hasTable.mockResolvedValue(true);
    await providersTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('providers');
    expect(mockSchema.createTable).not.toHaveBeenCalled();
  });

  it('should create the table with correct schema if not exists', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    await providersTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('providers');
    expect(mockSchema.createTable).toHaveBeenCalled();
    const createTableCall = mockSchema.createTable.mock.calls[0];
    expect(createTableCall[0]).toBe('providers');
    const callback = createTableCall[1];
    expect(typeof callback).toBe('function');
  });

  it('should define all columns and constraints correctly', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    const incrementsMock = vi.fn();
    const stringMock = vi.fn(() => columnBuilder);
    const booleanMock = vi.fn(() => columnBuilder);
    const jsonMock = vi.fn(() => columnBuilder);
    const indexMock = vi.fn();
    const columnBuilder = {
      notNullable: vi.fn(() => columnBuilder),
      primary: vi.fn(() => columnBuilder),
      unique: vi.fn(() => columnBuilder),
      defaultTo: vi.fn(() => columnBuilder),
      index: vi.fn(() => columnBuilder),
    };
    mockSchema.createTable = vi.fn((tableName, cb) => {
      cb({
        increments: incrementsMock,
        string: stringMock,
        boolean: booleanMock,
        json: jsonMock,
        index: indexMock,
      });
    });
    await providersTable(mockClient);
    expect(incrementsMock).toHaveBeenCalledWith('id');
    expect(stringMock).toHaveBeenCalledWith('email');
    expect(stringMock).toHaveBeenCalledWith('provider');
    expect(stringMock).toHaveBeenCalledWith('clientId');
    expect(stringMock).toHaveBeenCalledWith('clientSecret');
    expect(booleanMock).toHaveBeenCalledWith('enabled');
    expect(jsonMock).toHaveBeenCalledWith('data');
    expect(indexMock).toHaveBeenCalledWith(['provider']);
  });
});
