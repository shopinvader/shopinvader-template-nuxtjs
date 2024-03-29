import type { ErpFetch } from '@shopinvader/fetch';
import { Service } from '#services';
import {
  PaymentMethod,
  PaymentData,
  PaymentTransaction
} from '#models';

/**
 * PaymentService
 * @extends Service
 * @description This service is used to manage the payment methods and transactions.
 */
export class PaymentService extends Service {
  paymentProvider: any;
  provider: ErpFetch | null = null;
  constructor(provider: ErpFetch) {
    super();
    this.provider = provider;
  }

  /**
   * Get the payment methods for a payable.
   * @param payable
   * @returns PaymentMethod[]
   */
  async getPaymentMethods(payable: string): Promise<PaymentMethod[]> {
    const data = await this.provider?.get('payment/methods', { payable }, null);
    if (data?.providers?.length > 0) {
      return data.providers.map((provider: any) => new PaymentMethod(provider));
    }
    return [];
  }

  /**
   * Create a payment transaction.
   * @param paymentData
   * @param paymentMethod
   * @param inputs
   * @param redirectUrl
   * @returns PaymentMethod
   */
  async createTransaction(
    paymentData: PaymentData,
    paymentMethod: PaymentMethod,
    inputs: any[],
    redirectUrl: string
  ): Promise<PaymentTransaction> {
    const data = await this.provider?.post(`payment/transactions`, {
      payable: paymentData.payable,
      flow: 'redirect',
      provider_id: paymentMethod.id,
      frontend_redirect_url: redirectUrl,
      provider_input: inputs || {}
    });
    return new PaymentTransaction(data);
  }
}
