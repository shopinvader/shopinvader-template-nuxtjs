import { createResolver, resolveFiles, addComponent } from '@nuxt/kit'
import { Nuxt } from 'nuxt/schema'

/**
 * addOriginalComponents add components from other original layers
 * with the component name prefix "original"
 * @param nuxt
 */
export const addOriginalComponents = async (nuxt: Nuxt) => {
  const layers = nuxt.options._layers
  if(layers.length > 1) {
    for(let layer of layers) {
      if(layer.cwd !== nuxt.options.srcDir) {
        const {resolve} = createResolver(layer.cwd)
        const files = await resolveFiles(resolve('./components'), '**/*.vue')
        for(let filePath of files) {
          /* get name from filePath  */
          const name = `Original${filePath.replace(/\.vue$/, '').split('/').pop()}`
          await addComponent({
            name,
            filePath,
            pascalName: name
          })
        }
      }
    }
    console.info('Original components added')
  }
}
