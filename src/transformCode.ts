import * as t from '@babel/types'
import { parseTSX } from './utils/parseTSX.js'
import { traverse } from './utils/babelTypingsFix.js'
import { generateFormattedCode } from './utils/generateFormattedCode.js'
import { buildNewClassName } from './buildNewClassName.js'
import {
    addStylesImport,
    buildMemberExpression,
    buildStylesExpression
} from './astNodeBuilders.js'
import { ClassNames, generateCssModule } from './generateCssModule.js'
import { CallExpression, StringLiteral } from '@babel/types'

function transformCode(code: string): {
    componentName: string
    tsx: string
    moduleCss: string
} {
    const ast = parseTSX(code)

    const defaultExport = ast.program.body.find(
        (statement): statement is t.ExportDefaultDeclaration =>
            t.isExportDefaultDeclaration(statement)
    )

    if (!defaultExport) throw new Error('Not valid React component')
    if (!t.isIdentifier(defaultExport.declaration))
        throw new Error('Not implemented')
    const componentName = defaultExport.declaration.name

    const classNames: ClassNames = []

    traverse(ast, {
        JSXAttribute(path) {
            if (
                !(path.node.name.name === 'className') ||
                (!t.isStringLiteral(path.node.value) &&
                    !(
                        t.isJSXExpressionContainer(path.node.value) &&
                        t.isCallExpression(path.node.value.expression)
                    ))
            )
                return

            const jsxElementPath = path.parentPath.parentPath
            if (!jsxElementPath?.isJSXElement()) return

            const jsxElementName = jsxElementPath.node.openingElement.name
            if (!t.isJSXIdentifier(jsxElementName)) return

            const newClassName = buildNewClassName(
                jsxElementPath,
                jsxElementName.name
            )

            let oldClassName: string

            if (t.isStringLiteral(path.node.value)) {
                oldClassName = path.node.value.value
                path.node.value = buildStylesExpression(newClassName)
            } else {
                const callExpression = path.node.value
                    .expression as CallExpression

                oldClassName = callExpression.arguments
                    .filter((argument): argument is StringLiteral =>
                        t.isStringLiteral(argument)
                    )
                    .map(argument => argument.value)
                    .join(' ')

                callExpression.arguments = callExpression.arguments.filter(
                    argument => !t.isStringLiteral(argument)
                )

                callExpression.arguments.unshift(
                    buildMemberExpression(newClassName)
                )
            }

            classNames.push({
                oldClassName,
                newClassName
            })
        }
    })

    addStylesImport(ast.program.body, componentName)

    const outputCode = generateFormattedCode(ast)

    // deduplicate class names
    const deduplicatedClassNames = [
        ...new Map(classNames.map(e => [JSON.stringify(e), e])).values()
    ]

    const outputCss = generateCssModule(deduplicatedClassNames)

    return { tsx: outputCode, moduleCss: outputCss, componentName }
}

export { transformCode }
