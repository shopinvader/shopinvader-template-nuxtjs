import { Component } from './Component'
import * as Section from './section'

export class DynamicZone {
  components: (Component | null)[] = []
  data: any = null
  constructor(sections: any[]) {
    this.components =
      sections
        .map((section: any) => {
          const name = section?.__component.split('.')
          section.componentGroup = name[0]
          section.componentName = name[1]
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('')
          if (
            section.componentGroup === 'section' &&
            Section?.[section.componentName]
          ) {
            return new Section[section.componentName](section)
          }
          console.log('No component found for', section)
          return new Component(section)
        })
        .filter((section: any) => section !== null) || []
  }
}
