import './commands';
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('Unable to preload CSS')) {
    return false; // prevent Cypress from failing
  }
});