import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todos } from './todos';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  readonly todosUrl: string = environment.apiUrl + 'todos';

  constructor(private httpClient: HttpClient) {
  }



  getTodos(filters?: { status?: string }): Observable<Todos[]> {
    let httpParams: HttpParams = new HttpParams();

    if (filters){
      if (filters.status) {
        httpParams = httpParams.set('status', filters.status);
      }
  }


    return this.httpClient.get<Todos[]>(this.todosUrl, {
      params: httpParams,
    });
  }

  getTodoById(id: string): Observable<Todos> {
    return this.httpClient.get<Todos>(this.todosUrl + '/' + id);
  }

  filterTodos(todos: Todos[], filters: { owner?: string }): Todos[] {

    let filteredTodos = todos;

    // Filter by owner
    if (filters.owner) {
      filters.owner = filters.owner.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => todo.owner.toLowerCase().indexOf(filters.owner) !== -1);
    }
    return filteredTodos;
  }
}
