import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MockTodosService } from '../../testing/todos.service.mock';
import { Todos } from './todos';
import { TodosCardComponent } from './todos-card.component';
import { TodosProfileComponent } from './todos-profile.component';
import { TodosService } from './todos.service';

describe('TodosProfileComponent', () => {
  let component: TodosProfileComponent;
  let fixture: ComponentFixture<TodosProfileComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule
      ],
      declarations: [TodosProfileComponent, TodosCardComponent],
      providers: [
        { provide: TodosService, useValue: new MockTodosService() },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a specific todos profile', () => {
    const expectedTodos: Todos = MockTodosService.testTodos[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `TodosProfileComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedTodos._id });

    expect(component.id).toEqual(expectedTodos._id);
    expect(component.todos).toEqual(expectedTodos);
  });

  it('should navigate to correct todos when the id parameter changes', () => {
    let expectedTodos: Todos = MockTodosService.testTodos[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `TodosProfileComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedTodos._id });

    expect(component.id).toEqual(expectedTodos._id);

    // Changing the paramMap should update the displayed todos profile.
    expectedTodos = MockTodosService.testTodos[1];
    activatedRoute.setParamMap({ id: expectedTodos._id });

    expect(component.id).toEqual(expectedTodos._id);
  });

  it('should have `null` for the todos for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID' });

    // If the given ID doesn't map to a todos, we expect the service
    // to return `null`, so we would expect the component's todos
    // to also be `null`.
    expect(component.id).toEqual('badID');
    expect(component.todos).toBeNull();
  });
});
