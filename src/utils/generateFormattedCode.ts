import prettier from 'prettier'
import { generate } from './babelTypingsFix'
import { Node } from '@babel/types'

const generateFormattedCode = (ast: Node): string =>
    prettier.format(generate(ast).code, {
        parser: 'babel-ts',
        printWidth: 80,
        tabWidth: 4,
        useTabs: false,
        semi: false,
        singleQuote: true,
        quoteProps: 'as-needed',
        trailingComma: 'none',
        bracketSpacing: true,
        bracketSameLine: false,
        arrowParens: 'avoid',
        endOfLine: 'lf'
    })

export { generateFormattedCode }
