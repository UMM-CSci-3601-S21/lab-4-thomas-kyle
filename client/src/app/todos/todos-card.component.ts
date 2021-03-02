import { Component, OnInit, Input } from '@angular/core';
import { Todos } from './todos';

@Component({
  selector: 'app-todos-card',
  templateUrl: './todos-card.component.html',
  styleUrls: ['./todos-card.component.scss']
})
export class TodosCardComponent implements OnInit {

  @Input() todos: Todos;
  @Input() simple?: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
