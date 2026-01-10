import { userSessionTable } from '../../../../server/database/sqlite/tables/user_session.js';

describe('userSessionTable()', () => {
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
    await userSessionTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('user_session');
    expect(mockSchema.createTable).not.toHaveBeenCalled();
  });

  it('should create the table with correct schema if not exists', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    await userSessionTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('user_session');
    expect(mockSchema.createTable).toHaveBeenCalled();
    const createTableCall = mockSchema.createTable.mock.calls[0];
    expect(createTableCall[0]).toBe('user_session');
    const callback = createTableCall[1];
    expect(typeof callback).toBe('function');
  });

  it('should define all columns and constraints correctly', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    const incrementsMock = vi.fn();
    const stringMock = vi.fn(() => columnBuilder);
    const jsonbMock = vi.fn(() => columnBuilder);
    const datetimeMock = vi.fn(() => columnBuilder);
    const indexMock = vi.fn();
    const columnBuilder = {
      notNullable: vi.fn(() => columnBuilder),
      primary: vi.fn(() => columnBuilder),
      unique: vi.fn(() => columnBuilder),
      references: vi.fn(() => columnBuilder),
      inTable: vi.fn(() => columnBuilder),
      defaultTo: vi.fn(() => columnBuilder),
      index: vi.fn(() => columnBuilder),
    };
    mockSchema.createTable = vi.fn((tableName, cb) => {
      cb({
        increments: incrementsMock,
        string: stringMock,
        jsonb: jsonbMock,
        datetime: datetimeMock,
        index: indexMock,
      });
    });
    await userSessionTable(mockClient);
    expect(incrementsMock).toHaveBeenCalledWith('id');
    expect(stringMock).toHaveBeenCalledWith('sessionId');
    expect(stringMock).toHaveBeenCalledWith('email');
    expect(jsonbMock).toHaveBeenCalledWith('device');
    expect(jsonbMock).toHaveBeenCalledWith('data');
    expect(datetimeMock).toHaveBeenCalledWith('createdAt');
    expect(indexMock).toHaveBeenCalledWith('email');
  });
});
