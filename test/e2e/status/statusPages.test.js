import loginDetails from '../setup/fixtures/login.json';

describe("Lunalytics Status Page Flow", () => {
  const { email, password } = loginDetails.ownerUser;

  beforeEach(() => {
    cy.clearCookies();
    cy.loginUser(email, password);
    cy.visit('http://localhost:2308/home');
    cy.get('[class="luna-button-content"]', { timeout: 10000 }).should('be.visible');
  });

  it("should create a monitor", () => {
    cy.contains("div.luna-button-content", "Add Monitor").click();
    cy.get("#input-name").type("test-monitor");
    cy.get("#input-url").type("http://lunalytics.xyz");
    cy.contains("div.luna-button-content", "Create").click();
    cy.contains("test-monitor").should("exist");
  });

  it('shows error toast if status page URL already exists', () => {
    cy.visit("http://localhost:2308/status-pages");

    // Open Add Status Page modal
    cy.contains("div.luna-button-content", "Add Status Page").click();

    // Open Settings if needed
    cy.contains(".smc-options-item", "Settings").click();

    // Wait for the input to exist
    
cy.get('#status-url').clear().blur(); // make sure the field is empty
cy.get('#monitor-create-button').contains('Create').click();

// Assert the error toast appears
cy.contains('URL should be either "default" or a url path.', { timeout: 10000 })
  .should('be.visible');

// Close the toast
cy.get('.Toastify__toast--error .Toastify__close-button').click();

  });

  it("should create a valid status page", () => {
    cy.visit("http://localhost:2308/status-pages");

    cy.contains("div.luna-button-content", "Add Status Page").click();
    cy.contains(".smc-options-item", "Settings").click();

    cy.get("#status-url", { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type("default");

    cy.contains("div", "Layout").click();

    // Wait for the "Add all monitors" button to appear
    cy.contains("div.luna-button-content", "Add all monitors", { timeout: 10000 })
      .should("be.visible")
      .click();

    // Click it again (if needed)
    cy.contains("div.luna-button-content", "Add all monitors", { timeout: 10000 })
      .should("be.visible")
      .click();

    // Continue with Create
    cy.contains("div.luna-button-content", "Create").click();


    cy.contains("Status page created successfully!").should("exist");
  });
});
