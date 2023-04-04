export class Text {
  id: number
  text: string | null = null
  constructor(data: any) {
    this.id = data?.id || 0
    this.text = data?.text || null
  }
}
