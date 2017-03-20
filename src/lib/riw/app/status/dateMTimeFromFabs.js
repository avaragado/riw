// @flow

import fs from 'fs';

import type { AbsolutePath } from '../../../../types';

export default (fabs: AbsolutePath): number => {
    try {
        return fs.statSync(fabs).mtime;

    } catch (err) {
        return 0;
    }
};
