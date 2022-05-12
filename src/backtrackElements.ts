import { NodePath } from '@babel/traverse'
import { JSXElement } from '@babel/types'
import * as t from '@babel/types'

function backtrackElements(path: NodePath<JSXElement>) {
    let node = path
    const names: string[] = []

    while (node) {
        const parent = node.findParent(path =>
            path.isJSXElement()
        ) as NodePath<JSXElement>

        if (parent && t.isJSXIdentifier(parent.node.openingElement.name))
            names.push(parent.node.openingElement.name.name)

        node = parent
    }

    return names
}

export { backtrackElements }
