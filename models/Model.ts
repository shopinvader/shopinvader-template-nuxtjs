export interface Record {
  [field: string]: any
}

export class Model {
  static modelName: string
  public data: any
  constructor(data: any) {
    this.data = data
  }
  toJSON() {
    return { ...this.data }
  }
  public clone<T>(): T {
    return Object.create(this) as T;
  }
}
