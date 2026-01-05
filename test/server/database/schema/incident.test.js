import { incidentTable } from '../../../../server/database/sqlite/tables/incident.js';

describe('incidentTable()', () => {
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
    await incidentTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('incident');
    expect(mockSchema.createTable).not.toHaveBeenCalled();
  });

  it('should create the table with correct schema if not exists', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    await incidentTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('incident');
    expect(mockSchema.createTable).toHaveBeenCalled();
    const createTableCall = mockSchema.createTable.mock.calls[0];
    expect(createTableCall[0]).toBe('incident');
    const callback = createTableCall[1];
    expect(typeof callback).toBe('function');
  });

  it('should define all columns and constraints correctly', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    const incrementsMock = vi.fn();
    const stringMock = vi.fn(() => columnBuilder);
    const jsonbMock = vi.fn(() => columnBuilder);
    const datetimeMock = vi.fn(() => columnBuilder);
    const booleanMock = vi.fn(() => columnBuilder);
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
        jsonb: jsonbMock,
        datetime: datetimeMock,
        boolean: booleanMock,
        index: indexMock,
      });
    });
    await incidentTable(mockClient);
    expect(incrementsMock).toHaveBeenCalledWith('id');
    expect(stringMock).toHaveBeenCalledWith('incidentId');
    expect(stringMock).toHaveBeenCalledWith('title');
    expect(jsonbMock).toHaveBeenCalledWith('monitorIds');
    expect(jsonbMock).toHaveBeenCalledWith('messages');
    expect(stringMock).toHaveBeenCalledWith('affect');
    expect(stringMock).toHaveBeenCalledWith('status');
    expect(datetimeMock).toHaveBeenCalledWith('createdAt');
    expect(datetimeMock).toHaveBeenCalledWith('completedAt');
    expect(booleanMock).toHaveBeenCalledWith('isClosed');
    expect(indexMock).toHaveBeenCalledWith('incidentId');
    expect(indexMock).toHaveBeenCalledWith('createdAt');
    expect(indexMock).toHaveBeenCalledWith('completedAt');
    expect(indexMock).toHaveBeenCalledWith('isClosed');
  });
});
