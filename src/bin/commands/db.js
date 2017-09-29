// @flow

import type yargs from 'yargs';

export const command = 'db <command>';
export const desc = 'Manage the riw translations database';

export const builder = (yyargs: yargs.Argv) => yyargs.commandDir('db-commands');
export const handler = () => {};
