// @flow

import mock from 'mock-fs';

import dateTodo from '../dateTodo';
import cfgBase from '../../../__tests__/helpers/dummyConfig';

const cfgExtra = {
    ...cfgBase,
    rootDir: '.',
    todoFile: 'fixtures/dir/TODO.json',
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
            'TODO.json': mock.file({
                content: '[]',
                mtime: new Date(2000),
            }),
        },
    },
];

describe('lib/riw/project/status/dateTodo', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                fixtures: {
                    dir: fixture.in,
                },
            });

            const received = dateTodo(cfgExtra);

            mock.restore();

            expect(received).toMatchSnapshot();
        });
    });
});
