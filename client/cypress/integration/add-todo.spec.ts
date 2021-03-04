import { Todos } from 'src/app/todos/todos';
import { AddTodoPage } from '../support/add-todo.po';

describe('Add todo', () => {
  const page = new AddTodoPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Todo');
  });

  it('Should enable and disable the add todo button', () => {
    // ADD USER button should be disabled until all the necessary fields
    // are filled. Once the last (`#categoryField`) is filled, then the button should
    // become enabled.
    page.addTodoButton().should('be.disabled');
    page.getFormField('owner').type('test');
    page.addTodoButton().should('be.disabled');
    page.getFormField('body').type('Hi Im Paul');
    page.addTodoButton().should('be.disabled');
    page.getFormField('category').type('Im  cool');
    page.addTodoButton().should('be.disabled');
    // all the required fields have valid input, then it should be enabled
    page.addTodoButton().should('be.enabled');
  });

  it('Should show error messages for invalid inputs', () => {
    // Before doing anything there shouldn't be an error
    cy.get('[data-test=ownerError]').should('not.exist');
    // Just clicking the owner field without entering anything should cause an error message
    page.getFormField('owner').click().blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');
    // Some more tests for various invalid owner inputs
    page.getFormField('owner').type('J').blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');
    page.getFormField('owner').clear().type('This is a very long owner that goes beyond the 50 character limit').blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');
    // Entering a valid owner should remove the error.
    page.getFormField('owner').clear().type('John Smith').blur();
    cy.get('[data-test=ownerError]').should('not.exist');

    // Before doing anything there shouldn't be an error
    cy.get('[data-test=bodyError]').should('not.exist');
    // Just clicking the body field without entering anything should cause an error message
    page.getFormField('body').click().blur();
    // Some more tests for various invalid body inputs
    cy.get('[data-test=bodyError]').should('exist').and('be.visible');
    // Entering a valid body should remove the error.
    page.getFormField('body').clear().type('Hi this is a body').blur();
    cy.get('[data-test=bodyError]').should('not.exist');

    // Before doing anything there shouldn't be an error
    cy.get('[data-test=categoryError]').should('not.exist');
    // Just clicking the category field without entering anything should cause an error message
    page.getFormField('category').click().blur();
    // Some more tests for various invalid category inputs
    cy.get('[data-test=categoryError]').should('exist').and('be.visible');
    page.getFormField('category').type('J').blur();
    cy.get('[data-test=categoryError]').should('exist').and('be.visible');
    page.getFormField('category').clear().type('This is a very long category that goes beyond the 50 character limit').blur();
    cy.get('[data-test=categoryError]').should('exist').and('be.visible');
    // Entering a valid category should remove the error.
    page.getFormField('category').clear().type('John Smith').blur();
    cy.get('[data-test=categoryError]').should('not.exist');
  });

  describe('Adding a new todo', () => {

    beforeEach(() => {
      cy.task('seed:database');
    });

    it('Should go to the right page, and have the right info', () => {
      const todo: Todos = {
        _id: null,
        owner: 'Test Todo',
        status: true,
        category: 'test category',
        body: 'editor'
      };

      page.addTodo(todo);

      // New URL should end in the 24 hex character Mongo ID of the newly added todo
      cy.url()
        .should('match', /\/todos\/[0-9a-fA-F]{24}$/)
        .should('not.match', /\/todos\/new$/);

      // The new todo should have all the same attributes as we entered
      cy.get('.todo-card-owner').should('have.text', todo.owner);
      cy.get('.todo-card-category').should('have.text', todo.category);
      cy.get('.todo-card-body').should('have.text', todo.body);
      cy.get('.todo-card-status').should('have.text', todo.status);

      // We should see the confirmation message at the bottom of the screen
      cy.get('.mat-simple-snackbar').should('contain', `Added Todo ${todo.owner}`);
    });

    it('Should fail with no category', () => {
      const todo: Todos = {
        _id: null,
        owner: 'Test Todo',
        status: false,
        category: null, // The category being set to null means nothing will be typed for it
        body: 'editor in chief'
      };

      page.addTodo(todo);

      // We should get an error message
      cy.get('.mat-simple-snackbar').should('contain', `Failed to add the todo`);

      // We should have stayed on the new todo page
      cy.url()
        .should('not.match', /\/todos\/[0-9a-fA-F]{24}$/)
        .should('match', /\/todos\/new$/);

      // The things we entered in the form should still be there
      page.getFormField('owner').should('have.value', todo.owner);
      page.getFormField('body').should('have.value', todo.body);
      page.getFormField('category').should('have.value', todo.category);
      page.getFormField('status').should('have.value', todo.status);
    });
  });

});
