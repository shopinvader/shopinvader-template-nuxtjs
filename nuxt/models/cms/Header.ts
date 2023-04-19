import { Image } from './Image'
import { InfoBanner } from './InfoBanner'
export class Header {
  logo: Image | null = null
  baseline: string | null = null
  preheader: InfoBanner[] | null = null
  constructor(data: any) {
    const { attributes = null } = data
    if (!attributes) return
    this.logo = new Image(attributes?.logo?.data?.attributes)
    this.baseline = attributes?.baseline || ''
    this.preheader = attributes?.preheader?.map(
      (preheader: any) => new InfoBanner(preheader)
    )
  }
}
