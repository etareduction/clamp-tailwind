import parser from '@babel/parser'

const parseTSX = (code: string) =>
    parser.parse(code, {
        strictMode: true,
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
    })

export { parseTSX }
