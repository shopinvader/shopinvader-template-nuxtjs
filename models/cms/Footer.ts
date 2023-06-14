import { Component } from './Component'
import { Image } from './Image'
import { Text } from './Text'
export class Footer extends Component {
  logo: Image | null = null
  baseline: string | null = null
  content: Text[] = []
  constructor(data: any) {
    super(data)
    const { attributes = null } = data
    if (!attributes) return
    this.logo = new Image(attributes?.logo?.data?.attributes)
    this.baseline = attributes?.baseline || ''
    this.content = Array.isArray(attributes?.content)
      ? attributes?.content?.map((a: any) => new Text(a))
      : []
  }
}
