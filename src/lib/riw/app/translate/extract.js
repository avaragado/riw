// @flow

import chain from 'ramda/src/chain';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';

import type { MessageDescriptor, AbsolutePath, MessageDescriptorWithFile } from '../../../../types';
import type { Config } from '../../../config';
import type { FilesFromConfig } from '../../../config-helper';
import type { Notifier } from '../../../notify';
import { arfabsInputJSON, arfabsInputSource } from '../../../config-helper';

import armdFromJSONFabs from './armdFromJSONFabs';
import armdfromSourceFabs from './armdFromSourceFabs';

export type MessageDescriptorsFromFile = (
    fabs: AbsolutePath,
    config: Config,
) => MessageDescriptor[];

type MDExtractor = (arfabsFromConfig: FilesFromConfig, armdFromFabs: MessageDescriptorsFromFile) =>
    (notify: Notifier) => (config: Config) => MessageDescriptorWithFile[];

const armdExtract: MDExtractor = (arfabsFromConfig, armdFromFabs) => notify => config => compose(
    notify('endExtract'),
    chain(prop('armd')),
    map(compose(
        notify('endExtractFile'),
        fabs => ({
            fabs,
            armd: map(
                md => ({ ...md, file: fabs }: MessageDescriptorWithFile),
                armdFromFabs(fabs, config),
            ),
        }),
        notify('startExtractFile'),
    )),
    notify('startExtract'),
    arfabsFromConfig,
)(config);

export const armdExtractSource = armdExtract(arfabsInputSource, armdfromSourceFabs);
export const armdExtractJSON = armdExtract(arfabsInputJSON, armdFromJSONFabs);
