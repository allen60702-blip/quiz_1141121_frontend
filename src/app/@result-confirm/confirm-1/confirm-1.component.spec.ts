import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confirm1Component } from './confirm-1.component';

describe('Confirm1Component', () => {
  let component: Confirm1Component;
  let fixture: ComponentFixture<Confirm1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confirm1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Confirm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
