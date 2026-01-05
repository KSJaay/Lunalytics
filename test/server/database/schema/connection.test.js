import { connectionsTable } from '../../../../server/database/sqlite/tables/connection.js';

describe('connectionsTable()', () => {
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
    await connectionsTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('connections');
    expect(mockSchema.createTable).not.toHaveBeenCalled();
  });

  it('should create the table with correct schema if not exists', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    await connectionsTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('connections');
    expect(mockSchema.createTable).toHaveBeenCalled();
    const createTableCall = mockSchema.createTable.mock.calls[0];
    expect(createTableCall[0]).toBe('connections');
    const callback = createTableCall[1];
    expect(typeof callback).toBe('function');
  });

  it('should define all columns and constraints correctly', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    const stringMock = vi.fn(() => columnBuilder);
    const indexMock = vi.fn();
    const uniqueMock = vi.fn(() => columnBuilder);
    const columnBuilder = {
      notNullable: vi.fn(() => columnBuilder),
      unsigned: vi.fn(() => columnBuilder),
      references: vi.fn(() => columnBuilder),
      inTable: vi.fn(() => columnBuilder),
      onDelete: vi.fn(() => columnBuilder),
      unique: vi.fn(() => columnBuilder),
      index: vi.fn(() => columnBuilder),
    };
    mockSchema.createTable = vi.fn((tableName, cb) => {
      cb({
        string: stringMock,
        unique: uniqueMock,
        index: indexMock,
      });
    });
    await connectionsTable(mockClient);
    expect(stringMock).toHaveBeenCalledWith('email');
    expect(stringMock).toHaveBeenCalledWith('provider');
    expect(stringMock).toHaveBeenCalledWith('accountId');
    expect(stringMock).toHaveBeenCalledWith('createdAt');
    expect(uniqueMock).toHaveBeenCalledWith(['provider', 'accountId']);
    expect(indexMock).toHaveBeenCalledWith(['email', 'provider']);
  });
});
