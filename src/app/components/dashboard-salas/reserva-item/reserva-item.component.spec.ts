import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaItemComponent } from './reserva-item.component';

describe('ReservaItemComponent', () => {
  let component: ReservaItemComponent;
  let fixture: ComponentFixture<ReservaItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReservaItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
