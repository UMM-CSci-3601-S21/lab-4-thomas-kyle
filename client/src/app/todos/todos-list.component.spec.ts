import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockTodosService } from '../../testing/todos.service.mock';
import { Todos } from './todos';
import { TodosCardComponent } from './todos-card.component';
import { TodosListComponent } from './todos-list.component';
import { TodosService } from './todos.service';
import { MatIconModule } from '@angular/material/icon';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('TodosListComponent', () => {

  let todosList: TodosListComponent;
  let fixture: ComponentFixture<TodosListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [TodosListComponent, TodosCardComponent],
      // providers:    [ TodosService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      // This MockerTodosService is defined in client/testing/todos.service.mock.
      providers: [{ provide: TodosService, useValue: new MockTodosService() }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      // Create a "fixture" of the TodosListComponent. that
      // allows us to get an instance of the component
      // (todosList, below) that we can "control" in
      // the tests.
      fixture = TestBed.createComponent(TodosListComponent);
      todosList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the todos', () => {
    expect(todosList.serverFilteredTodos.length).toBe(3);
  });

  it('contains a todos owned by "chris"', () => {
    expect(todosList.serverFilteredTodos.some((todos: Todos) => todos.owner === 'chris')).toBe(true);
  });

  it('contains a todos owned by "jamie"', () => {
    expect(todosList.serverFilteredTodos.some((todos: Todos) => todos.owner === 'jamie')).toBe(true);
  });

  it('doesn\'t contain a todos owned by "Grinch"', () => {
    expect(todosList.serverFilteredTodos.some((todos: Todos) => todos.owner === 'Grinch')).toBe(false);
  });

  it('has two todos that are false', () => {
    expect(todosList.serverFilteredTodos.filter((todos: Todos) => todos.status === false).length).toBe(2);
  });
});

  /*
 * This test is a little odd, but illustrates how we can use "stubbing"
 * to create mock objects (a service in this case) that be used for
 * testing. Here we set up the mock TodosService (todosServiceStub) so that
 * _always_ fails (throws an exception) when you request a set of todos.
 *
 * So this doesn't really test anything meaningful in the context of our
 * code (I certainly wouldn't copy it), but it does illustrate some nice
 * testing tools. Hopefully it's useful as an example in that regard.
 */
describe('Misbehaving Todos List', () => {
  let todosList: TodosListComponent;
  let fixture: ComponentFixture<TodosListComponent>;

  let todosServiceStub: {
    getTodos: () => Observable<Todos[]>;
    getTodosFiltered: () => Observable<Todos[]>;
  };

  beforeEach(() => {
    // stub TodosService for test purposes
    todosServiceStub = {
      getTodos: () => new Observable(observer => {
        observer.error('Error-prone observable');
      }),
      getTodosFiltered: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [TodosListComponent],
      // providers:    [ TodosService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: TodosService, useValue: todosServiceStub }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodosListComponent);
      todosList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('fails to load todos if we do not set up a TodosListService', () => {
    // Since calling both getTodos() and getTodosFiltered() return
    // Observables that then throw exceptions, we don't expect the component
    // to be able to get a list of todos, and serverFilteredTodos should
    // be undefined.
    expect(todosList.serverFilteredTodos).toBeUndefined();
  });
});
