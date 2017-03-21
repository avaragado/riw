// @flow

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import mkdirp from 'mkdirp';

import type { Config } from '../../../config';
import log from '../../../log';

import type { TranslationsDB } from '../';

type WriteOpt = {
    allowOverwrite?: boolean,
};

const optDefault: WriteOpt = {
    allowOverwrite: true,
};

export default (config: Config, optIn: WriteOpt = {}) => (db: TranslationsDB): void => {
    const opt = { ...optDefault, ...optIn };
    const flag = opt.allowOverwrite ? 'w' : 'wx';

    const { translationsDatabaseFile: pathDB, rootDir } = config;

    const pabsDB = path.resolve(rootDir, pathDB);
    const dabsDB = path.dirname(pabsDB);

    const json = JSON.stringify(db, null, 4);

    try {
        mkdirp.sync(dabsDB);

    } catch (err) {
        log.error('Unable to create directory ', chalk.bold(dabsDB), ' for riw database file.');
        throw err;
    }

    try {
        fs.writeFileSync(pabsDB, json, { flag });
    } catch (err) {

        log.error('Unable to create riw database file ', chalk.bold(pabsDB), '. It might already exist.');
        throw err;
    }
};
