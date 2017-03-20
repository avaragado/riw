// this must be module.exports style
module.exports = {
    scripts: {
        build: {
            // default: 'nps clean,lint,test,build.es5',
            default: 'nps clean && nps build.es5 && nps flow.copySource',
            es5: 'babel --copy-files --out-dir dist --ignore __tests__ src',
        },
        release: 'standard-version',
        lint: {
            default: 'concurrently "nps lint.js" "nps flow"',
            js: 'eslint src',
        },
        test: {
            default: 'LOGLEVEL=silent jest',
            watch: 'LOGLEVEL=silent jest --watch',
            coverageReport: 'LOGLEVEL=silent jest --coverage',
        },
        clean: 'rimraf dist coverage flow-coverage',
        flow: {
            default: 'flow --show-all-errors; test $? -eq 0 -o $? -eq 2',
            typed: 'flow-typed update',
            coverageReport: 'flow-coverage-report -i \'src/**/*.js\' -t html -t text',
            copySource: 'flow-copy-source src dist',
        },
    },
};
