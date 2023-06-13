export interface CategoryResult {
  hits: Category[]
  total: number
  aggregations?: any
}

export class CategoryChild {
  name: string
  urlKey: string
  id: number
  childs: any[] | null
  sequence: number
  constructor(data: any) {
    this.id = data?.id || data?.object_id
    this.name = data?.name || ''
    this.urlKey = data?.url_key
    this.sequence = parseInt(data?.sequence) || 0
    this.childs = []
    if (Array.isArray(data?.childs)) {
      this.childs = data.childs.map((item: any) => new CategoryChild(item))
    }
  }
}

export class CategoryParent {
  name: string
  urlKey: string
  id: number
  parent: any | null
  constructor(data: any) {
    this.id = data?.id || data?.object_id
    this.name = data?.name || ''
    this.urlKey = data?.url_key
    this.parent = null
    if (data?.parent?.id !== undefined) {
      this.parent = new CategoryParent(data?.parent)
    }
  }
}

export class Category {
  // Standard fields
  id: number
  name: string
  subtitle: string
  shortDescription: string
  description: string
  seoTitle: string
  urlKey: string
  redirectUrlKey: string[]
  level: number
  metaDescription: string
  metaKeywords: string
  childs: CategoryChild[]
  parent: CategoryParent | null
  mainParent: CategoryParent | null
  sequence: number
  data: any

  /** Fill fields with data from the Json provided by ElasticSearch */
  constructor(data: any) {
    this.data = data
    // Standard fields
    this.id = data?.id
    this.metaDescription = data?.meta_description || ''
    this.metaKeywords = data?.meta_keywords || ''
    this.seoTitle = data?.seo_title || 0
    this.name = data?.name || ''
    this.subtitle = data?.subtitle || ''
    this.shortDescription = data?.short_description || ''
    this.description = data?.description || ''
    this.level = data?.level || 0
    this.urlKey = data?.url_key
    this.redirectUrlKey = data?.redirect_url_key || []
    this.childs = []
    this.parent = null
    this.sequence = parseInt(data?.sequence || 0)
    if (data?.parent !== undefined) {
      this.parent = new CategoryParent(data.parent)
    }
    if (Array.isArray(data?.childs)) {
      this.childs = data.childs.map((item: any) => new CategoryChild(item))
    }
    this.mainParent = this.parent

    while (this.mainParent != null && this.mainParent?.parent !== null) {
      this.mainParent = this.mainParent.parent
    }
  }
  toJSON() {
    return { ...this }
  }
}
