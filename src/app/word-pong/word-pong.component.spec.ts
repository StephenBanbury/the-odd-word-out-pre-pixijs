import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordPongComponent } from './word-pong.component';

describe('WordPongComponent', () => {
  let component: WordPongComponent;
  let fixture: ComponentFixture<WordPongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordPongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordPongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
