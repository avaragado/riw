// @flow

import type yargs from 'yargs';
import outdent from 'outdent';

import { createHandlerWithRIW } from '../utils';

export const command = 'print-config';
export const desc = 'Output the configuration used, in JSON format, taking defaults into account';

export const builder = (yyargs: yargs.Argv) => yyargs
    .usage(outdent`
        $0 ${command}

        Outputs the configuration settings used by the riw command, in JSON format.
        This includes both the default settings and the overrides supplied by your configuration file.
    `);

export const handler = createHandlerWithRIW((riw: RIW) => {
    // this uses plain config.log to make it easier to copy.
    console.log(JSON.stringify(riw.config, null, 4));
});
