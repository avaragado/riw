// @flow

import type yargs from 'yargs';

import outdent from 'outdent';
import ora from 'ora';
import chalk from 'chalk';
import sum from 'ramda/src/sum';
import sortBy from 'ramda/src/sortBy';
import reverse from 'ramda/src/reverse';
import { bardot, template } from 'bardot';

import type { RIW, AppStatusResult } from '../../..';
import log from '../../../lib/log';
import { createHandlerWithRIW } from '../../utils';

export const command = 'status';
export const desc = 'Show information about translations in your app';

const here = `app ${command}`;

export const builder = (yyargs: yargs.Argv) => yyargs
    .usage(outdent`
        $0 ${here}

        Shows information about the translations in your app.
        Indicates if you should run "riw app translate".
    `)
    .options({
        missing: {
            alias: 'm',
            boolean: true,
            group: 'Command options',
            desc: outdent`
                Show missing translations, grouped by locale
            `,
        },
    });

const sAbsent = chalk.red('(absent)');
const sTotal = 'TOTAL';

const bold = x => chalk.bold(x);
const sFromLidAr = arlid => arlid.map(bold).join(', ');

const absent = (ct: ?number) => (
    ct == null
    ? ` ${sAbsent}`
    : ''
);

const createPadder = (...ars: string[]) => {
    const ctChar = Math.max.apply(null, ars.map(s => s.length)) + 2;

    return (sLabel: string) => sLabel.padEnd(ctChar);
};

export const handler = createHandlerWithRIW((riw: RIW) => {
    const spinner = ora('Gathering information...').start();

    // keep flow happy
    const {
        default: ctDefault,
        target,
        todo,
        dateInputNewest,
        dateTodo,
        dateDB,
        dateConfig,
    }: AppStatusResult = riw.app.status();

    if (ctDefault == null) {
        spinner.fail(outdent`
            No locale output file(s) found. Run "riw app translate".
        `);
        return;
    }

    if (todo == null) {
        spinner.fail(outdent`
            No todo file found. Run "riw app translate".
        `);
        return;
    }

    const isTargetAbsent = lid => target[lid] === null;

    const arlidTarget = reverse(sortBy(lid => target[lid] || 0, Object.keys(target)));
    const arlidTargetAbsent = arlidTarget.filter(isTargetAbsent);
    let isShowingWarning = false;

    if (arlidTargetAbsent.length > 0) {
        isShowingWarning = true;
        spinner.fail(outdent`
            Missing file or key for ${sFromLidAr(arlidTargetAbsent)}.
        `);
    }

    if (dateInputNewest > dateTodo) {
        isShowingWarning = true;
        spinner.fail(outdent`
            Message descriptors in your source may have changed since you last built riw's output files.
        `);
    }

    if (dateDB > dateTodo) {
        isShowingWarning = true;
        spinner.fail(outdent`
            Translations may have changed since you last built riw's output files.
        `);
    }

    if (dateConfig > dateTodo) {
        isShowingWarning = true;
        spinner.fail(outdent`
            riw configuration may have changed since you last built riw's output files.
        `);
    }

    if (isShowingWarning) {
        spinner.fail(outdent`
            Run ${chalk.bold('riw app translate')} to regenerate output files.
        `);
    }

    spinner.stop();

    const padder = createPadder(sTotal, riw.config.defaultLocale, ...arlidTarget);

    const ctMessageHave = ctDefault + sum(arlidTarget.map(lid => target[lid] || 0));
    const ctMessageWant = ctDefault * (1 + riw.config.targetLocales.length);

    // fill the line.
    // can't use bardot's widthFill as we want bars with different numbers to line up.
    // $FlowFixMe flow moans at process.stdout.columns, no idea how to fix
    const ctCharBar = process.stdout.columns
        - padder('').length  // space for locale
        - (ctMessageWant.toString().length * 2) // space for TOTAL numbers
        - 19; // space derived from remaining spaces and the "% complete" suffix
    const barTarget = bardot
        .maximum(ctDefault)
        .widthBar(ctCharBar);
    const barTotal = bardot
        .maximum(ctMessageWant)
        .widthBar(ctCharBar)
        .template(template.barCurMaxPct);

    const arlidTodo = Object.keys(todo || {});
    const ctTodo = todo == null ? 0 : sum(arlidTodo.map(lid => todo[lid].length));

    const summaryDefault = `- ${
        chalk.bold(padder(riw.config.defaultLocale))
    }${
        barTarget.current(ctDefault).toString()
    } ${
        chalk.dim('total messages')
    }`;

    const summaryTarget = lid => `- ${
        chalk.bold(padder(lid))
    }${
        barTarget.current(target[lid] || 0).toString()
    }${
        absent(target[lid])
    }`;

    const summaryTotal = `- ${
        chalk.bold(padder(sTotal))
    }${
        barTotal.current(ctMessageHave).toString()
    } complete`;

    log(outdent`

        App settings:
        - Default locale: ${sFromLidAr([riw.config.defaultLocale])}
        - Target locales: ${sFromLidAr(riw.config.targetLocales)}

        Current output file(s) for these locales:
        ${summaryDefault}
        ${arlidTarget.map(summaryTarget).join('\n')}
        ${summaryTotal}

    `);

    if (ctTodo > 0) {
        log(outdent`
            Todo file contains:
            - ${chalk.bold(ctTodo.toString())} messages to translate
            - ${chalk.bold(arlidTodo.length.toString())} locales – ${sFromLidAr(arlidTodo)}

        `);
    }
});
