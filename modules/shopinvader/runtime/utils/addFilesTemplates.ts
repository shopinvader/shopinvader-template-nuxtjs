import { createResolver, resolveFiles, addTemplate } from '@nuxt/kit'
import { Nuxt } from 'nuxt/schema'

export const addModelsServicesTemplates  = async (nuxt: Nuxt) => {
  const layers = nuxt.options._layers
  const types = ['services', 'models']

  let alias = {}
  if(layers.length > 1) {
    for(let type of types) {
      const { resolve } = createResolver(nuxt.options.buildDir)
      let filenames:string[] = []
      for(let layer of layers) {
        const { resolve } = createResolver(layer.cwd)
        const files = await (await resolveFiles(resolve(`./${type}`), '**/*.ts'))
          .filter((file) => !file.endsWith('index.ts'))
          .map((file) => file.replace('.ts', ''))
        filenames = [...filenames, ...files]
      }

      addTemplate({
        filename: `shopinvader/${type}.ts`,
        write: true,
        getContents: () => {
          return filenames.reverse().map((filename) => `export * from '${filename.replace('.ts', '')}'`).join('\n')
        },
      })

      alias = {
        ...alias,
        [`~/${type}`]: resolve(`./shopinvader/${type}.ts`),
        [type]: resolve(`./shopinvader/${type}.ts`),
        [`#${type}`]: resolve(`./shopinvader/${type}.ts`),
      }
    }
  }

  nuxt.options.alias = {
    ...alias,
    ...nuxt.options.alias,
  }
  nuxt.hook('nitro:config', (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...alias,
      ...config.resolve.alias,
    }
  })
  nuxt.hook('vite:extend', (ctx) => {
    ctx.config.resolve = ctx.config.resolve || {}
    ctx.config.resolve.alias = {
      ...alias,
      ...ctx.config.resolve.alias,
    }
  })

}
