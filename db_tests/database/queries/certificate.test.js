const { certificateTable } = require('../../../server/database/sqlite/tables/certificate.js');

describe('certificateTable()', () => {
  let mockClient;
  let mockSchema;
  let mockCreateTableCallback;

  beforeEach(() => {
    mockCreateTableCallback = jest.fn();

    mockSchema = {
      hasTable: jest.fn(),
      createTable: jest.fn((tableName, callback) => {
        // simulate Knex.createTable callback with "table" object
        const mockTable = {
          increments: jest.fn(),
          string: jest.fn(() => mockColumnObj),
          boolean: jest.fn(() => mockColumnObj),
          text: jest.fn(() => mockColumnObj),
          datetime: jest.fn(() => mockColumnObj),
          integer: jest.fn(() => mockColumnObj),
          index: jest.fn(),
        };
        const mockColumnObj = {
          notNullable: jest.fn(() => mockColumnObj),
          references: jest.fn(() => mockColumnObj),
          inTable: jest.fn(() => mockColumnObj),
          onDelete: jest.fn(() => mockColumnObj),
          onUpdate: jest.fn(() => mockColumnObj),
          defaultTo: jest.fn(() => mockColumnObj),
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

    // Validate the callback definition
    const callback = createTableCall[1];
    expect(typeof callback).toBe('function');
  });

  it('should define all columns and constraints correctly', async () => {
    mockSchema.hasTable.mockResolvedValue(false);

    const incrementsMock = jest.fn();
    const stringMock = jest.fn(() => columnBuilder);
    const booleanMock = jest.fn(() => columnBuilder);
    const textMock = jest.fn(() => columnBuilder);
    const datetimeMock = jest.fn(() => columnBuilder);
    const integerMock = jest.fn(() => columnBuilder);
    const indexMock = jest.fn();

    const columnBuilder = {
      notNullable: jest.fn(() => columnBuilder),
      references: jest.fn(() => columnBuilder),
      inTable: jest.fn(() => columnBuilder),
      onDelete: jest.fn(() => columnBuilder),
      onUpdate: jest.fn(() => columnBuilder),
      defaultTo: jest.fn(() => columnBuilder),
    };

    mockSchema.createTable = jest.fn((tableName, cb) => {
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

    // Primary key
    expect(incrementsMock).toHaveBeenCalledWith('id');

    // monitorId foreign key
    expect(stringMock).toHaveBeenCalledWith('monitorId');
    expect(columnBuilder.notNullable).toHaveBeenCalled();
    expect(columnBuilder.references).toHaveBeenCalledWith('monitorId');
    expect(columnBuilder.inTable).toHaveBeenCalledWith('monitor');
    expect(columnBuilder.onDelete).toHaveBeenCalledWith('CASCADE');
    expect(columnBuilder.onUpdate).toHaveBeenCalledWith('CASCADE');

    // isValid default
    expect(booleanMock).toHaveBeenCalledWith('isValid');
    expect(columnBuilder.defaultTo).toHaveBeenCalledWith(0);

    // text + datetime + integer fields
    expect(textMock).toHaveBeenCalledWith('issuer');
    expect(datetimeMock).toHaveBeenCalledWith('validFrom');
    expect(datetimeMock).toHaveBeenCalledWith('validTill');
    expect(textMock).toHaveBeenCalledWith('validOn');
    expect(integerMock).toHaveBeenCalledWith('daysRemaining');
    expect(columnBuilder.defaultTo).toHaveBeenCalledWith(0);
    expect(datetimeMock).toHaveBeenCalledWith('nextCheck');

    // index
    expect(indexMock).toHaveBeenCalledWith('monitorId');
  });
});
