import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './users/user-list.component';
import { UserProfileComponent } from './users/user-profile.component';
import { AddUserComponent } from './users/add-user.component';
import { TodosListComponent } from './todos/todos-list.component';
import { TodosInfoComponent } from './todos/todos-info.component';
import { AddTodosComponent } from './todos/add-todo.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'users', component: UserListComponent},
  {path: 'users/new', component: AddUserComponent},
  {path: 'users/:id', component: UserProfileComponent},
  {path: 'todos', component: TodosListComponent},
  {path: 'todos/:id', component: TodosInfoComponent},
  {path: 'todos/new', component: AddTodosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
