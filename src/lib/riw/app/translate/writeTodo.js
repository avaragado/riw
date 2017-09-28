// @flow

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import mkdirp from 'mkdirp';

import type { Config } from '../../../config';
import log from '../../../log';

import type { TranslationLookupResult } from './findTranslations';

const stringify = obj => JSON.stringify(obj, null, 4);

export default (config: Config, notify: string => string => string) =>
    (translation: TranslationLookupResult) => {
        const { todoFile: pathOut, rootDir } = config;
        const { todos } = translation;

        const fabsOut = path.resolve(rootDir, pathOut);
        const dabsOut = path.dirname(fabsOut);

        const todosRelative = todos.map(todo => ({
            ...todo,
            file: path.relative(rootDir, todo.file),
        }));

        try {
            mkdirp.sync(dabsOut);

        } catch (err) {
            log.error('Unable to create directory ', chalk.bold(dabsOut), ' for riw TODO file.');
            throw err;
        }

        if (config.outputMode !== 'no-file') {
            fs.writeFileSync(fabsOut, stringify(todosRelative));
            notify('fileSaved')(fabsOut);
        }

        return translation;
    };
