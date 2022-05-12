import * as t from '@babel/types'
import { parseTSX } from './utils/parseTSX'
import { traverse } from './utils/babelTypingsFix'
import { generateFormattedCode } from './utils/generateFormattedCode'
import { buildNewClassName } from './buildNewClassName'
import { addStylesImport, buildStylesExpression } from './astNodeBuilders'
import { ClassNames, generateCssModule } from './generateCssModule'

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
                !t.isStringLiteral(path.node.value) ||
                !(path.node.name.name === 'className')
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

            classNames.push({
                oldClassName: path.node.value.value,
                newClassName
            })

            path.node.value = buildStylesExpression(newClassName)
        }
    })

    addStylesImport(ast.program.body, componentName)

    const outputCode = generateFormattedCode(ast)
    const outputCss = generateCssModule(classNames)

    return { tsx: outputCode, moduleCss: outputCss, componentName }
}

export { transformCode }
