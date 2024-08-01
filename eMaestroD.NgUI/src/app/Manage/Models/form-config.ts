import { FormField } from "./form-field";
import { TabConfig } from "./tab-config";

export interface FormConfig {
  title: string;
  tabs?: TabConfig[]; // optional tabs
  fields?: FormField[]; // for forms without tabs
}
