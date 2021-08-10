const URL = 'http://localhost:4200/';

describe('When a user visits m3o.com', () => {
  before(() => {
    cy.intercept('https://in.hotjar.com/');
    cy.viewport('macbook-16');
  });

  it('should allow them to login', () => {
    cy.visit(URL);
    cy.byCy('login').click();
    cy.url().should('contain', '/login');
    cy.get('[name="email"]').type('martin@m3o.com');
    cy.get('[name="password"]').type('PasswordFore2e');
    cy.byCy('submit').click();
    cy.url().should('eq', URL);
  });
});
