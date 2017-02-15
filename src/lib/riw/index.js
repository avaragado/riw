// @flow

import { makeDiskRWPipeline, makeDiskToQuadsPipeline } from './persistence/makePipeline';

import initDB from './initDB';
import updateTranslations from './transformer/updateTranslations';
import findTranslations from './transformer/findTranslations';
import deleteTranslations from './transformer/deleteTranslations';

export const sDescriptionDefault = '_';

export default (config: RIWConfig): RIW => ({
    config,
    db: {
        init: initDB(config),
        update: makeDiskRWPipeline(updateTranslations, config),
        find: makeDiskToQuadsPipeline(findTranslations, config),
        delete: makeDiskRWPipeline(deleteTranslations, config),
    },
});
