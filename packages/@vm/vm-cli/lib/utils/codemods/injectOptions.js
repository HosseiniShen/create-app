/**
 * Inject root options
 * @param {*} fielInfo 
 * @param {*} api 
 * @param {*} param2 
 */
module.exports = function injectOptions (fileInfo, api, { injections }) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)

  const toPropertyAST = i => j(`({${i}})`).nodes()[0].program.body[0].expression.properties[0]

  const properties = root
    .find(j.NewExpression, {
        callee: { name: 'Vue' },
        arguments: [{ type: 'ObjectExpression' }],
    })
    .map(path => path.get('arguments', 0))
    .get()
    .node
    .properties

  const toPropertyHash = p => `${p.key.name}: ${j(p.value).toSource()}`
  const propertySet = new Set(properties.map(toPropertyHash))
  const nonDuplicates = p => !propertySet.has(toPropertyHash(p))

  properties.splice(-1, 0, ...injections.map(toPropertyAST).filter(nonDuplicates))
  return root.toSource()
}
