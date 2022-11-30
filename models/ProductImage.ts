export class ProductImage {
  src: string
  alt: string
  tag: string

  constructor (data: any) {
    this.src = data?.src
    this.alt = data?.alt
    this.tag = data?.tag
  }
}
