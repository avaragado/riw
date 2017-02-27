// @flow

import chain from 'ramda/src/chain';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';

import * as source from './extractFromSource';
import * as json from './extractFromJSON';

type MDExtractor = (arfabsFromConfig: FilesFromConfig, armdFromFabs: MessageDescriptorsFromFile) =>
    <T>(notify: string => T => T) =>
    (config: RIWConfig) => RIWMessageDescriptor[];

const armdExtract: MDExtractor = (arfabsFromConfig, armdFromFabs) => notify => compose(
    notify('endExtract'),
    chain(prop('armd')),
    map(compose(
        notify('endExtractFile'),
        fabs => ({
            fabs,
            armd: map(
                md => ({ ...md, fabs }),
                armdFromFabs(fabs),
            ),
        }),
        notify('startExtractFile'),
    )),
    notify('startExtract'),
    arfabsFromConfig,
);

export const armdExtractSource = armdExtract(source.arfabsFromConfig, source.armdFromFabs);
export const armdExtractJSON = armdExtract(json.arfabsFromConfig, json.armdFromFabs);
