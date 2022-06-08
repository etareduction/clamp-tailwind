import * as t from '@babel/types'
import { parseTSX } from './utils/parseTSX.js'
import { traverse } from './utils/babelTypingsFix.js'
import { generateFormattedCode } from './utils/generateFormattedCode.js'
import { buildNewClassName } from './buildNewClassName.js'
import {
    addStylesImport,
    buildMemberExpression,
    buildObjectProperty,
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
            const nodeValue = path.node.value

            if (
                !(path.node.name.name === 'className') ||
                (!t.isStringLiteral(nodeValue) &&
                    !(
                        t.isJSXExpressionContainer(nodeValue) &&
                        t.isCallExpression(nodeValue.expression)
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

            if (t.isStringLiteral(nodeValue)) {
                oldClassName = nodeValue.value
                path.node.value = buildStylesExpression(newClassName)

                classNames.push({
                    oldClassName,
                    newClassName
                })
                return
            }

            const callExpression = nodeValue.expression as CallExpression

            // clamp static classes into single class in module
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

            classNames.push({
                oldClassName,
                newClassName
            })

            // make another pass and extract conditional classes into module
            let conditionalClassesCount = 0

            callExpression.arguments.forEach(argument => {
                if (!t.isObjectExpression(argument)) return

                argument.properties.forEach((property, i, self) => {
                    if (!t.isObjectProperty(property)) return

                    const key = property.key
                    if (!t.isStringLiteral(key))
                        throw new Error(
                            "Doesn't support anything but string literal keys in conditional classes yet"
                        )

                    const newConditionalClassName =
                        newClassName +
                        '-cond' +
                        (conditionalClassesCount > 0
                            ? conditionalClassesCount
                            : '')
                    conditionalClassesCount++

                    self[i] = buildObjectProperty(
                        newConditionalClassName,
                        property
                    )

                    classNames.push({
                        oldClassName: key.value,
                        newClassName: newConditionalClassName
                    })
                })
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
