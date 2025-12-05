import loginDetails from './setup/fixtures/login.json';

describe('Register', () => {
  const userEmail = `${loginDetails.username}${Date.now()}@lunalytics.xyz`;

  context('Register with invalid email', () => {
    loginDetails.incorrectEmails.forEach(({ value: email, error }) => {
      it(`Registering user with email: ${email}`, () => {
        cy.visit('/register');

        cy.typeText('[id="email"]', email).clickOutside();

        cy.equals('[id="error-email"]', error);
      });
    });
  });

  context('Register with invalid username', () => {
    loginDetails.incorrectUsernames.forEach(({ value: username, error }) => {
      it(`Registering user with username: ${username}`, () => {
        cy.visit('/register');

        cy.get('[class="luna-button-content"]').click();

        cy.typeText('[id="username"]', username).clickOutside();

        cy.equals('[id="error-username"]', error);
      });
    });
  });

  context('Register with invalid password', () => {
    loginDetails.incorrectPasswords.forEach(({ value: password, error }) => {
      it(`Registering user with password: ${password}`, () => {
        cy.visit('/register');

        cy.typeText('[id="email"]', userEmail).clickOutside();
        cy.get('[class="luna-button-content"]').click();
        cy.typeText('[id="username"]', loginDetails.username).clickOutside();
        cy.typeText('[id="password"]', password).clickOutside();

        cy.equals('[id="error-password"]', error);
      });
    });

    it('Registering user with valid password and invalid confirm password', () => {
      cy.visit('/register');

      cy.typeText('[id="email"]', userEmail).clickOutside();
      cy.get('[class="luna-button-content"]').click();
      cy.typeText('[id="username"]', loginDetails.username).clickOutside();

      cy.typeText('[id="password"]', loginDetails.password).clickOutside();
      cy.typeText('[id="confirmPassword"]', `${loginDetails.password}123`).clickOutside();

      cy.equals('[id="error-confirmPassword"]', 'Passwords do not match');
    });
  });

  context('Register with valid details', () => {
    it('Registering user with valid details', () => {
      cy.visit('/register');

      cy.typeText('[id="email"]', userEmail).clickOutside();
      cy.get('[class="luna-button-content"]').click();
      cy.typeText('[id="username"]', loginDetails.username).clickOutside();
      cy.typeText('[id="password"]', loginDetails.password).clickOutside();
      cy.typeText('[id="confirmPassword"]', loginDetails.password).clickOutside();

      cy.get('[class="luna-button-content"]').click();
    });
  });
});
