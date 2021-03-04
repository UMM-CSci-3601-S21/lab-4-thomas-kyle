import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TodosCardComponent } from './todos-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';

describe('TodosCardComponent', () => {
  let component: TodosCardComponent;
  let fixture: ComponentFixture<TodosCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule
      ],
      declarations: [ TodosCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosCardComponent);
    component = fixture.componentInstance;
    component.todos = {
      _id: 'chris_id',
      owner: 'Chris',
      category: 'intro',
      body: 'Hey I am Chris',
      status: true,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
