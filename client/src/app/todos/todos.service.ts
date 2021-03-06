import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todos } from './todos';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  readonly todosUrl: string = environment.apiUrl + 'todos';

  constructor(private httpClient: HttpClient) {
  }



  getTodos(filters?: { category?: string; status?: string }): Observable<Todos[]> {
    let httpParams: HttpParams = new HttpParams();

    if (filters){
      if (filters.status) {
        httpParams = httpParams.set('status', filters.status);
      }

      if (filters.category) {
        httpParams = httpParams.set('category', filters.category);
      }
  }


    return this.httpClient.get<Todos[]>(this.todosUrl, {
      params: httpParams,
    });
  }

  getTodoById(id: string): Observable<Todos> {
    return this.httpClient.get<Todos>(this.todosUrl + '/' + id);
  }

  filterTodos(todos: Todos[], filters: { body?: string; owner?: string }): Todos[] {

    let filteredTodos = todos;

    // Filter by owner
    if (filters.owner) {
      filters.owner = filters.owner.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => todo.owner.toLowerCase().indexOf(filters.owner) !== -1);
    }

    // Filter by body
    if (filters.body) {
      filters.body = filters.body;

      filteredTodos = filteredTodos.filter(todo => todo.body.indexOf(filters.body) !== -1);
    }
    return filteredTodos;
  }

  addTodo(newTodo: Todos): Observable<string> {
    // Send post request to add a new todos with the todos data as the body.
    return this.httpClient.post<{id: string}>(this.todosUrl, newTodo).pipe(map(res => res.id));
  }
}
