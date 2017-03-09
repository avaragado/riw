// @flow

import path from 'path';

import mock from 'mock-fs';

import dateConfig from '../dateConfig';
import cfgBase from '../../../__tests__/helpers/dummyConfig';

const cfg: RIWConfig = {
    ...cfgBase,
    rootDir: '.',
    configFile: path.resolve('fixtures/dir/config.json'),
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
            'config.json': mock.file({
                content: '{}',
                mtime: new Date(2000),
            }),
        },
    },
];

describe('lib/riw/project/status/dateConfig', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                fixtures: {
                    dir: fixture.in,
                },
            });

            const received = dateConfig(cfg);

            mock.restore();

            expect(received).toMatchSnapshot();
        });
    });
});
