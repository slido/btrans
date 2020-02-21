import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBtcComponent } from './send-btc.component';

describe('SendBtcComponent', () => {
  let component: SendBtcComponent;
  let fixture: ComponentFixture<SendBtcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendBtcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendBtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
