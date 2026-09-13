import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Musicplayer } from './musicplayer';

describe('Musicplayer', () => {
  let component: Musicplayer;
  let fixture: ComponentFixture<Musicplayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Musicplayer],
    }).compileComponents();

    fixture = TestBed.createComponent(Musicplayer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
