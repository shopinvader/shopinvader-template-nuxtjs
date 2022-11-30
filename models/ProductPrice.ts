export class ProductPrice {
  default: object
  value: number
  tax_included: boolean
  original_value: number
  discount: number

  constructor(data: any) {
    this.value = data?.value
    this.tax_included = data?.tax_included
    this.original_value = data?.original_value
  }
}