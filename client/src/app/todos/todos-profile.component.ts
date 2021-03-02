import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Todos } from './todos';
import { TodosService } from './todos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todos-profile',
  templateUrl: './todos-profile.component.html',
  styleUrls: ['./todos-profile.component.scss']
})
export class TodosProfileComponent implements OnInit, OnDestroy {
  todos: Todos;
  id: string;
  getTodoSub: Subscription;

  constructor(private route: ActivatedRoute, private todosService: TodosService) { }

  ngOnInit(): void {
    // We subscribe to the parameter map here so we'll be notified whenever
    // that changes (i.e., when the URL changes) so this component will update
    // to display the newly requested todos.
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      if (this.getTodoSub) {
        this.getTodoSub.unsubscribe();
      }
      this.getTodoSub = this.todosService.getTodoById(this.id).subscribe(todos => this.todos = todos);
    });
  }

  ngOnDestroy(): void {
    if (this.getTodoSub) {
      this.getTodoSub.unsubscribe();
    }
  }
}
