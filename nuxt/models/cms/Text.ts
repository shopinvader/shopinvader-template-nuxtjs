export class Text {
  id: number
  title: string | null = null
  text: string | null = null
  constructor(data: any) {
    this.id = data?.id || 0
    this.title = data?.title || null
    this.text = data?.text || null
  }
}
