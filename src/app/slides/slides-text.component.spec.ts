import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidesTextComponent } from './slides-text.component';

describe('SlidesTextComponent', () => {
  let component: SlidesTextComponent;
  let fixture: ComponentFixture<SlidesTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidesTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidesTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
