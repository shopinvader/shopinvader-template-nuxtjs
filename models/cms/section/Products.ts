import { Component } from '../Component'

export class Products extends Component {
  title: string | null = null
  productsSKU: any[] = []
  constructor(data: any) {
    super(data)
    this.title = data?.title
    console.log('Products', data?.products)
    this.productsSKU = data?.products
  }
}
