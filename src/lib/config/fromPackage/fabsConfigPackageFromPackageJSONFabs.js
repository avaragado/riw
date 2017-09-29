// @flow

import path from 'path';

import type { AbsolutePath } from '../../../types';

export default (fabsPackageJSON: ?AbsolutePath): ?AbsolutePath => (
    fabsPackageJSON
        ? path.resolve(path.dirname(fabsPackageJSON), '.riw-config.js')
        : null
);
