import { CSECustomer } from "./csecustomer";
import { MseMapArea } from "./mse-map-area";

export class CompanyCSE {
  CSEID?: number | null = null; // Nullable number for CSEID
  CompID?: number | null = null; // Nullable number for CompID
  vendID?: number | null = null; // Nullable number for vendID
  vendName?: string | null = null; // Nullable string for vendName
  RepName?: string | null = null; // Nullable string for RepName
  Address1?: string | null = null; // Nullable string for Address1
  email?: string | null = null; // Nullable string for email
  Cell?: string | null = null; // Nullable string for Cell
  Active?: boolean | null = null; // Nullable boolean for Active
  IsDefault?: boolean | null = null; // Nullable boolean for IsDefault
  CSECustomer?: CSECustomer[] = []; // List of CSECustomer objects (empty array by default)
}
