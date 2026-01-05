import { monitorTable } from '../../../../server/database/sqlite/tables/monitor.js';

describe('monitorTable()', () => {
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
    await monitorTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('monitor');
    expect(mockSchema.createTable).not.toHaveBeenCalled();
  });

  it('should create the table with correct schema if not exists', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    await monitorTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('monitor');
    expect(mockSchema.createTable).toHaveBeenCalled();
    const createTableCall = mockSchema.createTable.mock.calls[0];
    expect(createTableCall[0]).toBe('monitor');
    const callback = createTableCall[1];
    expect(typeof callback).toBe('function');
  });

  it('should define all columns and constraints correctly', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    const incrementsMock = vi.fn();
    const stringMock = vi.fn(() => columnBuilder);
    const integerMock = vi.fn(() => columnBuilder);
    const textMock = vi.fn(() => columnBuilder);
    const booleanMock = vi.fn(() => columnBuilder);
    const jsonMock = vi.fn(() => columnBuilder);
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
        increments: incrementsMock,
        string: stringMock,
        integer: integerMock,
        text: textMock,
        boolean: booleanMock,
        json: jsonMock,
        datetime: datetimeMock,
        index: indexMock,
      });
    });
    await monitorTable(mockClient);
    expect(incrementsMock).toHaveBeenCalledWith('id');
    expect(stringMock).toHaveBeenCalledWith('monitorId');
    expect(stringMock).toHaveBeenCalledWith('parentId');
    expect(stringMock).toHaveBeenCalledWith('name');
    expect(stringMock).toHaveBeenCalledWith('url');
    expect(integerMock).toHaveBeenCalledWith('port');
    expect(stringMock).toHaveBeenCalledWith('type');
    expect(integerMock).toHaveBeenCalledWith('interval');
    expect(integerMock).toHaveBeenCalledWith('retry');
    expect(integerMock).toHaveBeenCalledWith('retryInterval');
    expect(integerMock).toHaveBeenCalledWith('requestTimeout');
    expect(stringMock).toHaveBeenCalledWith('method');
    expect(textMock).toHaveBeenCalledWith('headers');
    expect(textMock).toHaveBeenCalledWith('body');
    expect(textMock).toHaveBeenCalledWith('valid_status_codes');
    expect(stringMock).toHaveBeenCalledWith('notificationId');
    expect(stringMock).toHaveBeenCalledWith('notificationType');
    expect(stringMock).toHaveBeenCalledWith('email');
    expect(booleanMock).toHaveBeenCalledWith('paused');
    expect(booleanMock).toHaveBeenCalledWith('ignoreTls');
    expect(jsonMock).toHaveBeenCalledWith('json_query');
    expect(datetimeMock).toHaveBeenCalledWith('createdAt');
    expect(jsonMock).toHaveBeenCalledWith('icon');
    expect(indexMock).toHaveBeenCalledWith('monitorId');
  });
});
