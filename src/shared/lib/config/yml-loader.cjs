const { parse } = require('yaml')

/** Turn a YAML file into a JS module. Used by Next.js and not imported from app code. */
module.exports = function ymlLoader(source) {
  const value = parse(String(source))
  return `export default ${JSON.stringify(value)}`
}
