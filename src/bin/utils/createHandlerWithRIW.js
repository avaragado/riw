// @flow

import type yargs from 'yargs';

import { configFromOptionalPath } from '../../lib/config';
import createRIWFromConfig from '../../lib/riw';

export default (handler: RIWCLIHandler) => (argv: yargs.Argv) => {
    const config = configFromOptionalPath(argv.config);

    if (config) {
        const riw = createRIWFromConfig(config);

        return handler(riw, argv);
    }

    // we've already output an error message.
    return null;
};
