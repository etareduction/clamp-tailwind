import { backtrackElements } from './backtrackElements'
import { countNamesakeSiblings } from './countNamesakeSiblings'
import { NodePath } from '@babel/traverse'
import { JSXElement } from '@babel/types'

const buildNewClassName = (
    elementPath: NodePath<JSXElement>,
    name: string
): string => {
    const names = backtrackElements(elementPath)
    const namesakeSiblingsCount = countNamesakeSiblings(elementPath)

    return names[0]
        ? names.reverse().join('-') + '-'
        : '' + name + (namesakeSiblingsCount > 0 ? namesakeSiblingsCount : '')
}

export { buildNewClassName }
