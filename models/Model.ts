export interface Record {
  [field: string]: any
}

export class Model {
  private data: any
  constructor(data: any) {
    this.data = data
  }
  toJSON() {
    return { ...this.data }
  }
}
