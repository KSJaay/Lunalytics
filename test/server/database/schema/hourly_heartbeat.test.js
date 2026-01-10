import { hourlyHeartbeatTable } from '../../../../server/database/sqlite/tables/hourly_heartbeat.js';

describe('hourlyHeartbeatTable()', () => {
  let mockClient;
  let mockSchema;

  beforeEach(() => {
    mockSchema = {
      hasTable: vi.fn(),
      createTable: vi.fn((tableName, callback) => {}),
    };
    mockClient = { schema: mockSchema, raw: vi.fn() };
  });

  it('should NOT create the table if it already exists', async () => {
    mockSchema.hasTable.mockResolvedValue(true);
    await hourlyHeartbeatTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('hourly_heartbeat');
    expect(mockSchema.createTable).not.toHaveBeenCalled();
  });

  it('should create the table with correct schema if not exists', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    await hourlyHeartbeatTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('hourly_heartbeat');
    expect(mockSchema.createTable).toHaveBeenCalled();
    const createTableCall = mockSchema.createTable.mock.calls[0];
    expect(createTableCall[0]).toBe('hourly_heartbeat');
    const callback = createTableCall[1];
    expect(typeof callback).toBe('function');
  });

  it('should define all columns and constraints correctly', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    const incrementsMock = vi.fn();
    const stringMock = vi.fn(() => columnBuilder);
    const integerMock = vi.fn(() => columnBuilder);
    const datetimeMock = vi.fn(() => columnBuilder);
    const indexMock = vi.fn();
    const columnBuilder = {
      notNullable: vi.fn(() => columnBuilder),
      references: vi.fn(() => columnBuilder),
      inTable: vi.fn(() => columnBuilder),
      onDelete: vi.fn(() => columnBuilder),
      onUpdate: vi.fn(() => columnBuilder),
      defaultTo: vi.fn(() => columnBuilder),
      index: vi.fn(() => columnBuilder),
    };
    mockSchema.createTable = vi.fn((tableName, cb) => {
      cb({
        increments: incrementsMock,
        string: stringMock,
        integer: integerMock,
        datetime: datetimeMock,
        index: indexMock,
      });
    });
    await hourlyHeartbeatTable(mockClient);
    expect(incrementsMock).toHaveBeenCalledWith('id');
    expect(stringMock).toHaveBeenCalledWith('monitorId');
    expect(integerMock).toHaveBeenCalledWith('status');
    expect(integerMock).toHaveBeenCalledWith('latency');
    expect(datetimeMock).toHaveBeenCalledWith('date');
  });
});
