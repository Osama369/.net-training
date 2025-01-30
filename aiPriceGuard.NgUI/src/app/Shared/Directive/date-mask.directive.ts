import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateMask]'
})
export class DateMaskDirective {
  private readonly separator: string = '-';

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    const formatted = this.applyMask(input);
    this.el.nativeElement.value = formatted;
  }

  @HostListener('blur', ['$event'])
  onBlur(event: any): void {
    const input = this.el.nativeElement.value;
    if (!this.isValidDate(input)) {
      this.el.nativeElement.value = null; // Clear the input if invalid
    }
  }

  private applyMask(value: string): string {
    let result = value;

    // Apply the mask
    if (value.length > 2) {
      result = value.substring(0, 2) + this.separator + value.substring(2);
    }
    if (value.length > 4) {
      result = result.substring(0, 5) + this.separator + value.substring(4);
    }

    // Ensure length does not exceed 10 characters (dd-MM-yyyy)
    return result.substring(0, 10);
  }

  private isValidDate(input: string): boolean {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!dateRegex.test(input)) {
        return false; // Input does not match the dd-MM-yyyy format
    }

    // Extract day, month, and year from the input
    const [day, month, year] = input.split('-').map((v) => parseInt(v, 10));

    // Create a date object with the extracted values
    const inputDate = new Date(year, month - 1, day); // Month is 0-indexed in JS
    const today = new Date();

    // Clear the time component of today's date for accurate comparison
    today.setHours(0, 0, 0, 0);

    // Check if the input date is greater than today
    if (inputDate <= today) {
        return false;
    }

    // Validate the date object matches the input
    return (
        inputDate.getDate() === day &&
        inputDate.getMonth() === month - 1 &&
        inputDate.getFullYear() === year
    );
}

}
