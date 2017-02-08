// @flow

// babel-plugin-inline-package-json@2.0.0 only supports require, and only in this icky form.
const name = require('../../../package.json').name;
const version = require('../../../package.json').version;

export const command = 'version';
export const desc = 'Print version information';

export const handler = () => {
    console.log(`${name} ${version}`);
};
