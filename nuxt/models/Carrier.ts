export class Carrier {
  data: any
  id: number | null
  name: string | null
  code: string
  description: string
  constructor(data: any) {
    this.data = data
    this.id = data.id || null
    this.name = data.name || null
    this.code = data.code || null
    this.description = data.description || null
  }
}
