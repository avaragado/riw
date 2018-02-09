// @flow

import { transformFileSync, type babel } from 'babel-core';
import pluginReactIntl from 'babel-plugin-react-intl';
import pluginReactIntlAuto from 'babel-plugin-react-intl-auto';
import pathOr from 'ramda/src/pathOr';
import compose from 'ramda/src/compose';

import type { AbsolutePath } from '../../../../types';
import type { Config } from '../../../config';
import log from '../../../log';

import type { MessageDescriptorsFromFile } from './extract';


const outputBabelFromFabs = (fabs: AbsolutePath, config: Config): babel.BabelFileResult => {
    const plugins = [pluginReactIntl];

    if (config.reactIntlAutoConfig) {
        plugins.unshift([pluginReactIntlAuto, config.reactIntlAutoConfig]);
    }

    try {
        return transformFileSync(fabs, { plugins });

    } catch (err) {
        log.error(err);
        throw err;
    }
};

const armdFromFabs: MessageDescriptorsFromFile = compose(
    pathOr([], ['metadata', 'react-intl', 'messages']),
    outputBabelFromFabs,
);

export default armdFromFabs;
