/**
 * Sort object property
 * @param {*} obj 
 * @param {*} sortKeys 
 * @param {*} dontSortByUnicode 
 * @returns 
 */
module.exports = function sortObject (obj, sortKeys, dontSortByUnicode) {
  if (!obj) return obj

  const ret = Object.create(null)

  if (Array.isArray(sortKeys)) {
    sortKeys.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        ret[key] = obj[key]
        delete obj[key]
      }
    })
  }

  const remainKeys = Object.keys(obj)
  !dontSortByUnicode && remainKeys.sort()
  remainKeys.forEach(key => {
    ret[key] = obj[key]
  })
  return ret
}
