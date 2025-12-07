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

      // Append '-Edited' to the existing value
      cy.get(monitorDetails.http.name.id)
        .invoke('val')
        .then((currentValue) => {
          cy.typeText(
            monitorDetails.http.name.id,
            `${currentValue}-Edited`
          );
        });

      // Save the monitor
      cy.get('[class="luna-button green flat"]', { timeout: 10000 }).click();

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
      cy.contains(
        '.item.item-active div.content div div',
        `${monitorDetails.http.name.value}-Edited`
      )
        .first()
        .click();

      // Click delete
      cy.get('[id="monitor-delete-button"]').click({ force: true });

      // Confirm deletion
      cy.get('[id="monitor-delete-confirm-button"]').click({ force: true });

      // Assert monitor is removed
      cy.contains(
        '.item.item-active div.content div div',
        `${monitorDetails.http.name.value}-Edited`,
        { timeout: 10000 }
      ).should('not.exist');
    });
  });
});
