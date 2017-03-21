// @flow

import chalk from 'chalk';

import { name, version } from '../../../package.json';
import log from '../../lib/log';

export const command = 'version';
export const desc = 'Print version information';

export const handler = () => {
    log(chalk.bold(name), ' ', version);
};
