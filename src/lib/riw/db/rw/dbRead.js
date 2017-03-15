// @flow

import fs from 'fs';
import path from 'path';

import log from '../../../log';

export default (config: RIWConfig) => (): RIWDB => {
    const { translationsDatabaseFile: pathDB, rootDir } = config;

    const pabsDB = path.resolve(rootDir, pathDB);
    let sDB;

    try {
        sDB = fs.readFileSync(pabsDB, 'utf8').toString();

    } catch (err) {
        log.error('riw', `Unable to read riw database file ${pabsDB}.`);
        throw err;
    }

    try {
        return JSON.parse(sDB);

    } catch (err) {
        log.error('riw', `Unable to parse riw database file ${pabsDB}. Could be malformed JSON.`);
        throw err;
    }
};