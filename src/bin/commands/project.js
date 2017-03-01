// @flow

import type yargs from 'yargs';

export const command = 'project <command>';
export const desc = 'Manage translations for this project';

export const builder = (yyargs: yargs.Argv) => yyargs.commandDir('project-commands').strict();
