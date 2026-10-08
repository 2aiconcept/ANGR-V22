import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonSmal } from './button-smal';

describe('ButtonSmal', () => {
  let component: ButtonSmal;
  let fixture: ComponentFixture<ButtonSmal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonSmal],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonSmal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
