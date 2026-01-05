import { certificateTable } from '../../../../server/database/sqlite/tables/certificate.js';

describe('certificateTable()', () => {
  let mockClient;
  let mockSchema;

  beforeEach(() => {
    mockSchema = {
      hasTable: vi.fn(),
      createTable: vi.fn((tableName, callback) => {
        const mockTable = {
          increments: vi.fn(),
          string: vi.fn(() => mockColumnObj),
          boolean: vi.fn(() => mockColumnObj),
          text: vi.fn(() => mockColumnObj),
          datetime: vi.fn(() => mockColumnObj),
          integer: vi.fn(() => mockColumnObj),
          index: vi.fn(),
        };
        const mockColumnObj = {
          notNullable: vi.fn(() => mockColumnObj),
          references: vi.fn(() => mockColumnObj),
          inTable: vi.fn(() => mockColumnObj),
          onDelete: vi.fn(() => mockColumnObj),
          onUpdate: vi.fn(() => mockColumnObj),
          defaultTo: vi.fn(() => mockColumnObj),
        };
        callback(mockTable);
      }),
    };

    mockClient = {
      schema: mockSchema,
    };
  });

  it('should NOT create the table if it already exists', async () => {
    mockSchema.hasTable.mockResolvedValue(true);

    await certificateTable(mockClient);

    expect(mockSchema.hasTable).toHaveBeenCalledWith('certificate');
    expect(mockSchema.createTable).not.toHaveBeenCalled();
  });

  it('should create the table with correct schema if not exists', async () => {
    mockSchema.hasTable.mockResolvedValue(false);

    await certificateTable(mockClient);

    expect(mockSchema.hasTable).toHaveBeenCalledWith('certificate');
    expect(mockSchema.createTable).toHaveBeenCalled();

    const createTableCall = mockSchema.createTable.mock.calls[0];
    expect(createTableCall[0]).toBe('certificate');

    const callback = createTableCall[1];
    expect(typeof callback).toBe('function');
  });

  it('should define all columns and constraints correctly', async () => {
    mockSchema.hasTable.mockResolvedValue(false);

    const incrementsMock = vi.fn();
    const stringMock = vi.fn(() => columnBuilder);
    const booleanMock = vi.fn(() => columnBuilder);
    const textMock = vi.fn(() => columnBuilder);
    const datetimeMock = vi.fn(() => columnBuilder);
    const integerMock = vi.fn(() => columnBuilder);
    const indexMock = vi.fn();

    const columnBuilder = {
      notNullable: vi.fn(() => columnBuilder),
      references: vi.fn(() => columnBuilder),
      inTable: vi.fn(() => columnBuilder),
      onDelete: vi.fn(() => columnBuilder),
      onUpdate: vi.fn(() => columnBuilder),
      defaultTo: vi.fn(() => columnBuilder),
    };

    mockSchema.createTable = vi.fn((tableName, cb) => {
      const table = {
        increments: incrementsMock,
        string: stringMock,
        boolean: booleanMock,
        text: textMock,
        datetime: datetimeMock,
        integer: integerMock,
        index: indexMock,
      };
      cb(table);
    });

    await certificateTable(mockClient);

    expect(incrementsMock).toHaveBeenCalledWith('id');

    expect(stringMock).toHaveBeenCalledWith('monitorId');
    expect(columnBuilder.notNullable).toHaveBeenCalled();
    expect(columnBuilder.references).toHaveBeenCalledWith('monitorId');
    expect(columnBuilder.inTable).toHaveBeenCalledWith('monitor');
    expect(columnBuilder.onDelete).toHaveBeenCalledWith('CASCADE');
    expect(columnBuilder.onUpdate).toHaveBeenCalledWith('CASCADE');

    expect(booleanMock).toHaveBeenCalledWith('isValid');
    expect(columnBuilder.defaultTo).toHaveBeenCalledWith(0);

    expect(textMock).toHaveBeenCalledWith('issuer');
    expect(datetimeMock).toHaveBeenCalledWith('validFrom');
    expect(datetimeMock).toHaveBeenCalledWith('validTill');
    expect(textMock).toHaveBeenCalledWith('validOn');
    expect(integerMock).toHaveBeenCalledWith('daysRemaining');
    expect(columnBuilder.defaultTo).toHaveBeenCalledWith(0);
    expect(datetimeMock).toHaveBeenCalledWith('nextCheck');

    expect(indexMock).toHaveBeenCalledWith('monitorId');
  });
});
