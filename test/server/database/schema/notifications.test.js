import { notificationsTable } from '../../../../server/database/sqlite/tables/notifications.js';

describe('notificationsTable()', () => {
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
    await notificationsTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('notifications');
    expect(mockSchema.createTable).not.toHaveBeenCalled();
  });

  it('should create the table with correct schema if not exists', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    await notificationsTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('notifications');
    expect(mockSchema.createTable).toHaveBeenCalled();
    const createTableCall = mockSchema.createTable.mock.calls[0];
    expect(createTableCall[0]).toBe('notifications');
    const callback = createTableCall[1];
    expect(typeof callback).toBe('function');
  });

  it('should define all columns and constraints correctly', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    const stringMock = vi.fn(() => columnBuilder);
    const textMock = vi.fn(() => columnBuilder);
    const booleanMock = vi.fn(() => columnBuilder);
    const datetimeMock = vi.fn(() => columnBuilder);
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
        text: textMock,
        boolean: booleanMock,
        datetime: datetimeMock,
        index: indexMock,
      });
    });
    await notificationsTable(mockClient);
    expect(stringMock).toHaveBeenCalledWith('id');
    expect(stringMock).toHaveBeenCalledWith('platform');
    expect(stringMock).toHaveBeenCalledWith('messageType');
    expect(textMock).toHaveBeenCalledWith('token');
    expect(textMock).toHaveBeenCalledWith('email');
    expect(booleanMock).toHaveBeenCalledWith('isEnabled');
    expect(textMock).toHaveBeenCalledWith('content');
    expect(stringMock).toHaveBeenCalledWith('friendlyName');
    expect(textMock).toHaveBeenCalledWith('data');
    expect(datetimeMock).toHaveBeenCalledWith('createdAt');
  });
});
