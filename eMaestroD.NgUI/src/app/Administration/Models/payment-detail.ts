export class PaymentDetail {
  id?: string;
  tenantId?: number;
  createTime?: Date;
  updateTime?: Date;
  intent?: string;
  status?: string;
  payerEmail?: string;
  payerId?: string;
  payerCountryCode?: string;
  payerGivenName?: string;
  payerSurname?: string;
  referenceId?: string;
  amountValue?: number;
  amountCurrency?: string;
  payeeEmail?: string;
  merchantId?: string;
  shippingFullName?: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  adminArea2?: string;
  adminArea1?: string;
  postalCode?: string;
  countryCode?: string;
  captureId?: string;
  captureStatus?: string;
  captureCreateTime?: Date;
  captureUpdateTime?: Date;
  captureAmountValue?: number;
  captureAmountCurrency?: string;
  finalCapture?: boolean;
  sellerProtectionStatus?: string;
  disputeCategories?: string;
  selfLinkHref?: string;
  selfLinkRel?: string;
  selfLinkMethod?: string;
  selfLinkTitle?: string;
  refundLinkHref?: string;
  refundLinkRel?: string;
  refundLinkMethod?: string;
  refundLinkTitle?: string;
  upLinkHref?: string;
  upLinkRel?: string;
  upLinkMethod?: string;
  upLinkTitle?: string;
  subscriptionPlan?: string;

  // Not mapped properties
  tenantEmailAddress?: string;
  companiesCount?: any;
  usersCount?: any;
  locationCount?: any;
  subscriptionDuration? : any;

  constructor(init?: Partial<PaymentDetail>) {
    Object.assign(this, init);
  }
}
