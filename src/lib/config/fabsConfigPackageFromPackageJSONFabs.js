// @flow

import path from 'path';

export default (fabsPackageJSON: ?AbsolutePath): ?AbsolutePath => (
    fabsPackageJSON
        ? path.resolve(path.dirname(fabsPackageJSON), '.riw-config.js')
        : null
    );
