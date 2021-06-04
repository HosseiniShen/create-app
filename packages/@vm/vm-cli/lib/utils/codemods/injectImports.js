/**
 * Inject import declarations
 * @param {*} fileInfo 
 * @param {*} api 
 * @param {*} param2 
 * @returns 
 */
module.exports = function injectImports (fileInfo, api, { imports }) {
  if (!imports || !imports.length) return fileInfo.source

  const j = api.jscodeshift
  const root = j(fileInfo.source)

  const toImportAST = i => j(`${ i }\n`).nodes()[0].program.body[0]
  const toImportHash = node => JSON.stringify({
    specifiers: node.specifiers.map(s => s.local.name),
    source: node.source.raw
  })
  
  const importDeclarations = root.find(j.ImportDeclaration)
  const importSet = new Set(importDeclarations.nodes().map(toImportHash))
  const nonDuplicates = node => !importSet.has(toImportHash(node))

  const importNodes = imports.map(toImportAST).filter(nonDuplicates)
  if (importDeclarations.length) {
    importDeclarations
      .at(-1)
      .forEach(({ node }) => delete node.loc)
      .insertAfter(importNodes)
  } else {
    root.get().node.program.body.unshift(...importNodes)
  }
  return root.toSource()
}
