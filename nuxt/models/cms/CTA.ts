import { CMSObject } from './CMSObject'
import { Image } from './Image'
export class CTA extends CMSObject {
  theme: Image | null = null
  label: string | null = null
  link: string
  constructor(data: any) {
    super(data)
    this.link = data?.link || ''
    this.label = data?.label || ''
    this.theme = data?.theme || null
  }
}
