import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelViewComponent } from './wheel-view.component';

describe('WheelViewComponent', () => {
  let component: WheelViewComponent;
  let fixture: ComponentFixture<WheelViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WheelViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
