import type { PaymentData } from '#models'
import { PaymentMethod, PaymentTransaction } from '#models'
import { ServiceErp } from './ServiceErp'

/**
 * PaymentService
 * @extends Service
 * @description This service is used to manage the payment methods and transactions.
 */
export class PaymentService extends ServiceErp {
  public endpoint: string = 'payment'
  paymentProvider: any

  /**
   * Get the payment methods for a payable.
   * @param payable
   * @returns PaymentMethod[]
   */
  async getPaymentMethods(payable: string): Promise<PaymentMethod[]> {
    const data = await this.ofetch(this.urlEndpoint + '/methods', { query: { payable } })
    if (data?.providers?.length > 0) {
      return data.providers.map((provider: any) => new PaymentMethod(provider))
    }
    return []
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
    const data = await this.ofetch(this.urlEndpoint + '/transactions', {
      method: 'POST',
      body: {
        payable: paymentData.payable,
        flow: 'redirect',
        provider_id: paymentMethod.id,
        frontend_redirect_url: redirectUrl,
        provider_input: inputs || {}
      }
    })
    return new PaymentTransaction(data)
  }
}
