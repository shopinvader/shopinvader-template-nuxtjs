import { CTA } from './CTA'
import { Image } from './Image'

export class CardStyle {
  shadow: boolean
  compact: boolean
  imageFull: boolean
  constructor(data: any) {
    if (Array.isArray(data)) {
      this.shadow = data?.includes('shadow') ?? false
      this.compact = data?.includes('compact') ?? false
      this.imageFull = data?.includes('imageFull') ?? false
    } else {
      this.shadow = data?.shadow ?? false
      this.compact = data?.compact ?? false
      this.imageFull = data?.imageFull ?? false
    }
  }
}
export class Card {
  image: Image | null = null
  title: string | null = null
  content: string | null = null
  style: CardStyle
  id: number | null = null
  cta: CTA | null = null
  constructor(data: any) {
    this.id = data?.id || null
    this.content = data?.content || null
    this.title = data?.title || null
    this.image = new Image(data?.image?.data?.attributes)
    this.style = new CardStyle(data?.style)
    this.cta = data?.cta ? new CTA(data?.cta) : null
  }
}
