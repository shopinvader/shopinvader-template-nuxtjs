import {
  Model,
  ProductCategory,
  ProductImageSet,
  ProductLinks,
  ProductModel,
  ProductPrice,
  Product as ProductVariant,
  type ProductPriceList,
  type ProductStock
} from '#models'

export interface ProductResult {
  hits: Product[]
  total: number
  aggregations?: any
  suggestions?: any
}

export interface VariantAttributes {
  [key: string]: string | number
}
export class ProductVariantSelectorItem extends Model {
  name: string
  sku: string
  available = false
  selected = false
  constructor(data: any) {
    super(data)
    this.name = data?.name || ''
    this.sku = data?.sku || ''
    this.available = data?.available
    this.selected = data?.selected
  }
}
export class ProductVariantSelector extends Model {
  name: string | null = null
  values: ProductVariantSelectorItem[] = []
  constructor(data: any) {
    super(data)
    this.name = data?.name || null
    this.values =
      data?.values?.map((item: any) => {
        if (item.name.includes(this.name)) {
          item.name = item.name.replace(this.name, '')
        }
        return new ProductVariantSelectorItem(item)
      }) || null
  }
}
export class Product extends Model {
  id: number | null = null
  model: ProductModel | null = null
  urlKey: string | null = null
  redirectUrlKey: string[] = []
  main = false
  shortDescription: string | null = null
  description: string | null = null
  name: string | null = null
  shortName: string | null = null
  seoTitle: string | null = null
  metaKeywords: string | null = null
  metaDescription: string | null = null
  variantCount = 0
  categories: ProductCategory[] | null
  sku: string | null
  variantAttributes: VariantAttributes = {}
  variantSelector: ProductVariantSelector[] = []
  price: ProductPrice | null = null
  pricesList: ProductPriceList = {}
  images: ProductImageSet[] | null
  variants: Product[] | null = null
  links: ProductLinks | null = null
  stock: ProductStock | null
  role: string

  constructor(data: any, role?: string) {
    super(data)

    this.role = role || 'default'
    this.id = data?.id || null
    this.model = new ProductModel(data?.model)
    this.urlKey = data?.url_key || null
    this.redirectUrlKey = Array.isArray(data?.redirect_url_key) ? data?.redirect_url_key : []
    this.main = data?.main || false
    this.shortDescription = data?.short_description || null
    this.description = data?.description || null
    this.name = data?.name || null
    this.shortName = data?.short_name || null
    this.seoTitle = data?.seo_title || null
    if (!this.seoTitle) {
      this.seoTitle = this.name
    }

    this.variantCount = data?.variant_count || 0
    this.stock = data?.stock || null
    this.categories = []
    this.metaKeywords = data.meta_keywords || null
    let metaDescription = data?.meta_description || null

    if (!metaDescription) {
      metaDescription = [this.seoTitle, this.shortDescription, this.description]
        .filter((item) => item)
        .join(', ')
        .replaceAll(/(<([^>]+)>)/gi, '')
        .replaceAll(/(\r\n|\n|\r)/gm, ' ')
        .replaceAll(/\s+/g, ' ')
        .substring(0, 255)
    }

    this.metaDescription = metaDescription
    if (Array.isArray(data?.categories)) {
      this.categories = data?.categories
        .map((category: any) => {
          return new ProductCategory(category)
        })
        .sort((a: any, b: any) => a?.level - b?.level)
    }
    this.sku = data?.sku || null
    this.variantAttributes = data?.variant_attributes || {}

    /** Product prices */
    const priceLists = Object.entries(data?.price_by_pricelist || data?.prices || data?.price || {})
    if (priceLists?.length > 0) {
      this.pricesList = {}
      for (let [key, value] of priceLists) {
        this.pricesList[key] = new ProductPrice(value)
      }
    }
    if (data?.price) {
      this.price = new ProductPrice(data?.price) || null
    } else if (this.pricesList?.[this.role]) {
      /* fallback to default price */
      this.price = this.pricesList[this.role]
    }

    /** Product images */
    this.images = [] as ProductImageSet[]
    if (Array.isArray(data?.images)) {
      this.images = data?.images.map((image: any) => {
        return new ProductImageSet(image)
      })
    }

    /** Product links */
    this.links = new ProductLinks(data?.links)
    this.variants = []
    if (Array.isArray(data?.variants)) {
      this.variants = data?.variants.map((variant: any) => {
        return new ProductVariant(variant, this.role)
      })
    }

    /** Product variant selector */
    if (Array.isArray(data?.variant_selector)) {
      this.variantSelector = data?.variant_selector.map((variantSelector: any) => {
        return new ProductVariantSelector(variantSelector)
      })
    }
  }
}
