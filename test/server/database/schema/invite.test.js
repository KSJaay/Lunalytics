import { inviteTable } from '../../../../server/database/sqlite/tables/invite.js';

describe('inviteTable()', () => {
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
    await inviteTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('invite');
    expect(mockSchema.createTable).not.toHaveBeenCalled();
  });

  it('should create the table with correct schema if not exists', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    await inviteTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('invite');
    expect(mockSchema.createTable).toHaveBeenCalled();
    const createTableCall = mockSchema.createTable.mock.calls[0];
    expect(createTableCall[0]).toBe('invite');
    const callback = createTableCall[1];
    expect(typeof callback).toBe('function');
  });

  it('should define all columns and constraints correctly', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    const stringMock = vi.fn(() => columnBuilder);
    const booleanMock = vi.fn(() => columnBuilder);
    const datetimeMock = vi.fn(() => columnBuilder);
    const integerMock = vi.fn(() => columnBuilder);
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
        string: stringMock,
        boolean: booleanMock,
        datetime: datetimeMock,
        integer: integerMock,
        index: indexMock,
      });
    });
    await inviteTable(mockClient);
    expect(stringMock).toHaveBeenCalledWith('email', 255);
    expect(stringMock).toHaveBeenCalledWith('token');
    expect(stringMock).toHaveBeenCalledWith('permission');
    expect(booleanMock).toHaveBeenCalledWith('paused');
    expect(datetimeMock).toHaveBeenCalledWith('createdAt');
    expect(datetimeMock).toHaveBeenCalledWith('expiresAt');
    expect(integerMock).toHaveBeenCalledWith('limit');
    expect(integerMock).toHaveBeenCalledWith('uses');
    expect(indexMock).toHaveBeenCalledWith('email');
    expect(indexMock).toHaveBeenCalledWith('token');
  });
});
