// @flow

import type { TranslationsDB } from '../';
import version from './version';

const dbEmpty: TranslationsDB = {
    version,
    data: {},
};

export default dbEmpty;
