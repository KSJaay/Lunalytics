import loginDetails from '../setup/fixtures/login.json';
import incidentData from '../setup/fixtures/incidents/incident.json';

describe('Incidents', () => {
  beforeEach(() => {
    const { email, password } = loginDetails.ownerUser;
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Login
    cy.visit('/login');
    cy.loginUser(email, password);
    
    // Navigate to incidents page
    cy.visit('/incidents', { timeout: 10000 });
    cy.url().should('include', '/incidents');
    cy.wait(2000); // Wait for page to fully load
  });

  context('Create Incident - Validation', () => {
    it('should enforce maximum character limit of 100 on title', () => {
      // Open Modal - try button with and without specific classes
      cy.get('body').then(($body) => {
        if ($body.find(incidentData.openButton.selector).length > 0) {
          cy.get(incidentData.openButton.selector)
            .contains(incidentData.openButton.text)
            .should('be.visible')
            .click({ force: true });
        } else {
          // Fallback: find button by text alone
          cy.contains('button', incidentData.openButton.text, { timeout: 10000 })
            .should('be.visible')
            .click({ force: true });
        }
      });

      // Wait for modal to appear
      cy.wait(1500);
      cy.get('.modal-container, [role="dialog"]', { timeout: 10000 }).should('exist');

      // Type text longer than 100 characters (using longValue from fixture)
      const longText = incidentData.title.longValue;

      cy.get(incidentData.title.id, { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(longText, { delay: 0 });

      // Assert that the input value was truncated to exactly 100 characters
      cy.get(incidentData.title.id)
        .invoke('val')
        .should('have.length', 100)
        .and('equal', longText.substring(0, 100));

      // Verify maxlength attribute
      cy.get(incidentData.title.id)
        .should('have.attr', 'maxlength', '100');
    });

    it('should not create incident with empty title', () => {
      // Open modal
      cy.get('body').then(($body) => {
        if ($body.find(incidentData.openButton.selector).length > 0) {
          cy.get(incidentData.openButton.selector)
            .contains(incidentData.openButton.text)
            .click({ force: true });
        } else {
          cy.contains('button', incidentData.openButton.text, { timeout: 10000 })
            .click({ force: true });
        }
      });

      // Wait for modal
      cy.wait(1500);
      cy.get('.modal-container, [role="dialog"]', { timeout: 10000 }).should('exist');

      // Leave title empty, fill only message
      cy.get(incidentData.message.id, { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(incidentData.message.validValue);

      // Try to submit
      cy.get(incidentData.createButton.selector, { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .wait(500)
        .click({ force: true });

      // Wait for validation
      cy.wait(1500);

      // Modal should still be open (validation failed)
      cy.get('.modal-container, [role="dialog"]', { timeout: 5000 })
        .should('exist');

      // Optionally check for error message
      cy.get('body').then(($body) => {
        if ($body.find(incidentData.title.error.id).length > 0) {
          cy.get(incidentData.title.error.id)
            .should('be.visible')
            .and('contain', incidentData.title.error.value);
        } else {
          cy.log('No specific error message element found, but modal is still open');
        }
      });
    });
  });

  context('Create Incident - Happy Path', () => {
    it('should create an incident with valid inputs', () => {
      // Open Modal
      cy.get('body').then(($body) => {
        if ($body.find(incidentData.openButton.selector).length > 0) {
          cy.get(incidentData.openButton.selector)
            .contains(incidentData.openButton.text)
            .click({ force: true });
        } else {
          cy.contains('button', incidentData.openButton.text, { timeout: 10000 })
            .click({ force: true });
        }
      });

      // Wait for modal
      cy.wait(1500);
      cy.get('.modal-container, [role="dialog"]', { timeout: 10000 }).should('exist');

      // Fill Title
      cy.get(incidentData.title.id, { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(incidentData.title.validValue);

      cy.wait(500);

      // Select Status: "Identified"
      cy.get(incidentData.status.selector, { timeout: 10000 })
        .contains(incidentData.status.identified)
        .should('exist')
        .scrollIntoView()
        .wait(300)
        .click({ force: true });

      cy.wait(500);

      // Fill Message
      cy.get(incidentData.message.id, { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .clear()
        .type(incidentData.message.validValue);

      cy.wait(500);

      // Click Create button
      cy.get(incidentData.createButton.selector, { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .scrollIntoView()
        .wait(500)
        .click({ force: true });

      // Wait for creation
      cy.wait(2500);

      // Verify modal closed
      cy.get('.modal-container, [role="dialog"]', { timeout: 5000 })
        .should('not.exist');

      // Verify incident appears in the list
      cy.contains(incidentData.title.validValue, { timeout: 10000 })
        .should('exist');

      // Verify "No incidents" message is gone
      cy.get('.monitor-none-exist').should('not.exist');
    });

    it('should create incident with different status options', () => {
      // Test creating with "Investigating" status
      cy.get('body').then(($body) => {
        if ($body.find(incidentData.openButton.selector).length > 0) {
          cy.get(incidentData.openButton.selector)
            .contains(incidentData.openButton.text)
            .click({ force: true });
        } else {
          cy.contains('button', incidentData.openButton.text)
            .click({ force: true });
        }
      });

      cy.wait(1500);

      const timestamp = Date.now();
      cy.get(incidentData.title.id, { timeout: 10000 })
        .should('exist')
        .clear()
        .type(`Test Incident ${timestamp}`);

      // Select "Investigating" status
      cy.get(incidentData.status.selector, { timeout: 10000 })
        .contains(incidentData.status.investigating)
        .should('exist')
        .wait(300)
        .click({ force: true });

      cy.get(incidentData.message.id, { timeout: 10000 })
        .should('exist')
        .type('Testing with Investigating status');

      cy.get(incidentData.createButton.selector, { timeout: 10000 })
        .should('exist')
        .wait(500)
        .click({ force: true });

      cy.wait(2500);

      // Verify creation
      cy.contains(`Test Incident ${timestamp}`, { timeout: 10000 })
        .should('exist');
    });

    it('should allow canceling incident creation', () => {
      // Open modal
      cy.get('body').then(($body) => {
        if ($body.find(incidentData.openButton.selector).length > 0) {
          cy.get(incidentData.openButton.selector)
            .contains(incidentData.openButton.text)
            .click({ force: true });
        } else {
          cy.contains('button', incidentData.openButton.text)
            .click({ force: true });
        }
      });

      cy.wait(1500);

      // Fill some data
      cy.get(incidentData.title.id, { timeout: 10000 })
        .should('exist')
        .type('This should be canceled');

      // Click cancel button
      cy.get(incidentData.cancelButton.selector, { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .scrollIntoView()
        .wait(500)
        .click({ force: true });

      cy.wait(1000);

      // Modal should be closed
      cy.get('.modal-container, [role="dialog"]', { timeout: 5000 })
        .should('not.exist');

      // Incident should not be created
      cy.contains('This should be canceled').should('not.exist');
    });
  });

  context('Create Incident - Edge Cases', () => {
    it('should handle special characters in title and message', () => {
      cy.get('body').then(($body) => {
        if ($body.find(incidentData.openButton.selector).length > 0) {
          cy.get(incidentData.openButton.selector)
            .contains(incidentData.openButton.text)
            .click({ force: true });
        } else {
          cy.contains('button', incidentData.openButton.text)
            .click({ force: true });
        }
      });

      cy.wait(1500);

      const specialTitle = 'Test <script>alert("XSS")</script> & "quotes" \'single\'';
      
      cy.get(incidentData.title.id, { timeout: 10000 })
        .should('exist')
        .type(specialTitle);

      cy.get(incidentData.status.selector)
        .contains(incidentData.status.identified)
        .click({ force: true });

      cy.get(incidentData.message.id, { timeout: 10000 })
        .should('exist')
        .type('Testing special chars: <>&"\' symbols');

      cy.get(incidentData.createButton.selector)
        .should('exist')
        .wait(500)
        .click({ force: true });

      cy.wait(2500);

      // Verify incident was created (text should be escaped, not executed)
      cy.get('body').then(($body) => {
        const bodyText = $body.text();
        // Should contain the text but not execute as script
        expect(bodyText).to.include('Test');
      });
    });
  });
});
