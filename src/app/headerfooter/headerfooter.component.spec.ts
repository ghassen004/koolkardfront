import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderfooterComponent } from './headerfooter.component';

describe('HeaderfooterComponent', () => {
  let component: HeaderfooterComponent;
  let fixture: ComponentFixture<HeaderfooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderfooterComponent]
    });
    fixture = TestBed.createComponent(HeaderfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
