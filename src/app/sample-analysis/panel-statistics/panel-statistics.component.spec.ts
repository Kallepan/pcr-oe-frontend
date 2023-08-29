import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelStatisticsComponent } from './panel-statistics.component';

describe('PanelStatisticsComponent', () => {
  let component: PanelStatisticsComponent;
  let fixture: ComponentFixture<PanelStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelStatisticsComponent]
    });
    fixture = TestBed.createComponent(PanelStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
