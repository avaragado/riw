// @flow

import { transformFileSync, type babel } from 'babel-core';
import pluginReactIntl from 'babel-plugin-react-intl';
import glob from 'glob';
import chain from 'ramda/src/chain';
import pathOr from 'ramda/src/pathOr';
import compose from 'ramda/src/compose';

const arfabsFromConfig: FilesFromConfig = config => chain(
    (sGlob: Glob) => glob.sync(sGlob, { cwd: config.rootDir, absolute: true }),
    config.sourceDirs,
);

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

export {
    arfabsFromConfig,
    armdFromFabs,
};
