import { Component, OnInit, OnDestroy } from '@angular/core';
import { Todos } from './todos';
import { TodosService } from './todos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todos-list-component',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.scss'],
  providers: []
})
export class TodosListComponent implements OnInit, OnDestroy {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredTodos: Todos[];
  public filteredTodos: Todos[];

  public todosOwner: string;
  public todosBody: string;
  public todosCategory: string;
  public todosStatus: string;
  public todosLimit: number;
  public todosOrderBy: string;
  public viewType: 'card' | 'list' = 'card';
  getTodosSub: Subscription;

  // Inject the TodoService into this component.
  // That's what happens in the following constructor.
  //
  // We can call upon the service for interacting
  // with the server.
  constructor(private todosService: TodosService) {

  }

  getTodosFromServer() {
    this.unsub();
    this.getTodosSub = this.todosService.getTodos({
      status: this.todosStatus
    }).subscribe(returnedTodos => {
      this.serverFilteredTodos = returnedTodos;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }
  public updateFilter() {
    this.filteredTodos = this.todosService.filterTodos(
      this.serverFilteredTodos, { owner: this.todosOwner });
  }

  /**
   * Starts an asynchronous operation to update the todos list
   *
   */
  ngOnInit(): void {
    this.getTodosFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getTodosSub) {
      this.getTodosSub.unsubscribe();
    }
  }

}
