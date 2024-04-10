import { createResolver, resolveFiles, addTemplate, addTypeTemplate } from '@nuxt/kit'
import { Mixin, mix } from 'ts-mixer'
import { Nuxt } from 'nuxt/schema'
import * as ts from "typescript";
import { Project, ClassDeclaration, ImportDeclaration } from "ts-morph";

const fs = require('fs');
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
 * @param files
 * @returns ServiceList
 */
function extractTsServiceName(files: string[]):ServiceList[] {
  let program = ts.createProgram(files, { allowJs: true });
  const result = []

  for(let file of files) {
    const sourceFile = program.getSourceFile(file);
    if(!sourceFile) continue
    const classes = sourceFile.statements.filter(ts.isClassDeclaration);
    for(let c of classes) {
      const item = c.members?.find(
        (m) => ts.isPropertyDeclaration(m) && m.name?.getText(sourceFile) === 'serviceName'
      )
      if(item) {
        const node = item?.getChildren(sourceFile).find((c) => c.kind === ts.SyntaxKind.StringLiteral)
        const serviceName = node?.getText(sourceFile).replace(/['"]+/g, '').trim() || null
        if(serviceName) {
          let className = c?.name?.text || ''
          result.push(
            {
              serviceName,
              className,
              path: file
            }
          )
        }
      }
    }
  }

  return result
}
interface ModelDeclaration {
  name: string
  extend: string | null
  declaration: ClassDeclaration
  path: string
}
interface ModelList {
  [key: string]: ModelDeclaration[]
}
function getClasses(files: string[]): string {
  const classStatment: ModelList = {}
  let project = new Project({})
  project.addSourceFilesAtPaths(files)

  const sourceFiles = project.getSourceFiles()
  for(let file of files) {
    console.log('file', file)
    const source = sourceFiles.find((s) => s.getFilePath() === file)
    if(!source || source?.getClasses()?.length == 0) continue
    const classes = source.getClasses()

    for(let c of classes) {
      let name = c.getName() || null
      if(!name || !c.isExported()) continue
      if(!classStatment?.[name]) {
        classStatment[name] = []
      }

      classStatment[name].push({
        name,
        extend: c.getExtends()?.getText() || null,
        declaration: c,
        path: file.replace('.ts', '')
      })
    }
  }
  console.table(classStatment)
  const exportSourceFiles = project.createSourceFile('index.ts', '')
  exportSourceFiles.addImportDeclaration({
    moduleSpecifier: 'ts-mixer',
    namedImports: ['Mixin']
  })
  for(let [name, modelList] of Object.entries(classStatment)) {
    if(modelList.length > 1) {
      const classList = []
      for(let i in modelList) {
        const model = modelList[i]
        console.log('model', i, model.name, model.path)
        exportSourceFiles.addImportDeclaration({
          moduleSpecifier: `${model.path}`,
          namedImports: []
        }).addNamedImport({
          name: model.name,
          alias: `${model.name}_${i}`
        })
        classList.push(`${model.name}_${i}`)
        if(i == '0') {
          exportSourceFiles.addExportDeclaration({
            moduleSpecifier: `${model.path}`,
            namedExports: []
          }).addNamedExport({
            name: name,
            alias: `${model.name}Original`
          })
        }
      }
      const c = exportSourceFiles.addClass({
        name: name,
        isExported: true,

      })
      c.setExtends(`Mixin(${classList.join(', ')})`)

    } else {
      const model = modelList[0]
      exportSourceFiles.addExportDeclaration({
        moduleSpecifier: `${model.path}`,
        namedExports: [name]
      }).addNamedExport({
        name: name,
        alias: `${model.name}Original`
      })
    }

  }
  console.table(exportSourceFiles.getText())
  return exportSourceFiles.getText()

}
/**
 * extract class from a file
 * @param files
 * @returns
 */
function extractTsClass(files: string[]):  TSFile[] {
  return getClasses(files)
  const models:ModelDeclaration[] = []
  for(let c of Object.values(a)) {
    if(models.some((f) => f.name === c.name))
      continue
    if(c.extend) {
      if(!models.some((f) => f.name === c.extend)) {
        models.push(a[c.extend])

      }
      c.declaration.setExtends(c.extend)
    }
    models.push(c)
  }

  const project = new Project({})
  const source = project.createSourceFile('test.ts', fs.readFileSync(files[0], 'utf8'))
  for(let m of models) {

  }

  process.exit(0)

  let declarations: TSFile[] = [];
  let program = ts.createProgram(files, { allowJs: true });
  for(let file of files) {
    console.group('file', file)
    const sourceFile = program.getSourceFile(file);
    if(!sourceFile) continue
    let imports: string[] = []
    ts.forEachChild(sourceFile, node => {

      if (ts.isInterfaceDeclaration(node) || ts.isClassDeclaration(node)) {
        const isExported = ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) || false
        if(isExported) {
          let name = node?.name?.text || ''
          if(node?.heritageClauses) {
            const heritage = node?.heritageClauses[0].getText(sourceFile).replace('extends', '').trim()
            imports.push(heritage)
          }
          let nodeType = ts.isInterfaceDeclaration(node) ? 'interface' : 'class'
          let tsfile: TSFile | null = declarations.find((f) => f.name === name) || null

          if(tsfile && tsfile?.path !== file) {
            console.log('tsfile', tsfile?.name )
            tsfile.name = `${name}Original`
            tsfile.alias = name
            tsfile = null
          }
          if(!tsfile) {
            tsfile = {name, path: file, content: '', nodeType, imports, alias: null}
            declarations.push(tsfile)
          }
        }
      }
    });
    console.groupEnd()
  }
  /** Sort by dependencies (imports) */
  declarations = declarations
    .sort((a, b) => {
      return a.imports.length > b.imports.length ? 1 : -1
    })
    .reduce((acc, file) => {
      if(file.imports.length > 0) {
        for(let i of file.imports) {

          if(!acc.some((f) => f.name === i)) {
            const dep = declarations.find((f) => f.name === i)
            if(dep) {
              acc.push(dep)
            }
          }
        }
      }
      if(!acc.find((f) => f.name === file.name)) {
        acc.push(file)
      }
      return acc
    }, [] as TSFile[]
  )
  return declarations
}


export const addModelsServicesTemplates  = async (nuxt: Nuxt) => {
  const layers = [...nuxt.options._layers].reverse()
  const types = ['models'/* , 'services' */]
  let templates:any[] = []
  let alias = {}
  if(layers.length > 0) {
    for(let type of types) {
      const { resolve } = createResolver(nuxt.options.buildDir)
      let filenames:string[] = []

      for(let layer of layers) {
        console.log('layers', layer.cwd)
        const { resolve } = createResolver(layer.cwd)
        const files = await (await resolveFiles(resolve(`./${type}`), '**/*.ts'))
          .filter((file) => !file.endsWith('index.ts'))
          filenames = [...filenames, ...files]
      }
      console.log('filenames', filenames)
      templates.push(addTemplate({
        filename: `shopinvader/${type}.ts`,
        write: true,
        getContents: () => {
          const files = getClasses(filenames)

          // const lines = files.map((f) => {
          //   const type = f.nodeType == 'interface' ? 'type ' : ''
          //   let name = f.alias ? `${f.alias} as ${f.name}` : f.name
          //   return `export ${type} { ${name} } from '${f.path.replace('.ts', '')}'`
          // })
          return files
        },
      }))
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
  nuxt.hook('prepare:types', ({ references }) => {
    for(let template of templates) {
      references.push({ path: template.dst })
    }
  })
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
