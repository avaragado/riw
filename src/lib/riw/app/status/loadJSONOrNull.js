// @flow

import fs from 'fs';

import type { AbsolutePath } from '../../../../types';

type Result = Object | any[] | null;

export default (fabs: AbsolutePath): Result => {
    try {
        // not using require to avoid caching issues
        return JSON.parse(fs.readFileSync(fabs).toString());

    } catch (err) {
        return null;
    }
};

