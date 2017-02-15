// @flow

import { makeDiskRWPipeline, makeDiskToQuadsPipeline } from './persistence/makePipeline';

import initDB from './initDB';
import updateTranslations from './transformer/updateTranslations';
import findTranslations from './transformer/findTranslations';

export const sDescriptionDefault = '_';

export default (config: RIWConfig): RIW => ({
    initDB: initDB(config),
    updateTranslations: makeDiskRWPipeline(updateTranslations, config),
    findTranslations: makeDiskToQuadsPipeline(findTranslations, config),
    config,
});
