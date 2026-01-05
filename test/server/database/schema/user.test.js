import { userTable } from '../../../../server/database/sqlite/tables/user.js';

describe('userTable()', () => {
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
    await userTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('user');
    expect(mockSchema.createTable).not.toHaveBeenCalled();
  });

  it('should create the table with correct schema if not exists', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    await userTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('user');
    expect(mockSchema.createTable).toHaveBeenCalled();
    const createTableCall = mockSchema.createTable.mock.calls[0];
    expect(createTableCall[0]).toBe('user');
    const callback = createTableCall[1];
    expect(typeof callback).toBe('function');
  });

  it('should define all columns and constraints correctly', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    const stringMock = vi.fn(() => columnBuilder);
    const booleanMock = vi.fn(() => columnBuilder);
    const integerMock = vi.fn(() => columnBuilder);
    const datetimeMock = vi.fn(() => columnBuilder);
    const jsonbMock = vi.fn(() => columnBuilder);
    const indexMock = vi.fn();
    const columnBuilder = {
      notNullable: vi.fn(() => columnBuilder),
      primary: vi.fn(() => columnBuilder),
      unique: vi.fn(() => columnBuilder),
      defaultTo: vi.fn(() => columnBuilder),
      references: vi.fn(() => columnBuilder),
      inTable: vi.fn(() => columnBuilder),
      index: vi.fn(() => columnBuilder),
    };
    mockSchema.createTable = vi.fn((tableName, cb) => {
      cb({
        string: stringMock,
        boolean: booleanMock,
        integer: integerMock,
        datetime: datetimeMock,
        jsonb: jsonbMock,
        index: indexMock,
      });
    });
    await userTable(mockClient);
    expect(stringMock).toHaveBeenCalledWith('email', 255);
    expect(stringMock).toHaveBeenCalledWith('displayName');
    expect(stringMock).toHaveBeenCalledWith('password');
    expect(stringMock).toHaveBeenCalledWith('avatar');
    expect(booleanMock).toHaveBeenCalledWith('isVerified');
    expect(booleanMock).toHaveBeenCalledWith('isOwner');
    expect(booleanMock).toHaveBeenCalledWith('sso');
    expect(integerMock).toHaveBeenCalledWith('permission');
    expect(datetimeMock).toHaveBeenCalledWith('createdAt');
    expect(jsonbMock).toHaveBeenCalledWith('settings');
    expect(indexMock).toHaveBeenCalledWith('email');
    expect(indexMock).toHaveBeenCalledWith('isVerified');
  });
});
