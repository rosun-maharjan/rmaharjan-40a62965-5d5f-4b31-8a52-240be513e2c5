import { TestBed } from '@angular/core/testing';
import { App } from './app.js';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('should render the portal title', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges(); // Trigger initial data binding
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check for your new title instead of the old Nx one
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'TurboVets Staff'
    );
  });
});