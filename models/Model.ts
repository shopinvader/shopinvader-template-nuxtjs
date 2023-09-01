export interface Record {
  [field: string]: any
}

export class Model {
  public data: any
  constructor(data: any) {
    this.data = data
  }
  toJSON() {
    return { ...this.data }
  }
}
