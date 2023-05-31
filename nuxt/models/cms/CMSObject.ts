export class CMSObject {
  payload: any = null
  constructor(data: any) {
    this.payload = data
  }
  toJSON() {
    return { ...this }
  }
}
