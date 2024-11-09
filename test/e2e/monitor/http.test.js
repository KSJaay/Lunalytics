import loginDetails from '../setup/fixtures/login.json';
import monitorDetails from '../setup/fixtures/monitor.json';

describe('Monitor HTTP - Advance', () => {
  context('create a monitor with basic information', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/');
    });

    it('should show errors for invalid values and create a monitor with valid values', () => {
      cy.createMonitor(monitorDetails.http);
    });
  });

  context('edit a monitor', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/');
    });

    it('Edit monitor name', () => {
      cy.get(`[id="monitor-${monitorDetails.http.name.value}"]`).click();

      cy.get('[id="monitor-edit-button"]').click();

      cy.typeText(monitorDetails.http.name.id, '-Edited');

      cy.get('[id="monitor-create-button"]').click();

      cy.equals(
        '[id="monitor-view-menu-name"]',
        `${monitorDetails.http.name.value}-Edited`
      );
    });
  });

  context('delete a monitor', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/');
    });

    it('Delete monitor', () => {
      cy.get(`[id="monitor-${monitorDetails.http.name.value}-Edited"]`).click();

      cy.get('[id="monitor-delete-button"]').click();

      cy.get('[id="monitor-delete-confirm-button"]').click();

      cy.get(`[id="monitor-${monitorDetails.http.name.value}-Edited"]`).should(
        'not.exist'
      );
    });
  });
});
