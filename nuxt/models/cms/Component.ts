import { CMSObject } from './CMSObject'

export class Component extends CMSObject {
  id: number | null = null
  componentName: string | null = null
  componentGroup: string | null = null
  component: any = null
  data: any = null
  constructor(data: any) {
    super(data)
    this.id = data?.id || null
    this.componentName = data?.componentName || null
    this.componentGroup = data?.componentGroup || null
    this.component = data?.component || null
    this.data = data || null
  }
}
