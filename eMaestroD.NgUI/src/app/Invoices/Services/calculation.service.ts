import { Injectable } from '@angular/core';
import { ProductViewModel } from 'src/app/Manage/Models/product-view-model';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor() { }


  calculateItem(product: ProductViewModel): ProductViewModel {
    // Initialize fields with default values
    product.qty = product.qty || 0;
    product.bonusQty = product.bonusQty || 0;
    product.purchRate = product.purchRate || 0;
    product.discount = product.discount || 0;
    product.discountAmount = product.discountAmount || 0;
    product.taxPercent = product.taxPercent || 0;
    product.taxAmount = product.taxAmount || 0;
    product.extraDiscountPercent = product.extraDiscountPercent || 0;
    product.extraDiscountAmount = product.extraDiscountAmount || 0;
    product.advanceTaxPercent = product.advanceTaxPercent || 0;
    product.advanceTaxAmount = product.advanceTaxAmount || 0;
    product.extraAdvanceTaxAmount = product.extraAdvanceTaxAmount || 0;
    product.extraAdvanceTaxPercent = product.extraAdvanceTaxPercent || 0;
    product.rebatePercent = product.rebatePercent || 0;
    product.rebateAmount = product.rebateAmount || 0;

    // Calculate gross value
    product.grossValue = parseFloat((product.qty * product.purchRate).toFixed(2));

    // Calculate discount
    if (product.discount > 0) {
      product.discountAmount = parseFloat(((product.grossValue * product.discount) / 100).toFixed(2));
    } else {
      product.discount = parseFloat(((product.discountAmount / product.grossValue) * 100).toFixed(2)) || 0;
    }

    // Calculate discounted gross
    product.discountedGross = parseFloat((product.grossValue - product.discountAmount).toFixed(2));

    // Calculate tax
    if (product.taxPercent > 0) {
      product.taxAmount = parseFloat(((product.discountedGross * product.taxPercent) / 100).toFixed(2));
    } else {
      product.taxPercent = parseFloat(((product.taxAmount / product.discountedGross) * 100).toFixed(2)) || 0;
    }

    // Calculate extra discount
    if (product.extraDiscountPercent > 0) {
      product.extraDiscountAmount = parseFloat(((product.discountedGross * product.extraDiscountPercent) / 100).toFixed(2));
    } else {
      product.extraDiscountPercent = parseFloat(((product.extraDiscountAmount / product.discountedGross) * 100).toFixed(2)) || 0;
    }

    // Calculate advance tax
    if (product.advanceTaxPercent > 0) {
      product.advanceTaxAmount = parseFloat(((product.discountedGross * product.advanceTaxPercent) / 100).toFixed(2));
    } else {
      product.advanceTaxPercent = parseFloat(((product.advanceTaxAmount / product.discountedGross) * 100).toFixed(2)) || 0;
    }

    // Calculate extra advance tax
    if (product.extraAdvanceTaxPercent > 0) {
      product.extraAdvanceTaxAmount = parseFloat(((product.discountedGross * product.extraAdvanceTaxPercent) / 100).toFixed(2));
    } else {
      product.extraAdvanceTaxPercent = parseFloat(((product.extraAdvanceTaxAmount / product.discountedGross) * 100).toFixed(2)) || 0;
    }

    // Calculate net amount before rebate
    product.netAmountBeforeRebate = parseFloat(
      (
        product.discountedGross +
        product.taxAmount -
        product.extraDiscountAmount +
        product.advanceTaxAmount +
        product.extraAdvanceTaxAmount
      ).toFixed(2)
    );

    // Calculate rebate
    if (product.rebatePercent > 0) {
      product.rebateAmount = parseFloat(((product.netAmountBeforeRebate * product.rebatePercent) / 100).toFixed(2));
    } else {
      product.rebatePercent = parseFloat(((product.rebateAmount / product.netAmountBeforeRebate) * 100).toFixed(2)) || 0;
    }

    // Calculate net amount
    product.netAmount = parseFloat((product.netAmountBeforeRebate - product.rebateAmount).toFixed(2));

    // Calculate net rate
    product.netRate = product.qty ? parseFloat((product.netAmount / product.qty).toFixed(2)) : 0;

    return product;
  }

  calculateTotals(productlist: any[]): any {
    let totalGross = 0;
    let totalDiscount = 0;
    let totalExtraDiscount = 0;
    let totalTax = 0;
    let totalExtraTax = 0;
    let totalAdvanceExtraTax = 0;
    let totalNetPayable = 0;
    let totalRebate = 0;

    productlist.forEach(product => {
      totalGross += product.grossValue || 0;
      totalDiscount += product.discountAmount || 0;
      totalExtraDiscount += product.extraDiscountAmount || 0;
      totalTax += product.taxAmount || 0;
      totalExtraTax += product.extraAdvanceTaxAmount || 0;
      totalAdvanceExtraTax += product.advanceTaxAmount || 0;
      totalNetPayable += product.netAmount || 0;
      totalRebate += product.rebateAmount || 0;
    });

    return {
      totalGross,
      totalDiscount,
      totalExtraDiscount,
      totalTax,
      totalExtraTax,
      totalAdvanceExtraTax,
      totalNetPayable,
      totalRebate
    };
  }
}
