type ClassNames = { oldClassName: string; newClassName: string }[]

const generateCssModule = (classNames: ClassNames) =>
    classNames
        .map(
            className =>
                `.${className.newClassName} {\n    @apply ${className.oldClassName};\n}\n`
        )
        .join('\n')

export { generateCssModule }
export type { ClassNames }
