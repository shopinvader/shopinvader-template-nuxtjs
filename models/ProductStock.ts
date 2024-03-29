export interface ProductStock {
  global: StockQtyResult | null
}

export type StockQtyResult = {
  qty: number | null
  state?: string | null
}
