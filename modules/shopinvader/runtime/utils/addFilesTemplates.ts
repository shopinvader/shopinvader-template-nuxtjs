import { addTemplate, createResolver, resolveFiles } from '@nuxt/kit'
import type { Nuxt } from 'nuxt/schema'
import * as ts from 'typescript'

interface TSFile {
  name: string
  path: string
  nodeType: string
  content: string
  imports: string[]
  alias: string | null
}
interface ServiceList {
  serviceName: string
  className: string
  path: string
}
/**
 * extract serviceName attribute from a service file
 * TODO: TO BE REFACTORED
 * @param files
 * @returns ServiceList
 */
function extractTsServiceName(files: string[]): ServiceList[] {
  const program = ts.createProgram(files, { allowJs: true })
  const result = []
  for (const file of files) {
    const sourceFile = program.getSourceFile(file)
    if (!sourceFile) continue
    const classes = sourceFile.statements.filter(ts.isClassDeclaration)
    for (const c of classes) {
      const item = c.members?.find(
        (m) => ts.isPropertyDeclaration(m) && m.name?.getText(sourceFile) === 'serviceName'
      )
      if (item) {
        const node = item
          ?.getChildren(sourceFile)
          .find((c) => c.kind === ts.SyntaxKind.StringLiteral)
        const serviceName = node?.getText(sourceFile).replace(/['"]+/g, '').trim() || null
        if (serviceName) {
          const className = c?.name?.text || ''
          result.push({
            serviceName,
            className,
            path: file
          })
        }
      }
    }
  }
  return result
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
          let tsfile: TSFile | null = declarations.find((f) => f.name === name) || null
          if (tsfile && tsfile?.path !== file) {
            tsfile.name = `${name}Original`
            tsfile.alias = name
            tsfile = null
          }
          if (!tsfile) {
            tsfile = { name, path: file, content: '', nodeType, imports, alias: null }
            declarations.push(tsfile)
          }
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
            const files = extractTsClass(filenames)

            const lines = files.map((f) => {
              const type = f.nodeType == 'interface' ? 'type ' : ''
              const name = f.alias ? `${f.alias} as ${f.name}` : f.name
              return `export ${type} { ${name} } from '${f.path.replace('.ts', '')}'`
            })
            return lines.join('\n')
          }
        })
      )
      alias = {
        ...alias,
        [`~/${type}`]: resolve(`./shopinvader/${type}.ts`),
        [type]: resolve(`./shopinvader/${type}.ts`),
        [`#${type}`]: resolve(`./shopinvader/${type}.ts`)
      }
    }
  }

  nuxt.options.alias = {
    ...alias,
    ...nuxt.options.alias
  }
  nuxt.hook('prepare:types', ({ references }) => {
    for (const template of templates) {
      references.push({ path: template.dst })
    }
  })
  nuxt.hook('nitro:config', (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...alias,
      ...config.resolve.alias
    }
  })
  nuxt.hook('vite:extend', (ctx) => {
    ctx.config.resolve = ctx.config.resolve || {}
    ctx.config.resolve.alias = {
      ...alias,
      ...ctx.config.resolve.alias
    }
  })
}
