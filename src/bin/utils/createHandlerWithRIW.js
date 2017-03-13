// @flow

import type yargs from 'yargs';

import { configFromPath, configFromPackage } from '../../lib/config';
import createRIW from '../../';

export default (handler: RIWCLIHandler) => (argv: yargs.Argv) => {
    const config = argv.config
        ? configFromPath(argv.config)
        : configFromPackage();

    if (config) {
        const riw = createRIW(config);

        return handler(riw, argv);
    }

    // we've already output an error message.
    return null;
};
