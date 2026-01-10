import { statusPageTable } from '../../../../server/database/sqlite/tables/status_page.js';

describe('statusPageTable()', () => {
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
    await statusPageTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('status_page');
    expect(mockSchema.createTable).not.toHaveBeenCalled();
  });

  it('should create the table with correct schema if not exists', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    await statusPageTable(mockClient);
    expect(mockSchema.hasTable).toHaveBeenCalledWith('status_page');
    expect(mockSchema.createTable).toHaveBeenCalled();
    const createTableCall = mockSchema.createTable.mock.calls[0];
    expect(createTableCall[0]).toBe('status_page');
    const callback = createTableCall[1];
    expect(typeof callback).toBe('function');
  });

  it('should define all columns and constraints correctly', async () => {
    mockSchema.hasTable.mockResolvedValue(false);
    const incrementsMock = vi.fn();
    const stringMock = vi.fn(() => columnBuilder);
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
        json: jsonMock,
        datetime: datetimeMock,
        index: indexMock,
      });
    });
    await statusPageTable(mockClient);
    expect(incrementsMock).toHaveBeenCalledWith('id');
    expect(stringMock).toHaveBeenCalledWith('statusId');
    expect(stringMock).toHaveBeenCalledWith('statusUrl');
    expect(jsonMock).toHaveBeenCalledWith('settings');
    expect(jsonMock).toHaveBeenCalledWith('layout');
    expect(stringMock).toHaveBeenCalledWith('email');
    expect(datetimeMock).toHaveBeenCalledWith('createdAt');
  });
});
