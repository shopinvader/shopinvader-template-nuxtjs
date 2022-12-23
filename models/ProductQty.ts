export class ProductQty {
    stock_qty : number

    constructor (data: any) {
        this.stock_qty = data?.stock_qty
    }
}