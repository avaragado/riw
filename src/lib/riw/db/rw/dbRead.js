// @flow

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import type { Config } from '../../../config';
import log from '../../../log';

import type { TranslationsDB } from '../';

export default (config: Config) => (): TranslationsDB => {
    const { translationsDatabaseFile: pathDB, rootDir } = config;

    const pabsDB = path.resolve(rootDir, pathDB);
    let sDB;

    try {
        sDB = fs.readFileSync(pabsDB, 'utf8').toString();

    } catch (err) {
        log.error('Unable to read riw database file ', chalk.bold(pabsDB));
        throw err;
    }

    try {
        return JSON.parse(sDB);

    } catch (err) {
        log.error('Unable to parse riw database file ', chalk.bold(pabsDB));
        log.error('Could be malformed JSON.');
        throw err;
    }
};
