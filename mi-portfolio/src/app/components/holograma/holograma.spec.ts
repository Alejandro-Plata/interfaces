import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Holograma } from './holograma';

describe('Holograma', () => {
  let component: Holograma;
  let fixture: ComponentFixture<Holograma>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Holograma]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Holograma);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
