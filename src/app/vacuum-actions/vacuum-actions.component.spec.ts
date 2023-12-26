import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacuumActionsComponent } from './vacuum-actions.component';

describe('VacuumActionsComponent', () => {
  let component: VacuumActionsComponent;
  let fixture: ComponentFixture<VacuumActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VacuumActionsComponent]
    });
    fixture = TestBed.createComponent(VacuumActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
