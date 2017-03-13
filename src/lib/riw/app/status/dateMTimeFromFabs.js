// @flow

import fs from 'fs';

export default (fabs: AbsolutePath): number => {
    try {
        return fs.statSync(fabs).mtime;

    } catch (err) {
        return 0;
    }
};
