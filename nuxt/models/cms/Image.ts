export class ImageBase {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: string
  size: number
  width: number
  height: number
  constructor(data: any) {
    this.ext = data?.ext || ''
    this.url = data?.url || ''
    this.hash = data?.hash || ''
    this.mime = data?.mime || ''
    this.name = data?.name || ''
    this.path = data?.path || ''
    this.size = data?.size || 0
    this.width = data?.width || 0
    this.height = data?.height || 0
  }
}

export class ImageFormats extends ImageBase {
  [key: string]: any
  constructor(data: any) {
    super(data)
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        this[key] = new ImageBase(data[key])
      }
    }
  }
}

export class Image extends ImageBase {
  alternativeText: string
  caption: string
  formats: ImageFormats | null
  previewUrl: string
  provider: string
  providerMetadata: any = null

  constructor(data: any) {
    super(data)
    this.alternativeText = data?.alternativeText || ''
    this.caption = data?.caption || ''
    this.formats = data?.formats ? new ImageFormats(data.formats) : null
    this.previewUrl = data?.previewUrl || null
    this.provider = data?.provider || ''
    this.providerMetadata = data?.provider_metadata || null
  }
}
