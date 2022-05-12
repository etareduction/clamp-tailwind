import { backtrackElements } from '../src/backtrackElements'
import { traverse } from '../src/utils/babelTypingsFix'
import { parseTSX } from '../src/utils/parseTSX'

test('two normal elements upside', () => {
    // language=text
    const code = `
import type { FC } from 'react'

const Button: FC = () => (
  <button>
    <span>
        <div className='w-10 h-10 bg-red-900' />
    </span>
  </button>
)

export default Button
`

    const ast = parseTSX(code)

    traverse(ast, {
        JSXAttribute(path) {
            if (path.parentPath.isJSXElement())
                expect(backtrackElements(path.parentPath)).toEqual([
                    'span',
                    'button'
                ])
        }
    })
})
