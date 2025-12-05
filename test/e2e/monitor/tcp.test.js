import loginDetails from '../setup/fixtures/login.json';
import monitorDetails from '../setup/fixtures/monitor.json';

describe('Monitor TCP - Advance', () => {
  context('create a monitor with basic information', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/home');
      cy.get('[class="luna-button-content"]', { timeout: 10000 }).should('be.visible');
    });

    it('should show errors for invalid values and create a monitor with valid values', () => {
      cy.createMonitor(monitorDetails.tcp);
    });
  });

  context('edit a TCP monitor', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/home');
    });

    it('should edit the TCP monitor name', () => {
      // Create monitor first
      cy.createMonitor(monitorDetails.tcp);

      // Click the monitor by visible name
      cy.contains('.item.item-active div.content div div', monitorDetails.tcp.name.value, { timeout: 10000 })
        .first()
        .click();

      cy.get('[id="monitor-edit-button"]').click({ force: true });

      // Wait for input to render and type full new name
      cy.get(monitorDetails.tcp.name.id, { timeout: 10000 })
        .should('exist')
        .clear()
        .type(`${monitorDetails.tcp.name.value}-Edited`);

      // Click create/save button (TCP skips Advanced, green button is enough)
      cy.get('[class="luna-button green flat"]', { timeout: 10000 }).click();

      // Assert new name is visible in monitor list
      cy.contains('.item.item-active div.content div div', `${monitorDetails.tcp.name.value}-Edited`, { timeout: 10000 })
        .should('be.visible');
    });
  });

  context('delete a TCP monitor', () => {
    beforeEach(() => {
      const { email, password } = loginDetails.ownerUser;

      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/home');
    });

    it('should delete the TCP monitor', () => {
      cy.contains('.item.item-active div.content div div', monitorDetails.tcp.name.value, { timeout: 10000 })
        .first()
        .click();

      cy.get('[id="monitor-delete-button"]').click({ force: true });
      cy.get('[id="monitor-delete-confirm-button"]').click({ force: true });

      // Assert monitor no longer exists
      cy.contains('.item.item-active div.content div div', monitorDetails.tcp.name.value, { timeout: 10000 })
        .should('not.exist');
    });
  });

});