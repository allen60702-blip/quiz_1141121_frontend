import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confirm2Component } from './confirm-2.component';

describe('Confirm2Component', () => {
  let component: Confirm2Component;
  let fixture: ComponentFixture<Confirm2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confirm2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Confirm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
