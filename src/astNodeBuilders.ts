import * as t from '@babel/types'
import { JSXExpressionContainer } from '@babel/types'

const addStylesImport = (statements: t.Statement[], fileName: string) =>
    statements.unshift(
        t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier('styles'))],
            t.stringLiteral(`./${fileName}.module.css`)
        )
    )

const buildMemberExpression = (newClassName: string): t.MemberExpression =>
    t.memberExpression(
        t.identifier('styles'),
        t.stringLiteral(newClassName),
        true
    )

const buildStylesExpression = (newClassName: string): JSXExpressionContainer =>
    t.jsxExpressionContainer(buildMemberExpression(newClassName))

const buildObjectProperty = (
    newClassName: string,
    oldProperty: t.ObjectProperty
): t.ObjectProperty =>
    t.objectProperty(
        buildMemberExpression(newClassName),
        oldProperty.value,
        true
    )

export {
    addStylesImport,
    buildStylesExpression,
    buildMemberExpression,
    buildObjectProperty
}
