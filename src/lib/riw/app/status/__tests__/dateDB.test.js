// @flow

import mock from 'mock-fs';

import type { ConfigSparseWithSource } from '../../../../config';
import { configResolve } from '../../../../config';

import dateDB from '../dateDB';

const cfg: ConfigSparseWithSource = {
    translationsDatabaseFile: 'fixtures/dir/db.json',
};

type Fixture = {
    name: string,
    in: {
        [key: string]: any,
    },
};

const fixtures: Fixture[] = [
    {
        name: '01',
        in: {},
    },
    {
        name: '02',
        in: {
            'db.json': mock.file({
                content: '[]',
                mtime: new Date(2000),
            }),
        },
    },
];

describe('lib/riw/app/status/dateDB', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                fixtures: {
                    dir: fixture.in,
                },
            });

            const received = dateDB(configResolve(cfg));

            mock.restore();

            expect(received).toMatchSnapshot();
        });
    });
});
