import loginDetails from '../setup/fixtures/login.json';
import monitorDetails from '../setup/fixtures/monitor.json';

describe('Monitor HTTP - Advance', () => {
  const { email, password } = loginDetails.ownerUser;

  context('create a monitor with basic information', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/home');
      cy.get('[class="luna-button-content"]', { timeout: 10000 }).should('be.visible');
    });

    it('should show errors for invalid values and create a monitor with valid values', () => {
      cy.createMonitor(monitorDetails.http);
    });
  });

  context('edit a monitor', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/home');
    });

    it('Edit monitor name', () => {
      cy.createMonitor(monitorDetails.http);

      // Click the monitor by its visible name
      cy.get('.item.item-active div.content div div', { timeout: 10000 })
        .contains(monitorDetails.http.name.value)
        .should('be.visible')
        .click();

      cy.get('[id="monitor-edit-button"]', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

      // Append '-Edited' to the existing value
      cy.get(monitorDetails.http.name.id, { timeout: 10000 })
        .should('be.visible')
        .then(($input) => {
          const currentValue = $input.val();
          cy.get(monitorDetails.http.name.id).clear().type(`${currentValue}-Edited`);
        });

      // Save the monitor
      cy.get('[class="luna-button green flat"]', { timeout: 10000 })
        .should('be.visible')
        .click();

      // Assert the edited monitor name is visible
      cy.get('.item.item-active div.content div div', { timeout: 10000 })
        .contains(`${monitorDetails.http.name.value}-Edited`)
        .should('be.visible');
    });
  });

  context('delete a monitor', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/home');
    });

    it('Delete monitor', () => {
      // Wait for monitor to exist before clicking
      cy.get('.item.item-active div.content div div', { timeout: 10000 })
        .contains(`${monitorDetails.http.name.value}-Edited`)
        .should('be.visible')
        .click();

      // Click delete and confirm
      cy.get('[id="monitor-delete-button"]', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

      cy.get('[id="monitor-delete-confirm-button"]', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

      // Assert monitor is removed
      cy.get('.item.item-active div.content div div', { timeout: 10000 })
        .contains(`${monitorDetails.http.name.value}-Edited`)
        .should('not.exist');
    });
  });
});
