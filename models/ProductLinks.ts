import { Model } from '#models'

export class ProductLinks extends Model {
  crossLink: { id: number }[] = []
  upLink: { id: number }[] = []

  constructor(links: any) {
    super(links)
    this.crossLink = links?.cross_selling || null
    this.upLink = links?.up_selling || null
  }
}
