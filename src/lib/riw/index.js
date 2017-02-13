// @flow

import makeDiskTransformer from './makeDiskTransformer';

import initDB from './initDB';
import updateTranslations from './transformer/updateTranslations';

export const sDescriptionDefault = '_';

export default (config: RIWConfig): RIW => ({
    initDB: initDB(config),
    updateTranslations: makeDiskTransformer(updateTranslations, config),
    config,
});
