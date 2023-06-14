import { DynamicZone } from './DynamicZone'
import { SEO } from './SEO'

export class Page {
  fullpath: string | null = null
  handle: string | null = null
  locale: string | null = null
  rank: number | null = null
  title: string | null = null
  content: DynamicZone | null = null
  seo: SEO | null = null
  constructor(data: any) {
    const { attributes = null } = data
    if (attributes) {
      this.fullpath = attributes?.fullpath || null
      this.handle = attributes?.handle || null
      this.locale = attributes?.locale || null
      this.rank = attributes?.rank || null
      this.title = attributes?.title || null
      this.content = new DynamicZone(attributes?.content)
      this.seo = new SEO(attributes?.seo)
    }
  }
}
