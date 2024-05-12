import loginDetails from './setup/fixtures/login.json';
import monitorDetails from './setup/fixtures/monitor.json';

describe('Monitor', () => {
  const { name, type, url, method, interval, retryInterval, timeout } =
    monitorDetails;

  const { value: monitorName } = name;

  context('create a monitor', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
    });

    it('Go to next page without adding Name and Type', () => {
      cy.createMonitor();

      cy.get('[id="Next"]').click();

      cy.equals(name.error.id, name.error.value);
      cy.equals(type.error.id, type.error.value);
    });

    it('Enter a valid name/type and go to next page', () => {
      cy.createMonitor(name, type);
    });

    it('Go to next page without adding URL and Method', () => {
      cy.createMonitor(name, type);

      cy.get('[id="Next"]').click();

      cy.equals(url.error.id, url.error.value);
      cy.equals(method.error.id, method.error.value);
    });

    it('Enter a valid URL/Method and go to next page', () => {
      cy.createMonitor(name, type, url, method);
    });

    it('Enter invalid time for interval, retry interval and request timeout', () => {
      cy.createMonitor(name, type, url, method);

      cy.typeText(interval.id, interval.invalidValue);
      cy.typeText(retryInterval.id, retryInterval.invalidValue);
      cy.typeText(timeout.id, timeout.invalidValue);

      cy.get('[id="Submit"]').click();

      cy.equals(interval.error.id, interval.error.value);
      cy.equals(retryInterval.error.id, retryInterval.error.value);
      cy.equals(timeout.error.id, timeout.error.value);
    });

    it('Enter valid time for interval, retry interval and request timeout and go to next page', () => {
      cy.createMonitor(
        name,
        type,
        url,
        method,
        interval,
        retryInterval,
        timeout
      );
    });
  });

  context('edit a monitor', () => {
    before(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/');
    });

    it('Edit monitor name', () => {
      cy.get(`[id="monitor-${monitorName}"]`).click();

      cy.get('[id="monitor-edit-button"]').click();

      cy.typeText(name.id, '-Edited');

      cy.get('[id="Next"]').click();
      cy.get('[id="Next"]').click();

      cy.get('[id="Submit"]').click();

      cy.equals('[id="monitor-view-menu-name"]', `${name.value}-Edited`);
    });
  });

  context('delete a monitor', () => {
    before(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/');
    });

    it('Delete monitor', () => {
      cy.get(`[id="monitor-${monitorName}-Edited"]`).click();

      cy.get('[id="monitor-delete-button"]').click();

      cy.get('[id="monitor-delete-confirm-button"]').click();

      cy.get(`[id="monitor-${monitorName}-Edited"]`).should('not.exist');
    });
  });
});
