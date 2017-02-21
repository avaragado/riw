// this must be module.exports style
module.exports = {
    scripts: {
        build: {
            // default: 'nps clean,lint,test,build.es5,build.modules',
            default: 'nps clean && nps build.es5',
            es5: 'NODE_ENV=es5 babel --copy-files --out-dir dist/es5 --ignore __tests__ src',
            modules: 'NODE_ENV=modules babel --copy-files --out-dir dist/modules --ignore __tests__ src',
        },
        release: 'standard-version',
        lint: {
            default: 'concurrently "nps lint.js" "nps flow"',
            js: 'eslint src',
        },
        test: {
            default: 'LOGLEVEL=silent jest',
            watch: 'LOGLEVEL=silent jest --watch',
            coverageReport: 'jest --coverage',
        },
        clean: 'rimraf dist coverage flow-coverage',
        flow: {
            default: 'flow; test $? -eq 0 -o $? -eq 2',
            typed: 'flow-typed update',
            coverageReport: 'flow-coverage-report -i \'src/**/*.js\' -t html -t text',
        },
    },
};
