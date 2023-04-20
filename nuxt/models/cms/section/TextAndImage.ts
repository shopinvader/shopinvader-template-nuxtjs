import { Component } from '../Component'
import { Image } from '../Image'
import { CTA } from '../CTA'
export class TextAndImage extends Component {
  defaultImage: Image | null = null
  mobileImage: Image | null = null
  content: string | null = null
  cta: CTA | null = null
  constructor(data: any) {
    super(data)
    this.defaultImage = data?.image?.defaultImage?.data?.attributes
      ? new Image(data?.image?.defaultImage?.data?.attributes)
      : null
    this.mobileImage = data?.image?.mobileImage?.data?.attributes
      ? new Image(data?.image?.mobileImage?.data?.attributes)
      : null
    this.content = data?.content
    this.cta = data?.cta ? new CTA(data?.cta) : null
  }
}
