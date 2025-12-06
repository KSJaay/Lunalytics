import loginDetails from '../setup/fixtures/login.json';

describe("Lunalytics Status Page Flow", () => {
  const { email, password } = loginDetails.ownerUser;

  // Login before each test
  beforeEach(() => {
    cy.clearCookies();
    cy.loginUser(email, password);  // Assuming you have a custom command for login
    cy.visit('http://localhost:2308/home');
    cy.get('[class="luna-button-content"]', { timeout: 10000 }).should('be.visible');
  });

  it("should create a monitor", () => {
    // Click Add Monitor
    cy.contains("div.luna-button-content", "Add Monitor").click();

    // Type Monitor Name
    cy.get("#input-name").type("test-monitor");

    // Type Monitor URL
    cy.get("#input-url").type("http://lunalytics.xyz");

    // Click Create
    cy.contains("div.luna-button-content", "Create").click();

    // Assert Monitor Created (Optional toast check)
    cy.contains("test-monitor").should("exist");
  });

  it("should show error when creating status page without URL", () => {
    cy.visit("http://localhost:2308/status-pages");

    // Click Add Status Page Button
    cy.contains("div.luna-button-content", "Add Status Page").click();

    // Click Create without filling anything
    cy.get("#monitor-create-button").contains("Create").click();

    // Assert Error Toast
    cy.contains('URL should be either "default" or a url path.').should("exist");
  });

  it("should create a valid status page", () => {
    cy.visit("http://localhost:2308/status-pages");

    // Add Status Page Modal
    cy.contains("div.luna-button-content", "Add Status Page").click();

    // Click Settings
    cy.contains(".smc-options-item", "Settings").click();

    // Enter default into URL field
    cy.get("#status-url").type("default");

    // Go to Layout tab
    cy.contains("div", "Layout").click();

    // Click Add all monitors (twice as described)
    cy.contains("div.luna-button-content", "Add all monitors").click();
    cy.contains("div.luna-button-content", "Add all monitors").click();

    // Click Create
    cy.contains("div.luna-button-content", "Create").click();

    // Assert Success Toast
    cy.contains("Status page created successfully!").should("exist");
  });
});
