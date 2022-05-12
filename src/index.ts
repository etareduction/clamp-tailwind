#!/usr/bin/env node
import * as fs from 'node:fs/promises'
import * as path from 'path'
import { transformCode } from './transformCode.js'

const [, , dirPath] = process.argv
traverseDirectory(path.resolve(process.cwd(), dirPath)).then()

async function traverseDirectory(pathToDir: string) {
    const fileNames = await fs.readdir(pathToDir)

    for (let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i]
        const pathToFile = path.resolve(pathToDir, fileName)
        const stat = await fs.stat(pathToFile)

        if (stat.isDirectory()) {
            traverseDirectory(pathToFile).then()
            return
        }

        if (!(path.extname(pathToFile) === '.tsx')) return

        const fileContents = await fs.readFile(pathToFile, {
            encoding: 'utf-8'
        })

        let { componentName, tsx, moduleCss } = transformCode(fileContents)

        console.log(`Writing to ${fileName} and ${componentName}.module.css`)

        fs.writeFile(pathToFile, tsx).then()
        fs.writeFile(
            pathToDir + `/${componentName}.module.css`,
            moduleCss
        ).then()
    }
}
