// @flow

import type {
    LocaleId,
    DefaultMessage,
    Description,
    TranslatedMessage,
    TranslationQuad,
} from '../../../../types';

export type TranslationMatchSpec = {
    defaultMessage?: DefaultMessage,
    description?: Description,
    locale?: LocaleId,
    translation?: TranslatedMessage,
};

export default (match: TranslationMatchSpec) => (quad: TranslationQuad): boolean => (
    (!match.defaultMessage || quad[0] === match.defaultMessage) &&
    (!match.description || quad[1] === match.description) &&
    (!match.locale || quad[2] === match.locale) &&
    (!match.translation || quad[3] === match.translation)
);
