// @flow

import type { Config } from '../../config';

import type {
    AppStatusResult,
} from './status';
import type {
    AppTranslateSpec,
    AppTranslateResult,
    TranslationLookupResult,
    DuplicateIdData,
} from './translate';

import status from './status';
import translate from './translate';

export type {
    AppStatusResult,
    AppTranslateSpec,
    AppTranslateResult,
    TranslationLookupResult,
    DuplicateIdData,
};

export type App = {|
    status: () => AppStatusResult,
    translate: (opt: AppTranslateSpec) => AppTranslateResult,
|};

export default (config: Config): App => ({
    status: status(config),
    translate: translate(config),
});
