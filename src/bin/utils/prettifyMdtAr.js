// @flow

import chalk from 'chalk';
import pick from 'ramda/src/pick';
import groupBy from 'ramda/src/groupBy';
import compose from 'ramda/src/compose';
import join from 'ramda/src/join';
import chain from 'ramda/src/chain';
import values from 'ramda/src/values';
import dropLast from 'ramda/src/dropLast';

const grouper = compose(
    JSON.stringify,
    pick(['defaultMessage', 'description']),
);

const formatHeaderFromMdt = mdt => [
    ' - ',
    chalk.dim('"'),
    chalk.bold.blue(mdt.defaultMessage),
    chalk.dim('"'),
    ' ',
    chalk.dim(mdt.description || ''),
    '\n',
];

const formatLineFromMdt = mdt => [
    '   ',
    chalk.green(mdt.locale),
    ' ',
    chalk.dim('"'),
    chalk.bold.green(mdt.translation),
    chalk.dim('"'),
    '\n',
];

const formatGroupFromMdtAr = armdt => [
    ...formatHeaderFromMdt(armdt[0]),
    ...chain(formatLineFromMdt, armdt),
    '\n',
];

type Prettifier = RIWTranslatedMessageDescriptor[] => string;

const prettify: Prettifier = compose(
    join(''),
    dropLast(1), // we don't need the very last \n
    chain(formatGroupFromMdtAr),
    values,
    groupBy(grouper),
);

export default prettify;
