import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WindowTab } from './window';

describe('Window', () => {
  let component: WindowTab;
  let fixture: ComponentFixture<WindowTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindowTab],
    }).compileComponents();

    fixture = TestBed.createComponent(WindowTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
