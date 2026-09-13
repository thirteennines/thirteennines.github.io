import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cucumbermelon } from './cucumbermelon';

describe('Cucumbermelon', () => {
  let component: Cucumbermelon;
  let fixture: ComponentFixture<Cucumbermelon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cucumbermelon],
    }).compileComponents();

    fixture = TestBed.createComponent(Cucumbermelon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
