// @flow

import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import reduce from 'ramda/src/reduce';
import toPairs from 'ramda/src/toPairs';
import filter from 'ramda/src/filter';

import type { MessageId, AbsolutePath, MessageDescriptorWithFile } from '../../../../types';
import type { Notifier } from '../../../notify';

export type DuplicateIdData = {|
    id: MessageId,
    files: AbsolutePath[],
|};

type DuplicateFinder = (notify: Notifier) => (armd: MessageDescriptorWithFile[])
    => DuplicateIdData[];

const find: DuplicateFinder = notify => compose(
    notify('endDupCheck'),
    map(([id, arfabs]) => ({ id, arfabs })),
    toPairs,
    filter(arfabs => arfabs.length > 1),
    reduce(
        (arfabsById, md: MessageDescriptorWithFile) => {
            arfabsById[md.id] = (arfabsById[md.id] || []).concat(md.file);
            return arfabsById;
        },
        {},
    ),
    notify('startDupCheck'),
);

export default find;
