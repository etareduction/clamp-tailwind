import _traverse from '@babel/traverse'
import _generate from '@babel/generator'

// @ts-ignore
const traverse = _traverse.default as typeof _traverse
// @ts-ignore
const generate = _generate.default as typeof _generate

export { traverse, generate }
