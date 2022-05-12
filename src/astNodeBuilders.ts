import * as t from '@babel/types'
import { JSXExpressionContainer } from '@babel/types'

const addStylesImport = (statements: t.Statement[], fileName: string) =>
    statements.unshift(
        t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier('styles'))],
            t.stringLiteral(`./${fileName}.module.css`)
        )
    )

const buildStylesExpression = (newClassName: string): JSXExpressionContainer =>
    t.jsxExpressionContainer(
        t.memberExpression(
            t.identifier('styles'),
            t.stringLiteral(newClassName),
            true
        )
    )

export { addStylesImport, buildStylesExpression }
