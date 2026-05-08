import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Result2Component } from './result-2.component';

describe('Result2Component', () => {
  let component: Result2Component;
  let fixture: ComponentFixture<Result2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Result2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Result2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
