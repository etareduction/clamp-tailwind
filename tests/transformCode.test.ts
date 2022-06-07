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

test('transform named function component', () => {
    // language=text
    const code = `function Button() {
    return (
        <div>
            <div className='w-10 h-10 bg-red-900' />
            <span className='w-50 h-12 bg-blue-900' />
        </div>
    )
}

export default Button
`

    // language=text
    const expectedCode = `import styles from './Button.module.css'

function Button() {
    return (
        <div>
            <div className={styles['div-div']} />
            <span className={styles['div-span']} />
        </div>
    )
}

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

test('transform buildClassName() expression', () => {
    // language=text
    const code = `import type { FC } from 'react'

const Button: FC = () => (
    <div
        className={buildClassName(
            'flex items-center justify-between',
            [!!invalidEntryMessage, 'border-accent-900'],
            'rounded-lg border border-secondary-300 py-1 px-1.6',
            [disabled, 'border-grays-300 bg-grays-100']
        )}
    />
)

export default Button
`

    // language=text
    const expectedCode = `import styles from './Button.module.css'
import type { FC } from 'react'

const Button: FC = () => (
    <div
        className={buildClassName(
            styles['div'],
            [!!invalidEntryMessage, 'border-accent-900'],
            [disabled, 'border-grays-300 bg-grays-100']
        )}
    />
)

export default Button
`

    // language=text
    const expectedCssModule = `.div {
    @apply flex items-center justify-between rounded-lg border border-secondary-300 py-1 px-1.6;
}
`

    expect(transformCode(code)).toEqual({
        tsx: expectedCode,
        moduleCss: expectedCssModule,
        componentName: 'Button'
    })
})

test('test deduplication, two alike paths with the same value should result in just one class being generated', () => {
    // language=text
    const code = `import type { FC } from 'react'

const Button: FC = () => {
    if (true) return <div className="bg-red-900" />
    else return <div className="bg-red-900" />
}

export default Button
`

    // language=text
    const expectedCode = `import styles from './Button.module.css'
import type { FC } from 'react'

const Button: FC = () => {
    if (true) return <div className={styles['div']} />
    else return <div className={styles['div']} />
}

export default Button
`

    // language=text
    const expectedCssModule = `.div {
    @apply bg-red-900;
}
`

    expect(transformCode(code)).toEqual({
        tsx: expectedCode,
        moduleCss: expectedCssModule,
        componentName: 'Button'
    })
})
