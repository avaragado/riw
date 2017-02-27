// @flow

import fs from 'fs';
import path from 'path';

import mkdirp from 'mkdirp';

import log from '../../../lib/log';

const stringify = obj => JSON.stringify(obj, null, 4);

export default (config: RIWConfig, notify: string => string => string) =>
    (translation: RIWFindTranslationResult) => {
        const { todoFile: pathOut, rootDir } = config;

        const fabsOut = path.resolve(rootDir || process.cwd(), pathOut);
        const dabsOut = path.dirname(fabsOut);

        try {
            mkdirp.sync(dabsOut);
        } catch (err) {
            log.error('riw', `Unable to create directory ${dabsOut} for riw todo file(s).`);
            throw err;
        }

        if (config.outputMode !== 'no-file') {
            fs.writeFileSync(fabsOut, stringify(translation.armdu));
            notify('fileSaved')(fabsOut);
        }

        return translation;
    };
