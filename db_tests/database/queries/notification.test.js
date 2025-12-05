// db_tests/database/queries/notification.test.js
import SQLite from '../../../server/database/sqlite/setup.js';
import * as notification from '../../../server/database/queries/notification.js';
import { cleanNotification, stringifyNotification } from '../../../server/class/notification.js';

describe('Notification Queries', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetchNotifications returns cleaned notifications', async () => {
    const mockData = [{ id: 1, message: 'Test' }];
    const selectMock = jest.fn().mockResolvedValue(mockData);
    SQLite.client = jest.fn(() => ({ select: selectMock }));

    const result = await notification.fetchNotifications();

    expect(SQLite.client).toHaveBeenCalledWith('notifications');
    expect(selectMock).toHaveBeenCalled();
    expect(result).toEqual(mockData.map(cleanNotification));
  });

  it('fetchNotificationById returns null if id is falsy', async () => {
    const result = await notification.fetchNotificationById(null);
    expect(result).toBeNull();
  });

  it('fetchNotificationById returns cleaned notification if found', async () => {
    const mockData = { id: 1, message: 'Test' };
    const firstMock = jest.fn().mockResolvedValue(mockData);
    const selectMock = jest.fn(() => ({ first: firstMock }));
    const whereMock = jest.fn(() => ({ select: selectMock }));

    SQLite.client = jest.fn(() => ({ where: whereMock }));

    const result = await notification.fetchNotificationById(1);

    expect(SQLite.client).toHaveBeenCalledWith('notifications');
    expect(whereMock).toHaveBeenCalledWith({ id: 1 });
    expect(selectMock).toHaveBeenCalled();
    expect(firstMock).toHaveBeenCalled();
    expect(result).toEqual(cleanNotification(mockData));
  });

  it('createNotification inserts and returns cleaned notification', async () => {
    const mockNotification = { id: 1, message: 'Test' };
    const insertMock = jest.fn().mockResolvedValue([1]);
    SQLite.client = jest.fn(() => ({ insert: insertMock }));

    const result = await notification.createNotification(mockNotification);

    expect(SQLite.client).toHaveBeenCalledWith('notifications');
    expect(insertMock).toHaveBeenCalledWith(stringifyNotification(mockNotification));
    expect(result).toEqual(cleanNotification(mockNotification));
  });

  it('editNotification updates and returns cleaned notification', async () => {
    const mockNotification = { id: 1, message: 'Updated' };
    const updateMock = jest.fn().mockResolvedValue(1);
    const whereMock = jest.fn(() => ({ update: updateMock }));
    SQLite.client = jest.fn(() => ({ where: whereMock }));

    const result = await notification.editNotification(mockNotification);

    expect(SQLite.client).toHaveBeenCalledWith('notifications');
    expect(whereMock).toHaveBeenCalledWith({ id: mockNotification.id });
    expect(updateMock).toHaveBeenCalledWith(stringifyNotification(mockNotification));
    expect(result).toEqual(cleanNotification(mockNotification));
  });

  it('toggleNotification updates isEnabled flag', async () => {
    const updateMock = jest.fn().mockResolvedValue(1);
    const whereMock = jest.fn(() => ({ update: updateMock }));
    SQLite.client = jest.fn(() => ({ where: whereMock }));

    await notification.toggleNotification(1, false);

    expect(SQLite.client).toHaveBeenCalledWith('notifications');
    expect(whereMock).toHaveBeenCalledWith({ id: 1 });
    expect(updateMock).toHaveBeenCalledWith({ isEnabled: false });
  });

  it('deleteNotification deletes notification and clears references in monitor', async () => {
    const delMock = jest.fn().mockResolvedValue(1);
    const updateMock = jest.fn().mockResolvedValue(1);
    const whereMock1 = jest.fn(() => ({ del: delMock }));
    const whereMock2 = jest.fn(() => ({ update: updateMock }));

    let callCount = 0;
    SQLite.client = jest.fn(() => {
      callCount++;
      return callCount === 1 ? { where: whereMock1 } : { where: whereMock2 };
    });

    await notification.deleteNotification(1);

    expect(SQLite.client).toHaveBeenCalledWith('notifications');
    expect(whereMock1).toHaveBeenCalledWith({ id: 1 });
    expect(delMock).toHaveBeenCalled();

    expect(SQLite.client).toHaveBeenCalledWith('monitor');
    expect(whereMock2).toHaveBeenCalledWith({ notificationId: 1 });
    expect(updateMock).toHaveBeenCalledWith({ notificationId: null });
  });
});
