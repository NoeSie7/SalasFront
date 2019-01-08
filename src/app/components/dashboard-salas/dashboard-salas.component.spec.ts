import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSalasComponent } from './dashboard-salas.component';

describe('DashboardSalasComponent', () => {
  let component: DashboardSalasComponent;
  let fixture: ComponentFixture<DashboardSalasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSalasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSalasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
