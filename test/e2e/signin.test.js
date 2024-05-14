import loginDetails from './setup/fixtures/login.json';

describe('Sign in', () => {
  context('Signin with invalid credentials', () => {
    it('Signing in with an invalid email', () => {
      cy.visit('/login');

      cy.typeText('[id="email"]', 'ksjaay.com').clickOutside();

      cy.equals('[id="text-input-error-email"]', 'Email is not valid');

      cy.get('[class="auth-button"]').click();

      cy.equals('[id="text-input-error-email"]', 'Email is not valid');
    });

    it('Signing in with an invalid password', () => {
      cy.visit('/login');

      cy.typeText('[id="email"]', loginDetails.email).clickOutside();

      cy.typeText(
        '[id="password"]',
        loginDetails.incorrectPasswords[0].value
      ).clickOutside();

      cy.equals('[id="text-input-error-password"]', 'Password is not valid');

      cy.get('[class="auth-button"]').click();

      cy.equals('[id="text-input-error-password"]', 'Password is not valid');
    });
  });

  context('Signin with valid credentials', () => {
    it('Signing in with valid credentials', () => {
      cy.visit('/login');

      cy.typeText('[id="email"]', loginDetails.ownerUser.email).clickOutside();
      cy.typeText(
        '[id="password"]',
        loginDetails.ownerUser.password
      ).clickOutside();

      cy.get('[class="auth-button"]').click();

      cy.url().should('eq', 'http://localhost:2308/');
    });
  });
});
