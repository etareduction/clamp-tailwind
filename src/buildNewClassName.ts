import { backtrackElements } from './backtrackElements.js'
import { countNamesakeSiblings } from './countNamesakeSiblings.js'
import { NodePath } from '@babel/traverse'
import { JSXElement } from '@babel/types'

const buildNewClassName = (
    elementPath: NodePath<JSXElement>,
    name: string
): string => {
    const names = backtrackElements(elementPath)
    const namesakeSiblingsCount = countNamesakeSiblings(elementPath)

    const currentNodeName = () =>
        name + (namesakeSiblingsCount > 0 ? namesakeSiblingsCount : '')

    return names[0]
        ? names.reverse().join('-') + '-' + currentNodeName()
        : currentNodeName()
}

export { buildNewClassName }
