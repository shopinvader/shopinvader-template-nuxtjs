import { ProductModel } from './ProductModel'
import { ProductCategory } from './ProductCategory'
import { ProductImageSet } from './ProductImageSet'
import { ProductPrice } from './ProductPrice'
import { ProductLinks } from './ProductLinks'
export interface ProductResult {
  hits: Product[]
  total: number
  aggregations?: any
}

export interface VariantAttributes {
  [key: string]: string | number
}
export class Product {
  id: number | null = null
  model: ProductModel | null = null
  urlKey: string | null = null
  redirectUrlKey: object | null = null
  main: boolean = false
  shortDescription: string | null = null
  description: string | null = null
  name: string | null = null
  shortName: string | null = null
  seoTitle: string | null = null
  metaKeywords: object | null = null
  metaDescription: object | null = null
  variantCount: number = 0
  categories: ProductCategory[] | null
  sku: string | null
  variantAttributes: VariantAttributes = {}
  price: ProductPrice | null = null
  images: ProductImageSet[] | null
  variants: Product[] | null = null
  brand: string | null = null
  stock_qty: number | null = 0
  links: ProductLinks | null = null
  constructor(data: any) {
    this.id = data?.id || null
    this.model = new ProductModel(data?.model)
    this.urlKey = data?.url_key || null
    this.redirectUrlKey = data?.redirect_url_key || null
    this.main = data?.main || false
    this.shortDescription = data?.short_description || null
    this.description = data?.description || null
    this.name = data?.name || null
    this.shortName = data?.short_name || null
    this.seoTitle = data?.seo_title || null
    this.metaKeywords = data?.meta_keywords || null
    this.metaDescription = data?.meta_description || null
    this.variantCount = data?.variant_count || 0
    this.categories = []
    if (Array.isArray(data?.categories)) {
      this.categories = data?.categories
      .map((category: any) => {
        return new ProductCategory(category)
      })
      .sort((a: any, b: any) => a?.level - b?.level)
    }
    this.sku = data?.sku || null
    this.variantAttributes = data?.variant_attributes || {}
    const priceLists = Object.keys(data?.price || {})
    this.price = new ProductPrice(data?.price[priceLists[0]]) || null
    this.images = [] as ProductImageSet[]
    if (Array.isArray(data?.images)) {
      this.images = data?.images.map((image: any) => {
        return new ProductImageSet(image)
      })
    }
    this.links = new ProductLinks(data?.links)
    this.variants = []
    if (Array.isArray(data?.variants)) {
      this.variants = data?.variants.map((variant: any) => {
        return new Product(variant)
      })
    }
    this.brand = data?.MARQUE || null
    this.stock_qty = data?.stock?.globla?.qty || 0
  }
}