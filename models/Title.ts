import * as M from '#models'
console.log(M)
export class Title extends M.Model {
  id: number
  name: string
  constructor(data: any) {
    super(data)
    this.id = data?.id
    this.name = data?.name
  }
}
