import { TodosListPage } from '../support/todos-list.po';

const page = new TodosListPage();

describe('Todos list', () => {

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTodosTitle().should('have.text', 'Todos');
  });

  it('Should show 300 todos in both card and list view', () => {
    page.getTodosCards().should('have.length', 300);
    page.changeView('list');
    page.getTodosListItems().should('have.length', 300);
  });

  it('Should type something in the owner filter and check that it returned correct elements', () => {
    // Filter for todos 'Fry'
    cy.get('#todos-owner-input').type('Fry');

    // All of the todos cards should have the owner we are filtering by
    page.getTodosCards().each(e => {
      cy.wrap(e).find('.todos-card-owner').should('have.text', 'Fry');
    });

    // (We check this two ways to show multiple ways to check this)
    page.getTodosCards().find('.todos-card-owner').each($el =>
      expect($el.text()).to.equal('Fry')
    );
  });

  it('Should type something in the body filter and check that it returned correct elements', () => {
    // Filter for todos 'sunt'
    cy.get('#todos-body-input').type('sunt');

    // All of the todos cards should have the body we are filtering by
    // (We check this two ways to show multiple ways to check this)
    page.getTodosCards().find('.todos-card-body').each($el =>
      expect($el.text()).to.contain('sunt')
    );
  });

  it('Should type something in the category filter and check that it returned correct elements', () => {
    // Filter for category 'homework'
    cy.get('[data-test=todosCategoryInput]').type('homework');

    page.getTodosCards().should('have.lengthOf.above', 0);

    // All of the todos cards should have the category we are filtering by
    page.getTodosCards().find('.todos-card-category').each(card => {
      cy.wrap(card).should('have.text', 'homework');
    });
  });

  it('Should type something partial in the category filter and check that it returned correct elements', () => {
    // Filter for category 'homework'
    cy.get('[data-test=todosCategoryInput]').type('homewo');

    page.getTodosCards().should('have.lengthOf.above', 0);

    // All of the todos cards should have the category we are filtering by
    page.getTodosCards().find('.todos-card-category').each(card => {
      cy.wrap(card).should('have.text', 'homework');
    });
  });

  it('Should select a status and get results', () => {
    // Filter for status 'viewer');
    page.selectStatus('complete');

    // Some of the todos should be listed
    page.getTodosCards().should('have.lengthOf.above', 0);

    // All of the todo card items that show should have the status we are looking for
    page.getTodosCards().find('.todos-card-status').each($card => {
      cy.wrap($card).should('have.text', 'true');
    });
  });

  it('Should change the view', () => {
    // Choose the view type "List"
    page.changeView('list');

    // We should not see any cards
    // There should be list items
    page.getTodosCards().should('not.exist');
    page.getTodosListItems().should('exist');

    // Choose the view type "Card"
    page.changeView('card');

    // There should be cards
    // We should not see any list items
    page.getTodosCards().should('exist');
    page.getTodosListItems().should('not.exist');
  });

  it('Should click view info on a todos and go to the right URL', () => {
    page.getTodosCards().first().then((card) => {
      const firstTodosOwner = card.find('.todos-card-owner').text();
      const firstTodosStatus = card.find('.todos-card-status').text();
      const firstTodosBody = card.find('.todos-card-body').text();
      const firstTodosCategory = card.find('.todos-card-category').text();

      // When the view info button on the first todos card is clicked, the URL should have a valid mongo ID
      page.clickViewInfo(page.getTodosCards().first());

      // The URL should contain '/todos/' (note the ending slash) and '/todos/' should be followed by a mongo ID
      cy.url()
        .should('contain', '/todos/')
        .should('match', /.*\/todos\/[0-9a-fA-F]{24}$/);

      // On this info page we were sent to, the owner and category should be correct
      cy.get('.todos-card-owner').first().should('have.text', firstTodosOwner);
      cy.get('.todos-card-status').first().should('have.text', firstTodosStatus);
      cy.get('.todos-card-body').first().should('have.text', firstTodosBody);
      cy.get('.todos-card-category').first().should('have.text', firstTodosCategory);
    });
   });

});
