export type linkId = { id: number }
export class ProductLinks {
  crossLink: linkId[] = []
  upLink: linkId[] = []

  constructor(links: any) {
    this.crossLink = links?.cross_selling || null
    this.upLink = links?.up_selling || null
  }
}
