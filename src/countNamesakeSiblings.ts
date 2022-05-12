import type { JSXElement } from '@babel/types'
import type { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

const countNamesakeSiblings = (path: NodePath<JSXElement>): number =>
    path
        .getAllPrevSiblings()
        .map(e => e.node)
        .filter(
            e =>
                t.isJSXElement(e) &&
                t.isJSXIdentifier(e.openingElement.name) &&
                t.isJSXIdentifier(path.node.openingElement.name) &&
                e.openingElement.name.name ===
                    path.node.openingElement.name.name
        ).length

export { countNamesakeSiblings }
