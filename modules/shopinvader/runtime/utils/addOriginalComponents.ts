import { addComponent, createResolver, resolveFiles } from '@nuxt/kit'
import { type Nuxt } from 'nuxt/schema'

/**
 * addOriginalComponents add components from other original layers
 * with the component name prefix "original"
 * @param nuxt
 */
export const addOriginalComponents = async (nuxt: Nuxt) => {

  const layers = nuxt.options._layers
  let loadedFiles:string[] = []
  if(layers.length > 1) {
    for(let layer of layers) {
      const {resolve} = createResolver(layer.cwd)
      const files = await resolveFiles(resolve('./components'), '**/*.vue')
      if(layer.cwd == nuxt.options.srcDir) {
        loadedFiles = files.map(f => f.replace(layer.cwd, ''))
      } else {

        for(let filePath of files) {
          /* get name from filePath  */
          const path = filePath.replace(layer.cwd, '')
          if(loadedFiles.includes(path)) {
            const name = `Original${filePath.replace(/\.vue$/, '').split('/').pop()}`
            await addComponent({
              name,
              filePath,
              pascalName: name
            })
          }
        }
      }
    }
  }
}
