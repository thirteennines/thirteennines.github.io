import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Guestbook } from './guestbook';

describe('Guestbook', () => {
  let component: Guestbook;
  let fixture: ComponentFixture<Guestbook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Guestbook],
    }).compileComponents();

    fixture = TestBed.createComponent(Guestbook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
