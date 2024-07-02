import { addTemplate, createResolver, resolveFiles } from '@nuxt/kit'
import type { Nuxt } from 'nuxt/schema'
import * as ts from 'typescript'

interface TSFile {
  name: string
  originalName: string | null
  path: string
  nodeType: string
  content: string
  imports: string[]
}

/**
 * extract class from a file
 * @param files
 * @returns
 */
function extractTsClass(files: string[]): TSFile[] {
  let declarations: TSFile[] = []
  const program = ts.createProgram(files, { allowJs: true })

  for (const file of files) {
    const sourceFile = program.getSourceFile(file)
    if (!sourceFile) continue
    const imports: string[] = []
    ts.forEachChild(sourceFile, (node) => {
      if (ts.isInterfaceDeclaration(node) || ts.isClassDeclaration(node)) {
        const isExported =
          ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) || false
        if (isExported) {
          const name = node?.name?.text || ''
          if (node?.heritageClauses) {
            const heritage = node?.heritageClauses[0]
              .getText(sourceFile)
              .replace('extends', '')
              .trim()
            imports.push(heritage)
          }
          const nodeType = ts.isInterfaceDeclaration(node) ? 'interface' : 'class'
          // Check if this class/interface was already declared in another file
          const sameNameTSFile: TSFile | undefined = declarations.find(
            (f) => f.name === name && f.path !== file
          )
          if (sameNameTSFile) {
            // Rename the existing entry
            sameNameTSFile.name = `${name}Original`
            // Keep the original name for aliasing
            sameNameTSFile.originalName = name
            // Let the user know
            console.log(
              `[ShopInvader] BUILD - ShopInvader model \x1b[32m${name}\x1b[0m overrided by your custom model. Aliasing ShopInvader model to \x1b[32m${sameNameTSFile.name}\x1b[0m.`
            )
          }
          // Add the class/interface to the list
          declarations.push({
            name,
            originalName: null,
            path: file,
            content: '',
            nodeType,
            imports
          })
        }
      }
    })
  }
  /** Sort by dependencies (imports) */
  declarations = declarations
    .sort((a, b) => {
      return a.imports.length > b.imports.length ? 1 : -1
    })
    .reduce((acc, file) => {
      if (file.imports.length > 0) {
        for (const i of file.imports) {
          if (!acc.some((f) => f.name === i)) {
            const dep = declarations.find((f) => f.name === i)
            if (dep) {
              acc.push(dep)
            }
          }
        }
      }
      if (!acc.find((f) => f.name === file.name)) {
        acc.push(file)
      }
      return acc
    }, [] as TSFile[])
  return declarations
}

// Scan all layers for models and services and create a single file for each via the prepare:types Nuxt hook
export const addModelsServicesTemplates = async (nuxt: Nuxt) => {
  const layers = [...nuxt.options._layers].reverse()
  const types = ['models', 'services']
  const templates: any[] = []
  let alias = {}
  if (layers.length > 0) {
    for (const type of types) {
      const { resolve } = createResolver(nuxt.options.buildDir)
      let filenames: string[] = []
      for (const layer of layers) {
        const { resolve } = createResolver(layer.cwd)
        const files = await (
          await resolveFiles(resolve(`./${type}`), '**/*.ts')
        ).filter((file) => !file.endsWith('index.ts'))
        filenames = [...filenames, ...files]
      }
      templates.push(
        addTemplate({
          filename: `shopinvader/${type}.ts`,
          write: true,
          getContents: () => {
            console.log(
              `[ShopInvader] BUILD - Creating .nuxt/shopinvader/${type}.ts file for #${type} imports...`
            )
            const files = extractTsClass(filenames)
            const lines = files.map((f) => {
              const type = f.nodeType == 'interface' ? 'type ' : ''
              const exportedName = f.originalName ? `${f.originalName} as ${f.name}` : f.name
              return `export ${type} { ${exportedName} } from '${f.path.replace('.ts', '')}'`
            })
            return lines.join('\n')
          }
        })
      )
      // Allows three ways to import models/services
      alias = {
        ...alias,
        [`~/${type}`]: resolve(`./shopinvader/${type}.ts`),
        [type]: resolve(`./shopinvader/${type}.ts`),
        [`#${type}`]: resolve(`./shopinvader/${type}.ts`)
      }
    }
  }
  // Add alias to nuxt options
  nuxt.options.alias = {
    ...alias,
    ...nuxt.options.alias
  }
  // Add custom references to Nuxt
  nuxt.hook('prepare:types', ({ references }) => {
    for (const template of templates) {
      references.push({ path: template.dst })
    }
  })
}
