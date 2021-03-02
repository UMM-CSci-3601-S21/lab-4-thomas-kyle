import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todos } from '../app/todos/todos';
import { TodosService } from '../app/todos/todos.service';

/**
 * A "mock" version of the `TodosService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockTodosService extends TodosService {
  static testTodos: Todos[] = [
    {
      _id: 'chris_id',
      owner: 'chris',
      status: false,
      body: 'happy to help',
      category: 'workout'
    },
    {
      _id: 'pam_id',
      owner: 'pam',
      status: false,
      body: 'here to stay',
      category: 'call'
    },
    {
      _id: 'jamie_id',
      owner: 'jamie',
      status: true,
      body: 'pull that up',
      category: 'podcast'
    }
  ];

  constructor() {
    super(null);
  }

  getTodos(): Observable<Todos[]> {
    // Our goal here isn't to test (and thus rewrite) the service, so we'll
    // keep it simple and just return the test users regardless of what
    // filters are passed in.
    return of(MockTodosService.testTodos);
  }

  getTodoById(id: string): Observable<Todos> {
    // If the specified ID is for the first test user,
    // return that user, otherwise return `null` so
    // we can test illegal user requests.
    if (id === MockTodosService.testTodos[0]._id) {
      return of(MockTodosService.testTodos[0]);
    } else {
      return of(null);
    }
  }

}
