// @flow

import { transformFileSync, type babel } from 'babel-core';
import pluginReactIntl from 'babel-plugin-react-intl';
import pathOr from 'ramda/src/pathOr';
import compose from 'ramda/src/compose';

import type { AbsolutePath } from '../../../../types';
import log from '../../../log';

import type { MessageDescriptorsFromFile } from './extract';


const outputBabelFromFabs = (fabs: AbsolutePath): babel.BabelFileResult => {
    try {
        return transformFileSync(fabs, {
            plugins: [pluginReactIntl],
        });

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
