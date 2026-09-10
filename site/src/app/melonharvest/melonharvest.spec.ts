import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Melonharvest } from './melonharvest';

describe('Melonharvest', () => {
  let component: Melonharvest;
  let fixture: ComponentFixture<Melonharvest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Melonharvest],
    }).compileComponents();

    fixture = TestBed.createComponent(Melonharvest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
