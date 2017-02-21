// @flow
// all types common across riw

import type yargs from 'yargs';

declare type AbsolutePath = string;
declare type RelativePath = string;
declare type Path = AbsolutePath | RelativePath;
declare type Glob = string;

declare type LocaleId = string;

declare type RIWConfig = {
    rootDir?: AbsolutePath, // added by config processing: directory holding config file (if omitted: cwd)
    defaultLocale: LocaleId,
    targetLocales: LocaleId[],
    translationsDatabaseFile: Path,
    sourceDirs: Glob[],
};

declare type RIWDBVersion = number;
declare type RIWDBDefaultMessage = string;
declare type RIWDBTranslatedMessage = string;
declare type RIWDBDescription = string;
declare type RIWMessageId = string;

declare type RIWMessageDescriptor = {
    id: RIWMessageId,
    defaultMessage: RIWDBDefaultMessage,
    description?: RIWDBDescription,
    fabs: AbsolutePath, // added by riw
};

declare type RIWSourceMessageDescriptorData = {
    fabs: AbsolutePath,
    armd: RIWMessageDescriptor[],
};

declare type RIWDuplicateIdData = {
    id: RIWMessageId,
    arfabs: AbsolutePath[],
};

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

declare type RIWDBQuad = [RIWDBDefaultMessage, RIWDBDescription, LocaleId, RIWDBTranslatedMessage];

declare type RIWDBQuadsTransformer = (config: RIWConfig, opt?: Object) => (quads: RIWDBQuad[]) => RIWDBQuad[];

declare type RIWCLIHandler = (riw: RIW, argv: yargs.Argv) => void;

declare type RIWTranslatedMessageDescriptor = {
    defaultMessage: RIWDBDefaultMessage,
    description: RIWDBDescription,
    locale: LocaleId,
    translation: RIWDBTranslatedMessage,
};

declare type RIWQuadMatcher = {
    defaultMessage?: RIWDBDefaultMessage,
    description?: RIWDBDescription,
    locale?: LocaleId,
    translation?: RIWDBTranslatedMessage,
}

type RIWCLIOptDBUpdate = {
    translations: RIWTranslatedMessageDescriptor[],
};

type RIWCLIOptDBFind = {
    match: RIWQuadMatcher,
};

type RIWCLIOptDBDelete = {
    match: RIWQuadMatcher,
};

type RIWCLIOptProjectExtract = {
    on?: {
        start?: () => void,
        startFiles?: (arfabsSource: AbsolutePath[]) => void,
        startFile?: (fabsSource: AbsolutePath) => void,
        endFile?: (smdd: RIWSourceMessageDescriptorData) => void,
        startDupCheck?: () => void,
        end?: () => void,
    },
};

type RIWCLIProjectExtractResult = {
    armd: RIWMessageDescriptor[],
    dups: RIWDuplicateIdData[],
};

declare type RIW = {
    config: RIWConfig,
    db: {
        init: void => void,
        update: (opt: RIWCLIOptDBUpdate) => void,
        find: (opt: RIWCLIOptDBFind) => RIWDBQuad[],
        delete: (opt: RIWCLIOptDBDelete) => void,
    },
    project: {
        extract: (opt: RIWCLIOptProjectExtract) => RIWCLIProjectExtractResult,
    },
};

