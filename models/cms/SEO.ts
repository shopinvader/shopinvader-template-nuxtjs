export class SEO {
  metaTitle: string | null = null
  metaDescription: string | null = null
  keywords: string | null = null
  metaRobots: string | null = null
  structuredData: object | null = {}
  metaViewport: string | null = null

  constructor(data: any) {
    this.metaTitle = data?.metaTitle || null
    this.metaDescription = data?.metaDescription || null
    this.keywords = data?.keywords || null
    this.metaRobots = data?.metaRobots || null
    this.structuredData = data?.structuredData || null
    this.metaViewport = data?.metaViewport || null
  }
}
