import loginDetails from '../setup/fixtures/login.json';
import incidentData from '../setup/fixtures/incidents/incident.json';

describe('Incidents - Debug', () => {
  it('DEBUG: Check what pages are available', () => {
    const { email, password } = loginDetails.ownerUser;
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/login');
    cy.loginUser(email, password);
    
    // Wait for login to complete
    cy.wait(2000);
    
    // Check what page we're on
    cy.url().then((url) => {
      cy.log('After login, current URL:', url);
    });
    
    cy.screenshot('01-after-login');
    
    // Log page content
    cy.get('body').invoke('text').then((text) => {
      cy.log('Page content (first 300 chars):', text.substring(0, 300));
    });
    
    // Try to visit home/dashboard
    cy.visit('/home', { failOnStatusCode: false });
    cy.wait(1000);
    cy.screenshot('02-home-page');
    cy.url().then((url) => cy.log('Home URL:', url));
    
    // Try status pages
    cy.visit('/status-pages', { failOnStatusCode: false });
    cy.wait(1000);
    cy.screenshot('03-status-pages');
    
    cy.get('body').then(($body) => {
      const text = $body.text();
      cy.log('Status pages content:', text.substring(0, 300));
      
      if (text.includes('Add') || text.includes('Create') || text.includes('New')) {
        cy.log('✅ Found Add/Create button text on status pages');
      } else {
        cy.log('❌ No Add/Create button on status pages');
      }
    });
    
    // Try to visit incidents directly
    cy.visit('/incidents', { failOnStatusCode: false });
    cy.wait(1000);
    cy.screenshot('04-incidents-direct');
    
    cy.url().then((url) => {
      cy.log('Incidents direct URL:', url);
      if (!url.includes('/incidents')) {
        cy.log('⚠️ Redirected away from /incidents to:', url);
      }
    });
    
    cy.get('body').then(($body) => {
      const text = $body.text();
      cy.log('Incidents page content:', text.substring(0, 300));
      
      // Count elements
      const buttons = $body.find('button').length;
      const links = $body.find('a').length;
      const divs = $body.find('div').length;
      
      cy.log(`Elements found: ${buttons} buttons, ${links} links, ${divs} divs`);
      
      if (buttons === 0 && links === 0 && divs < 5) {
        cy.log('⚠️ Page appears to be empty or not loaded');
      }
    });
    
    // Check navigation/sidebar
    cy.get('nav, [role="navigation"], .sidebar, .menu, header').then(($nav) => {
      if ($nav.length > 0) {
        cy.log('Navigation found, content:', $nav.text());
        
        // Try to find incidents link
        if ($nav.text().toLowerCase().includes('incident')) {
          cy.log('✅ Found "incident" in navigation');
        }
        
        if ($nav.text().toLowerCase().includes('status')) {
          cy.log('✅ Found "status" in navigation');
        }
      } else {
        cy.log('❌ No navigation elements found');
      }
    });
  });

  it('DEBUG: Try to access incidents through status page', () => {
    const { email, password } = loginDetails.ownerUser;
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/login');
    cy.loginUser(email, password);
    cy.wait(2000);
    
    // Go to status pages
    cy.visit('/status-pages', { failOnStatusCode: false });
    cy.wait(2000);
    cy.screenshot('05-status-pages-for-incidents');
    
    cy.get('body').then(($body) => {
      const text = $body.text();
      
      // Check if status pages exist
      if (text.includes('No status page') || text.includes('Create your first')) {
        cy.log('⚠️ No status pages exist - need to create one first');
        cy.log('ACTION REQUIRED: Create a status page before testing incidents');
        
        // Try to find create button
        cy.get('button, a, [role="button"]').each(($el) => {
          const elText = Cypress.$($el).text();
          cy.log(`Found: "${elText}"`);
        });
      } else {
        cy.log('✅ Status pages exist, trying to find one...');
        
        // Try to click on a status page
        cy.get('body').then(($b) => {
          // Look for status page cards/items
          const statusPageLinks = $b.find('a[href*="status"]').length;
          const statusPageCards = $b.find('.card, .item, [class*="status"]').length;
          
          cy.log(`Found ${statusPageLinks} status page links, ${statusPageCards} cards`);
          
          if (statusPageLinks > 0) {
            cy.get('a[href*="status"]').first().then(($link) => {
              const href = $link.attr('href');
              cy.log('Clicking status page:', href);
              cy.wrap($link).click({ force: true });
              
              cy.wait(2000);
              cy.screenshot('06-inside-status-page');
              
              // Now look for incidents
              cy.get('body').then(($inner) => {
                const innerText = $inner.text();
                cy.log('Inside status page:', innerText.substring(0, 300));
                
                if (innerText.toLowerCase().includes('incident')) {
                  cy.log('✅ Found "incident" text inside status page');
                  
                  // Try to find incidents link/tab
                  cy.contains('Incident', { matchCase: false }).then(($incident) => {
                    cy.log('Found incident element, trying to click...');
                    cy.wrap($incident).click({ force: true });
                    cy.wait(2000);
                    cy.screenshot('07-incidents-page-accessed');
                    
                    // Check for Add Incident button
                    cy.get('body').then(($final) => {
                      const finalText = $final.text();
                      if (finalText.includes('Add Incident')) {
                        cy.log('✅✅✅ SUCCESS! Found "Add Incident" button!');
                      } else {
                        cy.log('All buttons:', $final.find('button').text());
                      }
                    });
                  });
                }
              });
            });
          }
        });
      }
    });
  });
});

describe('Incidents - Actual Tests (Run after debug)', () => {
  // These tests should be updated based on what the debug tests reveal
  
  it.skip('Placeholder - Update path based on debug results', () => {
    // Once we know the correct path to incidents, update these tests
    cy.log('Run debug tests first to find correct navigation path');
  });
});
