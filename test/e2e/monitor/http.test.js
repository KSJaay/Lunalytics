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
      cy.contains('.item.item-active div.content div div', monitorDetails.http.name.value)
        .first()
        .click();

      cy.get('[id="monitor-edit-button"]').click({ force: true });

      // Wait for input to be enabled, then type
      cy.get(monitorDetails.http.name.id, { timeout: 10000 })
        .should('be.visible')
        .should('not.be.disabled') // wait for input to be enabled
        .invoke('val')
        .then((currentValue) => {
          cy.get(monitorDetails.http.name.id).clear().type(`${currentValue}-Edited`);
        });

      // Save the monitor
      cy.get('[class="luna-button green flat"]', { timeout: 10000 })
        .should('be.visible')
        .click();

      // Assert the edited monitor name is visible
      cy.contains(
        '.item.item-active div.content div div',
        `${monitorDetails.http.name.value}-Edited`,
        { timeout: 10000 }
      ).should('be.visible');
    });
  });

    context('delete a monitor', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.loginUser(email, password);
      cy.visit('/home');
    });

    it('Delete monitor', () => {
  // Click the monitor by its visible name
  cy.contains('.item.item-active div.content div div', `${monitorDetails.http.name.value}-Edited`)
    .first()
    .click({ force: true });

  // Click delete (dropdown or hidden button)
  cy.get('[id="monitor-delete-button"]')
    .click({ force: true });  // force click because element may be clipped

  // Confirm deletion
  cy.get('[id="monitor-delete-confirm-button"]')
    .click({ force: true });  // also force click

  // Assert monitor is removed
  cy.contains(
    '.item.item-active div.content div div',
    `${monitorDetails.http.name.value}-Edited`,
    { timeout: 15000 } // wait for DOM update
  ).should('not.exist');
});

  });
});
