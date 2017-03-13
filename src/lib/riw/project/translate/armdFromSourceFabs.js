// @flow

import { transformFileSync, type babel } from 'babel-core';
import pluginReactIntl from 'babel-plugin-react-intl';
import pathOr from 'ramda/src/pathOr';
import compose from 'ramda/src/compose';

const outputBabelFromFabs = (fabs: AbsolutePath): babel.BabelFileResult => {
    try {
        return transformFileSync(fabs, {
            plugins: [pluginReactIntl],
        });

    } catch (err) {
        console.log(err);
        throw err;
    }
};

const armdFromFabs: MessageDescriptorsFromFile = compose(
    pathOr([], ['metadata', 'react-intl', 'messages']),
    outputBabelFromFabs,
);

export default armdFromFabs;
