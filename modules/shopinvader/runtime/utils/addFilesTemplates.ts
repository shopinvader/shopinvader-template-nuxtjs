import { createResolver, resolveFiles } from '@nuxt/kit'
import fs from 'fs'
import type { Nuxt } from 'nuxt/schema'
import { join } from 'path'
import * as ts from 'typescript'

const SHOPINVADER_LAYERNAME = 'shopinvader-template-nuxtjs'
const UNICODE_GREEN = '\x1b[32m'
const UNICODE_RESET = '\x1b[0m'

interface LayerFile {
  layerName: string
  filename: string
}

interface TSFile {
  name: string
  originalName: string | null
  layerName: string
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
function extractTsClass(layerFiles: LayerFile[]): TSFile[] {
  let declarations: TSFile[] = []
  const files = layerFiles.map((l) => l.filename)
  const program = ts.createProgram(files, { allowJs: true })
  // Extract classes/interfaces from files
  for (const layerFile of layerFiles) {
    const sourceFile = program.getSourceFile(layerFile.filename)
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
            (f) => f.name === name && f.path !== layerFile.filename
          )
          if (sameNameTSFile) {
            // Rename the existing entry
            sameNameTSFile.name = `${name}Original`
            // Keep the original name for aliasing
            sameNameTSFile.originalName = name
            // Let the user know
            console.log(
              `[ShopInvader] BUILD - ShopInvader model ${UNICODE_GREEN}${name}${UNICODE_RESET} overrided by your custom model. You can use ${UNICODE_GREEN}${sameNameTSFile.name}${UNICODE_RESET} to access original.`
            )
          }
          // Add the class/interface to the list
          declarations.push({
            name,
            originalName: null,
            layerName: layerFile.layerName,
            path: layerFile.filename,
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
      // Avoid duplicates
      if (!acc.find((f) => f.name === file.name)) {
        acc.push(file)
      }
      return acc
    }, [] as TSFile[])
  return declarations
}

async function writeIndexFileContent(applicationRoot: string, type: string, content: string) {
  const dir = applicationRoot + '/' + type
  // Check if the directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  fs.writeFileSync(dir + '/index.ts', content)
}

async function buildindexFileContent(nuxt: Nuxt, type: string): Promise<string> {
  const layers = [...nuxt.options._layers].reverse()
  if (layers.length === 0) {
    return ''
  }
  // Build list of all files in layers
  let filenames: LayerFile[] = []
  for (const layer of layers) {
    const layerName = layer.cwd.indexOf(SHOPINVADER_LAYERNAME) >= 0 ? SHOPINVADER_LAYERNAME : ''
    const { resolve } = createResolver(layer.cwd)
    const files = await (
      await resolveFiles(resolve(`./${type}`), '**/*.ts')
    )
      .filter((file) => !file.endsWith('index.ts'))
      .map<LayerFile>((f) => {
        return { layerName, filename: f }
      })

    filenames = [...filenames, ...files]
  }
  // Extract classes/interfaces from files
  const files = extractTsClass(filenames)
  // Build the content for the index file
  const coreExports = files
    .map((f) => {
      const type = f.nodeType == 'interface' ? 'type ' : ''
      const exportedName = f.originalName ? `${f.originalName} as ${f.name}` : f.name
      return `export ${type} { ${exportedName} } from '${f.path.replace('.ts', '')}'`
    })
    .join('\n')
  // Add all other xxxOriginals
  const originalsExports = files
    .filter((f) => f.layerName === SHOPINVADER_LAYERNAME && !f.originalName)
    .map((f) => {
      const type = f.nodeType == 'interface' ? 'type ' : ''
      return `export ${type} { ${f.name} as ${f.name}Original } from '${f.path.replace('.ts', '')}'`
    })
    .join('\n')
  const warning =
    '// Do not modify this file: it is automatically generated by ShopInvader.\n// ======================================================================'
  return warning + '\n' + coreExports + '\n' + originalsExports
}

// Scan all layers for models and services and create a single file for each via the prepare:types Nuxt hook
export const addModelsServicesTemplates = async (nuxt: Nuxt) => {
  const applicationRoot = nuxt.options.srcDir
  const layers = [...nuxt.options._layers].reverse()
  const types = ['models', 'services']
  let alias = {}
  if (layers.length > 0) {
    for (const type of types) {
      // Write index files
      const content = await buildindexFileContent(nuxt, type)
      await writeIndexFileContent(applicationRoot, type, content)
      // Add alias to nuxt options
      alias = {
        ...alias,
        [`#${type}`]: join(applicationRoot, type + '/index.ts')
      }
    }
  }
  // Add alias to nuxt options
  nuxt.options.alias = {
    ...alias,
    ...nuxt.options.alias
  }

  // Add hook to webpack:change
  nuxt.hook('builder:watch', async (pEvent, pShortPath) => {
    if (pShortPath.endsWith('models/index.ts') || pShortPath.endsWith('services/index.ts')) {
      return // Avoid infinite loop
    }
    let type = ''
    if (pShortPath.indexOf('models/') >= 0) {
      type = 'models'
    } else if (pShortPath.indexOf('services/') >= 0) {
      type = 'services'
    } else {
      return
    }
    console.log(
      `[ShopInvader] EVENT - ${pShortPath} ${pEvent} => rebuild ${UNICODE_GREEN}#${type}${UNICODE_RESET} index file`
    )
    const content = await buildindexFileContent(nuxt, type)
    await writeIndexFileContent(applicationRoot, type, content)
  })
}
