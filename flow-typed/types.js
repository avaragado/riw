// @flow
// all types common across riw

import type yargs from 'yargs';

declare type AbsolutePath = string;
declare type RelativePath = string;
declare type Path = AbsolutePath | RelativePath;
declare type Glob = string;

declare type LocaleId = string;
declare type InputMode = 'source' | 'json';
declare type OutputMode = 'single-file' | 'file-per-locale' | 'no-file';

declare type RIWConfigSparse = {
    defaultLocale?: LocaleId,
    targetLocales?: LocaleId[],
    translationsDatabaseFile?: Path,
    sourceDirs?: Glob[],
    collateDir?: Path,
    inputMode?: InputMode,
    translationsOutputFile?: Path,
    outputMode?: OutputMode,
    todoFile?: Path,
};

declare type RIWConfigSource = {
    configFile?: AbsolutePath,
    rootDir?: AbsolutePath,
};

declare type RIWConfigSparseWithSource = RIWConfigSource & RIWConfigSparse;

declare type RIWConfig = {
    rootDir: AbsolutePath,
    configFile?: AbsolutePath, // remains optional as API user might not have one
    defaultLocale: LocaleId,
    targetLocales: LocaleId[],
    translationsDatabaseFile: Path,
    sourceDirs: Glob[],
    collateDir: Path,
    inputMode: InputMode,
    translationsOutputFile: Path,
    outputMode: OutputMode,
    todoFile: Path,
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

declare type RIWMessageDescriptorUntranslated = {
    id: RIWMessageId,
    defaultMessage: RIWDBDefaultMessage,
    description?: RIWDBDescription,
    locale: LocaleId,
};

declare type RIWDuplicateIdData = {
    id: RIWMessageId,
    arfabs: AbsolutePath[],
};

declare type RIWFindTranslationResult = {
    locale: {
        [key: LocaleId]: {
            [key: RIWMessageId]: RIWDBTranslatedMessage,
        },
    },
    armdu: RIWMessageDescriptorUntranslated[],
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

declare type RIWDBPair = [RIWDBDefaultMessage, RIWDBDescription];
declare type RIWDBQuad = [RIWDBDefaultMessage, RIWDBDescription, LocaleId, RIWDBTranslatedMessage];

declare type RIWCLIHandler = (riw: RIW, argv: yargs.Argv) => void;

declare type RIWTranslatedMessageDescriptor = {
    defaultMessage: RIWDBDefaultMessage,
    description?: RIWDBDescription,
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

type RIWCLIOptAppTranslate = {
    on?: {
        start?: () => void,
        startExtract?: (arfabsSource: AbsolutePath[]) => void,
        startExtractFile?: (fabsSource: AbsolutePath) => void,
        endExtractFile?: ({ armd: RIWMessageDescriptor[], fabs: AbsolutePath }) => void,
        endExtract?: (RIWMessageDescriptor[]) => void,
        startDupCheck?: (armd: RIWMessageDescriptor[]) => void,
        endDupCheck?: (dups: RIWDuplicateIdData[]) => void,
        startLookup?: (armd: RIWMessageDescriptor[]) => void,
        endLookup?: (translation: RIWFindTranslationResult) => void,
        fileSaved?: (fabs: AbsolutePath) => void,
        end?: ({ armd: RIWMessageDescriptor[], dups: RIWDuplicateIdData[] }) => void,
    },
};

type RIWCLIAppTranslateResult = {
    armd: RIWMessageDescriptor[],
    dups: RIWDuplicateIdData[],
};

type RIWCLIDBStatusResult = {
    default: RIWDBPair[],
    locale: {
        [key: LocaleId]: {
            has: RIWDBPair[],
            missing: RIWDBPair[],
        },
    },
};

type RIWCLIAppStatusResult = {
    default: ?number,
    target: {
        [key: LocaleId]: ?number,
    },
    todo: null | {
        [key: LocaleId]: RIWMessageDescriptorUntranslated[],
    },
    dateInputNewest: number,
    dateTodo: number,
    dateDB: number,
    dateConfig: number,
};

declare type RIW = {|
    config: RIWConfig,
    db: {|
        init: () => void,
        read: () => RIWDB,
        find: (opt: RIWCLIOptDBFind) => RIWTranslatedMessageDescriptor[],
        status: () => RIWCLIDBStatusResult,
        update: (opt: RIWCLIOptDBUpdate) => void,
        delete: (opt: RIWCLIOptDBDelete) => void,
    |},
    app: {|
        translate: (opt: RIWCLIOptAppTranslate) => RIWCLIAppTranslateResult,
        status: () => RIWCLIAppStatusResult,
    |},
|};

type FilesFromConfig = (config: RIWConfig) => AbsolutePath[];
type MessageDescriptorsFromFile = (fabs: AbsolutePath) => RIWMessageDescriptor[];
