// @flow

import path from 'path';

import log from '../../log';

export default (pathConfig: Path): ?RIWConfigSparseWithSource => {
    const fabs: AbsolutePath = path.resolve(pathConfig);

    try {
        return {
            ...(require(fabs): RIWConfigSparse),
            configFile: fabs,
        };

    } catch (err) {
        log.error('riw', 'File not found: %j.', fabs);
        return null;
    }
};
