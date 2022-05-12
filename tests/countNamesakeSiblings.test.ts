import { countNamesakeSiblings } from '../src/countNamesakeSiblings'
import { traverse } from '../src/utils/babelTypingsFix'
import { parseTSX } from '../src/utils/parseTSX'

test('two divs and span behind, one div ahead, expect 2', () => {
    // language=text
    const code = `
import type { FC } from 'react'

const Button: FC = () => (
  <button>
    <span />
    <div />
    <div />
    <div className='w-10 h-10 bg-red-900' />
    <div />
  </button>
)

export default Button

`

    const ast = parseTSX(code)

    traverse(ast, {
        JSXAttribute(path) {
            if (path.parentPath.isJSXElement())
                expect(countNamesakeSiblings(path.parentPath)).toBe(2)
        }
    })
})
