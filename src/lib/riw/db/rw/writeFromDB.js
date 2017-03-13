// @flow

import fs from 'fs';
import path from 'path';

import mkdirp from 'mkdirp';

import log from '../../../log';

type WriteOpt = {
    allowOverwrite?: boolean,
};

const optDefault: WriteOpt = {
    allowOverwrite: true,
};

export default (config: RIWConfig, optIn: WriteOpt = {}) => (db: RIWDB): void => {
    const opt = { ...optDefault, ...optIn };
    const flag = opt.allowOverwrite ? 'w' : 'wx';

    const { translationsDatabaseFile: pathDB, rootDir } = config;

    const pabsDB = path.resolve(rootDir, pathDB);
    const dabsDB = path.dirname(pabsDB);

    const json = JSON.stringify(db, null, 4);

    try {
        mkdirp.sync(dabsDB);
    } catch (err) {
        log.error('riw', `Unable to create directory ${dabsDB} for riw database file.`);
        throw err;
    }

    try {
        fs.writeFileSync(pabsDB, json, { flag });
    } catch (err) {
        log.error('riw', `Unable to create riw database file ${pabsDB}. It might already exist.`);
        throw err;
    }
};
