import loginDetails from './setup/fixtures/login.json';

describe('Auth', () => {
  context('Signin tests', () => {
    before(() => {
      cy.clearCookies();

      cy.registerUser(
        loginDetails.email,
        loginDetails.username,
        loginDetails.password
      );

      cy.clearCookies();

      cy.verifyUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password,
        loginDetails.username
      );

      cy.clearCookies();
    });

    after(() => {
      cy.clearCookies();
      cy.deleteUserAccount(loginDetails.email, loginDetails.password);
    });

    it('Signin with invalid email shows error', () => {
      cy.visit('/login');

      cy.typeText('[id="email"]', 'invalidemail.com').clickOutside();

      cy.equals('[id="error-email"]', 'Email is not valid');
    });

    it('Signin with invalid password shows error', () => {
      cy.visit('/login');

      cy.typeText('[id="email"]', loginDetails.email).clickOutside();

      cy.get('[id="auth-button"]').click();

      cy.equals('[id="auth-title"]', 'Enter password');

      cy.typeText(
        '[id="password"]',
        loginDetails.incorrectPasswords[0].value
      ).clickOutside();

      cy.equals('[id="error-password"]', 'Password is not valid');
    });

    it('Signin with valid credentials redirects to home', () => {
      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      cy.url().should('eq', 'http://localhost:2308/home');
    });
  });

  context('Register tests', () => {
    const username = loginDetails.username + Date.now();
    const userEmail = username + '@lunalytics.xyz';

    after(() => {
      cy.clearCookies();

      cy.verifyUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password,
        username
      );

      cy.clearCookies();

      cy.deleteUserAccount(userEmail, loginDetails.password);
    });

    it('Register with invalid email shows error', () => {
      cy.visit('/login');

      cy.typeText('[id="email"]', 'invalidemail.com').clickOutside();

      cy.equals('[id="error-email"]', 'Email is not valid');
    });

    it('Register with invalid Email shows error', () => {
      cy.visit('/login');

      cy.typeText('[id="email"]', 'ab').clickOutside();

      cy.equals(
        '[id="error-email"]',
        'Email must be between 3 and 254 characters.'
      );
    });

    it('Register with valid email proceeds to details page', () => {
      cy.visit('/login');

      cy.typeText('[id="email"]', userEmail).clickOutside();

      cy.get('[id="auth-button"]').click();

      cy.equals('[id="auth-title"]', 'Enter details');
    });

    it('Register with invalid username shows error', () => {
      cy.visit('/login');

      cy.typeText('[id="email"]', userEmail).clickOutside();

      cy.get('[id="auth-button"]').click();

      cy.typeText('[id="username"]', 'ab').clickOutside();

      cy.equals(
        '[id="error-username"]',
        'Username must be between 3 and 32 characters.'
      );
    });

    it('Register with invalid password shows error', () => {
      cy.visit('/login');

      cy.typeText('[id="email"]', userEmail).clickOutside();
      cy.get('[id="auth-button"]').click();

      cy.typeText('[id="username"]', username).clickOutside();

      cy.typeText('[id="password"]', 'short').clickOutside();

      cy.equals(
        '[id="error-password"]',
        'Password must be between 8 and 48 characters.'
      );
    });

    it('Register with non-matching confirm password shows error', () => {
      cy.visit('/login');

      cy.typeText('[id="email"]', userEmail).clickOutside();
      cy.get('[id="auth-button"]').click();

      cy.typeText('[id="username"]', username).clickOutside();

      cy.typeText('[id="password"]', loginDetails.password).clickOutside();

      cy.typeText('[id="confirmPassword"]', 'differentpassword').clickOutside();

      cy.equals('[id="error-confirmPassword"]', 'Passwords do not match');
    });

    it('Register with valid details proceeds to next step', () => {
      cy.visit('/login');

      cy.typeText('[id="email"]', userEmail).clickOutside();
      cy.get('[id="auth-button"]').click();

      cy.typeText('[id="username"]', username).clickOutside();

      cy.typeText('[id="password"]', loginDetails.password).clickOutside();

      cy.typeText(
        '[id="confirmPassword"]',
        loginDetails.password
      ).clickOutside();

      cy.get('[id="auth-button"]').click();

      cy.url().should('eq', 'http://localhost:2308/verify');
    });
  });
});
