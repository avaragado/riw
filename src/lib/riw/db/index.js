// @flow

import version from './version';
import dbEmpty from './dbEmpty';
import readFromFile from './readFromFile';
import writeToFile from './writeToFile';
import writeEmptyToFile from './writeEmptyToFile';
import arquadFromDB from './arquadFromDB';
import dbFromQuadAr from './dbFromQuadAr';
import { makeFileToQuadArPipeline, makeFileToFilePipeline } from './makePipeline';

import updateTranslations from './transform/updateTranslations';
import findTranslations from './transform/findTranslations';
import deleteTranslations from './transform/deleteTranslations';
import status from './status';

export {
    version,
    dbEmpty,
    readFromFile,
    writeToFile,
    writeEmptyToFile,
    arquadFromDB,
    dbFromQuadAr,
    makeFileToQuadArPipeline,
    makeFileToFilePipeline,
};

export default (config: RIWConfig) => ({
    init: writeEmptyToFile(config),
    update: makeFileToFilePipeline(updateTranslations, config),
    find: makeFileToQuadArPipeline(findTranslations, config),
    status: status(config),
    delete: makeFileToFilePipeline(deleteTranslations, config),
});
