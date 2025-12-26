import loginDetails from './setup/fixtures/login.json';

describe('Verify User', () => {
  context('Register a user and get owner to verify the user', () => {
    const username = 'test' + Date.now();
    const secondUsername = 'test2nd' + Date.now();

    before(() => {
      cy.clearCookies();

      cy.registerUser(
        `${username}@lunalytics.xyz`,
        username,
        'Lunalytics12345!$#'
      );

      cy.clearCookies();

      cy.registerUser(
        `${secondUsername}@lunalytics.xyz`,
        secondUsername,
        'Lunalytics12345!$#'
      );
    });

    it('Accept member from settings', () => {
      cy.clearCookies();
      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      cy.visit('/settings');
      cy.contains('[id="Manage-Team"]', 'Manage Team').click();

      cy.get(`[id="accept-${username}"]`).click();

      cy.get('[id="manage-approve-button"]').click();

      cy.clearCookies();

      cy.loginUser(`${username}@lunalytics.xyz`, 'Lunalytics12345!$#');

      cy.url().should('eq', 'http://localhost:2308/home');

      cy.clearCookies();

      cy.deleteUserAccount(`${username}@lunalytics.xyz`, 'Lunalytics12345!$#');
    });

    it('Decline member from settings', () => {
      cy.clearCookies();

      cy.loginUser(
        loginDetails.ownerUser.email,
        loginDetails.ownerUser.password
      );

      cy.visit('/settings');

      cy.get('[id="Manage-Team"]').click();
      cy.get(`[id="decline-${secondUsername}"]`).click();
      cy.get('[id="manage-decline-button"]').click();

      cy.wait(1000);

      cy.clearCookies();

      cy.visit('/login');

      cy.typeText(
        '[id="email"]',
        `${secondUsername}@lunalytics.xyz`
      ).clickOutside();

      cy.get('[id="auth-button"]').click();

      cy.equals('[id="auth-title"]', 'Enter details');
    });
  });
});
