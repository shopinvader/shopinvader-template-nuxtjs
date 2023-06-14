import { Model } from './Model'

export type linkId = { id: number }
export class ProductLinks extends Model {
  crossLink: linkId[] = []
  upLink: linkId[] = []

  constructor(links: any) {
    super(links)
    this.crossLink = links?.cross_selling || null
    this.upLink = links?.up_selling || null
  }
}
