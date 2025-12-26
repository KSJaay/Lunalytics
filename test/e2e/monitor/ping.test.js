import loginDetails from '../setup/fixtures/login.json';
import pingMonitorDetails from '../setup/fixtures/monitors/ping.json';

describe('Monitor Ping', () => {
  context('create a monitor with basic information', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/home');
    });

    it('should show errors for invalid values and create a monitor with valid values', () => {
      cy.createMonitor(pingMonitorDetails);
    });
  });

  context('edit a monitor', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/home');
    });

    it('Edit monitor name', () => {
      cy.get('[id="monitor-options-button"]').click();

      cy.get('[id="monitor-edit-button"]').click();

      cy.typeText(pingMonitorDetails.name.id, '-Edited');

      cy.get('[id="monitor-configure-submit-button"]').click();

      cy.equals(
        '[id="monitor-view-menu-name"]',
        `Monitor - ${pingMonitorDetails.name.value}-Edited`
      );
    });
  });

  context('delete a monitor', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/home');
    });

    it('Delete monitor', () => {
      cy.get('[id="monitor-options-button"]').click();

      cy.get('[id="monitor-delete-button"]').click();

      cy.get('[id="monitor-delete-confirm-button"]').click();

      cy.get(`[id="monitor-view-menu-name"]`).should('not.exist');

      cy.get('[class="monitor-none-exist"]')
        .should('be.visible')
        .contains('No monitors found');
    });
  });
});
