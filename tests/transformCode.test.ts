import { transformCode } from '../src/transformCode'

test('transform single div className to css module', () => {
    // language=text
    const code = `import type { FC } from 'react'

const Button: FC = () => <div className='w-10 h-10 bg-red-900' />

export default Button
`

    // language=text
    const expectedCode = `import styles from './Button.module.css'
import type { FC } from 'react'

const Button: FC = () => <div className={styles['div']} />

export default Button
`

    // language=text
    const expectedCssModule = `.div {
    @apply w-10 h-10 bg-red-900;
}
`

    expect(transformCode(code)).toEqual({
        tsx: expectedCode,
        moduleCss: expectedCssModule,
        componentName: 'Button'
    })
})

test('transform multiple nested elements with classNames', () => {
    // language=text
    const code = `import type { FC } from 'react'

const Button: FC = () => (
    <div>
        <div className='w-10 h-10 bg-red-900' />
        <span className='w-50 h-12 bg-blue-900' />
    </div>
)

export default Button
`

    // language=text
    const expectedCode = `import styles from './Button.module.css'
import type { FC } from 'react'

const Button: FC = () => (
    <div>
        <div className={styles['div-div']} />
        <span className={styles['div-span']} />
    </div>
)

export default Button
`

    // language=text
    const expectedCssModule = `.div-div {
    @apply w-10 h-10 bg-red-900;
}

.div-span {
    @apply w-50 h-12 bg-blue-900;
}
`

    expect(transformCode(code)).toEqual({
        tsx: expectedCode,
        moduleCss: expectedCssModule,
        componentName: 'Button'
    })
})
