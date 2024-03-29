import { Model } from '#models'

export class ProductImage extends Model {
  src: string
  alt: string
  tag: string

  constructor(data: any) {
    super(data)
    this.src = data?.src
    this.alt = data?.alt
    this.tag = data?.tag
  }
}
