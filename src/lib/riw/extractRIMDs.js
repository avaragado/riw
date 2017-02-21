// @flow

import { transformFileSync } from 'babel-core';
import pluginReactIntl from 'babel-plugin-react-intl';
import glob from 'glob';
import chain from 'ramda/src/chain';
import pathOr from 'ramda/src/pathOr';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import reduce from 'ramda/src/reduce';
import toPairs from 'ramda/src/toPairs';
import filter from 'ramda/src/filter';
import prop from 'ramda/src/prop';

import makeNotifier from '../notify';

const arfabsSourceFromConfig = (config: RIWConfig) => chain(
    sGlob => glob.sync(sGlob, { cwd: config.rootDir, absolute: true }),
    config.sourceDirs,
);

const outputPluginFromSourceFabs = (fabs: AbsolutePath): Object => {
    try {
        return transformFileSync(fabs, {
            plugins: [pluginReactIntl],
        });

    } catch (err) {
        console.log(err);
        throw err;
    }
};

const armdFromSourceFabs = compose(
    pathOr([], ['metadata', 'react-intl', 'messages']),
    outputPluginFromSourceFabs,
);

const process = (config, notify) => compose(
    notify('end'),
    armd => ({
        armd,
        dups: compose(
            map(([id, arfabs]) => ({ id, arfabs })),
            toPairs,
            filter(arfabs => arfabs.length > 1),
            reduce(
                (arfabsById, md) => {
                    arfabsById[md.id] = (arfabsById[md.id] || []).concat(md.fabs);
                    return arfabsById;
                },
                {},
            ),
        )(armd),
    }),
    chain(prop('armd')),
    notify('startDupCheck'),
    map(compose(
        notify('endFile'),
        fabs => ({
            fabs,
            armd: map(
                md => ({ ...md, fabs }),
                armdFromSourceFabs(fabs),
            ),
        }),
        notify('startFile'),
    )),
    notify('startFiles'),
    arfabsSourceFromConfig,
    notify('start'),
)(config);

export default (config: RIWConfig) => (opt: RIWCLIOptProjectExtract): RIWCLIProjectExtractResult =>
    process(config, makeNotifier(opt.on));
