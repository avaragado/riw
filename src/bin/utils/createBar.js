// @flow

import chalk from 'chalk';

const sBlock = '⣿';
const arsPart = ['', '⡀', '⡄', '⡆', '⡇', '⣇', '⣧', '⣷'];

export default (ctTotal: number, ctChar: number = 20) => {
    const ctBlockPerNum = ctChar / ctTotal;
    const ctPipPerNum = (ctChar * arsPart.length) / ctTotal;

    const bar = num => sBlock.repeat(num * ctBlockPerNum);
    const part = num => arsPart[Math.floor(num * ctPipPerNum) % arsPart.length];
    const barspace = num => (bar(num) + part(num)).padEnd(ctChar);
    const slash = num => `${num}/${ctTotal}`;

    return (num: number) => `${chalk.green(barspace(num))} ${chalk.dim(slash(num))}`;
};
