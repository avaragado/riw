// @flow

import reduce from 'ramda/src/reduce';
import assocPath from 'ramda/src/assocPath';

const keysFromTMD = (tmd: RIWTranslatedMessageDescriptor) => [
    'data',
    tmd.defaultMessage,
    tmd.description,
    tmd.locale,
];

const update = (rdbAcc: RIWDB, tmd: RIWTranslatedMessageDescriptor) =>
    assocPath(keysFromTMD(tmd), tmd.translation, rdbAcc);

// eslint-disable-next-line no-unused-vars
const transformer: RIWDBTransformer = (config, opt?: RIWCLIUpdateTranslationsOpt) => rdb =>
    (opt && opt.translations.length > 0
        ? reduce(update, rdb, opt.translations)
        : rdb
    );

export default transformer;
