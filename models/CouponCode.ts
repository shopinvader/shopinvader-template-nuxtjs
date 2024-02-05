import { Model } from "#models"

export class CouponCode extends Model {
  id: number | null = null
  code: string | null = null
  rewardType: string | null = null
  discount: number | null = null
  discountMode: string | null = null
  discountApplicability: string | null = null

  constructor(data: any) {
    super(data)
    this.id = data?.id || null
    this.rewardType = data?.reward_type || null
    this.discount = data?.discount || null
    this.discountMode = data?.discount_mode || null
    this.discountApplicability = data?.discount_applicability || null
    this.code = data?.code || null
  }
}
