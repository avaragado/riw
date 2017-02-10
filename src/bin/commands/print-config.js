// @flow

import { createHandlerWithRIW } from '../utils';

export const command = 'print-config';
export const desc = 'Output the configuration used, in JSON format, taking defaults into account';

export const handler = createHandlerWithRIW((riw: RIW) => {
    // this uses plain config.log to make it easier to copy.
    console.log(JSON.stringify(riw.config, null, 4));
});
