// @flow
// all types common across riw

import type yargs from 'yargs';

declare type AbsolutePath = string;
declare type RelativePath = string;
declare type Path = AbsolutePath | RelativePath;

declare type LocaleId = string;

declare type RIWConfig = {
    rootDir?: AbsolutePath, // added by config processing: directory holding config file (if omitted: cwd)
    defaultLocale: LocaleId,
    targetLocales: LocaleId[],
    translationsDatabaseFile: Path,
};

declare type RIWDBVersion = number;
declare type RIWDBDefaultMessage = string;
declare type RIWDBTranslatedMessage = string;
declare type RIWDBDescription = string;

declare type RIWDBLocaleTranslationMap = {
    [key: LocaleId]: RIWDBTranslatedMessage,
};

declare type RIWDBDescriptionTranslationMap = {
    [key: RIWDBDescription]: RIWDBLocaleTranslationMap,
};

declare type RIWDBTranslationMap = {
    [key: RIWDBDefaultMessage]: RIWDBDescriptionTranslationMap,
};

declare type RIWDB = {
    version: RIWDBVersion,
    data: RIWDBTranslationMap,
};

declare type RIWDBTransformer = (config: RIWConfig, opt?: Object) => (rdb: RIWDB) => RIWDB;

declare type RIW = {
    config: RIWConfig,
    initDB: void => void,
    updateTranslations: (opt: Object) => void,
};

declare type RIWCLIHandler = (riw: RIW, argv: yargs.Argv) => void;

declare type RIWTranslatedMessageDescriptor = {
    defaultMessage: string,
    description?: string,
    locale: LocaleId,
    translation: string,
};

type RIWCLIUpdateTranslationsOpt = {
    translations: RIWTranslatedMessageDescriptor[],
};
