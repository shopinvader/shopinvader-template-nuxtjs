import { Component } from '../Component'
import { Image } from '../Image'
export class ImageBanner extends Component {
  defaultImage: Image | null = null
  mobileImage: Image | null = null
  link: string | null = null
  title: string | null = null
  content: string | null = null
  constructor(data: any) {
    super(data)
    this.defaultImage = new Image(data?.defaultImage?.data?.attributes)
    this.mobileImage = new Image(data?.mobileImage?.data?.attributes)
    this.link = data?.link
    this.title = data?.title
    this.content = data?.content
  }
}
