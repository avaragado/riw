// @flow

import type {
    LocaleId,
    DefaultMessage,
    Description,
    TranslatedMessage,
    TranslationQuad,
} from '../../../../types';
import { descriptionSerialised } from '../../../config-helper';


export type TranslationMatchSpec = {
    defaultMessage?: DefaultMessage,
    description?: Description,
    locale?: LocaleId,
    translation?: TranslatedMessage,
};

export default (match: TranslationMatchSpec) => {
    const descSer = descriptionSerialised(match.description);

    return (quad: TranslationQuad): boolean => (
        (!match.defaultMessage || quad[0] === match.defaultMessage) &&
        (!match.description || quad[1] === descSer) &&
        (!match.locale || quad[2] === match.locale) &&
        (!match.translation || quad[3] === match.translation)
    );
};
