// @flow

import type yargs from 'yargs';

export const command = 'app <command>';
export const desc = 'Manage translations for this app';

export const builder = (yyargs: yargs.Argv) => yyargs.commandDir('app-commands');
export const handler = () => {};
