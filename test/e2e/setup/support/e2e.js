import './commands';

const SUPPRESSED = [
  'ResizeObserver loop',
  'Hydration failed',
  'Minified React error #418',
];

Cypress.on('uncaught:exception', (err) => {
  if (SUPPRESSED.some((needle) => err.message.includes(needle))) {
    return false;
  }
  return true;
});

beforeEach(() => {
  cy.viewport(
    Cypress.config('viewportWidth'),
    Cypress.config('viewportHeight')
  );
});
