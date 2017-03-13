// @flow

import path from 'path';

import mock from 'mock-fs';
import outdent from 'outdent';

import { configResolve } from '../../../../config';

import { armdExtractJSON } from '../extract';

const cfgBase: RIWConfigSparseWithSource = {
    rootDir: '/fixtures',
    sourceDirs: ['dir/**/*.js'],
};

const notify = () => x => x;

type Fixture = {
    name: string,
    in: { [key: string]: string },
    configOverride?: RIWConfigSparse,
};

const fixtures: Fixture[] = [
    {
        name: '01',
        in: {}, // empty dir
    },

    {
        name: '02',
        in: {
            'a.json': '[]',
            'b.json': '[]',
        },
    },

    {
        name: '03',
        in: {
            'a.json': outdent`
                [
                    {
                        "id": "a.1",
                        "defaultMessage": "a.1!"
                    }
                ]
            `,
            'aa.json': outdent`
                [
                    {
                        "id": "a.1",
                        "defaultMessage": "a.1 again!"
                    }
                ]
            `,
            'b.json': outdent`
                [
                    {
                        "id": "b.1",
                        "defaultMessage": "b.1!"
                    },
                    {
                        "id": "b.2",
                        "description": "b.2 desc",
                        "defaultMessage": "b.2!"
                    }
                ]
            `,
            'bb.json': outdent`
                [
                    {
                        "id": "b.2",
                        "description": "b.2 again desc",
                        "defaultMessage": "b.2 again!"
                    }
                ]
            `,
            'c.json': outdent`
                [
                    {
                        "id": "c.1",
                        "defaultMessage": "c.1!"
                    }
                ]
            `,
        },
        configOverride: {
            collateDir: 'dir',
            inputMode: 'json',
        },
    },

    {
        name: '04',
        in: {
            'a.json': outdent`
                [
                    {
                        "id": "a.1",
                        "defaultMessage": "a.1!"
                    }
                ]
            `,
            'aa.json': outdent`
                [
                    {
                        "id": "a.1",
                        "defaultMessage": "a.1 again!"
                    }
                ]
            `,
            'b.json': outdent`
                [
                    {
                        "id": "b.1",
                        "defaultMessage": "b.1!"
                    },
                    {
                        "id": "b.2",
                        "description": "b.2 desc",
                        "defaultMessage": "b.2!"
                    }
                ]
            `,
            'bb.json': outdent`
                [
                    {
                        "id": "b.2",
                        "description": "b.2 again desc",
                        "defaultMessage": "b.2 again!"
                    }
                ]
            `,
            'c.json': outdent`
                [
                    {
                        "id": "c.1",
                        "defaultMessage": "c.1!"
                    }
                ]
            `,
        },
        configOverride: {
            collateDir: path.resolve('/fixtures', 'dir'),
            inputMode: 'json',
        },
    },
];

describe('lib/riw/project/translate/extract.json', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                '/fixtures': {
                    dir: fixture.in,
                },
            });

            const cfg = configResolve({
                ...cfgBase,
                ...fixture.configOverride,
            });

            const received = armdExtractJSON(notify)(cfg);

            mock.restore();

            expect(received).toMatchSnapshot();
        });
    });
});
