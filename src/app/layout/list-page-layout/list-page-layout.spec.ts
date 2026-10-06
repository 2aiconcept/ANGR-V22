import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPageLayout } from './list-page-layout';

describe('ListPageLayout', () => {
  let component: ListPageLayout;
  let fixture: ComponentFixture<ListPageLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPageLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ListPageLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
