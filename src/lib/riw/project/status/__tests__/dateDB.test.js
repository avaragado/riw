// @flow

import mock from 'mock-fs';

import dateDB from '../dateDB';
import cfgBase from '../../../__tests__/helpers/dummyConfig';

const cfgExtra = {
    ...cfgBase,
    rootDir: '.',
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

describe('lib/riw/project/status/dateDB', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                fixtures: {
                    dir: fixture.in,
                },
            });

            const received = dateDB(cfgExtra);

            mock.restore();

            expect(received).toMatchSnapshot();
        });
    });
});
