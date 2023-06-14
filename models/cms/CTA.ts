import { Image } from './Image'
export class CTA {
  theme: Image | null = null
  label: string | null = null
  link: string
  constructor(data: any) {
    this.link = data?.link || ''
    this.label = data?.label || ''
    this.theme = data?.theme || null
  }
}
