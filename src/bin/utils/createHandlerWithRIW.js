// @flow

import type yargs from 'yargs';

import type { RIW } from '../../';
import { createRIW, configFromPath, configFromPackage } from '../../';

type Handler = (riw: RIW, argv: yargs.Argv) => void;

export default (handler: Handler) => (argv: yargs.Argv) => {
    const config = argv.config
        ? configFromPath(argv.config)
        : configFromPackage();

    if (config) {
        return handler(createRIW(config), argv);
    }

    // we've already output an error message.
    return null;
};
