import { createResolver, resolveFiles, addTemplate } from '@nuxt/kit'
import { Nuxt } from 'nuxt/schema'
export const addModelsTemplates  = async (nuxt: Nuxt) => {
  const layers = nuxt.options._layers
  if(layers.length > 1) {
    for(let layer of layers) {
      const {resolve} = createResolver(layer.cwd)
      const models = await resolveFiles(resolve('./models'), '**/*.ts')
      const modelsFiles:string[] = []
      for(let model of models) {
        const filename = model.split('/').pop()
        if(filename !== 'index.ts') {
          modelsFiles.push(model)
          addTemplate({
            filename,
            dst: `models/${filename}`,
            src: model,
          })
        }
      }
      addTemplate({
        filename: 'index.ts',
        dst: `models/index.ts`,
        getContents: () => {
          return modelsFiles.map((filename) => `export * from '${filename}'`).join('\n')
        },
      })
    }
  }
}
export const addServicesTemplates  = async (nuxt: Nuxt) => {
  const layers = nuxt.options._layers
  if(layers.length > 1) {
    for(let layer of layers) {
      const {resolve} = createResolver(layer.cwd)
      const services = await resolveFiles(resolve('./services'), '**/*.ts')
      const servicesFiles:string[] = []
      for(let service of services) {
        const filename = service.split('/').pop()
        if(filename !== 'index.ts') {
          servicesFiles.push(service)
          addTemplate({
            filename,
            dst: `services/${filename}`,
            src: service,
          })
        }
      }
      addTemplate({
        filename: 'index.ts',
        dst: `services/index.ts`,
        getContents: () => {
          return servicesFiles.map((filename) => `export * from '${filename}'`).join('\n')
        },
      })
    }
  }
}
