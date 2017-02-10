// @flow

const VERSION: RIWDBVersion = 1;

// eslint-disable-next-line no-unused-vars
export default (config: RIWConfig) => (): RIWDB => ({
    version: VERSION,
    data: {},
});
