import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Todos } from './todos';
import { TodosService } from './todos.service';

@Component({
  selector: 'app-add-todos',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodosComponent implements OnInit {

  addTodosForm: FormGroup;

  todos: Todos;

    // not sure if this owner is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  addTodosValidationMessages = {
    owner: [
      {type: 'required', message: 'Owner is required'},
      {type: 'minlength', message: 'Owner must be at least 2 characters long'},
      {type: 'maxlength', message: 'Owner cannot be more than 50 characters long'}
    ],

    body: [
      {type: 'required', message: 'Body is required'},
      {type: 'minlength', message: 'Body must be at least 5 characters long'}
    ],

    category: [
      {type: 'required', message: 'Category is required'},
      {type: 'minlength', message: 'Category must be at least 2 characters long'},
      {type: 'maxlength', message: 'Category cannot be more than 50 characters long'}
    ],

    status: [
      { type: 'required', message: 'Status is required' },
      { type: 'pattern', message: 'Status must be True or False' },
    ]
  };

  constructor(private fb: FormBuilder, private todosService: TodosService, private snackBar: MatSnackBar, private router: Router) {
  }

  createForms() {

    // add todos form validations
    this.addTodosForm = this.fb.group({
      // We allow alphanumeric input and limit the length for owner.
      owner: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        // In the real world you'd want to be very careful about having
        // an upper limit like this because people can sometimes have
        // very long owners. This demonstrates that it's possible, though,
        // to have maximum length limits.
        Validators.maxLength(50)
      ])),

      // We don't care much about what is in the company field, so we just add it here as part of the form
      // without any particular validation.
      category: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        // In the real world you'd want to be very careful about having
        // an upper limit like this because people can sometimes have
        // very long owners. This demonstrates that it's possible, though,
        // to have maximum length limits.
        Validators.maxLength(50)
      ])),

      // We don't need a special validator just for our app here, but there is a default one for email.
      // We will require the email, though.
      body: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),

      status: new FormControl('false', Validators.compose([
        Validators.required,
        Validators.pattern('^(true|false)$'),
      ])),
    });

  }

  ngOnInit() {
    this.createForms();
  }


  submitForm() {
    this.todosService.addTodo(this.addTodosForm.value).subscribe(newID => {
      this.snackBar.open('Added Todos ' + this.addTodosForm.value.owner, null, {
        duration: 2000,
      });
      this.router.navigate(['/todos/', newID]);
    }, err => {
      this.snackBar.open('Failed to add the todos', 'OK', {
        duration: 5000,
      });
    });
  }

}
