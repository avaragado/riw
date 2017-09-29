// @flow

import chalk from 'chalk';

const log = process.env.LOGLEVEL === 'silent'
    ? (...ars: string[]) => {} // eslint-disable-line no-unused-vars
    : (...ars: string[]) => console.log(ars.join(''));

log.warn = (...ars: string[]) => log(chalk.red('WARNING '), ...ars);
log.error = (...ars: string[]) => log(chalk.red.bold('ERROR '), ...ars);

export default log;
