import { CTA } from '../CTA'
import { Image } from '../Image'
import { TextAndImage } from './TextAndImage'
export class Hero extends TextAndImage {
  title: string | null = null
  content: string | null = null
  cta: CTA | null = null
  image: Image | null = null
  constructor(data: any) {
    super(data)
    this.title = data?.title
    this.cta = data?.cta ? new CTA(data?.cta) : null
    this.content = data?.content
    this.image = new Image(data?.image?.data?.attributes)
  }
}
