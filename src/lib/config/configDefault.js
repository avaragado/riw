// @flow

const cfg: RIWConfig = {
    configFile: null, // overridden
    rootDir: '', // overridden
    defaultLocale: 'en-us',
    targetLocales: [],
    translationsDatabaseFile: 'src/locale/riw-db.json',
    sourceDirs: ['src/**/*.js'],
    collateDir: 'tmp/babel-plugin-react-intl',
    inputMode: 'source',
    translationsOutputFile: 'src/locale/[locale].json',
    outputMode: 'file-per-locale',
    todoFile: 'src/locale/TODO-untranslated.json',
};

export default cfg;
