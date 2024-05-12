import loginDetails from './setup/fixtures/login.json';

describe('Verify User', () => {
  context('Register a user and get owner to verify the user', () => {
    const username = 'test' + Date.now();
    const secondUsername = 'test2nd' + Date.now();

    it('Register two users', () => {
      cy.visit('/register');
      cy.registerUser(`${username}@lunalytics.xyz`, username, 'testing123');
      cy.clearCookies();
      cy.visit('/register');
      cy.registerUser(
        `${secondUsername}@lunalytics.xyz`,
        secondUsername,
        'testing123'
      );
    });

    it('Accept member from settings', () => {
      cy.clearCookies();
      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      cy.visit('/settings');
      cy.contains('[id="manage"]', 'Manage Team').click();

      cy.get(`[id="accept-${username}"]`).click();

      cy.get('[id="manage-approve-button"]').click();

      cy.clearCookies();

      cy.loginUser(`${username}@lunalytics.xyz`, 'testing123');

      cy.url().should('eq', 'http://localhost:2308/');
    });

    it('Decline member from settings', () => {
      cy.clearCookies();

      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      cy.visit('/settings');

      cy.get('[id="manage"]').click();
      cy.get(`[id="decline-${secondUsername}"]`).click();
      cy.get('[id="manage-decline-button"]').click();

      cy.clearCookies();

      cy.loginUser(`${secondUsername}@lunalytics.xyz`, 'testing123');

      cy.url().should('eq', 'http://localhost:2308/login');
    });
  });
});
