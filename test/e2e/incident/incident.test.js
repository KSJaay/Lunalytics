import loginDetails from '../setup/fixtures/login.json';
import incidentData from '../setup/fixtures/incidents/incident.json';

describe('Incidents', () => {
  beforeEach(() => {
    const { email, password } = loginDetails.ownerUser;
    cy.clearCookies();
    cy.loginUser(email, password);
    // Assuming the URL based on context, update if different
    cy.visit('/incidents'); 
  });

  context('Create Incident - Validation', () => {
    it('should enforce maximum character limit of 100 on title', () => {
      // Open Modal
      cy.get(incidentData.openButton.selector)
        .contains(incidentData.openButton.text)
        .click();

      // Create a string longer than 100 characters (150 chars)
      const longText = 'a'.repeat(150);

      // Type the long text
      cy.get(incidentData.title.id).type(longText);

      // Assert that the input value was truncated to exactly 100 characters
      // because the HTML has maxlength="100"
      cy.get(incidentData.title.id)
        .should('have.value', longText.substring(0, 100))
        .and('have.attr', 'maxlength', '100');
    });

    it('should not create incident with empty title', () => {
      cy.get(incidentData.openButton.selector).click();

      // Leave title empty, fill other fields
      cy.get(incidentData.message.id).type(incidentData.message.validValue);
      
      // Click Create
      cy.get(incidentData.createButton.selector).click();

      // Assert Modal is still open (or check for specific error if LunaUI generates one)
      cy.get('.modal-container').should('exist');
      
      // If your UI generates a specific error message span for empty fields:
      // cy.get(incidentData.title.error.id).should('be.visible');
    });
  });

  context('Create Incident - Happy Path', () => {
    it('fails to create an incident despite valid inputs (Known Bug)', () => {
      // 1. Open Modal
      cy.get(incidentData.openButton.selector).click();

      // 2. Fill Title with valid data
      cy.get(incidentData.title.id)
        .clear()
        .type(incidentData.title.validValue);

      // 3. Select Status (using contains because IDs are repeated in HTML)
      cy.get(incidentData.status.selector)
        .contains(incidentData.status.identified)
        .click();

      // 4. Fill Message
      cy.get(incidentData.message.id)
        .type(incidentData.message.validValue);

      // 5. Click Create
      cy.get(incidentData.createButton.selector).click();

      // --- BUG ASSERTIONS ---
      // If the code is buggy and doesn't create the incident, the modal usually stays open 
      // or the list doesn't update.
      
      // Assert the modal did NOT close (indicating a crash or failed submission)
      cy.get('.modal-container').should('exist');

      // Assert the list still says "No incidents found" (indicating data was not saved)
      cy.get('.monitor-none-exist').should('exist');
    });
  });
});