import { Image } from './Image'
export class Header {
  logo: Image | null = null
  baseline: string | null = null
  constructor(data: any) {
    const { attributes = null } = data
    if (!attributes) return
    this.logo = new Image(attributes?.logo?.data?.attributes)
    this.baseline = attributes?.baseline || ''
  }
}
