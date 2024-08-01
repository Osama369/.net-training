import { FormGroup } from "@angular/forms";

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'dropdown' | 'checkbox' | 'date';
  options?: { value: any; label: string }[]; // for dropdowns
  validators?: any[];
  visible?: boolean; // default visibility
  condition?: (value: any, form: FormGroup) => boolean; // condition for dynamic visibility
}
