import { apiTokenTable } from '../../../../server/database/sqlite/tables/api_token.js';

describe('apiTokenTable()', () => {
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
    await apiTokenTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('api_token');
    expect(mockSchema.createTable).not.toHaveBeenCalled();
  });

  it('should create the table with correct schema if not exists', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    await apiTokenTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('api_token');
    expect(mockSchema.createTable).toHaveBeenCalled();
    const createTableCall = mockSchema.createTable.mock.calls[0];
    expect(createTableCall[0]).toBe('api_token');
    const callback = createTableCall[1];
    expect(typeof callback).toBe('function');
  });

  it('should define all columns and constraints correctly', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    const stringMock = vi.fn(() => columnBuilder);
    const datetimeMock = vi.fn(() => columnBuilder);
    const indexMock = vi.fn();
    const columnBuilder = {
      notNullable: vi.fn(() => columnBuilder),
      primary: vi.fn(() => columnBuilder),
      unique: vi.fn(() => columnBuilder),
      index: vi.fn(() => columnBuilder),
    };
    mockSchema.createTable = vi.fn((tableName, cb) => {
      cb({
        string: stringMock,
        datetime: datetimeMock,
        index: indexMock,
      });
    });
    await apiTokenTable(mockClient);
    expect(stringMock).toHaveBeenCalledWith('token');
    expect(columnBuilder.notNullable).toHaveBeenCalled();
    expect(columnBuilder.primary).toHaveBeenCalled();
    expect(columnBuilder.unique).toHaveBeenCalled();
    expect(stringMock).toHaveBeenCalledWith('name');
    expect(stringMock).toHaveBeenCalledWith('permission');
    expect(stringMock).toHaveBeenCalledWith('email');
    expect(datetimeMock).toHaveBeenCalledWith('createdAt');
    expect(indexMock).toHaveBeenCalledWith('token');
    expect(indexMock).toHaveBeenCalledWith('email');
  });
});
