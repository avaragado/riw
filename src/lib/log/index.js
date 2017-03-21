// @flow

import chalk from 'chalk';

const log = process.env.LOGLEVEL === 'silent'
    ? () => {}
    : (...ars: string[]) => console.log(ars.join(''));

log.warn = (...ars) => log(chalk.red('WARNING '), ...ars);
log.error = (...ars) => log(chalk.red.bold('ERROR '), ...ars);

export default log;
