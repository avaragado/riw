// @flow

import type { AbsolutePath } from '../../types';
import type { Config } from '../config';

import arfabsInputJSON from './arfabsInputJSON';
import arfabsInputSource from './arfabsInputSource';
import translationsOutputFile from './translationsOutputFile';
import descriptionSerialised from './descriptionSerialised';

export type FilesFromConfig = (config: Config) => AbsolutePath[];

export {
    arfabsInputJSON,
    arfabsInputSource,
    translationsOutputFile,
    descriptionSerialised,
};
