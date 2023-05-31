import { Component } from '../Component'

export class Products extends Component {
  title: string | null = null
  productsSKU: any[] = []
  constructor(data: any) {
    super(data)
    this.title = data?.title
    this.productsSKU = data?.products
  }
}
