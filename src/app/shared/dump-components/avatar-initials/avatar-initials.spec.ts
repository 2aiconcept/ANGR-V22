import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarInitials } from './avatar-initials';

describe('AvatarInitials', () => {
  let component: AvatarInitials;
  let fixture: ComponentFixture<AvatarInitials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarInitials],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarInitials);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
