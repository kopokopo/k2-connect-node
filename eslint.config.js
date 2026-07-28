const js = require('@eslint/js')

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: 'commonjs',
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
                Buffer: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                before: 'readonly',
                after: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly'
            }
        },
        rules: {
            indent: [
                'error',
                'tab'
            ],
            'linebreak-style': [
                'error',
                'unix'
            ],
            quotes: [
                'error',
                'single'
            ],
            semi: [
                'error',
                'never'
            ],
            'spaced-comment': [
                'error', 'always', {
                    line: {
                        markers: ['/'],
                        exceptions: ['-', '+']
                    },
                    block: {
                        markers: ['!'],
                        exceptions: ['*'],
                        balanced: true
                    }
                }
            ]
        }
    }
]
