import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Drawbox } from './drawbox';

describe('Drawbox', () => {
  let component: Drawbox;
  let fixture: ComponentFixture<Drawbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Drawbox],
    }).compileComponents();

    fixture = TestBed.createComponent(Drawbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
