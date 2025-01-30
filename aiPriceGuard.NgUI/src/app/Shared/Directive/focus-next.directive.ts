import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFocusNext]'
})
export class FocusNextDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    event.preventDefault(); // Prevent default Enter behavior
    this.moveFocusToNextElement();
  }

  private moveFocusToNextElement() {
    // Define selectors for all targetable PrimeNG components
    const focusableSelectors = [
      '.p-inputtext',       // Input fields
      '.p-dropdown',        // Dropdowns
      '.p-dropdown',        // Dropdowns
      '.p-autocomplete',    // Autocomplete
      '.p-calendar',        // Calendar
      '.p-button',          // Buttons (if required)
    ];

    // Query all elements matching the selectors
    const focusableElements = Array.from(
      document.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
    ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

    // Find the current element's index
    const currentIndex = focusableElements.indexOf(this.el.nativeElement);

    if (currentIndex >= 0) {
      // Focus the next element in the list (or wrap around to the first)
      const nextIndex = (currentIndex + 1) % focusableElements.length;
      const nextElement = focusableElements[nextIndex];

      // Handle specific PrimeNG components if needed
      if (nextElement.classList.contains('p-dropdown')) {
        // If it's a dropdown, check if the dropdown is open
        const inputElement = nextElement.querySelector('input');
        if (inputElement) {
          // If the dropdown input is not already focused, focus it
          inputElement.focus();
        } else {
          // If no input element found, just focus the dropdown itself
          nextElement.focus();
        }
      } else {
        nextElement.focus(); // Default focus behavior for other elements
      }
    }
  }
}
