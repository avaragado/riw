// @flow

import type { Config } from '../';

export default ({
    rootDir: '.',
    defaultLocale: 'en-US',
    targetLocales: [],
    translationsDatabaseFile: 'src/locale/riw-db.json',
    sourceDirs: ['src/**/*.js'],
    collateDir: 'tmp/babel-plugin-react-intl',
    inputMode: 'source',
    translationsOutputFile: 'src/locale/[locale].json',
    outputMode: 'file-per-locale',
    todoFile: 'src/locale/TODO-untranslated.json',
}: Config);
